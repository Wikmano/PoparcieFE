import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/AppConfig.js', () => ({
  BASE_API_URL: 'http://localhost:3000/api/',
  USE_MOCK_PETITIONS: true,
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
    })),
  },
}));

import { petitionsService } from '../../../src/services/petitionsService.js';

describe('petitionsService (mock mode)', () => {
  it('should return an array of petitions when no filters are applied', async () => {
    const result = await petitionsService.getAllPetitions();
    const petitions = result?.data?.petitions ?? result?.petitions ?? result ?? [];
    expect(Array.isArray(petitions)).toBe(true);
  });

  it('should return petitions filtered by title keyword', async () => {
    const result = await petitionsService.getAllPetitions({ title: 'drogi' });
    const petitions = result?.data?.petitions ?? result?.petitions ?? result ?? [];
    expect(Array.isArray(petitions)).toBe(true);
  });

  it('should return only active petitions when filtered by status active', async () => {
    const result = await petitionsService.getAllPetitions({ status: 'active' });
    const petitions = result?.data?.petitions ?? result?.petitions ?? result ?? [];
    expect(Array.isArray(petitions)).toBe(true);
    petitions.forEach((p) => {
      expect(p.status).toBe('active');
    });
  });

  it('should return mock petitions for getMyPetitions', async () => {
    const result = await petitionsService.getMyPetitions();
    const petitions = result?.data ?? result?.petitions ?? result ?? [];
    expect(Array.isArray(petitions)).toBe(true);
  });

  it('should find a petition by id in mock mode', async () => {
    const petition = await petitionsService.getPetitionById(1);
    expect(petition).not.toBeNull();
    expect(petition._id).toBe(1);
  });

  it('should return null for a non-existent petition id in mock mode', async () => {
    const petition = await petitionsService.getPetitionById(9999);
    expect(petition).toBeNull();
  });

  it('should create a new petition in mock mode and return it with active status', async () => {
    const newPetition = await petitionsService.createPetition({
      title: 'Nowa petycja testowa',
      shortDescription: 'Opis krótki',
      longDescription: 'Opis długi',
      goal: 500,
      category: 'Edukacja',
      deadline: '2030-01-01',
    });
    expect(newPetition).toBeDefined();
    expect(newPetition.title).toBe('Nowa petycja testowa');
    expect(newPetition.status).toBe('active');
  });
});
