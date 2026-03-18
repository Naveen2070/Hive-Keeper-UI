import { PaginatedResponse, UserDto } from '../../features/users/services/user.service';

export const MOCK_USERS: UserDto[] = [
  {
    id: '1',
    email: 'alex.super@hive.com',
    fullName: 'Alex Super',
    active: true,
    roles: [
      { roleId: 1, roleName: 'SUPER_ADMIN', domain: 'identity' },
      { roleId: 2, roleName: 'ADMIN', domain: 'events' },
      { roleId: 3, roleName: 'ADMIN', domain: 'movies' },
    ],
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-03-10T14:20:00Z',
  },
  {
    id: '2',
    email: 'sarah.event@org.com',
    fullName: 'Sarah Jenkins',
    active: true,
    roles: [
      { roleId: 4, roleName: 'ORGANIZER', domain: 'events' },
      { roleId: 5, roleName: 'USER', domain: 'movies' },
    ],
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z',
  },
  {
    id: '3',
    email: 'mike.movie@cinema.net',
    fullName: 'Mike Ross',
    active: true,
    roles: [{ roleId: 6, roleName: 'ORGANIZER', domain: 'movies' }],
    createdAt: '2025-02-15T11:45:00Z',
    updatedAt: '2025-03-01T16:10:00Z',
  },
  {
    id: '4',
    email: 'banned.user@spam.com',
    fullName: 'Bad Actor',
    active: false,
    roles: [{ roleId: 7, roleName: 'USER', domain: 'identity' }],
    createdAt: '2025-01-10T08:20:00Z',
    updatedAt: '2025-03-15T12:00:00Z',
  },
  {
    id: '5',
    email: 'john.doe@gmail.com',
    fullName: 'John Doe',
    active: true,
    roles: [],
    createdAt: '2025-03-01T14:00:00Z',
    updatedAt: '2025-03-01T14:00:00Z',
  },
];

export const MOCK_USERS_PAGINATED: PaginatedResponse<UserDto> = {
  content: MOCK_USERS,
  pageNumber: 0,
  pageSize: 50,
  totalElements: MOCK_USERS.length,
  totalPages: 1,
  isLast: true,
};
