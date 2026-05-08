import { describe, it, expect } from 'vitest';
import { loginSchema } from '../../../src/schemas/loginSchema.js';

describe('loginSchema', () => {
  it('should pass with valid credentials', () => {
    const result = loginSchema.safeParse({ username: 'user', password: 'pass' });
    expect(result.success).toBe(true);
  });

  it('should fail when username is empty', () => {
    const result = loginSchema.safeParse({ username: '', password: 'pass' });
    expect(result.success).toBe(false);
  });

  it('should fail when password is empty', () => {
    const result = loginSchema.safeParse({ username: 'user', password: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when username is missing', () => {
    const result = loginSchema.safeParse({ password: 'pass' });
    expect(result.success).toBe(false);
  });

  it('should fail when password is missing', () => {
    const result = loginSchema.safeParse({ username: 'user' });
    expect(result.success).toBe(false);
  });

  it('should fail when both fields are empty', () => {
    const result = loginSchema.safeParse({ username: '', password: '' });
    expect(result.success).toBe(false);
  });

  it('should include error message when username is empty', () => {
    const result = loginSchema.safeParse({ username: '', password: 'pass' });
    expect(result.success).toBe(false);
    const messages = result.error.issues.map((i) => i.message);
    expect(messages).toContain('Nazwa użytkownika jest wymagana');
  });

  it('should include error message when password is empty', () => {
    const result = loginSchema.safeParse({ username: 'user', password: '' });
    expect(result.success).toBe(false);
    const messages = result.error.issues.map((i) => i.message);
    expect(messages).toContain('Hasło jest wymagane');
  });
});
