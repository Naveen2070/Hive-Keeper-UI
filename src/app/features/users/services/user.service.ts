import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UserRoleDto {
  roleId: number;
  roleName: string;
  domain: string;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  active: boolean;
  roles: UserRoleDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password?: string;
  domainRoles: Record<string, string>;
}

export interface AddUserRoleRequest {
  domain: string;
  roleName: string;
}

export interface UpdateUserRolesRequest {
  domainRoles: Record<string, string>;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/users`;

  getUsers(page: number = 0, size: number = 50): Observable<PaginatedResponse<UserDto>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PaginatedResponse<UserDto>>(this.baseUrl, { params });
  }

  createUser(request: CreateUserRequest): Observable<UserDto> {
    return this.http.post<UserDto>(this.baseUrl, request);
  }

  toggleStatus(id: string, active: boolean): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.baseUrl}/${id}/status`, { active });
  }

  hardDeleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/hard`);
  }

  addRole(id: string, request: AddUserRoleRequest): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}/${id}/roles`, request);
  }

  updateRoles(id: string, request: UpdateUserRolesRequest): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.baseUrl}/${id}/roles`, request);
  }

  removeRole(id: string, domain: string, roleName: string): Observable<UserDto> {
    return this.http.delete<UserDto>(`${this.baseUrl}/${id}/roles/${domain}/${roleName}`);
  }
}
