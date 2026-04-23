# User Module (Better Auth + Neon Postgres + OTP)

This module is built around Better Auth and email OTP login.

## Goals

- Use Better Auth as the source of truth for authentication users.
- Store authentication data in Neon Postgres through the Better Auth Drizzle adapter.
- Support OTP login without password.
- Keep app-specific profile fields in a dedicated table.

## Storage Model

### 1. Auth data (Better Auth managed)

Better Auth persists auth tables in Neon Postgres (for example user/session/account/verification).

### 2. App profile data (project managed)

This project stores optional profile fields in `user_profiles`:

- `user_id` (primary key, same as Better Auth user id)
- `phone`
- `created_at`
- `updated_at`

File: `src/modules/user/user.model.ts`

## OTP Flow

### Send OTP

- Endpoint: `POST /api/users/otp/send`
- Body:

```json
{
  "email": "user@example.com",
  "type": "sign-in"
}
```

Internally calls Better Auth `sendVerificationOTP`.

### Verify OTP and Sign In

- Endpoint: `POST /api/users/otp/verify`
- Body:

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "name": "Optional Name"
}
```

Internally calls Better Auth `signInEmailOTP`.

If user does not exist, Better Auth can auto create it for OTP sign-in flow.

## Protected User Endpoints

### Current User

- Endpoint: `GET /api/users/me`
- Auth: required (session cookie)
- Returns Better Auth user plus profile row.

### Update Current User Profile

- Endpoint: `PATCH /api/users/me`
- Auth: required (session cookie)
- Body:

```json
{
  "phone": "+1234567890"
}
```

Performs upsert into `user_profiles`.

## Important Config

File: `src/config/auth.ts`

- Uses Better Auth Drizzle adapter (`provider: "pg"`)
- Enables `emailOTP` plugin
- Disables `emailAndPassword`

Current OTP sender logs OTP in server logs for development. Replace with your real email/SMS sender for production.

## Environment Variables

Add these in `.env`:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-long-random-secret
BETTER_AUTH_URL=http://localhost:4000
```

`AUTH_TOKEN` is still supported as a fallback secret in current code.

## Neon Auth Note

You mentioned "Neon Auth". In this backend, Better Auth handles authentication logic and stores data in Neon Postgres. If you want Neon managed auth product features directly, that is a separate integration path and can be layered later.
