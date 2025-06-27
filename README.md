# Patientenübersicht (FHIR-Prototyp)

Dieses Projekt ist eine einfache Webanwendung zur Darstellung von Patientenstammdaten basierend auf HL7 FHIR. Es handelt sich um einen Prototyp für die Visualisierung von medizinischen Informationen, der die patientenzentrierte Ansicht unterstützt. Die Anwendung nutzt öffentlich zugängliche FHIR-Testdaten von https://hapi.fhir.org.

## Inhalt der Anwendung

Die Benutzeroberfläche zeigt übersichtlich:

- Name des Patienten
- Patientennummer (hartkodiert)
- Geburtsdatum
- Geschlecht
- Versicherungsform (gesetzlich oder privat)
- Alter
- Diagnosen, Dokumente und Abrechnungen (fiktive Daten)
- Gewicht und Größe (hartkodiert)

Die Stammdaten werden aus einer FHIR-Patientenressource geladen und dynamisch angezeigt.

## Aufbau

### `index.html`

Die HTML-Datei stellt die Grundstruktur der Seite bereit. Es gibt einen Hauptbereich für die Patienteninformationen und eine Sidebar. Die HTML-Elemente sind mit Klassen versehen, die vom JavaScript zur Laufzeit mit Daten befüllt werden.

### `style.css`

Die CSS-Datei definiert ein modernes, übersichtliches Layout. Farbige Karten zeigen diagnostische Informationen. Die Stammdaten sind in einem hervorgehobenen Rahmen gruppiert.

### `app.js`

Das JavaScript lädt Patientendaten von einer FHIR-API und trägt diese in die Benutzeroberfläche ein. Es wird auf folgende Informationen zugegriffen:

- Name: aus `patient.name`
- Geburtsdatum: aus `patient.birthDate`
- Geschlecht: aus `patient.gender`
- Versicherungsform: ermittelt aus `patient.identifier` (Codes `GKV` oder `PKV`)
- Alter: berechnet aus dem Geburtsdatum

Die Daten werden über `fetch()` beim Laden der Seite abgerufen.
