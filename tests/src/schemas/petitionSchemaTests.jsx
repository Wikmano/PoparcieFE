import { describe, it, expect } from 'vitest';
import { petitionSchema } from '../../../src/schemas/petitionSchema.js';

const validData = {
  title: 'Moja petycja',
  shortDescription: 'Krótki opis petycji',
  longDescription: 'Długi opis petycji zawierający szczegółowe informacje.',
  category: 'Edukacja',
  goal: 1000,
  deadline: '2030-12-31',
};

describe('petitionSchema', () => {
  it('should pass with valid data', () => {
    const result = petitionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when title is empty', () => {
    const result = petitionSchema.safeParse({ ...validData, title: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when title exceeds 100 characters', () => {
    const result = petitionSchema.safeParse({ ...validData, title: 'T'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('should fail when shortDescription is empty', () => {
    const result = petitionSchema.safeParse({ ...validData, shortDescription: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when shortDescription exceeds 100 characters', () => {
    const result = petitionSchema.safeParse({ ...validData, shortDescription: 'D'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('should fail when longDescription is empty', () => {
    const result = petitionSchema.safeParse({ ...validData, longDescription: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when longDescription exceeds 1000 characters', () => {
    const result = petitionSchema.safeParse({ ...validData, longDescription: 'L'.repeat(1001) });
    expect(result.success).toBe(false);
  });

  it('should fail when category is empty', () => {
    const result = petitionSchema.safeParse({ ...validData, category: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when goal is below minimum (< 100)', () => {
    const result = petitionSchema.safeParse({ ...validData, goal: 50 });
    expect(result.success).toBe(false);
  });

  it('should fail when goal exceeds maximum (> 100000)', () => {
    const result = petitionSchema.safeParse({ ...validData, goal: 100001 });
    expect(result.success).toBe(false);
  });

  it('should fail when goal is not a number', () => {
    const result = petitionSchema.safeParse({ ...validData, goal: 'not-a-number' });
    expect(result.success).toBe(false);
  });

  it('should fail when deadline is empty', () => {
    const result = petitionSchema.safeParse({ ...validData, deadline: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when extra fields are present (strict mode)', () => {
    const result = petitionSchema.safeParse({ ...validData, extra: 'field' });
    expect(result.success).toBe(false);
  });

  it('should pass at minimum goal boundary (100)', () => {
    const result = petitionSchema.safeParse({ ...validData, goal: 100 });
    expect(result.success).toBe(true);
  });

  it('should pass at maximum goal boundary (100000)', () => {
    const result = petitionSchema.safeParse({ ...validData, goal: 100000 });
    expect(result.success).toBe(true);
  });
});
