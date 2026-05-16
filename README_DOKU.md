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
Es sollte ein klickbarer Prototyp fuer eine kleine Game-Webapplikation erstellt werden. Die Idee war ein Deadlock-inspirierter GeoGuessr-Ansatz: Nutzer loggen sich ein, starten eine Runde mit Bildern, geben auf einer Map einen Ort an und erhalten je nach Genauigkeit Punkte. Die Resultate sollen anschliessend im Profil und in einer globalen Highscore-Ansicht sichtbar sein.

- **Problem:** Es braucht eine visuell nachvollziehbare und technisch umsetzbare Vorlage fuer eine spielerische Webapplikation mit Login, Spielablauf, Profil und Leaderboard.
- **Ziele:** Interaktiver Prototyp mit mehreren Screens, spielbarem Hauptworkflow, Speicherung von Usern und Scores in MongoDB, sowie einer klaren Grundlage fuer die spaetere Weiterentwicklung.
- **Primäre Zielgruppe:** Personen, die schnelle, kompetitive Runden spielen wollen und ihre Resultate mit anderen vergleichen moechten.
- **Weitere Stakeholder [Optional]:** Lehrperson, Mitstudierende, spaetere Entwicklerinnen und Entwickler des Projekts.


## 2. Lösungsidee
Die Loesung ist eine SvelteKit-Webapplikation mit Bootstrap als UI-Grundlage. Nach dem Login kann ein Spielmodus mit Bildanzahl und Timer ausgewaehlt werden. Im Spiel wird ein Bild angezeigt und auf einer statischen Deadlock-Map ein Guess gesetzt. Nach Abschluss der Runde wird der Score gespeichert. Zusaetzlich gibt es Profil- und Highscore-Seiten mit Filtermoeglichkeiten.

- **Kernfunktionalität:** Login und Sign up, Spielmodus waehlen, Runde spielen, Score speichern, Profil anzeigen und bearbeiten, globale Highscores mit Filter.
- **Annahmen [Optional]:** Die Nutzer verstehen den Spielablauf auch ohne komplexes Tutorial. Die statische Map reicht fuer einen Prototypen aus. Profile und Leaderboards sind motivierende Bestandteile des Spielkonzepts.
- **Abgrenzung [Optional]:** Kein vollstaendiges Auth-System mit Sessions oder Rollen, keine echte Deadlock-Originalmap, keine produktionsreife Sicherheit, keine aufwaendige Administration fuer Bilder oder Nutzer.

## 3. Vorgehen & Artefakte
Die Umsetzung orientierte sich an einem phasenbasierten Vorgehen von Problemverstaendnis ueber Mockup bis zum funktionierenden Prototyp.

### 3.1 Understand & Define
- **Zielgruppenverständnis:** Ausgangspunkt war ein einfacher Spiel-Workflow, der ohne lange Einarbeitung funktioniert. Wichtige Bestandteile waren schneller Einstieg, klarer Spielstart, sofort sichtbare Resultate und ein kompetitiver Vergleich ueber Highscores.
- **Wesentliche Erkenntnisse:**
  - Der Einstieg muss sehr einfach sein, deshalb Login/Sign up direkt auf der Startseite.
  - Der Spielmodus soll vor dem Start klar konfigurierbar sein.
  - Profil und Highscores muessen getrennt sichtbar sein, da eigenes Abschneiden und globaler Vergleich unterschiedliche Beduerfnisse abdecken.
  - Filter fuer Bildanzahl und Timer sind notwendig, damit Profil- und Highscore-Ansichten nicht zu gross werden.

### 3.2 Sketch
- **Variantenüberblick:** Es wurden frueh einfache Layouts fuer Login, Home, Spiel, Profil und Highscores definiert.
- **Skizzen:** Zunaechst wurde ein einfacher Wireframe-Ansatz gewaehlt, spaeter daraus ein klickbares Figma-Mockup mit mehreren Screens abgeleitet. Unterschiede zwischen den Varianten betrafen vor allem Navigation, Filterdarstellung und die Platzierung von Profil- und Highscore-Funktionen.

