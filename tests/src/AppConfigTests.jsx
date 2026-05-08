import { describe, it, expect } from 'vitest';
import { BASE_API_URL, USE_MOCK_PETITIONS } from '../../src/AppConfig.js';

describe('AppConfig', () => {
  it('should export BASE_API_URL as a string', () => {
    expect(typeof BASE_API_URL).toBe('string');
  });

  it('should export BASE_API_URL with a non-empty value', () => {
    expect(BASE_API_URL.length).toBeGreaterThan(0);
  });

  it('should export USE_MOCK_PETITIONS as a boolean', () => {
    expect(typeof USE_MOCK_PETITIONS).toBe('boolean');
  });
});
