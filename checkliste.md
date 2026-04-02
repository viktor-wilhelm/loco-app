# Projektabgabe – Jump and Run
## El Pollo Loco / Sharkie

Bitte erfülle alle Punkte auf dieser Liste, bevor du das Projekt einreichst. Solltest du weitere Extras eingebaut haben, erwähne das kurz, damit sich die Mentoren dies bei Bedarf anschauen können.

---

## Inhaltsverzeichnis

1. [Allgemein](#1-allgemein)
   - Git-Workflow
   - Funktionalität
   - Design
   - Responsiveness
   - Technische Umsetzung
   - JavaScript / Clean Code
   - Häufige Fehler vermeiden
2. [Funktionalitäten – User Stories](#2-funktionalitäten--user-stories)
   - Spielerklärung
   - Spiel
   - Charakter
   - Gegner
3. [Sonstiges](#3-sonstiges)
   - User Story 1 – Mobile
   - User Story 2 – Impressum

---

## 1. Allgemein

### Git-Workflow

- [ ] Nutze GitHub von Anfang an *(Dein GitHub-Profil ist deine Visitenkarte für Arbeitgeber!)*
- [ ] Committe nach jeder Coding-Session
- [ ] Verwende klare, aussagekräftige Commit-Messages
- [ ] Verwende `.gitignore`, um unnötige Dateien auszuschließen
- [ ] Halte dein Repository aktuell und gepflegt

### Funktionalität

- [ ] Alle Links und Buttons sind funktionstüchtig
- [ ] Es gibt keine Konsolenfehler & keine `console.log`-Ausgaben

### Design

- [ ] Design bestmöglich umgesetzt, kreativ gestaltet
- [ ] Richtige Schriftart ausgewählt & lokal eingebunden
- [ ] Favicon vorhanden
- [ ] Buttons haben die CSS-Eigenschaft `cursor: pointer`

### Responsiveness

- [ ] Seite funktioniert auf Desktop und im mobilen Querformat
- [ ] Im Hochformat wird eine Hinweismeldung angezeigt (z.B. *„Turn your device to play"*)
- [ ] Mobile-Touch-Buttons nur sichtbar im Tablet/Handy-Bereich
- [ ] Kein Scrollbalken bei kleineren Auflösungen

### Technische Umsetzung

**Dateinamen:**
- [ ] Beschreibend / aussagekräftig
- [ ] Konsistent benannt
- [ ] Hauptseite heißt `index.html`

**Projektstruktur:**
- [ ] Eigener `classes`-Ordner für alle `.class.js`-Dateien

### JavaScript / Clean Code

- [ ] Eine Funktion hat nur eine Aufgabe
- [ ] Eine Funktion ist maximal 14 Zeilen lang *(HTML ausgenommen)*
- [ ] Deutliche Datei-, Funktions- und Variablennamen in konsistenter Schreibweise
- [ ] Erster Buchstabe von Funktionen/Variablen ist klein geschrieben
- [ ] 1–2 Leerzeilen Abstand zwischen Funktionen
- [ ] Max. 400 LOC pro Datei
- [ ] Dateien korrekt benannt: `index.html`, `script.js`, `style.css`
- [ ] HTML-Code ggf. in extra Funktion ausgelagert
- [ ] Extra Ordner für `templates` und Bilder (`img`)
- [ ] Statischer HTML-Code wird nicht über JavaScript generiert
- [ ] Funktionen nach [JSDoc-Standard](https://jsdoc.app/about-getting-started.html) dokumentiert

### Häufige Fehler vermeiden

- [ ] Animationen laufen flüssig (nicht zu schnell / zu langsam)
- [ ] Keine Lücken zwischen den Hintergrundbildern
- [ ] Angemessene Anzahl an Gegnern
- [ ] Ausgewogene Gegnerstärke
- [ ] Gegner stirbt nur bei echtem Treffer, nicht beim Vorbeispringen
- [ ] Statusbars werden korrekt aktualisiert
- [ ] Charakter ist nach dem Tod unbeweglich
- [ ] Sounds starten und stoppen korrekt
- [ ] Mute-Button stoppt alle Sounds; Lautstärke ist angemessen
- [ ] Möglichkeit zum Neustart nach GameOver vorhanden
- [ ] Restart **nicht** über Seiten-Reload gelöst
- [ ] **Mobile:** Buttons funktionieren auf dem Tablet
- [ ] Echte Daten im Impressum

---

## 2. Funktionalitäten – User Stories

> Es ist soweit – *„El Pollo Loco"* / *„Sharkie"* wartet darauf, von dir zum Leben erweckt zu werden!
> El Pollo Loco ist etwas einfacher als Sharkie – das sollte dich jedoch nicht davon abhalten, das Spiel zu wählen, das du erstellen möchtest. Auch eigene Grafiken sind möglich.
> Aus den folgenden User Stories kannst du kleine Tasks ableiten und z.B. in deinem Kanban-Board auflisten. Viel Spaß!

### Spielerklärung

*Als Benutzer möchte ich eine ansprechende Landingpage haben, die mir erklärt, wie das Spiel funktioniert.*

- [ ] Seite hat ein thematisch passendes Hintergrundbild
- [ ] Schriftart ist angepasst
- [ ] Es gibt eine Möglichkeit, die Tastenbelegung nachzuschauen
- [ ] Ein Button öffnet einen Dialog mit der Spielerklärung; Dialog schließt sich per Klick daneben oder auf ein ✕
- [ ] *(Optional)* Story-Erklärung vorhanden
- [ ] *(Optional)* Fullscreen-Modus möglich

### Spiel

*Als Benutzer möchte ich das Spiel über einen Start-Button starten können.*

- [ ] Start-Button vorhanden
- [ ] Spieler wird nach dem Start nicht sofort von Gegnern überrannt
- [ ] Hintergrund ist gleichmäßig ohne Lücken
- [ ] Hintergrundmusik und Soundeffekte vorhanden
- [ ] Mute-Button stellt alle Sounds stumm; Status wird im `localStorage` gespeichert
- [ ] Bei Sieg oder Niederlage erscheint ein Endscreen mit Restart- und Home-Button

### Charakter

*Als Benutzer möchte ich einen Charakter spielen, der durchgehend animiert ist.*

- [ ] Sprunganimation ist flüssig
- [ ] Alle Animationen (normal, verletzt, springend) sind flüssig
- [ ] Idle-Animation vorhanden; Sleep-Animation tritt spätestens nach 15 Sekunden ein
- [ ] Charakter kann Coins und Flaschen / Blubberblasen einsammeln; Statusbar aktualisiert sich
- [ ] **Pollo Loco:** Charakter kann Flaschen werfen; normale Gegner sterben bei Treffer; Endboss erleidet Schaden; Statusbar reduziert sich
- [ ] **Sharkie:** Charakter kann mit Schwanzflosse / Blubberblase Gegner töten und Endboss Schaden zufügen
- [ ] Charakter hat passende Sounds zu seinen Animationen (z.B. Schnarchen beim Schlafen)
- [ ] Statusbar reduziert sich bei Schaden; bei leerem Balken ist das Spiel verloren

### Gegner

*Als Benutzer möchte ich herausfordernde, aber besiegbare Gegner haben.*

> Tipp: Im Entwicklungsmodus dem Charakter mehr Leben geben, um besser testen zu können.

- [ ] Mindestens 2 verschiedene Gegnertypen + Endboss (variieren in Größe, Geschwindigkeit, Angriff)
- [ ] Endboss ist stärker als normale Gegner
- [ ] Animationen der Gegner sind flüssig (auch beim Verletzen und Sterben)
- [ ] Gegner sterben nur, wenn man von oben auf sie springt
- [ ] Offsets passen: Gegner stirbt nur bei echtem Treffer
- [ ] Gegner haben passende Sounds (z.B. Endboss gackert beim Schaden)

---

## 3. Sonstiges

### User Story 1 – Mobile

*Als Benutzer möchte ich das Spiel auch auf Mobilgeräten spielen.*

- [ ] Querformat auf Mobilgerät wird unterstützt
- [ ] Nur in der Mobilansicht werden extra Touch-Buttons angezeigt
- [ ] Kontextmenü (Rechtsklick / Touch-and-Hold) bei Mobile-Buttons deaktiviert
- [ ] Im Hochformat wird eine Meldung angezeigt, das Gerät zu drehen

### User Story 2 – Impressum

*Als Benutzer möchte ich das Impressum einsehen können.*

- [ ] Link führt zu einer Seite mit vollständigen Anbieterinformationen und rechtlichen Hinweisen
