# Duplicate24 — Display Loop

„Vier Farben, ein Moment" — 10 Sekunden, 9:16, stummer Schaufenster-Screen.

## Start

```bash
npm install
npm run studio          # Vorschau im Remotion Studio
npm run render          # out/DisplayLoop.mp4
npm run render -- DisplayLoopWide   # 1920x1080 Variante
```

Vor dem ersten Render: `public/qr.png` ablegen (Ziel-URL Konfigurator). Fehlt
die Datei, rendert der Loop trotzdem — der QR-Rahmen bleibt als Platzhalter.

## Timing

| Frames | Sekunden | Was passiert |
|---|---|---|
| 0–36 | 0,0–1,2 | Passermarken atmen ein, Andruckbogen fährt hoch |
| 36–120 | 1,2–4,0 | Vier Druckdurchläufe C → M → Y → K, sichtbar versetzt |
| 120–138 | 4,0–4,6 | Passer-Snap, Cyan-Impuls |
| 138–210 | 4,6–7,0 | Wortmarke steht, Tagline tippt sich ein |
| 210–258 | 7,0–8,6 | Leistungen flippen durch |
| 258–300 | 8,6–10,0 | Adresse + QR, Ausblende zurück auf Frame 0 |

Alle Zeiten liegen in `src/theme.js` unter `BEAT`. Eine Zahl ändern reicht.

## Entscheidungen, die vom ersten Konzept abweichen

Der Andruckbogen ist **dunkel** statt weiß. Ein heller Bogen in 9:16 hätte gut
60 % der Fläche gefüllt — das blendet nachts die Mainzer Landstraße und kostet
tagsüber Kontrast auf der Schrift. Jetzt glühen die CMYK-Ebenen auf Graphit,
was näher an deiner Dark-Ästhetik liegt und die Farben härter treffen lässt.

Der Loop schließt sich über `seam` in `DisplayLoop.jsx`: die letzten acht Frames
blenden auf denselben Zustand wie Frame 0. Kein sichtbarer Sprung beim Rewind.

Gegen Einbrennen driftet die Wortmarke permanent um wenige Pixel
(`driftX`/`driftY` in `Wordmark.jsx`) — unsichtbar im Betrieb, aber es steht nie
ein Pixel über Stunden an derselben Stelle.

## Stellschrauben

`src/theme.js` → Farben, Beats, Leistungsreihenfolge.
`src/shader/InkField.jsx` → `spread`, `radius`, `grain` für die Farbwolken.
`src/scenes/Wordmark.jsx` → `PASSES[].offset` steuert, wie stark der Versatz
vor dem Snap auseinanderläuft. Größer = dramatischer, ab ca. 40 px wird die
Wortmarke unlesbar.
`src/scenes/Halftone.jsx` → `size` ist die Rasterweite. Bei Betrachtung aus
über vier Metern darf sie auf 9–10 px hoch, dann ist das Raster sichtbarer.

## Lizenz

Remotion Free License (for-profit bis 3 Mitarbeiter). `render.mjs` deklariert
das über `licenseKey: 'free-license'`. Kommt ein vierter Kopf dazu — auch
Teilzeit oder Freelance — wird eine Company License fällig.
