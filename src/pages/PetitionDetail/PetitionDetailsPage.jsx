import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { petitionsService } from '../../services/petitionsService.js';
import { voteService } from '../../services/voteService.js';
import { authService } from '../../services/authService.js';
import { zkpService } from '../../services/zkpService.js';
import { hashPassword, getPasskeySecret, createIdentity } from '../../services/identityService.js';
import { generateProof } from '@semaphore-protocol/proof';
import { SNARK_ARTIFACTS } from '../../AppConfig.js';
import './PetitionDetailsPage.css';
import { Group } from '@semaphore-protocol/group';

function PetitionDetailsPage() {
  const { id } = useParams();
  const [petition, setPetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = authService.isAdmin();
  const isOrganization = authService.isOrganization();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auth flow states for voting
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');

  const loadPetition = useCallback(async () => {
    if (!id) {
      setError('Brak id petycji');
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      setSuccessMessage('');
      setIsLoading(true);
      const data = await petitionsService.getPetitionById(id);
      const p = data?.data ?? data;
      setPetition(p);
    } catch {
      setError('Nie udało się pobrać petycji');
      setPetition(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPetition();
  }, [loadPetition]);

  const executeZkpVoting = async (secretString) => {
    try {
      setIsSigning(true);
      setError('');
      setSuccessMessage('');

      const identity = createIdentity(secretString);
      const commitment = identity.commitment.toString();
      const groupId = '1'; //Only one tree for now

      const commitmentsData = await voteService.getGroup(groupId);
      const commitments = commitmentsData?.data;

      const semaphoreGroup = new Group(commitments);
      const leafIndex = semaphoreGroup.indexOf(commitment);
      if (leafIndex === -1) {
        throw new Error('Podane hasło lub klucz są nieprawidłowe (brak autoryzacji).');
      }
      const merkleProof = semaphoreGroup.generateMerkleProof(leafIndex);

      const groupDepth = semaphoreGroup.depth;
      const message = '1';
      const scope = id;
      const snarkArtifacts = SNARK_ARTIFACTS
        ? {
            wasm: SNARK_ARTIFACTS.replace(/\/+$/, '') + `/semaphore-${groupDepth}.wasm`,
            zkey: SNARK_ARTIFACTS.replace(/\/+$/, '') + `/semaphore-${groupDepth}.zkey`,
          }
        : undefined;

      const generatedProof = await generateProof(
        identity,
        merkleProof,
        message,
        scope,
        groupDepth,
        snarkArtifacts,
      );

      await zkpService.sign({ proof: generatedProof, id: scope });

      // Clear memory
      setPassword('');
      setShowAuthPrompt(false);

      // Reload petition to show updated vote count
      await loadPetition();
      setSuccessMessage('Twój głos został pomyślnie oddany!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Nie udało się oddać głosu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSigning(false);
    }
  };

  const handleSignPetitionInit = () => {
    setShowAuthPrompt(true);
  };

  const handlePasskeyVoteClick = async (attachment) => {
    try {
      setError('');
      const secret = await getPasskeySecret(attachment);
      await executeZkpVoting(secret);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Błąd podczas autoryzacji Passkey');
    }
  };

  const handlePasswordVoteSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Hasło nie może być puste');
      return;
    }
    if (password.length < 12) {
      setError('Hasło musi mieć co najmniej 12 znaków');
      return;
    }
    try {
      const hashed = await hashPassword(password);
      await executeZkpVoting(hashed);
    } catch {
      setError('Błąd podczas hashowania hasła');
    }
  };

  const handleDeleteClick = async () => {
    if (!petition) {
      return;
    }

    try {
      setIsSavingChanges(true);
      setAdminMessage('');
      const petitionId = petition._id ?? petition.id ?? id;
      await petitionsService.archivePetition(petitionId);

      setAdminMessage('Akcja została wykonana. Id: ' + petitionId);
    } catch (err) {
      setAdminMessage(err?.response?.data?.message || 'Nie udało się wykonać akcji.');
    } finally {
      setIsSavingChanges(false);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Ładowanie petycji...</div>;
  }

  if (error && !petition) {
    return (
      <div className="not-found-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!petition) {
    return <div className="not-found-container">Petycja nie została znaleziona.</div>;
  }

  const progressPercentage = Math.min((petition.votes / petition.goal) * 100, 100);
  const formattedDate = petition.createdAt
    ? new Date(petition.createdAt).toLocaleDateString('pl-PL')
    : 'Brak daty';
  const formattedDeadline = petition.deadline
    ? new Date(petition.deadline).toLocaleDateString('pl-PL')
    : 'Brak terminu';

  // Obliczanie czy petycja wygasła
  const isExpired = petition.deadline ? new Date(petition.deadline) < new Date() : false;

  let statusClass = 'active';
  let statusText = 'Aktywna';
  const statusLower = petition.status ? petition.status.toLowerCase() : '';

  if (statusLower === 'archived') {
    statusClass = 'archived';
    statusText = 'Zaarchiwizowana';
  } else if (statusLower === 'closed' || isExpired) {
    statusClass = 'closed';
    statusText = 'Zakończona';
  }

  const isArchived = statusLower === 'archived';
  const adminActionLabel = isArchived ? 'Przywróć' : 'Ukryj';
  const canSign = statusClass === 'active';

  return (
    <div className="petition-details-page">
      <main className="petition-container">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="petition-badges">
          <span className="badge category-badge">{petition.category || 'Ogólne'}</span>
          <span className={`badge status-badge ${statusClass}`}>{statusText}</span>
        </div>

        <header className="petition-header">
          <h1>{petition.title}</h1>
          <div className="author-info">
            <span className="author-name">Autor: {petition.authorDisplayName}</span>
            <span className="petition-separator">|</span>
            <span className="petition-date">Utworzono: {formattedDate}</span>
          </div>
        </header>

        <section className="petition-description">
          <div className="description-label">Opis petycji</div>
          {petition.longDescription}
        </section>

        <section className="petition-stats">
          <div className="stats-header">
            <span className="votes-count">{petition.votes}</span>
            <span className="votes-goal">z celu {petition.goal} głosów</span>
          </div>
          <div className="progress-bar-large">
            <div className="progress-fill-large" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="stats-footer">
            <div className="deadline-info">
              Termin zakończenia: <strong>{formattedDeadline}</strong>
            </div>
          </div>
        </section>

        {isAdmin && (
          <section className="admin-menu">
            <button
              className="admin-menu-toggle"
              type="button"
              onClick={() => setIsAdminMenuOpen((prevState) => !prevState)}
            >
              {isAdminMenuOpen ? 'Ukryj menu admina' : 'Pokaż menu admina'}
            </button>

            {isAdminMenuOpen && (
              <div className="admin-actions">
                <button
                  className="admin-action-button admin-delete-button"
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={isSavingChanges}
                  title={isArchived ? 'Przywróć petycję' : 'Ukryj petycję'}
                >
                  {isSavingChanges ? 'Przetwarzanie...' : adminActionLabel}
                </button>
              </div>
            )}

            {adminMessage && <div className="admin-message">{adminMessage}</div>}
          </section>
        )}

        {!isOrganization && (
          <section
            className="petition-signing-section"
            style={{
              marginTop: '1.5rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid #f0f0f0',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {!showAuthPrompt ? (
              <button
                className="sign-button"
                type="button"
                onClick={handleSignPetitionInit}
                disabled={isSigning || !canSign}
              >
                {statusClass === 'archived'
                  ? 'Petycja zaarchiwizowana'
                  : statusClass === 'closed'
                    ? 'Petycja wygasła'
                    : 'Podpisz petycję'}
              </button>
            ) : (
              <div
                className="auth-prompt-container"
                style={{
                  background: '#f8fafc',
                  padding: '30px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  width: '100%',
                }}
              >
                <h3>Potwierdź swoją tożsamość</h3>
                <p>Aby oddać głos anonimowo, musisz potwierdzić swoją tożsamość.</p>

                {!usePassword ? (
                  <div
                    className="passkey-options"
                    style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                  >
                    <button
                      className="passkey-btn"
                      onClick={() => handlePasskeyVoteClick('platform')}
                      disabled={isSigning}
                      style={{ backgroundColor: '#0f766e' }}
                    >
                      {isSigning ? 'Przetwarzanie...' : 'Windows Hello / Biometria'}
                    </button>
                    <button
                      className="passkey-btn"
                      onClick={() => handlePasskeyVoteClick('security-key')}
                      disabled={isSigning}
                      style={{ backgroundColor: '#1e40af' }}
                    >
                      {isSigning ? 'Przetwarzanie...' : 'Klucz sprzętowy (U2F/Yubikey)'}
                    </button>
                    <button
                      className="passkey-btn"
                      onClick={() => handlePasskeyVoteClick('hybrid')}
                      disabled={isSigning}
                      style={{ backgroundColor: '#6d28d9' }}
                    >
                      {isSigning ? 'Przetwarzanie...' : 'Kod QR / Telefon (Wymagany Bluetooth)'}
                    </button>
                    <button
                      className="passkey-btn"
                      onClick={() => setUsePassword(true)}
                      disabled={isSigning}
                      style={{ backgroundColor: '#64748b', marginTop: '10px' }}
                    >
                      Chcę użyć tradycyjnego hasła
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordVoteSubmit} className="password-form">
                    <input
                      type="password"
                      placeholder="Wprowadź swoje hasło"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSigning}
                      required
                    />
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={isSigning}
                      style={{ backgroundColor: '#059669' }}
                    >
                      {isSigning ? 'Przetwarzanie...' : 'Autoryzuj hasłem'}
                    </button>
                    <button
                      type="button"
                      className="passkey-btn"
                      onClick={() => setUsePassword(false)}
                      disabled={isSigning}
                      style={{ backgroundColor: '#6366f1', marginTop: '10px' }}
                    >
                      Wróć do opcji Passkeys
                    </button>
                  </form>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default PetitionDetailsPage;
