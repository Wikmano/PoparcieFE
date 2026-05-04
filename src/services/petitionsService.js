import axios from 'axios';
import { BASE_API_URL, USE_MOCK_PETITIONS } from '../AppConfig.js';

const mockPetitionsSeed = [
  {
    _id: 1,
    title: 'Petycja o ochronę środowiska',
    author: 'Jan Kowalski',
    description: 'Wiecej terenow zielonych i mniej zanieczyszczen w miescie.',
    votes: 150,
    goal: 500,
    category: 'Ekologia',
    status: 'active',
    createdAt: '2026-03-15',
  },
  {
    _id: 2,
    title: 'Petycja o lepsze drogi',
    author: 'Anna Nowak',
    description: 'Remont kluczowych drog i bezpieczniejsze przejscia dla pieszych.',
    votes: 200,
    goal: 400,
    category: 'Infrastruktura',
    status: 'active',
    createdAt: '2026-03-16',
  },
  {
    _id: 3,
    title: 'Petycja o edukację',
    author: 'Piotr Wiśniewski',
    description: 'Nowoczesne wyposazenie szkol i darmowe zajecia dodatkowe.',
    votes: 80,
    goal: 300,
    category: 'Edukacja',
    status: 'closed',
    createdAt: '2026-03-17',
  },
  {
    _id: 4,
    title: 'Petycja o zdrowie',
    author: 'Maria Zielińska',
    description: 'Lepszy dostep do profilaktyki i krotsze kolejki do specjalistow.',
    votes: 120,
    goal: 600,
    category: 'Zdrowie',
    status: 'archived',
    createdAt: '2026-03-18',
  },
];

class PetitionsService {
  constructor(useMock = USE_MOCK_PETITIONS) {
    this.useMock = useMock;
    this.mockPetitions = mockPetitionsSeed.map((petition) => ({ ...petition }));
    this.api = axios.create({
      baseURL: BASE_API_URL + 'petition/',
      withCredentials: true,
    });
  }

  async getAllPetitions(query = {}) {
    const { title, category, status, page = 1, perPage = 20, sortBy, sortOrder } = query;

    if (this.useMock) {
      let filtered = this.mockPetitions.map((petition) => ({ ...petition }));

      if (title) {
        const normalizedQuery = title.toLowerCase();
        filtered = filtered.filter(
          (petition) =>
            petition.title.toLowerCase().includes(normalizedQuery) ||
            petition.author.toLowerCase().includes(normalizedQuery),
        );
      }

      if (category && category !== 'All') {
        filtered = filtered.filter((petition) => petition.category === category);
      }

      if (status && status !== 'All') {
        filtered = filtered.filter((petition) => petition.status === status);
      }

      const direction = sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        if (sortBy === 'a') {
          return a.title.localeCompare(b.title) * direction;
        }
        if (sortBy === 'v') {
          return (a.votes - b.votes) * direction;
        }
        if (sortBy === 'd') {
          return (
            (new Date(a.deadline || a.createdAt) - new Date(b.deadline || b.createdAt)) * direction
          );
        }
        return (new Date(a.createdAt) - new Date(b.createdAt)) * direction;
      });

      const startIndex = (page - 1) * perPage;
      const paged = filtered.slice(startIndex, startIndex + perPage);
      return { data: { petitions: paged } };
    }

    const params = {};
    if (title) params.title = title;
    if (category && category !== 'All') params.category = category;
    if (status && status !== 'All') params.status = status;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    params.page = page;
    params.perPage = perPage;

    const response = await this.api.get('', { params });
    return response.data;
  }

  async getMyPetitions() {
    if (this.useMock) {
      return { data: this.mockPetitions.slice(0, 2) };
    }

    const response = await this.api.get('/me', {
      withCredentials: true,
    });
    return response.data;
  }

  async getPetitionById(id) {
    if (this.useMock) {
      const petitionId = Number(id);
      return this.mockPetitions.find((petition) => petition._id === petitionId) || null;
    }

    const response = await this.api.get(`/${id}`);
    return response.data;
  }

  async createPetition(petitionData) {
    if (this.useMock) {
      const newPetition = {
        _id: this.mockPetitions.length + 1,
        title: petitionData.title,
        shortDescription: petitionData.shortDescription,
        description: petitionData.longDescription, // Map to existing field for safety
        longDescription: petitionData.longDescription,
        goal: petitionData.goal,
        votes: 0,
        category: 'Inne',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };

      this.mockPetitions.push(newPetition);
      return newPetition;
    }

    const response = await this.api.post('/create', petitionData, {
      withCredentials: true,
    });

    return response.data;
  }

  async updatePetition(id, petitionData) {
    if (this.useMock) {
      const petitionId = Number(id);
      const index = this.mockPetitions.findIndex((petition) => petition._id === petitionId);

      if (index === -1) {
        throw new Error('Petycja nie została znaleziona');
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedPetition = {
        ...this.mockPetitions[index],
        ...petitionData,
        description: petitionData.longDescription ?? petitionData.description,
        longDescription: petitionData.longDescription ?? petitionData.description,
      };

      this.mockPetitions[index] = updatedPetition;
      return updatedPetition;
    }

    const response = await this.api.patch(`/${id}`, petitionData, {
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(response.statusText);
  }

  async archivePetition(id) {
    if (this.useMock) {
      const petitionId = Number(id);
      const index = this.mockPetitions.findIndex((petition) => petition._id === petitionId);
      if (index === -1) {
        throw new Error('Petycja nie została znaleziona');
      }
      // Simulate server delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Remove petition from mock storage
      this.mockPetitions.splice(index, 1);

      return;
    }

    const response = await this.api.patch(
      `/${id}/archive`,
      {},
      {
        withCredentials: true,
      },
    );

    if (response.status === 200) {
      return;
    }

    throw new Error(response.statusText);
  }
}

export const petitionsService = new PetitionsService();
