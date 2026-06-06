# MongoDB Schema für die aktuelle App

Dieses Dokument beschreibt die Collections und Felder, die die App **tatsächlich verwendet**.

Die aktuelle Implementierung arbeitet mit genau diesen 3 Collections:

- `users`
- `pictures`
- `scores`

## 1. `users`

Speichert Login- und Profildaten.

```json
{
  "_id": "ObjectId",
  "email": "string",
  "passwordHash": "string",
  "username": "string",
  "avatar": "string",
  "bio": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Bedeutung:

- `email`: wird für den Login verwendet
- `passwordHash`: gehashter Passwortwert
- `username`: Anzeigename im Profil und Leaderboard
- `avatar`: aktuell Initialen wie `RS`
- `bio`: Profiltext
- `createdAt`: Account-Erstellung
- `updatedAt`: letzte Profil-Änderung

Empfohlene Indexe:

- Unique Index auf `email`
- Index auf `username`

## 2. `pictures`

Speichert alle Bilder, die während eines Spiels zufällig gezogen werden.

```json
{
  "_id": "ObjectId",
  "name": "string",
  "image": "Binary",
  "mimeType": "string",
  "actual": {
    "x": "number",
    "y": "number"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Bedeutung:

- `name`: Name des Bildes
- `image`: das eigentliche Bild als Binary-Daten in MongoDB
- `mimeType`: Dateityp des Bildes, z. B. `image/png`
- `actual.x`, `actual.y`: Zielposition auf der statischen Deadlock-Map in Prozent

Empfohlene Indexe:

- Index auf `name`

## 3. `scores`

Speichert jede abgeschlossene Runde eines Users.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "username": "string",
  "avatar": "string",
  "modeKey": "string",
  "roundCount": "number",
  "timerSeconds": "number",
  "totalScore": "number",
  "isTopThreeForUser": "boolean",
  "playedAt": "Date",
  "rounds": [
    {
      "imageId": "string",
      "imageName": "string",
      "distance": "number",
      "score": "number",
      "guess": {
        "x": "number",
        "y": "number"
      },
      "actual": {
        "x": "number",
        "y": "number"
      }
    }
  ]
}
```

Bedeutung:

- `userId`: Referenz auf den User, dem der Score gehört
- `username`: redundanter Snapshot für einfachere Anzeige im Leaderboard
- `avatar`: redundanter Snapshot für einfachere Anzeige im Leaderboard
- `modeKey`: Kombination aus Bildanzahl und Timer, z. B. `5-10`
- `roundCount`: Anzahl Bilder der Runde
- `timerSeconds`: Zeit pro Bild
- `totalScore`: Gesamtpunktzahl der Runde
- `isTopThreeForUser`: `true`, wenn dieser Score aktuell zu den besten 3 Scores dieses Users gehört
- `playedAt`: Zeitpunkt der Runde
- `rounds`: Detaildaten pro Bild

Wichtig für die App:

- Im **Profil** werden alle Scores des Users angezeigt
- Im **globalen Leaderboard** werden nur Scores angezeigt, bei denen `isTopThreeForUser = true`
- Dadurch kann ein User höchstens **3 Einträge** im globalen Leaderboard haben

Empfohlene Indexe:

- Index auf `userId`
- Index auf `modeKey`
- Index auf `totalScore`
- Index auf `isTopThreeForUser`
- Compound Index auf `userId`, `totalScore`

## Beziehungen

- `users._id` -> `scores.userId`

## Beispiel für die aktuelle Logik

Wenn ein User 5 Scores hat:

- `5000`
- `5000`
- `5000`
- `4200`
- `3000`

dann werden im globalen Leaderboard nur die **3 Scores mit 5000** angezeigt, weil nur diese drei `isTopThreeForUser = true` bekommen.

Im Profil des Users bleiben trotzdem **alle 5 Scores** sichtbar.

## Hinweis zur aktuellen Implementierung

- Die App berechnet `modeStats` aktuell **nicht als eigene Collection**, sondern dynamisch aus den `scores`
- Die Bilder liegen aktuell in `pictures`, nicht in `game_images`
- Die gespielten Runden liegen aktuell direkt in `scores`, nicht in `game_sessions`

Falls du die Datenbank später weiter normalisieren willst, könntest du zusätzlich Collections wie `game_sessions` oder `user_mode_stats` einführen. Für den aktuellen Stand der App sind diese 3 Collections aber die richtige und tatsächlich verwendete Struktur.
