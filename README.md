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

## Repozytoria Projektu

- **Frontend:** [GitHub (PoparcieFE)](https://github.com/Wikmano/PoparcieFE)
- **Backend:** [GitHub (mPoparcie-backend)](https://github.com/Luk1104/mPoparcie-backend)

---

## Szybki start (Local Dev)

Aplikacja zbudowana w oparciu o React + Vite.

Aby uruchomić projekt lokalnie:

```bash
npm install
npm run dev
```

Aby automatycznie naprawić błędy ESLint i formatowanie Prettier:

```bash
npm run fix
```

---

## Technologie

- **Frontend:** React 19, Vite, Vanilla CSS
- **Bezpieczeństwo:** zkSNARKs (Wiedza Zerowa), mObywatel API
