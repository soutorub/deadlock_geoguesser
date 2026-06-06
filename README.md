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
- **Primäre Zielgruppe:** Personen, die schnelle, kompetitive Runden spielen wollen und ihre Resultate mit anderen vergleichen möchten. Die App ist auf Personen ausgerichtet, die das Spiel "Deadlock" bereits kennen.


## 2. Lösungsidee
Die Lösung ist eine SvelteKit-Webapplikation mit Bootstrap als UI-Grundlage. Nach dem Login kann ein Spielmodus mit Bildanzahl und Timer ausgewählt werden. Im Spiel wird ein Bild angezeigt und auf einer statischen Deadlock-Map ein Guess gesetzt. Nach Abschluss der Runde wird der Score gespeichert. Zusätzlich gibt es Profil- und Highscore-Seiten mit Filtermöglichkeiten.

- **Kernfunktionalität:** Login und Sign up, Spielmodus wählen, Runde spielen, Score speichern, Profil anzeigen und bearbeiten, globale Highscores mit Filter.
- **Annahmen [Optional]:** Die Nutzer verstehen den Spielablauf auch ohne komplexes Tutorial. Die statische Map reicht für einen Prototypen aus. Profile und Leaderboards sind motivierende Bestandteile des Spielkonzepts.
- **Abgrenzung [Optional]:** Kein vollständiges Auth-System mit Rollen, keine zoomable / bewegbare Live-Map, keine produktionsreife Sicherheit, kein manuelles hinzufügen von Bildern durch User.

## 3. Vorgehen & Artefakte
Die Umsetzung orientierte sich an einem phasenbasierten Vorgehen von Problemverständnis über Mockup bis zum funktionierenden Prototyp.

### 3.1 Understand & Define
- **Zielgruppenverständnis:** Ausgangspunkt war ein einfacher Spiel-Workflow, der ohne lange Einarbeitung funktioniert. Wichtige Bestandteile waren schneller Einstieg, klarer Spielstart, sofort sichtbare Resultate und ein kompetitiver Vergleich über Highscores. Da die Zielgruppe das Spiel "Deadlock" bereits kennt, konnten viele Details des Gameplays vorausgesetzt werden.
- **Wesentliche Erkenntnisse:**
  - Der Einstieg muss sehr einfach sein, deshalb Login/Sign up direkt auf der Startseite.
  - Der Spielmodus soll vor dem Start klar konfigurierbar sein.
  - Profil und Highscores müssen getrennt sichtbar sein, da eigenes Abschneiden und globaler Vergleich unterschiedliche Bedürfnisse abdecken.
  - Filter für Bildanzahl und Timer sind notwendig, damit Profil- und Highscore-Ansichten nicht zu gross werden.

  Ausführliches Artefakt: **Ideenfindung_Prototyping_souorub.pdf** (siehe Abgabeordner)

### 3.2 Sketch
- **Variantenüberblick:** Es wurden früh einfache Skizzen für Login, Home, Spiel, Profil und Highscores definiert.
- **Skizzen:** Die Skizzen unterscheideten sich vor allem in den Seiten die sie darstellen. In der Lektion wurde uns erlaubt anstatt eine Seite 8 mal zu zeichnen einfach verschiedene Seiten zu skizzieren. Es gab Varianten des Profils, des Gameplays, der Login Seite sowie auch der Highscore Seite. Alle Skizzen hatten einen ähnlichen Aufbau, da sie alle auf einem Desktop-Layout basieren sollten. Was vor allem aber nützlich war, war die Reflektion von meinen Mitschülern und mir, die mir geholfen haben die Skizzen zu verbessern.

  Ausführliches Artefakt: **Crazy_8_Abgabe_soutorub.pdf** (siehe Abgabeordner)

