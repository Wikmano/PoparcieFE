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

## Continuous Deployment (CD)

Projekt posiada skonfigurowany proces automatycznego wdrożenia za pomocą **GitHub Actions** i **Self-hosted Runnera**.

### Architektura portów
- **Port 5000**: Publiczny port aplikacji.
- **Port 5001**: Prywatny rejestr obrazów Docker.
- **Port 5173**: Wewnętrzny port aplikacji Vite (mapowany na 5000).

### Konfiguracja serwera (Pierwsze uruchomienie)
1. **Uruchomienie rejestru Docker:**
   ```bash
   docker run -d -p 5001:5000 --restart always --name registry registry:2
   ```
2. **GitHub Actions Runner:** Skonfiguruj runnera w `Settings > Actions > Runners` w repozytorium GitHub.

---

## Technologie
- **Frontend:** React 19, Vite, Vanilla CSS
- **Bezpieczeństwo:** zkSNARKs (Wiedza Zerowa), mObywatel API
- **Infrastruktura:** Docker, GitHub Actions, Self-hosted Runners
