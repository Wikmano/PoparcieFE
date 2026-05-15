import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <h1 className="about-hero__title">O nas – Poznaj mPoparcie</h1>
        <p className="about-hero__subtitle">GŁOSUJESZ I&nbsp;DECYDUJESZ.</p>
      </section>

      {/* Intro */}
      <section className="about-intro">
        <p>
          Wierzymy, że demokracja w&nbsp;XXI wieku powinna być wygodna, dostępna
          z&nbsp;każdego miejsca na świecie, a&nbsp;przede wszystkim – całkowicie
          bezpieczna. Dlatego stworzyliśmy <strong>mPoparcie</strong> –
          nowoczesny, anonimowy i&nbsp;nielinkowalny system do głosowania
          elektronicznego (e-votingu). Naszym celem jest przeniesienie zaufania,
          jakie mamy do tradycyjnej, papierowej urny wyborczej, do świata
          cyfrowego.
        </p>
      </section>

      {/* How it works */}
      <section className="about-section">
        <h2 className="about-section__heading">
          🔐 Jak to działa? Magia &bdquo;Wiedzy Zerowej&rdquo;
        </h2>
        <p className="about-section__text">
          Głównym problemem głosowania przez internet jest zawsze ten sam
          dylemat: <em>Skoro system musi wiedzieć kim jestem, żeby pozwolić mi
          zagłosować, to jak może zagwarantować, że mój głos pozostanie
          tajny?</em>
        </p>
        <p className="about-section__text">
          Rozwiązaniem tego problemu jest przełomowa technologia{' '}
          <strong>Dowodów Wiedzy Zerowej</strong> (Zero-Knowledge Proofs).
          Działa ona jak cyfrowa, matematyczna kabina wyborcza. Pozwala Ci
          udowodnić systemowi, że masz prawo głosu, bez ujawniania kim jesteś,
          ani jak głosujesz. Proces podzieliliśmy na dwa proste etapy:
        </p>

        {/* Step 1 */}
        <article className="about-step">
          <div className="about-step__indicator">1</div>
          <div className="about-step__body">
            <h3 className="about-step__title">
              Rejestracja <span className="about-step__badge">Pobranie cyfrowej karty</span>
            </h3>
            <p className="about-step__lead">
              Aby zagłosować, musimy mieć pewność, że jesteś prawdziwą osobą,
              która ma do tego prawo.
            </p>
            <ul className="about-step__list">
              <li>
                <strong>Potwierdzenie tożsamości:</strong> Logujesz się za
                pomocą bezpiecznej, rządowej aplikacji <em>mObywatel</em>.
                Dzięki temu wiemy, że jesteś człowiekiem, a&nbsp;nie
                komputerowym botem.
              </li>
              <li>
                <strong>Anonimizacja:</strong> Tutaj dzieje się magia. System
                nie zapisuje Twojego imienia, nazwiska ani numeru PESEL.
                Zamiast tego, na Twoim własnym urządzeniu (za pomocą tzw.
                kluczy sprzętowych <em>passkeys</em> lub hasła) tworzona jest
                Twoja nowa, w&nbsp;100% anonimowa tożsamość. Do publicznej
                bazy danych trafia tylko skomplikowany ciąg znaków, który nie
                mówi o&nbsp;Tobie absolutnie nic.
              </li>
            </ul>
          </div>
        </article>

        {/* Step 2 */}
        <article className="about-step">
          <div className="about-step__indicator">2</div>
          <div className="about-step__body">
            <h3 className="about-step__title">
              Głosowanie <span className="about-step__badge">Wrzucenie głosu do urny</span>
            </h3>
            <p className="about-step__lead">
              Kiedy przychodzi czas decyzji, nie musisz się już nigdzie logować
              swoimi danymi.
            </p>
            <ul className="about-step__list">
              <li>
                Twój telefon lub komputer samodzielnie pobiera publiczną listę
                wszystkich uprawnionych i&nbsp;&bdquo;odnajduje&rdquo; na niej
                Twoją anonimową tożsamość.
              </li>
              <li>
                Następnie oddajesz głos. Twój telefon generuje specjalny
                matematyczny dowód, który potwierdza:{' '}
                <em>
                  &bdquo;Osoba oddająca ten głos jest na liście
                  uprawnionych&rdquo;
                </em>
                .
              </li>
              <li>
                Gotowy głos (niezawierający żadnych Twoich danych) trafia na
                nasz serwer, który sprawdza poprawność dowodu matematycznego
                i&nbsp;dopisuje go do puli.
              </li>
            </ul>
          </div>
        </article>
      </section>

      {/* Trust */}
      <section className="about-section">
        <h2 className="about-section__heading">
          🛡️ Dlaczego możesz nam zaufać?
        </h2>

        <div className="about-trust-grid">
          <article className="about-trust-card">
            <h3 className="about-trust-card__title">Prywatność absolutna</h3>
            <p>
              Jesteśmy systemem &bdquo;nielinkowalnym&rdquo;. Oznacza to, że
              z&nbsp;matematycznego punktu widzenia{' '}
              <strong>nikt</strong> – ani my, ani administratorzy serwerów, ani
              instytucje państwowe – nie jest w&nbsp;stanie połączyć oddanego
              głosu z&nbsp;Twoim nazwiskiem.
            </p>
          </article>

          <article className="about-trust-card">
            <h3 className="about-trust-card__title">Nowoczesna kryptografia</h3>
            <p>
              Używamy tych samych zaawansowanych algorytmów (np. funkcji skrótu
              Poseidon czy krzywych eliptycznych), które zabezpieczają
              najnowocześniejsze systemy finansowe na świecie.
            </p>
          </article>

          <article className="about-trust-card">
            <h3 className="about-trust-card__title">Transparentność</h3>
            <p>
              Nasza baza danych działa jak szklana urna (tzw.{' '}
              <em>Drzewo Merkle'a</em>) – jest publicznie dostępna, więc każdy
              może zweryfikować, że nikt nie manipuluje głosami.
            </p>
          </article>
        </div>
      </section>

      {/* Closing */}
      <section className="about-closing">
        <p>
          <strong>mPoparcie</strong> to narzędzie, które oddaje władzę
          w&nbsp;Twoje ręce, szanując Twoją prywatność.
        </p>
        <p className="about-closing__tagline">
          Bezpiecznie. Anonimowo. Elektronicznie.
        </p>
      </section>
    </main>
  );
}

export default AboutPage;
