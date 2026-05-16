# mPoparcie - Frontend

**Głosujesz i decydujesz anonimowo.**

mPoparcie to nowoczesny, **anonimowy** i **nielinkowalny** system open-source do wyrażania poparcia dla petycji. Naszym celem jest przeniesienie zaufania do tradycyjnej, papierowej urny wyborczej do świata cyfrowego przy użyciu nowoczesnej kryptografii.

Projekt można opisać trzema słowami:
**Bezpiecznie. Anonimowo. Elektronicznie.**

## O Projekcie

System wykorzystuje technologię **Nieinteraktywnych Dowodów Wiedzy Zerowej** (zkSNARKs), co pozwala udowodnić posiadanie prawa głosu (poprzez integrację z mObywatelem) bez ujawniania tożsamości użytkownika.

### Główne cechy:
- **Prywatność absolutna:** Nikt nie jest w stanie połączyć oddanego głosu z Twoimi danymi osobowymi.
- **Nowoczesna kryptografia:** Wykorzystanie algorytmów zkSNARKs i bezpiecznych kluczy sprzętowych (passkeys).
- **Transparentność:** Publicznie dostępna baza danych (Drzewo Merkle'a) pozwala każdemu zweryfikować poprawność procesu.

---

## Technologie Frontendowe

Aplikacja kliencka została zbudowana z wykorzystaniem nowoczesnego stosu technologicznego, skupiającego się na bezpieczeństwie i wydajności:

### Core Stack
- **React 19**: Najnowsza wersja biblioteki do budowy interfejsów użytkownika.
- **Vite 8**: Ultraszybkie narzędzie do budowania i serwowania aplikacji.
- **React Router 7**: Zaawansowane zarządzanie nawigacją i trasami.

### Bezpieczeństwo i Kryptografia
- **Semaphore Protocol**: Wykorzystanie grup i dowodów tożsamości do anonimowego głosowania.
- **WebAuthn (@simplewebauthn)**: Obsługa bezpiecznych kluczy sprzętowych (Passkeys) dla nielinkowalnej autentykacji.
- **Snarkjs**: Generowanie i weryfikacja dowodów wiedzy zerowej po stronie klienta.

### Zarządzanie Danymi i Formularzami
- **React Hook Form**: Wydajna obsługa formularzy.
- **Zod**: Ścisła walidacja schematów danych.
- **Axios**: Komunikacja z API Backendowym.

### Jakość Kodu i Testowanie
- **Vitest**: Nowoczesny runner testów jednostkowych i integracyjnych.
- **React Testing Library**: Testowanie komponentów z perspektywy użytkownika.
- **ESLint & Prettier**: Automatyczne zapewnienie spójności stylu kodu.

---

## Szybki start (Local Dev)

Aby uruchomić projekt lokalnie:

```bash
npm install
npm run dev
```

Aby automatycznie naprawić błędy ESLint i formatowanie Prettier:

```bash
npm run fix
```
