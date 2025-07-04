async function ladePatientenDaten() {
    try {
        // Abruf der Patientendaten von HAPI FHIR Server
        const antwort = await fetch('https://hapi.fhir.org/baseR4/Patient/48066251');
        const patient = await antwort.json();

         // Name zusammensetzen aus Vor- und Nachname
        const vorname = patient.name[0].given.join(' ');
        const nachname = patient.name[0].family;
        const name = vorname + ' ' + nachname;

        // Weitere Stammdaten extrahieren
        const geburtsdatum = patient.birthDate;
        const geschlecht = patient.gender;
        const alter = berechneAlter(geburtsdatum);

        // Versicherungsart ermitteln anhand der Identifier (z. B. GKV oder PKV)
        let versicherung = 'Unbekannt';
        const ids = patient.identifier || [];
        for (let i = 0; i < ids.length; i++) {
            const code = ids[i].type?.coding?.[0]?.code;
            if (code === 'GKV') {
                versicherung = 'gesetzlich';
                break;
            } else if (code === 'PKV') {
                versicherung = 'privat';
                break;
            }
        }

        // Patientendaten in die HTML-Oberfläche einfügen
        document.querySelector('.patient-info h1').textContent = name;
        document.querySelector('.geburtsdatum').textContent = geburtsdatum;
        document.querySelector('.geschlecht').textContent = übersetzeGeschlecht(geschlecht);
        document.querySelector('.versicherungsform').textContent = versicherung;
        document.querySelector('.alter').textContent = alter;

    } catch (fehler) {
        console.error('Fehler beim Laden:', fehler);
    }
}

// Alter dynamisch auf Basis des Geburtsdatums berechnen
function berechneAlter(geburtsdatum) {
    const geburt = new Date(geburtsdatum);
    const heute = new Date();
    let jahre = heute.getFullYear() - geburt.getFullYear();
    const monatDiff = heute.getMonth() - geburt.getMonth();
    if (monatDiff < 0 || (monatDiff === 0 && heute.getDate() < geburt.getDate())) {
        jahre--;
    }
    return jahre;
}

// Geschlecht auf deutsch übersetzen
function übersetzeGeschlecht(code) {
    if (code === 'male') return 'männlich';
    if (code === 'female') return 'weiblich';
    if (code === 'other') return 'anderes';
    return 'unbekannt';
}

// Beim Laden der Seite Patientendaten abrufen
window.onload = ladePatientenDaten;
