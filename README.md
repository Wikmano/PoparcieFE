# M-Poparcie Frontend

Aplikacja kliencka projektu M-Poparcie zbudowana w oparciu o React + Vite.

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

---

## Continuous Deployment (CD)

Projekt posiada skonfigurowany proces automatycznego wdrożenia za pomocą **GitHub Actions** i **Self-hosted Runnera**.

### Architektura portów

- **Port 5000**: Publiczny port aplikacji (dostępny w przeglądarce).
- **Port 5001**: Prywatny rejestr obrazów Docker (Docker Registry).
- **Port 5173**: Wewnętrzny port aplikacji Vite (mapowany na 5000).

### Konfiguracja serwera (Pierwsze uruchomienie)

Aby proces CD działał poprawnie, na serwerze (maszynie z runnerem) należy jednorazowo wykonać poniższe kroki:

#### 1. Uruchomienie lokalnego rejestru Docker

Rejestr jest niezbędny do przechowywania zbudowanych obrazów:

```bash
docker run -d -p 5001:5000 --restart always --name registry registry:2
```

#### 2. Konfiguracja GitHub Actions Runner

Należy pobrać i skonfigurować runnera zgodnie z instrukcją w ustawieniach repozytorium GitHub (`Settings > Actions > Runners`). Runner musi być uruchomiony (`./run.sh`), aby odbierać zadania.

### Proces wdrażania

Po każdym wypchnięciu zmian na gałąź `main` (`git push origin main`):

1. GitHub Actions zleca zadanie runnerowi.
2. Obraz Docker jest budowany i wysyłany do `localhost:5001`.
3. Stary kontener aplikacji jest usuwany.
4. Nowy kontener o nazwie `m-poparcie-frontend` jest uruchamiany na porcie `5000`.

---

## Technologie

- React 19
- Vite 8
- Docker
- GitHub Actions
- Prettier & ESLint