### 3.3 Decide
- **Gewählte Variante & Begründung:** Gewählt wurde ein Desktop-orientierter Aufbau mit klarer Navigation, weil damit der Spielablauf und die Auswertung am einfachsten verständlich dargestellt werden konnten. Bootstrap wurde verwendet, weil dies eine schnelle, konsistente Umsetzung ermöglichte.
- **End-to-End-Ablauf:** Nutzer registrieren sich oder loggen sich ein, wählen auf der Startseite Bildanzahl und Timer, spielen eine Runde, sehen den finalen Score und können anschliessend Profil oder globale Highscores einsehen.
- **Mockup:** Das klickbare Mockup wurde in Figma als Wireframe erstellt und zeigte die wichtigsten Screens: Login, Sign up, Spielstart, Spielansicht, Highscores und Profil.

  Für klickbares Mockup: Ausführliches Artefakt: **Figma_Prototype_Deadlock_Geoguesser.pdf** (siehe Abgabeordner) oder [Figma-Link](https://www.figma.com/design/YR2wRlvN1l2AVIeLazi4jZ/Deadlock-GeoGuesser---3-Screen-Workflow?node-id=0-1&p=f)

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
  - Grün/Schwarz als klare visuelle Richtung passend zu Deadlock, da dort auch viel mit Grün und dunklen Farben gearbeitet wird
  - Bootstrap-Komponenten für Formulare, Buttons, Cards und Tabellen
  - Profil nicht als eigener Navigationsbutton, sondern über den klickbaren User-Bereich (standardmässig mit Avatar und Name) erreichbar. Das sollte eigentlich klar sein, da es auf vielen Plattformen so gelöst ist.
  - Filter für Bildanzahl und Timer separat, damit Statistiken und Highscores gezielt eingeschränkt werden können

#### 3.4.2. Umsetzung (Technik)
- **Technologie-Stack:** SvelteKit, TypeScript, Bootstrap 5, MongoDB Node Driver, MongoDB Atlas
- **Tooling:** IntelliJ IDEA als Code Editor, GitHub für Versionskontrolle, Figma für das Mockup, Netlify für Deployment, MongoDB Atlas für die Datenbank
- **Struktur & Komponenten:** 
  - **Routen:** 
    - `src/routes/+page.svelte` für Login / Sign up
    - `src/routes/app/+page.svelte` für Spielstart
    - `src/routes/app/game/+page.svelte` für den Spielscreen
    - `src/routes/app/profile/+page.svelte` für Profil und gefilterte Scores
    - `src/routes/app/leaderboard/+page.svelte` für globale Highscores
  - **Store:** `src/lib/stores/app-store.ts` verwaltet den Frontend-State und kommuniziert mit den API-Endpunkten (wichtiges file für funktionalen Ablauf)
  - **Komponenten:** `AppShell`, `DeadlockMap`, `ModeBadge`, `Podium`
  - **Serverlogik:** `src/lib/server/db.ts` und `src/lib/server/mongodb.ts`
- **Daten & Schnittstellen:** 
  - Daten liegen in MongoDB Atlas
  - Collections: `users`, `pictures`, `scores` (siehe mehr Details in [mongodb-schema.md](./mongodb-schema.md))
  - `scores.userId` referenziert den jeweiligen User
  - `scores.isTopThreeForUser` steuert, welche Einträge im globalen Leaderboard auftauchen (maximal drei pro User)
  - API-Endpunkte für Login, Sign up, Profil-Update, zufällige Bilder, Score-Speicherung und Bootstrap-Daten
- **Deployment:** Deployment über Netlify
- **Besondere Entscheidungen:** 
  - Profilstatistiken werden aktuell dynamisch aus den gespeicherten Scores berechnet statt in einer separaten Stats-Collection gehalten
  - Die Map bleibt statisch, nur die Zielkoordinaten der Bilder sind in der Datenbank gespeichert. Die berechnung der Punkte erfolgt im Frontend anhand der Distanz zwischen Guess und Zielkoordinaten. Die map selbst ist nicht interaktiv, sondern zeigt nur den Guess-Pin an der entsprechenden Stelle.
  - Das globale Leaderboard zeigt bewusst nicht beliebig viele Einträge pro User, sondern maximal die besten drei

### 3.5 Validate
#### URL der getesteten Version
https://deadlockgeoguesser-old.netlify.app/app

#### Ziele der Evaluation
Ziel der Evaluation war es zu überprüfen, ob neue Benutzer die wichtigsten Funktionen der Anwendung ohne zusätzliche Erklärung verstehen und erfolgreich nutzen können. Dabei sollte insbesondere untersucht werden:

- Ob Login und Registrierung verständlich sind
- Ob das Erstellen und Starten einer Spielrunde intuitiv funktioniert
- Ob das Platzieren und Bestätigen eines Guess auf der Map nachvollziehbar ist
- Ob Nutzer ihre Resultate und Highscores problemlos finden können
- Ob Navigations- oder Verständlichkeitsprobleme auftreten

#### Vorgehen
Die Evaluation wurde als moderierter Vor-Ort-Test (on-site) durchgeführt. Die Testpersonen erhielten nacheinander die vorbereiteten Aufgaben und sollten diese möglichst selbstständig lösen. Während der Durchführung wurden Beobachtungen notiert. Nach Abschluss aller Aufgaben wurden zusätzliche Abschlussfragen gestellt, um qualitative Rückmeldungen zur Bedienbarkeit und Verständlichkeit der Anwendung zu erhalten.

#### Stichprobe
Die Evaluation wurde mit drei Testpersonen durchgeführt.

Profil der Testpersonen:
- 3 Person ohne Vorkenntnisse zum Projekt
- Alter zwischen 20 und 30 Jahren

Alle Testpersonen nutzten die Anwendung erstmals und erhielten vor Beginn keine Erklärung zur Bedienung.

- **Aufgaben/Szenarien:**
  Für die Evaluation wurden vier kurze Testfälle vorbereitet. Jeder Testfall bildet einen zusammenhängenden Workflow ab und soll innerhalb von maximal 3 Minuten durchführbar sein. Nach jedem Testfall bleibt Platz, um das konkrete Feedback der Testperson zu notieren.

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
  - Beim Filtern im Profil musste der Tester kurz überlegen, welche Auswahl die angezeigten Scores konkret verändert.

#### Kennzahlen und Beobachtungen
Erfolgsquote:

- 3 von 3 Testpersonen konnten alle Aufgaben erfolgreich abschliessen
- Es war keine Unterstützung durch den Moderator notwendig

Qualitative Beobachtungen:

- Die Erstellung einer neuen Runde wurde von allen Testpersonen schnell verstanden
- Die Map wurde als intuitiv wahrgenommen und die Funktion zum Platzieren eines Guess war grundsätzlich verständlich
- Profil und Highscore-Bereich konnten von allen Testpersonen gefunden werden
- Der Unterschied zwischen persönlichen Scores und globalen Highscores war anfangs nicht für alle Testpersonen klar
- Beim ersten Guess entstand teilweise Unsicherheit darüber, ob der gesetzte Marker bereits gespeichert wurde oder zusätzlich bestätigt werden muss
- Der Timer wurde während des Spielens teilweise wenig wahrgenommen

#### Zusammenfassung der Resultate
Die Evaluation zeigt, dass die Kernfunktionen des Prototyps grundsätzlich verständlich und nutzbar sind. Alle Testpersonen konnten die vorgesehenen Aufgaben erfolgreich durchführen. Besonders positiv wurden die einfache Erstellung einer Spielrunde sowie die intuitive Nutzung der Map bewertet. Verbesserungspotenzial besteht vor allem bei der Navigation, der Sichtbarkeit des Timers sowie der klareren Kommunikation von Spielzuständen und Highscore-Konzepten.

#### Abgeleitete Verbesserungen
Priorisierte Verbesserungen aus der Evaluation:

1. Klarere Navigation zwischen Profil und Highscores
2. Deutlichere Kennzeichnung des Unterschieds zwischen persönlichen Scores und globalen Highscores
3. Bessere visuelle Rückmeldung nach dem Setzen eines Guess
4. Höhere Sichtbarkeit des Timers während einer Runde
5. Überarbeitung einzelner Bezeichnungen, damit Funktionen und Abläufe für neue Nutzer noch verständlicher werden

## 4. Erweiterungen [Optional]

### 4.1 Gefilterte Highscores und Profilscores
- **Beschreibung & Nutzen:** Sowohl im Profil als auch in den globalen Highscores kann nach Bildanzahl und Timer gefiltert werden. Dadurch bleiben die Listen übersichtlich.
- **Wo umgesetzt:** 
  - **Frontend:** Filterelemente und Tabellen auf Profil- und Highscore-Seite
  - **Backend:** Scores werden mit `modeKey`, `roundCount` und `timerSeconds` gespeichert
- **Referenz:** Kapitel 3.4.1 und 3.4.2
- **Aus Evaluation abgeleitet?:** Teil der Designentscheidung für bessere Übersicht

### 4.2 Begrenzung des globalen Leaderboards pro User
- **Beschreibung & Nutzen:** Im globalen Leaderboard werden pro User maximal die besten drei Scores angezeigt. Dadurch wird verhindert, dass ein einzelner User die gesamte Liste dominiert.
- **Wo umgesetzt:** 
  - **Backend:** Flag `isTopThreeForUser` in der `scores`-Collection und Aktualisierung in `src/lib/server/db.ts`
- **Frontend:** Leaderboard verwendet nur diese markierten Einträge
- **Referenz:** Kapitel 3.4.2 und [mongodb-schema.md](./mongodb-schema.md)
- **Aus Evaluation abgeleitet?:** Nein, war funktionale Anforderung

### 4.3 Distanzbasierte Punkteberechnung
- **Beschreibung & Nutzen:** Die Punkte werden anhand der Distanz zwischen Guess und tatsächlicher Position berechnet. Dadurch entstehen abgestufte Resultate und nicht nur richtige oder falsche Antworten. Auch nahe Schätzungen werden entsprechend belohnt.
- **Wo umgesetzt:**
  - **Backend:** Berechnung der Distanz und des resultierenden Scores bei Spielabschluss
- **Frontend:** Anzeige des berechneten Scores nach jeder Runde
- **Referenz:** Kapitel 3.4.2
- **Aus Evaluation abgeleitet?:** Nein, war Bestandteil des Spielkonzepts

### 4.4 Wiederverwendbare Spielmodi
- **Beschreibung & Nutzen:** Die Kombination aus Bildanzahl und Timer wird als eigener Spielmodus gespeichert. Dadurch können Resultate verschiedener Spielarten getrennt ausgewertet, gefiltert und fair miteinander verglichen werden.
- **Wo umgesetzt:**
  - **Backend:** Speicherung von `modeKey`, `roundCount` und `timerSeconds` in der `scores`-Collection
- **Frontend:** Auswahl des Spielmodus sowie Filtermöglichkeiten in Profil und Highscores
- **Referenz:** Kapitel 3.4.1 und 3.4.2
- **Aus Evaluation abgeleitet?:** Nein, war funktionale Designentscheidung

### 4.5 Trennung zwischen persönlichen und globalen Erfolgen
- **Beschreibung & Nutzen:** Das System trennt bewusst zwischen persönlichen Scores im Profil und den globalen Highscores. Nutzer können dadurch sowohl ihre gesamte Spielhistorie betrachten als auch ihre besten Leistungen mit anderen vergleichen.
- **Wo umgesetzt:**
  - **Backend:** Separate Datenaufbereitung für Profilansicht und Leaderboard
- **Frontend:** Eigenständige Profil- und Highscore-Seiten
- **Referenz:** Kapitel 3.4.1 und 3.4.2
- **Aus Evaluation abgeleitet?:** Teilweise, da der Unterschied von einigen Testpersonen zunächst nicht sofort erkannt wurde

### 4.6 Zufällige Bildauswahl pro Runde
- **Beschreibung & Nutzen:** Die Bilder werden für jede Runde zufällig aus der Datenbank ausgewählt. Dadurch unterscheiden sich die Spielrunden voneinander und die Wiederspielbarkeit des Prototyps wird erhöht.
- **Wo umgesetzt:**
  - **Backend:** Zufällige Auswahl der Bilder aus der `pictures`-Collection
- **Frontend:** Automatische Anzeige der vom Backend gelieferten Bilder
- **Referenz:** Kapitel 3.4.2 und [mongodb-schema.md](./mongodb-schema.md)
- **Aus Evaluation abgeleitet?:** Nein, war Bestandteil des Spielkonzepts

### 4.7 Zentraler App-Store für den gesamten Spielablauf
- **Beschreibung & Nutzen:** Der zentrale `app-store.ts` verwaltet Login-Zustand, aktive Spielrunde, Profil-Scores, Leaderboard-Daten und Spielresultate an einer Stelle. Dadurch bleibt der Ablauf zwischen Login, Spielstart, Spielrunde, Score-Speicherung und Anzeige der Resultate konsistent.
- **Wo umgesetzt:**
  - **Frontend:** `src/lib/stores/app-store.ts` als zentraler State-Store mit `writable` und `derived` Stores
  - **API-Kommunikation:** Der Store ruft die API-Endpunkte für Login, Signup, Bootstrap-Daten, Bilder, Profil-Updates und Scores auf
- **Referenz:** Kapitel 3.4.2
- **Aus Evaluation abgeleitet?:** Nein, war technische Architekturentscheidung

### 4.8 Wiederherstellung der aktiven Session über LocalStorage
- **Beschreibung & Nutzen:** Der aktive User wird im Browser gespeichert und beim erneuten Öffnen der App automatisch über den Server neu geladen. Dadurch bleibt der Nutzer nach einem Reload oder späteren Besuch weiterhin eingeloggt, ohne dass alle Profildaten dauerhaft im Browser gespeichert werden.
- **Wo umgesetzt:**
  - **Frontend:** Speicherung der User-ID unter `deadlock-geoguesser-active-user` im `localStorage`
  - **Backend/API:** Laden der aktuellen Daten über `/api/bootstrap?userId=...`
- **Referenz:** Kapitel 3.4.2
- **Aus Evaluation abgeleitet?:** Nein, war Komfortfunktion für den Prototyp

### 4.9 Einheitliche Fehlerbehandlung für API-Anfragen
- **Beschreibung & Nutzen:** API-Anfragen werden über eine gemeinsame Funktion `requestJson()` verarbeitet. Dadurch werden JSON-Antworten, Textantworten und Fehlermeldungen einheitlich behandelt. Das reduziert doppelten Code und sorgt dafür, dass Login-, Signup-, Profil- und Score-Fehler konsistent angezeigt werden können.
- **Wo umgesetzt:**
  - **Frontend/API-Kommunikation:** Funktion `requestJson()` in `src/lib/stores/app-store.ts`
  - **Verwendet bei:** Login, Signup, Bootstrap, Profil-Update, Bildauswahl und Score-Speicherung
- **Referenz:** Kapitel 3.4.2
- **Aus Evaluation abgeleitet?:** Nein, war technische Qualitätsverbesserung

## 5. Projektorganisation [Optional]
- **Repository & Struktur:** Das Projekt ist als SvelteKit-Repository organisiert mit klarer Trennung zwischen Routen, Komponenten, Store und Serverlogik.
- **Issue-Management:** Es wurde kein formales externes Issue-Board verwendet; die Entwicklung erfolgte iterativ entlang der Anforderungen und bei Bedarf mit neuen Ideen, die beim Programmierungsprozess gefunden wurden.
- **Commit-Praxis:** Mehrere kleine Commits mit sprechenden Messages für Setup, State, Seiten und Dokumentation.

## 6. KI-Deklaration
Die folgende Deklaration beschreibt den Einsatz von KI im Projekt.

### 6.1 KI-Tools
- **Eingesetzte Tools**: ChatGPT / Codex
- **Zweck & Umfang**: KI wurde punktuell für Styling verfeinerungen, technische Fehlersuche, Refactoring-Vorschläge verwendet. Code generation wurde vor allem für erstes styling sowie für das file "app-store.ts"  und seine integration projektweit genutzt. Alle generierten Vorschläge wurden anschliessend manuell überprüft, angepasst und in den Projektkontext integriert. 
- **Eigene Leistung (Abgrenzung):** Die Projektidee, die fachlichen Anforderungen, die Struktur der App (Grundgerüst), die Auswahl, Priorisierung und schlussendliche Integration der Funktionen sowie die inhaltlichen Entscheidungen zum Gameplay wurden selbst erarbeitet. Auch das Styling wurde manuell verfeinert. Datenbankanbindung, html,  die verschiedenen Komponenten, Routes und Gamelogik wurden auch selbst erarbeitet. 

### 6.2 Prompt-Vorgehen
Die KI wurde schrittweise und gezielt eingesetzt. Meist wurden konkrete Teilprobleme formuliert, zum Beispiel Fragen zum Styling, zur MongoDB-Anbindung, zu Fehlermeldungen im Deployment oder zu möglichen Refactorings. Anschliessend wurden die Vorschläge geprüft, ausgewählt und an den konkreten Projektkontext angepasst. Für Dokumentation die das Projekt und code betrifft wurden auch zuerst Vorschläge benutzt da diese oft sehr hilfreich waren, um die Gedanken zu strukturieren und wichtige Punkte nicht zu vergessen. Die Prompts waren dabei immer mehrere sätze lang und beinhalteten viele Details damit alles stimmig bleibt.

### 6.3 Reflexion
Der Einsatz von KI war vor allem bei technischen Detailfragen, beim Debugging, Refactoring und bei der Suche nach möglichen Lösungswegen hilfreich. Grenzen zeigten sich dort, wo projektspezifische Entscheidungen, fachliche Anforderungen und selbst beurteilt werden mussten. Deshalb war eine laufende eigene Überprüfung und Anpassung notwendig. KI diente in diesem Projekt als Unterstützung, nicht als Ersatz für die inhaltliche und technische Umsetzung. Was aufgefallen ist, ist dass KI bei styling und code keinen schönen Code schreibt und man oft den Code selbst "cleanen" muss, damit er in das Projekt passt. Es gab auch einige Vorschläge, die nicht so gut waren und verworfen wurden, dort wurde öfters viel Zeit eingebusst.
Es gab aber auch viele gute Vorschläge, die mir geholfen haben weiterzukommen, vor allem bei der Erstellung des app-stores.


## 7. Anhang [Optional]
- **Quellen:** 
  - MongoDB Atlas Dokumentation
  - Netlify Dokumentation
  - SvelteKit Dokumentation
  - Bootstrap Dokumentation
- **Testskript & Materialien:** Manuelle Tests entlang der Kernworkflows Login, Spielstart, Spiel, Profil und Highscores
- **Rohdaten/Auswertung:** Beispielhafte Datenstruktur in [mongodb-schema.md](./mongodb-schema.md)
