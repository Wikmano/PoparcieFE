import { describe, it, expect } from 'vitest';
import { registerSchema } from '../../../src/schemas/registerSchema.js';

const validData = {
  username: 'jankowalski',
  password: 'strongpassword1',
  name: 'Jan',
  surname: 'Kowalski',
};

describe('registerSchema', () => {
  it('should pass with valid data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when username is too short (< 3 chars)', () => {
    const result = registerSchema.safeParse({ ...validData, username: 'ab' });
    expect(result.success).toBe(false);
  });

  it('should fail when username is too long (> 16 chars)', () => {
    const result = registerSchema.safeParse({ ...validData, username: 'averylongusername123' });
    expect(result.success).toBe(false);
  });

  it('should fail when password is too short (< 12 chars)', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'short' });
    expect(result.success).toBe(false);
  });

  it('should fail when password is too long (> 100 chars)', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('should fail when name is too short (< 2 chars)', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'J' });
    expect(result.success).toBe(false);
  });

  it('should fail when name is too long (> 20 chars)', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'J'.repeat(21) });
    expect(result.success).toBe(false);
  });

  it('should fail when surname is too short (< 2 chars)', () => {
    const result = registerSchema.safeParse({ ...validData, surname: 'K' });
    expect(result.success).toBe(false);
  });

  it('should fail when surname is too long (> 40 chars)', () => {
    const result = registerSchema.safeParse({ ...validData, surname: 'K'.repeat(41) });
    expect(result.success).toBe(false);
  });

  it('should fail when required field is missing', () => {
    const { username: _u, ...rest } = validData;
    const result = registerSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('should include error message for short username', () => {
    const result = registerSchema.safeParse({ ...validData, username: 'ab' });
    expect(result.success).toBe(false);
    const messages = result.error.issues.map((i) => i.message);
    expect(messages).toContain('Nazwa użytkownika musi mieć minimum 3 znaki');
  });

  it('should include error message for short password', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'short' });
    expect(result.success).toBe(false);
    const messages = result.error.issues.map((i) => i.message);
    expect(messages).toContain('Hasło musi mieć minimum 12 znaków');
  });
});
