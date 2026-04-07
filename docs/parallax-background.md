# Moving Background / Parallax-Effekt

## Was ist Parallax?

Objekte, die weiter von der Kamera entfernt sind, bewegen sich langsamer als nahe Objekte.
In einem 2D-Spiel wird das simuliert, indem jeder Hintergrund-Layer mit einem eigenen
Geschwindigkeitsfaktor (`parallaxSpeed`) verschoben wird.

```
Layer         parallaxSpeed   Effekt
──────────────────────────────────────────────
Himmel        0               bleibt komplett still
Berge         0.1             bewegt sich kaum
Wolken        0.15            bewegt sich leicht
Mittelebene   0.2             bewegt sich mittel
Vordergrund   0.3             bewegt sich schneller
Character     1.0             bewegt sich mit der Kamera
```

---

## Implementierung in 3 Schritten

---

### Schritt 1 — `BackgroundObject` um `parallaxSpeed` erweitern

**Datei:** `models/background-object.class.js`

```js
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  constructor(imagePath, x, parallaxSpeed = 1) {
    super();
    this.parallaxSpeed = parallaxSpeed; // ← NEU
    this.loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
```

**Warum `= 1` als Default?**
Rückwärtskompatibel — bestehende Aufrufe ohne dritten Parameter funktionieren weiterhin
und verhalten sich wie vorher (Layer scrollt 1:1 mit der Kamera).

---

### Schritt 2 — Neue Methode in `World` für Parallax-Zeichnung

**Datei:** `models/world.class.js`

```js
addBackgroundObjectsParallax(backgroundObjects) {
    backgroundObjects.forEach((bg) => {
        this.ctx.save();                                    // (1)
        const parallaxX = this.camera_x * bg.parallaxSpeed; // (2)
        this.ctx.translate(parallaxX, 0);                  // (3)
        bg.draw(this.ctx);                                 // (4)
        this.ctx.restore();                                // (5)
    });
}
```

**Zeile für Zeile erklärt:**

| #   | Code                          | Warum                                                                |
| --- | ----------------------------- | -------------------------------------------------------------------- |
| 1   | `ctx.save()`                  | Friert den aktuellen Canvas-Zustand ein                              |
| 2   | `camera_x * parallaxSpeed`    | Berechnet die individuelle Verschiebung des Layers                   |
| 3   | `ctx.translate(parallaxX, 0)` | Verschiebt den Canvas-Ursprung für diesen Layer                      |
| 4   | `bg.draw(ctx)`                | Zeichnet den Layer an der verschobenen Position                      |
| 5   | `ctx.restore()`               | Stellt den Canvas-Zustand wieder her — nächster Layer startet sauber |

**Warum `save()` / `restore()` und nicht manuell zurückverschieben?**

Ohne `save()`/`restore()` würden sich die `translate()`-Aufrufe aufaddieren:

```
Layer Himmel  → translate(50, 0)   → Canvas ist bei X=50
Layer Berge   → translate(100, 0)  → Canvas ist jetzt bei X=150 ❌ (statt 100)
Layer Boden   → translate(200, 0)  → Canvas ist jetzt bei X=350 ❌
```

Mit `save()`/`restore()` startet jeder Layer bei X=0:

```
save() → translate(50)  → draw Himmel → restore()  → Canvas wieder bei X=0 ✅
save() → translate(100) → draw Berge  → restore()  → Canvas wieder bei X=0 ✅
save() → translate(200) → draw Boden  → restore()  → Canvas wieder bei X=0 ✅
```

---

### Schritt 3 — `draw()` anpassen

**Datei:** `models/world.class.js`

```js
draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Hintergrund + Wolken mit Parallax zeichnen
    this.addBackgroundObjectsParallax(this.level.backgroundObjects);
    this.addBackgroundObjectsParallax(this.level.clouds);  // ← Wolken auch mit Parallax

    // Feste UI-Elemente (kein translate nötig)
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);

    // Spielobjekte mit Kamera-Verschiebung
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);  // ← clouds hier entfernt
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => this.draw());
}
```

**Wichtig:** Das frühere `translate(-camera_x, 0)` nach den Backgrounds entfernen!
Die Parallax-Methode räumt intern über `restore()` auf — ein zusätzliches
`translate(-camera_x)` würde alle nachfolgenden Objekte fehl positionieren.

---

### Schritt 4 — `parallaxSpeed` pro Layer in `level1.js` vergeben

**Datei:** `levels/level1.js`

```js
new BackgroundObject('img/.../air_1920-1080px.png', 0, 0),     // Himmel — komplett still
new BackgroundObject('img/.../3_third_layer/1.png', 0, 0.1),   // Berge — sehr langsam
new BackgroundObject('img/.../2_second_layer/1.png', 0, 0.2),  // Mitte — mittel
new BackgroundObject('img/.../1_first_layer/1.png', 0, 0.3),   // Vordergrund — schneller
```

---

## Häufige Fehler

| Fehler                               | Ursache                                              | Lösung                                               |
| ------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------- |
| Hintergrund verzerrt sich / Streifen | Orphaned `translate(-camera_x)` nach Parallax-Aufruf | Das übrige `translate(-camera_x)` entfernen          |
| Alle Layer scrollen gleich schnell   | `parallaxSpeed` nicht übergeben → Default `1` greift | Dritten Parameter in `level1.js` ergänzen            |
| Layer-Positionen driften auseinander | `save()`/`restore()` fehlt im forEach                | Jeden Layer einzeln mit `save()`/`restore()` wrappen |

---

## Wolken mit Parallax (Erweiterung)

Die Methode `addBackgroundObjectsParallax()` funktioniert für **jedes Objekt mit `parallaxSpeed`** —
nicht nur für Backgrounds. Wolken bekommen die Eigenschaft direkt in der Klasse:

**Datei:** `models/cloud.class.js`

```js
class Cloud extends MovableObject {
  parallaxSpeed = 0.15; // ← als feste Klasseneigenschaft, kein Parameter nötig
  // ...
}
```

Dann in `draw()` einfach denselben Aufruf wie für Backgrounds:

```js
this.addBackgroundObjectsParallax(this.level.clouds);
```

---

## Designentscheidungen

In den meisten klassischen Jump-and-Run-Spielen (z.B. Super Mario) bleibt der Himmel komplett still —
das wirkt natürlicher, weil der Himmel "unendlich weit weg" ist. Deshalb hat der Himmel-Layer
in diesem Projekt `parallaxSpeed = 0`.

## Erweiterungsideen

- Mehr als 4 Layer für noch mehr Tiefe
