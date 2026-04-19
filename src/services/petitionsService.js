import axios from 'axios';
import { BASE_API_URL, USE_MOCK_PETITIONS } from '../AppConfig.js';

const mockPetitionsSeed = [
  {
    id: 1,
    title: 'Petycja o ochronę środowiska',
    author: 'Jan Kowalski',
    description: 'Wiecej terenow zielonych i mniej zanieczyszczen w miescie.',
    votes: 150,
    target: 500,
    category: 'Ekologia',
    createdAt: '2026-03-15',
  },
  {
    id: 2,
    title: 'Petycja o lepsze drogi',
    author: 'Anna Nowak',
    description: 'Remont kluczowych drog i bezpieczniejsze przejscia dla pieszych.',
    votes: 200,
    target: 400,
    category: 'Infrastruktura',
    createdAt: '2026-03-16',
  },
  {
    id: 3,
    title: 'Petycja o edukację',
    author: 'Piotr Wiśniewski',
    description: 'Nowoczesne wyposazenie szkol i darmowe zajecia dodatkowe.',
    votes: 80,
    target: 300,
    category: 'Edukacja',
    createdAt: '2026-03-17',
  },
  {
    id: 4,
    title: 'Petycja o zdrowie',
    author: 'Maria Zielińska',
    description: 'Lepszy dostep do profilaktyki i krotsze kolejki do specjalistow.',
    votes: 120,
    target: 600,
    category: 'Zdrowie',
    createdAt: '2026-03-18',
  },
];

export class PetitionsService {
  constructor(useMock = USE_MOCK_PETITIONS) {
    this.useMock = useMock;
    this.mockPetitions = mockPetitionsSeed.map((petition) => ({ ...petition }));
    this.api = axios.create({
      baseURL: BASE_API_URL + 'petition/',
    });
  }

  async getAllPetitions() {
    if (this.useMock) {
      return this.mockPetitions.map((petition) => ({ ...petition }));
    }

    const response = await this.api.get('get');
    return response.data;
  }

  async getPetitionById(id) {
    if (this.useMock) {
      const petitionId = Number(id);
      return this.mockPetitions.find((petition) => petition.id === petitionId) || null;
    }

    const response = await this.api.get(`/${id}`);
    return response.data;
  }

  async signPetition(id) {
    if (this.useMock) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const petitionId = Number(id);
      const petition = this.mockPetitions.find((item) => item.id === petitionId);
      if (!petition) {
        throw new Error('Petition not found');
      }

      petition.votes += 1;
      return { ...petition };
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await this.api.post(`/${id}/sign`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
}

export const petitionsService = new PetitionsService();
