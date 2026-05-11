import { describe, it, expect } from 'vitest';
import { decodeToken } from '../../../src/services/tokenUtils.js';

function makeJwt(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fakesignature`;
}

describe('decodeToken', () => {
  it('should return null for null input', () => {
    expect(decodeToken(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(decodeToken(undefined)).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(decodeToken('')).toBeNull();
  });

  it('should return null for a string without 3 parts', () => {
    expect(decodeToken('only.two')).toBeNull();
  });

  it('should decode a valid JWT token', () => {
    const payload = { sub: '123', role: 'admin' };
    const token = makeJwt(payload);
    const result = decodeToken(token);
    expect(result).toMatchObject(payload);
  });

  it('should strip "Bearer " prefix before decoding', () => {
    const payload = { sub: '456', username: 'jan' };
    const token = 'Bearer ' + makeJwt(payload);
    const result = decodeToken(token);
    expect(result).toMatchObject(payload);
  });

  it('should return null for a token with invalid base64 payload', () => {
    const result = decodeToken('header.!!!invalid!!!.sig');
    expect(result).toBeNull();
  });
});