### 3.3 Decide
- **Gewählte Variante & Begründung:** Gewaehlt wurde ein Desktop-orientierter Aufbau mit klarer Navigation, weil damit der Spielablauf und die Auswertung am einfachsten verstaendlich dargestellt werden konnten. Bootstrap wurde verwendet, weil dies eine Vorgabe war und gleichzeitig eine schnelle, konsistente Umsetzung ermoeglichte.
- **End-to-End-Ablauf:** Nutzer registrieren sich oder loggen sich ein, waehlen auf der Startseite Bildanzahl und Timer, spielen eine Runde, sehen den finalen Score und koennen anschliessend Profil oder globale Highscores einsehen.
- **Mockup:** Das klickbare Mockup wurde in Figma als Wireframe erstellt und zeigte die wichtigsten Screens: Login, Sign up, Spielstart, Spielansicht, Highscores und Profil.

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)
Der Prototyp setzt auf eine dunkle, spielartige Oberflaeche mit gruenen Akzenten. Die Gestaltung wurde bewusst relativ kompakt gehalten, damit der Fokus auf dem Workflow und nicht auf dekorativen Elementen liegt.

- **Informationsarchitektur:** 
  - `Login / Sign up`
  - `Spiel starten`
  - `Spiel`
  - `Profil`
  - `Highscores`
- **User Interface Design:** 
  - **Login / Sign up:** gemeinsamer Einstieg mit Umschalten zwischen Login und Registrierung
  - **Spielstart:** Auswahl von Bildanzahl und Timer, anschliessend Start einer neuen Runde
  - **Spielscreen:** grosses Bild links, Map mit Guess-Bereich rechts, Timer und Buttons fuer Guess/Skip
  - **Profil:** Anzeige der Profildaten, Bearbeitung des Profils, gefilterte Scores pro Spielart
  - **Highscores:** gefiltertes Leaderboard mit Podest fuer die Top 3 und Tabelle fuer weitere Eintraege
- **Designentscheidungen:** 
  - Gruen/Schwarz als klare visuelle Richtung passend zum Game-Kontext
  - Bootstrap-Komponenten fuer Formulare, Buttons, Cards und Tabellen
  - Profil nicht als eigener Navigationsbutton, sondern ueber den klickbaren User-Bereich
  - Filter fuer Bildanzahl und Timer separat, damit Statistiken und Highscores gezielt eingeschraenkt werden koennen

#### 3.4.2. Umsetzung (Technik)
- **Technologie-Stack:** SvelteKit, TypeScript, Bootstrap 5, MongoDB Node Driver, MongoDB Atlas
- **Tooling:** VS Code, Git/GitHub, Figma fuer das Mockup, Netlify fuer Deployment, MongoDB Atlas fuer die Datenbank
- **Struktur & Komponenten:** 
  - **Routen:** 
    - `src/routes/+page.svelte` fuer Login / Sign up
    - `src/routes/app/+page.svelte` fuer Spielstart
    - `src/routes/app/game/+page.svelte` fuer den Spielscreen
    - `src/routes/app/profile/+page.svelte` fuer Profil und gefilterte Scores
    - `src/routes/app/leaderboard/+page.svelte` fuer globale Highscores
  - **Store:** `src/lib/stores/app-store.ts` verwaltet den Frontend-State und kommuniziert mit den API-Endpunkten
  - **Komponenten:** `AppShell`, `DeadlockMap`, `ModeBadge`, `Podium`
  - **Serverlogik:** `src/lib/server/db.ts` und `src/lib/server/mongodb.ts`
- **Daten & Schnittstellen:** 
  - Daten liegen in MongoDB Atlas
  - Collections: `users`, `pictures`, `scores`
  - `scores.userId` referenziert den jeweiligen User
  - `scores.isTopThreeForUser` steuert, welche Eintraege im globalen Leaderboard auftauchen
  - API-Endpunkte fuer Login, Sign up, Profil-Update, zufaellige Bilder, Score-Speicherung und Bootstrap-Daten
