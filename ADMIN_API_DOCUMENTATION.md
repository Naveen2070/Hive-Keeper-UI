# Admin and Super Admin API Documentation

This document provides a comprehensive overview of the administrative and super-administrative endpoints available across all Hive Project services, along with their associated DTOs, entities, and data structures.

---

## 1. Identity Service (User & Access Management)

### Base URL: `/api/admin`
**Role Required:** `SUPER_ADMIN`

#### Endpoints

| Method | Path | Summary | Response Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/users` | List/Search users | `PaginatedResponse<UserDto>` | Paginated list of users with optional search. |
| `GET` | `/users/{id}` | Get user details | `UserDto` | Retrieve full details of a specific user. |
| `POST` | `/users` | Create internal user | `UserDto` | Manually create users with roles like `ADMIN` or `ORGANIZER`. |
| `PATCH` | `/users/{id}/status` | Ban/Unban user | `UserDto` | Toggle active status of a user. |
| `DELETE` | `/users/{id}/hard` | Hard delete user | `void` (204) | Permanently delete a user from the database. |

---

### Data Structures (Identity Service)

#### `UserDto`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String` | Unique identifier (Long as String) |
| `email` | `String` | User's email address |
| `fullName` | `String` | User's full name |
| `active` | `Boolean` | Whether the user is active (not banned) |
| `roles` | `Set<UserRoleDto>` | List of roles assigned to the user |
| `createdAt` | `Instant` | Timestamp of creation |
| `updatedAt` | `Instant` | Timestamp of last update |

#### `UserRoleDto`
| Field | Type | Description |
| :--- | :--- | :--- |
| `roleId` | `Int` | Internal ID of the role |
| `roleName` | `String` | Name of the role (e.g., `USER`, `ADMIN`, `SUPER_ADMIN`, `ORGANIZER`) |
| `domain` | `String` | Service domain (e.g., `events`, `movies`, `identity`) |

#### `CreateUserRequest`
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `fullName` | `String` | Not Blank | Full name of the new user |
| `email` | `String` | Not Blank, Email | Valid email address |
| `password` | `String` | Not Blank, min 8 chars | User's password |
| `domainRoles` | `Map<String, String>` | Default: `{"events": "USER"}` | Map of domain to role (e.g., `{"events": "ADMIN"}`) |

---

## 2. Core API (Event Management)

### Base URL: `/api/events`
**Role Required:** `ORGANIZER`, `ADMIN`, or `SUPER_ADMIN` for management tasks.

| Method | Path | Summary | Response Type | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Create Event | `EventDTO` | `ORGANIZER`, `ADMIN`, `SUPER_ADMIN` |
| `PUT` | `/{id}` | Update Event | `EventDTO` | `ORGANIZER` (own), `ADMIN`, `SUPER_ADMIN` |
| `PATCH` | `/status/{id}` | Change Status | `EventDTO` | `ORGANIZER` (own), `ADMIN`, `SUPER_ADMIN` |
| `DELETE` | `/{id}` | Delete Event | `void` (204) | `ORGANIZER` (own), `ADMIN`, `SUPER_ADMIN` |

### Base URL: `/api/tiers` (Ticket Tiers)
**Role Required:** `ORGANIZER`, `ADMIN`, or `SUPER_ADMIN`.

