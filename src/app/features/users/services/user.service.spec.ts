import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  AddUserRoleRequest,
  CreateUserRequest,
  UpdateUserRolesRequest,
  UserDto,
  UserService,
} from './user.service';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUserResponse: UserDto = {
    id: '1',
    email: 'test@test.com',
    fullName: 'Test User',
    active: true,
    roles: [],
    createdAt: '',
    updatedAt: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const mockResponse = {
      content: [mockUserResponse],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
      isLast: true,
    };

    service.getUsers(0, 10).subscribe((response) => {
      expect(response.content).toHaveLength(1);
      expect(response.totalElements).toBe(1);
    });

    const req = httpMock.expectOne(
      (request) => request.url.includes('/api/admin/users') && request.params.get('page') === '0',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a user', () => {
    const mockRequest: CreateUserRequest = {
      fullName: 'New User',
      email: 'new@test.com',
      domainRoles: { events: 'ADMIN' },
    };

    service.createUser(mockRequest).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne((request) => request.url.endsWith('/api/admin/users'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockUserResponse);
  });

  it('should toggle user status', () => {
    const id = '1';
    const active = false;

    service.toggleStatus(id, active).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url.endsWith(`/api/admin/users/${id}/status`),
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ active });
    req.flush({});
  });

  it('should hard delete a user', () => {
    const id = '1';

    service.hardDeleteUser(id).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url.endsWith(`/api/admin/users/${id}/hard`),
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should add a role', () => {
    const id = '1';
    const request: AddUserRoleRequest = { domain: 'events', roleName: 'ADMIN' };

    service.addRole(id, request).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url.endsWith(`/api/admin/users/${id}/roles`),
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({});
  });

  it('should update roles', () => {
    const id = '1';
    const request: UpdateUserRolesRequest = { domainRoles: { movies: 'ORGANIZER' } };

    service.updateRoles(id, request).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url.endsWith(`/api/admin/users/${id}/roles`),
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush({});
  });

  it('should remove a role', () => {
    const id = '1';
    const domain = 'events';
    const roleName = 'ADMIN';

    service.removeRole(id, domain, roleName).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url.endsWith(`/api/admin/users/${id}/roles/${domain}/${roleName}`),
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
