async function ladePatientenDaten() {
    try {
        const antwort = await fetch('https://hapi.fhir.org/baseR4/Patient/48066251');
        const patient = await antwort.json();

        const vorname = patient.name[0].given.join(' ');
        const nachname = patient.name[0].family;
        const name = vorname + ' ' + nachname;

        const geburtsdatum = patient.birthDate;
        const geschlecht = patient.gender;
        const alter = berechneAlter(geburtsdatum);

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

        document.querySelector('.patient-info h1').textContent = name;
        document.querySelector('.geburtsdatum').textContent = geburtsdatum;
        document.querySelector('.geschlecht').textContent = übersetzeGeschlecht(geschlecht);
        document.querySelector('.versicherungsform').textContent = versicherung;
        document.querySelector('.alter').textContent = alter;

    } catch (fehler) {
        console.error('Fehler beim Laden:', fehler);
    }
}

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

function übersetzeGeschlecht(code) {
    if (code === 'male') return 'männlich';
    if (code === 'female') return 'weiblich';
    if (code === 'other') return 'anderes';
    return 'unbekannt';
}

window.onload = ladePatientenDaten;