| Method | Path | Summary | Response Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/events/{eventId}` | Add Ticket Tier | `TicketTierDTO` | Create a new pricing tier for an event. |
| `PUT` | `/{tierId}` | Update Ticket Tier | `TicketTierDTO` | Modify an existing tier. |
| `DELETE` | `/{tierId}` | Delete Ticket Tier | `void` (204) | Remove a tier (only if no tickets sold). |

### Base URL: `/api/bookings`
**Role Required:** `ADMIN` or `SUPER_ADMIN` for global management.

| Method | Path | Summary | Response Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| `PATCH` | `/status/{id}` | Update Booking Status | `BookingDTO` | Admin can update any booking status (e.g., `PAID`, `CANCELLED`). |
| `POST` | `/check-in` | Check in Attendee | `CheckInResponse` | `ORGANIZER` only (validates ticket/booking). |

---

### Data Structures (Core API)

#### `EventDTO`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `Long` | Event ID |
| `title` | `String` | Event Title |
| `description` | `String` | Detailed event description |
| `startDate` | `LocalDateTime` | Event start time |
| `endDate` | `LocalDateTime` | Event end time |
| `location` | `String` | Venue details |
| `status` | `EventStatus` (`DRAFT`, `PUBLISHED`, `CANCELLED`, `COMPLETED`) | Current state of the event |
| `ticketTiers` | `List<TicketTierDTO>` | Available ticket categories |
| `priceRange` | `String` | String representation of min-max price |
| `organizerId` | `String` | ID of the creator |
| `organizerName` | `String` | Name of the creator |
| `createdAt` | `Instant` | Creation timestamp |

#### `TicketTierDTO`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `Long` | Tier identifier |
| `name` | `String` | Tier name (e.g., "General Admission") |
| `price` | `BigDecimal` | Ticket price |
| `totalAllocation` | `Int` | Total tickets available |
| `availableAllocation` | `Int` | Remaining tickets |
| `validFrom` | `LocalDateTime` | Start of sale period |
| `validUntil` | `LocalDateTime` | End of sale period |

#### `BookingDTO`
| Field | Type | Description |
| :--- | :--- | :--- |
| `bookingId` | `Long` | Unique booking identifier |
| `bookingReference` | `String` | Human-readable reference (for check-in) |
| `eventId` | `Long` | Reference to event |
| `eventTitle` | `String` | Title of the event |
| `status` | `BookingStatus` | `PENDING`, `CONFIRMED`, `CANCELLED`, `REFUNDED` |
| `ticketsCount` | `Int` | Number of tickets booked |
| `totalPrice` | `BigDecimal` | Total price paid |
| `bookedAt` | `Instant` | Time of booking |

#### `CheckInResponse`
| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `Boolean` | Whether check-in was successful |
| `status` | `CheckInStatus` | `SUCCESS`, `ALREADY_CHECKED_IN`, `INVALID_TICKET`, `EVENT_NOT_STARTED` |
| `message` | `String` | Result details |
| `attendeeName` | `String?` | Name of the person (if found) |
| `ticketTierName` | `String?` | Tier of the ticket checked in |
| `timestamp` | `LocalDateTime` | Time of operation |

---

## 3. Movie Service (Cinema & Catalog Management)

### Base URL: `/api/movies`
**Role Required:** `ORGANIZER` or `SUPER_ADMIN`.

| Method | Path | Summary | Response Type | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Register Movie | `MovieResponse` | `ORGANIZER`, `SUPER_ADMIN` |
| `PUT` | `/{id}` | Update Movie | `void` (204) | `ORGANIZER`, `SUPER_ADMIN` |
| `DELETE` | `/{id}` | Soft Delete Movie | `void` (204) | `ORGANIZER`, `SUPER_ADMIN` |

### Base URL: `/api/cinemas`
**Role Required:** `ORGANIZER` or `SUPER_ADMIN`.

| Method | Path | Summary | Response Type | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Create Cinema | `CinemaResponse` | `ORGANIZER`, `SUPER_ADMIN` |
| `PUT` | `/{id}` | Update Cinema | `void` (204) | `ORGANIZER` (own), `SUPER_ADMIN` |
| `PATCH` | `/{id}/status` | **Update Approval Status** | `void` (204) | **`SUPER_ADMIN` ONLY** |
| `DELETE` | `/{id}` | Soft Delete Cinema | `void` (204) | `ORGANIZER` (own), `SUPER_ADMIN` |

### Base URL: `/api/auditoriums`
**Role Required:** `ORGANIZER` or `SUPER_ADMIN`.

| Method | Path | Summary | Response Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Create Auditorium | `AuditoriumResponse` | Define layout, rows, columns, and tiers. |
| `PUT` | `/{id}` | Update Auditorium | `void` (204) | Full replacement of layout and metadata. |
| `DELETE` | `/{id}` | Soft Delete | `void` (204) | Remove from active listings. |

---

### Data Structures (Movie Service)

#### `CinemaResponse`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `Guid` (UUID v7) | Unique identifier |
| `name` | `string` | Cinema name |
| `location` | `string` | Physical address |
| `approvalStatus` | `string` | `Pending`, `Approved`, `Rejected` |

#### `MovieResponse`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `Guid` | Unique identifier |
| `title` | `string` | Movie title |
| `durationMinutes` | `int` | Runtime |
| `releaseDate` | `DateTime` | Premiere date |

#### `AuditoriumResponse`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `Guid` | Auditorium unique identifier |
| `cinemaId` | `Guid` | Parent cinema ID |
| `name` | `string` | Room name/number |
| `maxRows` | `int` | Grid height |
| `maxColumns` | `int` | Grid width |
| `layout` | `AuditoriumLayoutDto` | Seating configuration |

#### `AuditoriumLayoutDto`
| Field | Type | Description |
| :--- | :--- | :--- |
| `disabledSeats` | `List<SeatCoordinateDto>` | Aisles/Pillars (non-selectable) |
| `wheelchairSpots` | `List<SeatCoordinateDto>` | Designated accessibility spots |
| `tiers` | `List<SeatTierDto>` | Surcharges for specific seat groups |

---

## 4. Dashboard & Analytics

### Endpoints

| Service | Path | Role | Response Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Core API** | `/api/dashboard/stats` | `ORGANIZER` | `DashboardStatsDTO` | Revenue, Sales, Event Trends |
| **Movie Service** | `/api/movies/dashboard` | `ORGANIZER` / `SUPER_ADMIN` | `DashboardStatsResponse` | Movie sales, Revenue trends |

#### `DashboardStatsDTO` (Core API)
| Field | Type | Description |
| :--- | :--- | :--- |
| `totalRevenue` | `BigDecimal` | Aggregate earnings |
| `totalTicketsSold` | `Long` | Count of tickets issued |
| `activeEventsCount` | `Long` | Currently running events |
| `revenueTrend` | `List<RevenueTrendItemDTO>` | Data points for time-series charts |
| `recentSales` | `List<RecentSaleDTO>` | Transaction log for display |

#### `DashboardStatsResponse` (Movie Service)
| Field | Type | Description |
| :--- | :--- | :--- |
| `totalRevenue` | `decimal` | Aggregate earnings |
| `totalMoviesSold` | `int` | Total tickets for movies |
| `activeShowtimesCount` | `int` | Currently scheduled showtimes |
| `revenueTrend` | `List<RevenueTrendItem>` | Data points for time-series charts |
| `recentSales` | `List<RecentSale>` | Transaction log for display |

---

## 5. Common Response Structures

### `PaginatedResponse<T>` / `PagedResponse<T>`
Used for all list endpoints.

| Field | Type | Description |
| :--- | :--- | :--- |
| `content` | `List<T>` | Data items |
| `pageNumber` | `Int` | Current page |
| `totalElements` | `Long` | Total records available |
| `totalPages` | `Int` | Total pages available |

### `ApiErrorResponse`
Standard error format for 4xx/5xx responses.

| Field | Type | Description |
| :--- | :--- | :--- |
| `status` | `Int` | HTTP status code |
| `message` | `String` | Human-readable error message |
| `timestamp` | `DateTime` | ISO timestamp |