- **Deployment:** Deployment ueber Netlify
- **Besondere Entscheidungen:** 
  - Profilstatistiken werden aktuell dynamisch aus den gespeicherten Scores berechnet statt in einer separaten Stats-Collection gehalten
  - Die Map bleibt statisch, nur die Zielkoordinaten der Bilder sind in der Datenbank gespeichert
  - Das globale Leaderboard zeigt bewusst nicht beliebig viele Eintraege pro User, sondern maximal die besten drei

### 3.5 Validate
- **URL der getesteten Version** (separat deployt): Netlify-Deployment
- **Ziele der Prüfung:** Ueberpruefen, ob der Hauptworkflow von Login bis gespeicherten Scores technisch und visuell funktioniert.
- **Vorgehen:** Eigenes Testen waehrend der Entwicklung sowie wiederholte technische Kontrolle nach Aenderungen an Routing, MongoDB-Anbindung und Deployment.
- **Stichprobe:** Kein formaler externer Usability-Test; Hauptfokus auf technischer Validierung und Workflow-Pruefung.
- **Aufgaben/Szenarien:** 
  - Nutzerkonto erstellen
  - Einloggen
  - Spielmodus waehlen
  - Runde starten und Guess abgeben
  - Score im Profil pruefen
  - Highscore-Liste nach Spielmodus filtern
- **Kennzahlen & Beobachtungen:** 
  - Lokale Typechecks wurden erfolgreich ausgefuehrt
  - Deployment-Probleme traten vor allem bei MongoDB/Netlify und Atlas-IP-Freigaben auf
  - Die Trennung zwischen Profil-Scores und globalem Leaderboard funktionierte wie geplant
- **Zusammenfassung der Resultate:** Der Kernworkflow des Prototyps funktioniert. Besonders wichtig war die saubere Datenhaltung in MongoDB und die Regel, dass im globalen Leaderboard pro User nur die besten drei Scores erscheinen.
- **Abgeleitete Verbesserungen:** 
  - Robusteres Error Handling fuer Produktionsfehler
  - Bessere Admin-Moeglichkeit zum Verwalten von Bildern
  - Echte Passwort-Hashes und sichereres Authentifizierungsmodell
  - Optional spaeter Tests mit realen Nutzern fuer Bedienbarkeit und Verstaendlichkeit

## 4. Erweiterungen [Optional]

### 4.1 MongoDB-Integration
- **Beschreibung & Nutzen:** Nutzer, Bilder und Scores werden nicht nur lokal simuliert, sondern ueber MongoDB gespeichert. Das macht den Prototypen naeher an einer echten Webapplikation.
- **Wo umgesetzt:** 
  - **Frontend:** Store-Kommunikation ueber API-Endpunkte
  - **Backend:** MongoDB-Zugriff in `src/lib/server/db.ts`
  - **Datenbank:** Collections `users`, `pictures`, `scores`
- **Referenz:** beschrieben in Kapitel 3.4.2 und in [mongodb-schema.md](/Users/rubensouto/Documents/Schuel/IdeaProjects/Semester%204/Pt/Deadlock_GeoGuesser_soutorub/Deadlock_Geoguesser_soutorub/mongodb-schema.md)
- **Aus Evaluation abgeleitet?:** Nein, dies war Teil der technischen Zielsetzung

### 4.2 Gefilterte Highscores und Profilscores
- **Beschreibung & Nutzen:** Sowohl im Profil als auch in den globalen Highscores kann nach Bildanzahl und Timer gefiltert werden. Dadurch bleiben die Listen uebersichtlich.
- **Wo umgesetzt:** 
  - **Frontend:** Filterelemente und Tabellen auf Profil- und Highscore-Seite
  - **Backend:** Scores werden mit `modeKey`, `roundCount` und `timerSeconds` gespeichert
- **Referenz:** Kapitel 3.4.1 und 3.4.2
- **Aus Evaluation abgeleitet?:** Teil der Designentscheidung fuer bessere Uebersicht

### 4.3 Begrenzung des globalen Leaderboards pro User
- **Beschreibung & Nutzen:** Im globalen Leaderboard werden pro User maximal die besten drei Scores angezeigt. Dadurch wird verhindert, dass ein einzelner User die gesamte Liste dominiert.
- **Wo umgesetzt:** 
  - **Backend:** Flag `isTopThreeForUser` in der `scores`-Collection und Aktualisierung in `src/lib/server/db.ts`
  - **Frontend:** Leaderboard verwendet nur diese markierten Eintraege
