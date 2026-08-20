# Activity01 — React Frontend (Registration / Login / Dashboard)

A Vite + React frontend for the previously built Spring Boot backend
(`edu.cit.sibi.activity01`). Lets a user register, log in, and land on a
Dashboard that reads the session created by a successful login.

## Stack

- React 18 + Vite
- React Router v6 (navigation + protected `/dashboard` route)
- Native `fetch` (see `src/api/authApi.js`)
- Plain CSS, no UI framework

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and expects the Spring Boot backend
to be running at `http://localhost:8080` (see `BASE_URL` in
`src/api/authApi.js` if your backend runs elsewhere).

Make sure the backend allows cross-origin requests from the Vite dev server.
If you see a CORS error in the browser console, add a CORS config to the
Spring Boot app, e.g.:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

## Project structure

```
src/
  api/
    authApi.js      # fetch wrapper + register/login/getUserById calls
    session.js       # sessionStorage helpers (password is stripped before saving)
  components/
    AuthShell.jsx     # shared centered-card layout
    SealStamp.jsx      # signature seal-stamp element, reused per page
    Field.jsx          # labeled input with inline validation error
    Banner.jsx          # success / error banner
  pages/
    Register.jsx
    Login.jsx
    Dashboard.jsx
  App.jsx             # routes + protected /dashboard route
  main.jsx
  styles.css
```

## Security notes

- Passwords are never written to `sessionStorage`/`localStorage`. `session.js`
  strips the `password` field before persisting the logged-in user.
- The session lives in `sessionStorage`, so it clears when the tab closes;
  logging out also clears it explicitly.
- Password `<input>` fields use `type="password"` so nothing is shown in
  plain text in the UI.

## Client-side validation

- **Register:** username required (min 3 chars), email required + format
  check, password required (min 6 chars), confirm-password must match.
- **Login:** username and password both required.

Server-side errors (e.g. duplicate username, wrong password) are caught and
shown in a banner above the form; they don't crash the app.

---

## API Data Contract

Base URL: `http://localhost:8080/api`

All requests/responses use `Content-Type: application/json`.

### 1. Register a user

| | |
|---|---|
| **Method / URL** | `POST /api/register` |
| **Purpose** | Create a new user account. |
| **Headers** | `Content-Type: application/json` |

**Request body**

| Field | Type | Required |
|---|---|---|
| `username` | string | yes |
| `email` | string | yes |
| `password` | string | yes |

```json
{
  "username": "juandelacruz",
  "email": "juan@example.com",
  "password": "somepassword"
}
```

**Success response — `201 Created`**

```json
{
  "id": 1,
  "username": "juandelacruz",
  "email": "juan@example.com",
  "password": "somepassword"
}
```

**Error response — `400 Bad Request`** (e.g. username already taken, missing
required field)

```json
"Username already exists"
```

---

### 2. Log in

| | |
|---|---|
| **Method / URL** | `POST /api/login` |
| **Purpose** | Verify credentials and return the matching user. |
| **Headers** | `Content-Type: application/json` |

**Request body**

| Field | Type | Required |
|---|---|---|
| `username` | string | yes |
| `password` | string | yes |

```json
{
  "username": "juandelacruz",
  "password": "somepassword"
}
```

**Success response — `200 OK`**

```json
{
  "id": 1,
  "username": "juandelacruz",
  "email": "juan@example.com",
  "password": "somepassword"
}
```

**Error response — `401 Unauthorized`** (wrong username/password)

```json
"Invalid username or password"
```

---

### 3. Get user by ID

| | |
|---|---|
| **Method / URL** | `GET /api/user/{id}` |
| **Purpose** | Fetch a single user's details by numeric ID. |
| **Headers** | none required |
| **Request body** | none |

**Success response — `200 OK`**

```json
{
  "id": 1,
  "username": "juandelacruz",
  "email": "juan@example.com",
  "password": "somepassword"
}
```

**Error response — `404 Not Found`**

```json
"User not found"
```

> Note: the current backend echoes `password` back in these responses. The
> React app never stores or displays that field — see **Security notes**
> above. If you want to harden the backend too, add `@JsonIgnore` to the
> `password` field on the `User` entity (or map to a response DTO that omits
> it) so it never leaves the server at all.
