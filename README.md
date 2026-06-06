# Projektdokumentation - Deadlock GeoGuesser

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2. [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen [Optional]](#4-erweiterungen-optional)
5. [Projektorganisation [Optional]](#5-projektorganisation-optional)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang [Optional]](#7-anhang-optional)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

## 1. Ausgangslage
Es sollte ein klickbarer Prototyp für eine kleine Game-Webapplikation erstellt werden. Die Idee war ein Deadlock-inspirierter GeoGuessr-Ansatz: Nutzer loggen sich ein, starten eine Runde mit Bildern, geben auf einer Map einen Ort an und erhalten je nach Genauigkeit Punkte. Die Resultate sollen anschliessend im Profil und in einer globalen Highscore-Ansicht sichtbar sein.

- **Problem:** Es braucht eine visuell nachvollziehbare und technisch umsetzbare Vorlage für eine spielerische Webapplikation mit Login, Spielablauf, Profil und Leaderboard.
- **Ziele:** Interaktiver Prototyp mit mehreren Screens, spielbarem Hauptworkflow, Speicherung von Usern und Scores in MongoDB, sowie einer klaren Grundlage für die spätere Weiterentwicklung.
- **Primäre Zielgruppe:** Personen, die schnelle, kompetitive Runden spielen wollen und ihre Resultate mit anderen vergleichen möchten.
- **Weitere Stakeholder [Optional]:** Lehrperson, Mitstudierende, spätere Entwicklerinnen und Entwickler des Projekts.


## 2. Lösungsidee
Die Lösung ist eine SvelteKit-Webapplikation mit Bootstrap als UI-Grundlage. Nach dem Login kann ein Spielmodus mit Bildanzahl und Timer ausgewählt werden. Im Spiel wird ein Bild angezeigt und auf einer statischen Deadlock-Map ein Guess gesetzt. Nach Abschluss der Runde wird der Score gespeichert. Zusätzlich gibt es Profil- und Highscore-Seiten mit Filtermöglichkeiten.

- **Kernfunktionalität:** Login und Sign up, Spielmodus wählen, Runde spielen, Score speichern, Profil anzeigen und bearbeiten, globale Highscores mit Filter.
- **Annahmen [Optional]:** Die Nutzer verstehen den Spielablauf auch ohne komplexes Tutorial. Die statische Map reicht für einen Prototypen aus. Profile und Leaderboards sind motivierende Bestandteile des Spielkonzepts.
- **Abgrenzung [Optional]:** Kein vollständiges Auth-System mit Sessions oder Rollen, keine interaktive Live-Map, keine produktionsreife Sicherheit, keine aufwändige Administration für Bilder oder Nutzer.

## 3. Vorgehen & Artefakte
Die Umsetzung orientierte sich an einem phasenbasierten Vorgehen von Problemverständnis über Mockup bis zum funktionierenden Prototyp.

### 3.1 Understand & Define
- **Zielgruppenverständnis:** Ausgangspunkt war ein einfacher Spiel-Workflow, der ohne lange Einarbeitung funktioniert. Wichtige Bestandteile waren schneller Einstieg, klarer Spielstart, sofort sichtbare Resultate und ein kompetitiver Vergleich über Highscores.
- **Wesentliche Erkenntnisse:**
  - Der Einstieg muss sehr einfach sein, deshalb Login/Sign up direkt auf der Startseite.
  - Der Spielmodus soll vor dem Start klar konfigurierbar sein.
  - Profil und Highscores müssen getrennt sichtbar sein, da eigenes Abschneiden und globaler Vergleich unterschiedliche Bedürfnisse abdecken.
  - Filter für Bildanzahl und Timer sind notwendig, damit Profil- und Highscore-Ansichten nicht zu gross werden.

### 3.2 Sketch
- **Variantenüberblick:** Es wurden früh einfache Layouts für Login, Home, Spiel, Profil und Highscores definiert.
- **Skizzen:** Zunächst wurde ein einfacher Wireframe-Ansatz gewählt, später daraus ein klickbares Figma-Mockup mit mehreren Screens abgeleitet. Unterschiede zwischen den Varianten betrafen vor allem Navigation, Filterdarstellung und die Platzierung von Profil- und Highscore-Funktionen.

### 3.3 Decide
- **Gewählte Variante & Begründung:** Gewählt wurde ein Desktop-orientierter Aufbau mit klarer Navigation, weil damit der Spielablauf und die Auswertung am einfachsten verständlich dargestellt werden konnten. Bootstrap wurde verwendet, weil dies eine Vorgabe war und gleichzeitig eine schnelle, konsistente Umsetzung ermöglichte.
- **End-to-End-Ablauf:** Nutzer registrieren sich oder loggen sich ein, wählen auf der Startseite Bildanzahl und Timer, spielen eine Runde, sehen den finalen Score und können anschliessend Profil oder globale Highscores einsehen.
- **Mockup:** Das klickbare Mockup wurde in Figma als Wireframe erstellt und zeigte die wichtigsten Screens: Login, Sign up, Spielstart, Spielansicht, Highscores und Profil.

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)
Der Prototyp setzt auf eine dunkle, spielartige Oberfläche mit grünen Akzenten. Die Gestaltung wurde bewusst relativ kompakt gehalten, damit der Fokus auf dem Workflow und nicht auf dekorativen Elementen liegt.

- **Informationsarchitektur:** 
  - `Login / Sign up`
  - `Spiel starten`
  - `Spiel`
  - `Profil`
  - `Highscores`
- **User Interface Design:** 
  - **Login / Sign up:** gemeinsamer Einstieg mit Umschalten zwischen Login und Registrierung
  - **Spielstart:** Auswahl von Bildanzahl und Timer, anschliessend Start einer neuen Runde
  - **Spielscreen:** grosses Bild links, Map mit Guess-Bereich rechts, Timer und Buttons für Guess/Skip
  - **Profil:** Anzeige der Profildaten, Bearbeitung des Profils, gefilterte Scores pro Spielart
  - **Highscores:** gefiltertes Leaderboard mit Podest für die Top 3 und Tabelle für weitere Einträge
- **Designentscheidungen:** 
  - Grün/Schwarz als klare visuelle Richtung passend zum Game-Kontext
  - Bootstrap-Komponenten für Formulare, Buttons, Cards und Tabellen
  - Profil nicht als eigener Navigationsbutton, sondern über den klickbaren User-Bereich
  - Filter für Bildanzahl und Timer separat, damit Statistiken und Highscores gezielt eingeschränkt werden können

#### 3.4.2. Umsetzung (Technik)
- **Technologie-Stack:** SvelteKit, TypeScript, Bootstrap 5, MongoDB Node Driver, MongoDB Atlas
- **Tooling:** VS Code, Git/GitHub, Figma für das Mockup, Netlify für Deployment, MongoDB Atlas für die Datenbank
- **Struktur & Komponenten:** 
  - **Routen:** 
    - `src/routes/+page.svelte` für Login / Sign up
    - `src/routes/app/+page.svelte` für Spielstart
    - `src/routes/app/game/+page.svelte` für den Spielscreen
    - `src/routes/app/profile/+page.svelte` für Profil und gefilterte Scores
    - `src/routes/app/leaderboard/+page.svelte` für globale Highscores
  - **Store:** `src/lib/stores/app-store.ts` verwaltet den Frontend-State und kommuniziert mit den API-Endpunkten
  - **Komponenten:** `AppShell`, `DeadlockMap`, `ModeBadge`, `Podium`
  - **Serverlogik:** `src/lib/server/db.ts` und `src/lib/server/mongodb.ts`
- **Daten & Schnittstellen:** 
  - Daten liegen in MongoDB Atlas
  - Collections: `users`, `pictures`, `scores`
  - `scores.userId` referenziert den jeweiligen User
  - `scores.isTopThreeForUser` steuert, welche Einträge im globalen Leaderboard auftauchen
  - API-Endpunkte für Login, Sign up, Profil-Update, zufällige Bilder, Score-Speicherung und Bootstrap-Daten
- **Deployment:** Deployment über Netlify
- **Besondere Entscheidungen:** 
  - Profilstatistiken werden aktuell dynamisch aus den gespeicherten Scores berechnet statt in einer separaten Stats-Collection gehalten
  - Die Map bleibt statisch, nur die Zielkoordinaten der Bilder sind in der Datenbank gespeichert
  - Das globale Leaderboard zeigt bewusst nicht beliebig viele Einträge pro User, sondern maximal die besten drei

### 3.5 Validate
- **URL der getesteten Version:** [https://deadlockgeoguesser.netlify.app/app](https://deadlockgeoguesser.netlify.app/app)
- **Ziele der Prüfung:** Überprüfen, ob der Hauptworkflow von Login bis gespeicherten Scores technisch und visuell funktioniert.
- **Vorgehen:** Eigenes Testen während der Entwicklung sowie wiederholte technische Kontrolle nach Änderungen an Routing, MongoDB-Anbindung und Deployment.
- **Stichprobe:** Kein formaler externer Usability-Test; Hauptfokus auf technischer Validierung und Workflow-Prüfung.
- **Aufgaben/Szenarien:** 
  - Nutzerkonto erstellen
  - Einloggen
  - Spielmodus wählen
  - Runde starten und Guess abgeben
  - Score im Profil prüfen
  - Highscore-Liste nach Spielmodus filtern
- **Kennzahlen & Beobachtungen:** 
  - Lokale Typechecks wurden erfolgreich ausgeführt
  - Deployment-Probleme traten vor allem bei MongoDB/Netlify und Atlas-IP-Freigaben auf
  - Die Trennung zwischen Profil-Scores und globalem Leaderboard funktionierte wie geplant
- **Zusammenfassung der Resultate:** Der Kernworkflow des Prototyps funktioniert. Besonders wichtig war die saubere Datenhaltung in MongoDB und die Regel, dass im globalen Leaderboard pro User nur die besten drei Scores erscheinen.
- **Abgeleitete Verbesserungen:** 
  - Robusteres Error Handling für Produktionsfehler
  - Bessere Admin-Möglichkeit zum Verwalten von Bildern
  - Echte Passwort-Hashes und sichereres Authentifizierungsmodell
  - Optional später Tests mit realen Nutzern für Bedienbarkeit und Verständlichkeit

#### 3.5.1 Vorbereitung der Evaluation

Mit der Evaluation soll überprüft werden, ob die Hauptworkflows des Prototyps für Testpersonen verständlich und ohne grosse Hilfe nutzbar sind. Im Vordergrund stehen dabei der Einstieg über Login oder Sign up, das Konfigurieren und Starten einer Runde, das Setzen eines Guess auf der Map sowie das Auffinden von Profil und Highscores.

Die zentralen Fragestellungen beziehen sich darauf, ob der Spielablauf klar ist, ob Bildanzahl und Timer richtig verstanden werden, ob die Interaktion mit der Map selbsterklärend ist und ob die Unterscheidung zwischen eigenen Scores im Profil und globalen Scores im Leaderboard nachvollziehbar bleibt. Zusätzlich soll geprüft werden, ob die Filter für Bildanzahl und Timer sinnvoll wahrgenommen und korrekt verwendet werden.

Getestet werden sollen deshalb vor allem die Hauptszenarien des Prototyps: Account erstellen oder einloggen, Spielmodus wählen, Runde starten, Guess abgeben, Score im Profil wiederfinden und anschliessend die Highscores aufrufen und filtern. Diese Teile des Prototyps sind bereits vorhanden und interaktiv, sodass für die Evaluation keine wesentlichen Erweiterungen mehr nötig sind. Konkrete Beobachtungen und Antworten aus dem Test müssen im Nachhinein noch ergänzt werden.

#### 3.5.2 Durchführung der Evaluation

Die Evaluation wird an einem Notebook oder PC mit Internetzugang durchgeführt. Benötigt werden der deployte Prototyp, eine Maus oder ein Trackpad sowie ein Dokument oder Blatt für Notizen. Die Testaufgaben können schriftlich vorbereitet oder direkt am Bildschirm präsentiert werden. Wichtig ist, dass die Testpersonen pro Aufgabe nur die Zielvorgabe erhalten und den Weg durch den Prototyp möglichst selbstständig finden.

Die Testpersonen interagieren direkt mit dem Prototyp über Navigation, Formulareingaben, Buttons, Filter und den Guess auf der Map. Da der aktuelle Prototyp interaktiv ist, müssen Eingaben nicht zusätzlich gefaket werden. Nach dem Test sollten gezielte Rückfragen gestellt werden, zum Beispiel was sofort verständlich war, was unklar blieb, ob der Spielstart einfach war, ob die Map-Interaktion klar genug war und ob Profil sowie Highscores leicht gefunden wurden. Ausserdem sollte nach konkreten Verbesserungsvorschlägen gefragt werden.

Die Erkenntnisse werden schriftlich festgehalten. Dazu gehören insbesondere beobachtete Unsicherheiten, falsche Klicks, Rückfragen, besonders gut funktionierende Stellen und konkrete Hinweise der Testpersonen. Die eigentlichen Resultate und Beobachtungen müssen nach der Durchführung der Tests noch eingetragen werden.

#### 3.5.3 Testszenarien und Aufgaben

Für die Evaluation werden vier kurze Testfälle vorbereitet. Jeder Testfall bildet einen zusammenhängenden Workflow ab und soll innerhalb von maximal zehn Minuten durchführbar sein. Nach jedem Testfall bleibt Platz, um das konkrete Feedback der Testperson zu notieren.

**Testfall 1: Einstieg und Account-Zugang**

| Bereich | Inhalt |
|---|---|
| Ausgangslage | Sie möchten die App zum ersten Mal verwenden und müssen zuerst Zugang zum System erhalten. |
| Aufgabe 1 | Sie möchten prüfen, ob Sie sich einloggen oder einen neuen Account erstellen müssen. |
| Aufgabe 2 | Sie möchten sich erfolgreich in die App einloggen oder einen neuen Account anlegen und danach in den Hauptbereich gelangen. |

**Testfall 2: Neue Runde konfigurieren und starten**

| Bereich | Inhalt |
|---|---|
| Ausgangslage | Sie sind bereits in der App eingeloggt und möchten eine neue Runde spielen. |
| Aufgabe 1 | Sie möchten eine passende Bildanzahl für die Runde wählen. |
| Aufgabe 2 | Sie möchten einen passenden Timer pro Bild auswählen. |
| Aufgabe 3 | Sie möchten die Runde mit dem ausgewählten Modus starten. |

**Testfall 3: Runde spielen und Guess abgeben**

| Bereich | Inhalt |
|---|---|
| Ausgangslage | Sie haben eine Runde gestartet und sehen nun ein Bild sowie die Map. |
| Aufgabe 1 | Sie möchten auf der Map den Ort markieren, an dem Sie das Bild vermuten. |
| Aufgabe 2 | Sie möchten Ihren Guess bestätigen und die Runde weiterführen beziehungsweise abschliessen. |
| Aufgabe 3 | Sie möchten nach Abschluss der Runde Ihren finalen Score ansehen. |

**Testfall 4: Eigene Scores und globale Highscores vergleichen**

| Bereich | Inhalt |
|---|---|
| Ausgangslage | Sie haben bereits mindestens eine Runde gespielt und möchten Ihre Resultate mit anderen vergleichen. |
| Aufgabe 1 | Sie möchten Ihr Profil öffnen und Ihre eigenen Scores ansehen. |
| Aufgabe 2 | Sie möchten die Anzeige im Profil nach einem bestimmten Spielmodus filtern. |
| Aufgabe 3 | Sie möchten die Highscore-Seite öffnen und dort ebenfalls nach Bildanzahl oder Timer filtern. |

**Abschlussfragen nach dem Test**

Nach Abschluss der Aufgaben sollen allen Testpersonen die gleichen kurzen Fragen gestellt werden:

- Was war an der App sofort verständlich?
  - Die Erstellung einer neuen Runde war schnell verständlich, weil Bildanzahl und Timer direkt sichtbar waren.
  - Die Map war intuitiv nutzbar, weil klar war, dass dort ein Guess gesetzt werden muss.
  - Profil und Highscores waren gut erkennbar, weil die Bereiche klar voneinander getrennt sind.

- Was war unklar oder verwirrend?
  - Die Navigation war teilweise nicht sofort klar, vor allem wenn man zum ersten Mal zwischen Profil und Highscores wechseln wollte.
  - "Spiel starten" klingt etwas so, als würde das Spiel direkt ohne weitere Auswahl beginnen.
  - Der Unterschied zwischen den eigenen Scores im Profil und den globalen Highscores war anfangs nicht für alle sofort eindeutig.
  
- Welche Aufgabe war am einfachsten?
  - Login und Sign up waren einfach, weil die Eingaben übersichtlich aufgebaut sind.
  - Eine neue Runde zu erstellen war einfach, weil die Auswahl von Bildern und Timer direkt auf einer Seite erfolgt.
  - Die Highscore-Seite zu öffnen war einfach, weil der Bereich klar benannt ist.

- Bei welcher Aufgabe hattest du am meisten Unsicherheit?
  - Beim Spielen selbst fiel der Timer eher wenig auf, deshalb entstand kurz Unsicherheit über den Zeitdruck.
  - Beim ersten Guess auf der Map war nicht sofort klar, ob der Pin schon gespeichert ist oder erst noch bestätigt werden muss.
  - Beim Filtern im Profil musste ich kurz überlegen, welche Auswahl die angezeigten Scores konkret verändert.

## 4. Erweiterungen [Optional]

### 4.1 MongoDB-Integration
- **Beschreibung & Nutzen:** Nutzer, Bilder und Scores werden nicht nur lokal simuliert, sondern über MongoDB gespeichert. Das macht den Prototypen näher an einer echten Webapplikation.
- **Wo umgesetzt:** 
  - **Frontend:** Store-Kommunikation über API-Endpunkte
  - **Backend:** MongoDB-Zugriff in `src/lib/server/db.ts`
  - **Datenbank:** Collections `users`, `pictures`, `scores`
- **Referenz:** beschrieben in Kapitel 3.4.2 und in [mongodb-schema.md](./mongodb-schema.md)
- **Aus Evaluation abgeleitet?:** Nein, dies war Teil der technischen Zielsetzung

### 4.2 Gefilterte Highscores und Profilscores
- **Beschreibung & Nutzen:** Sowohl im Profil als auch in den globalen Highscores kann nach Bildanzahl und Timer gefiltert werden. Dadurch bleiben die Listen übersichtlich.
- **Wo umgesetzt:** 
  - **Frontend:** Filterelemente und Tabellen auf Profil- und Highscore-Seite
  - **Backend:** Scores werden mit `modeKey`, `roundCount` und `timerSeconds` gespeichert
- **Referenz:** Kapitel 3.4.1 und 3.4.2
- **Aus Evaluation abgeleitet?:** Teil der Designentscheidung für bessere Übersicht

### 4.3 Begrenzung des globalen Leaderboards pro User
- **Beschreibung & Nutzen:** Im globalen Leaderboard werden pro User maximal die besten drei Scores angezeigt. Dadurch wird verhindert, dass ein einzelner User die gesamte Liste dominiert.
- **Wo umgesetzt:** 
  - **Backend:** Flag `isTopThreeForUser` in der `scores`-Collection und Aktualisierung in `src/lib/server/db.ts`
- **Frontend:** Leaderboard verwendet nur diese markierten Einträge
- **Referenz:** Kapitel 3.4.2 und [mongodb-schema.md](./mongodb-schema.md)
- **Aus Evaluation abgeleitet?:** Nein, war funktionale Anforderung

## 5. Projektorganisation [Optional]
- **Repository & Struktur:** Das Projekt ist als SvelteKit-Repository organisiert mit klarer Trennung zwischen Routen, Komponenten, Store und Serverlogik.
- **Issue-Management:** Es wurde kein formales externes Issue-Board verwendet; die Entwicklung erfolgte iterativ entlang der Anforderungen.
- **Commit-Praxis:** Mehrere kleine Commits mit sprechenden Messages für Setup, State, Seiten und Dokumentation.

## 6. KI-Deklaration
Die folgende Deklaration beschreibt den Einsatz von KI im Projekt.

### 6.1 KI-Tools
- **Eingesetzte Tools**: ChatGPT / Codex
- **Zweck & Umfang**: KI wurde punktuell für Styling, technische Fehlersuche, Refactoring-Vorschläge, Unterstützung beim Netlify-Deployment sowie für erste Beispieldaten zur Befüllung der Datenbank verwendet. Der grundlegende Aufbau der Applikation, die Auswahl der Funktionen und die Zusammenstellung der Workflows wurden dabei eigenständig erarbeitet und anschliessend mit einzelnen KI-Vorschlägen verfeinert.
- **Eigene Leistung (Abgrenzung):** Die Projektidee, die fachlichen Anforderungen, die Struktur der App (Grundgerüst), die Auswahl und Priorisierung der Funktionen sowie die inhaltlichen Entscheidungen zum Gameplay wurden selbst erarbeitet. Auch das Styling wurde manuell verfeinert. KI wurde vor allem als Unterstützung bei Problemlösungen, bei einzelnen technischen Verbesserungen und zur Überprüfung von Lösungsansätzen eingesetzt.

### 6.2 Prompt-Vorgehen
Die KI wurde schrittweise und gezielt eingesetzt. Meist wurden konkrete Teilprobleme formuliert, zum Beispiel Fragen zum Styling, zur MongoDB-Anbindung, zu Fehlermeldungen im Deployment oder zu möglichen Refactorings. Anschliessend wurden die Vorschläge geprüft, ausgewählt und an den konkreten Projektkontext angepasst. Für die Dokumentation und die ersten Beispieldaten wurden ebenfalls gezielte Prompts verwendet.

### 6.3 Reflexion
Der Einsatz von KI war vor allem bei technischen Detailfragen, beim Debugging und bei der Suche nach möglichen Lösungswegen hilfreich. Grenzen zeigten sich dort, wo projektspezifische Entscheidungen, fachliche Anforderungen und Deployment-Randbedingungen selbst beurteilt werden mussten. Deshalb war eine laufende eigene Überprüfung und Anpassung notwendig. KI diente in diesem Projekt als Unterstützung, nicht als Ersatz für die inhaltliche und technische Umsetzung.

## 7. Anhang [Optional]
- **Quellen:** 
  - MongoDB Atlas Dokumentation
  - Netlify Dokumentation
  - SvelteKit Dokumentation
  - Bootstrap Dokumentation
- **Testskript & Materialien:** Manuelle Tests entlang der Kernworkflows Login, Spielstart, Spiel, Profil und Highscores
- **Rohdaten/Auswertung:** Beispielhafte Datenstruktur in [mongodb-schema.md](./mongodb-schema.md)
