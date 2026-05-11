import { Identity } from '@semaphore-protocol/identity';

export async function hashPassword(password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  );
  const salt = enc.encode('mPoparcie-salt-fixed');
  const key = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );
  return Array.from(new Uint8Array(key))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getPasskeySecret(authType) {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const prfSalt = new TextEncoder().encode('mPoparcie-prf-salt-v1').buffer;
  const hashBuffer = await crypto.subtle.digest('SHA-256', prfSalt);
  const prfInput = new Uint8Array(hashBuffer);

  const publicKeyOptions = {
    challenge: challenge,
    rpId: window.location.hostname,
    extensions: { prf: { eval: { first: prfInput } } },
  };

  if (authType) {
    const hintMap = {
      platform: 'client-device',
      'security-key': 'security-key',
      hybrid: 'hybrid',
    };
    if (hintMap[authType]) {
      publicKeyOptions.hints = [hintMap[authType]];
    }
  }

  const getResult = await navigator.credentials.get({
    publicKey: publicKeyOptions,
  });

  const extensionResults = getResult.getClientExtensionResults();

  if (extensionResults.prf && extensionResults.prf.results && extensionResults.prf.results.first) {
    const secretMaterial = new Uint8Array(extensionResults.prf.results.first);
    return Array.from(secretMaterial)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    throw new Error('Urządzenie nie zwróciło WebAuthn PRF (Passkeys). Spróbuj użyć hasła.');
  }
}

export async function createPasskeySecret(authType) {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  const prfSalt = new TextEncoder().encode('mPoparcie-prf-salt-v1').buffer;
  const hashBuffer = await crypto.subtle.digest('SHA-256', prfSalt);
  const prfInput = new Uint8Array(hashBuffer);

  const authenticatorSelection = {
    userVerification: 'required',
    residentKey: 'required',
    requireResidentKey: true,
  };

  if (authType === 'platform') {
    authenticatorSelection.authenticatorAttachment = 'platform';
  } else if (authType === 'security-key') {
    authenticatorSelection.authenticatorAttachment = 'cross-platform';
  }
  const publicKeyCredentialCreationOptions = {
    challenge: challenge,
    rp: {
      name: 'Logowanie',
      id: window.location.hostname,
    },
    user: {
      id: userId,
      name: 'zkpuser',
      displayName: 'zkpuser',
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },
      { alg: -257, type: 'public-key' },
    ],
    authenticatorSelection: authenticatorSelection,
    extensions: {
      prf: {
        eval: {
          first: prfInput,
        },
      },
    },
  };

  if (authType) {
    const hintMap = {
      platform: 'client-device',
      'security-key': 'security-key',
      hybrid: 'hybrid',
    };
    if (hintMap[authType]) {
      publicKeyCredentialCreationOptions.hints = [hintMap[authType]];
    }
  }

  const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  });

  const extensionResults = credential.getClientExtensionResults();

  let secretMaterial;
  if (extensionResults.prf && extensionResults.prf.results && extensionResults.prf.results.first) {
    secretMaterial = new Uint8Array(extensionResults.prf.results.first);
  } else if (extensionResults.prf && extensionResults.prf.enabled) {
    // Sometimes PRF output isn't returned on creation, we need to assert to get it
    return await getPasskeySecret(authType);
  } else {
    throw new Error('Urządzenie nie obsługuje WebAuthn PRF (Passkeys). Spróbuj użyć hasła.');
  }

  return Array.from(secretMaterial)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function createIdentity(secretString) {
  return new Identity(secretString);
}