- **Referenz:** Kapitel 3.4.2 und [mongodb-schema.md](/Users/rubensouto/Documents/Schuel/IdeaProjects/Semester%204/Pt/Deadlock_GeoGuesser_soutorub/Deadlock_Geoguesser_soutorub/mongodb-schema.md)
- **Aus Evaluation abgeleitet?:** Nein, war funktionale Anforderung

## 5. Projektorganisation [Optional]
- **Repository & Struktur:** Das Projekt ist als SvelteKit-Repository organisiert mit klarer Trennung zwischen Routen, Komponenten, Store und Serverlogik.
- **Issue-Management:** Es wurde kein formales externes Issue-Board verwendet; die Entwicklung erfolgte iterativ entlang der Anforderungen.
- **Commit-Praxis:** Mehrere kleine Commits mit sprechenden Messages fuer Setup, State, Seiten und Dokumentation.

## 6. KI-Deklaration
Die folgende Deklaration beschreibt den Einsatz von KI im Projekt.

### 6.1 KI-Tools
- **Eingesetzte Tools**: ChatGPT / Codex
- **Zweck & Umfang**: KI wurde fuer Styling-Unterstuetzung, Hilfe beim Beheben von Fehlern im Code, Unterstuetzung beim Netlify-Deployment sowie fuer das Erstellen von Beispieldaten zur ersten Befuellung der Datenbank verwendet. Ebenfalls wurde KI bei technischen Refactorings und bei der Dokumentationsformulierung genutzt.
- **Eigene Leistung (Abgrenzung):** Die Projektidee, die fachlichen Anforderungen, die Auswahl der Funktionen, die inhaltlichen Entscheidungen zum Gameplay sowie die laufende Kontrolle und Anpassung der Resultate wurden eigenstaendig vorgenommen. KI-generierte Vorschlaege wurden nicht ungeprueft uebernommen, sondern angepasst und auf das Projekt zugeschnitten.

### 6.2 Prompt-Vorgehen
Die KI wurde schrittweise eingesetzt. Zunaechst wurden einzelne Teilprobleme formuliert, zum Beispiel Styling-Fragen, MongoDB-Anbindung, Fehlerbilder im Deployment oder Strukturierungsfragen im Code. Danach wurden die generierten Vorschlaege geprueft, angepasst und in den konkreten Projektkontext uebernommen. Beim Prompting wurde darauf geachtet, klar zu trennen zwischen funktionalen Anforderungen, technischen Randbedingungen und gewuenschtem Output. Fuer die Dokumentation und erste Beispieldaten wurden ebenfalls gezielte Prompts verwendet.

### 6.3 Reflexion
Der Einsatz von KI war besonders hilfreich bei der Beschleunigung technischer Detailarbeit, beim Debugging und bei der Strukturierung einzelner Umsetzungsschritte. Grenzen zeigten sich dort, wo projektspezifische Entscheidungen, Deployment-Randbedingungen oder Datenbankkonzepte manuell kontrolliert werden mussten. Deshalb war eine laufende fachliche und technische Ueberpruefung notwendig. KI war in diesem Projekt ein Hilfsmittel, aber nicht Ersatz fuer Planung, Kontrolle und Entscheidungsfindung.

## 7. Anhang [Optional]
- **Quellen:** 
  - MongoDB Atlas Dokumentation
  - Netlify Dokumentation
  - SvelteKit Dokumentation
  - Bootstrap Dokumentation
- **Testskript & Materialien:** Manuelle Tests entlang der Kernworkflows Login, Spielstart, Spiel, Profil und Highscores
- **Rohdaten/Auswertung:** Beispielhafte Datenstruktur in [mongodb-schema.md](/Users/rubensouto/Documents/Schuel/IdeaProjects/Semester%204/Pt/Deadlock_GeoGuesser_soutorub/Deadlock_Geoguesser_soutorub/mongodb-schema.md)
