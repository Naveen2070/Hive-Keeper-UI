import { CinemaResponse } from '../../features/cinemas/services/cinema.service';

export const MOCK_CINEMAS: CinemaResponse[] = [
  {
    id: '018e3b5a-7b1a-7b1a-8b1a-7b1a7b1a7b1a',
    name: 'Grand Stellar IMAX',
    location: 'Downtown, Metropolis',
    contactEmail: 'contact@stellar.com',
    approvalStatus: 'Pending',
  },
  {
    id: '018e3b5a-7b1b-7b1b-8b1b-7b1b7b1b7b1b',
    name: 'Horizon Cineplex',
    location: 'Westside Mall, Gotham',
    contactEmail: 'manager@horizon.com',
    approvalStatus: 'Approved',
  },
  {
    id: '018e3b5a-7b1c-7b1c-8b1c-7b1c7b1c7b1c',
    name: 'Vintage Film House',
    location: 'Old Town, Central City',
    contactEmail: 'vintage@films.com',
    approvalStatus: 'Pending',
  },
  {
    id: '018e3b5a-7b1d-7b1d-8b1d-7b1d7b1d7b1d',
    name: 'Neon Nights Cinema',
    location: 'Cyber District, Night City',
    contactEmail: 'admin@neonnights.com',
    approvalStatus: 'Rejected',
  },
];
