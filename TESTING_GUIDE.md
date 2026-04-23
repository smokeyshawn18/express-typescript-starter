# User Module Testing Guide (Requestly)

This guide walks you through testing all user endpoints using Requestly (or similar API tools like Postman).

---

## Prerequisites

- Server running: `pnpm dev` (on `http://localhost:4000`)
- Requestly installed and open
- Database connected

---

## 1. Request OTP (Send)

**Endpoint:** `POST http://localhost:4000/api/users/otp/send`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "testuser@example.com",
  "type": "sign-in"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "OTP sent"
}
```

**Server Log Output:**

```
OTP generated for testuser@example.com (sign-in): 123456
```

✅ **Copy the OTP from server logs** — you'll need it for the next step.

---

## 2. Verify OTP & Sign In

**Endpoint:** `POST http://localhost:4000/api/users/otp/verify`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "testuser@example.com",
  "otp": "123456",
  "name": "Test User"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
      "id": "user-uuid-here",
      "email": "testuser@example.com",
      "emailVerified": false,
      "name": "Test User",
      "image": null
    }
  }
}
```

**Response Headers:**

```
Set-Cookie: better-auth.session_token=...; Path=/; HttpOnly; Secure; SameSite=Lax
```

✅ **Copy the session token or ensure cookie is stored** — needed for protected endpoints.

---

## 3. Get Current User (Me)

**Endpoint:** `GET http://localhost:4000/api/users/me`

**Headers:**

```
Cookie: better-auth.session_token=<your-token-from-step-2>
```

**Body:** (none)

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-here",
      "email": "testuser@example.com",
      "emailVerified": false,
      "name": "Test User",
      "image": null
    },
    "profile": null
  }
}
```

Note: `profile` is `null` because we haven't created one yet.

---

## 4. Update User Profile (Me)

**Endpoint:** `PATCH http://localhost:4000/api/users/me`

**Headers:**

```
Cookie: better-auth.session_token=<your-token>
Content-Type: application/json
```

**Body:**

```json
{
  "phone": "+1-555-123-4567"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "userId": "user-uuid-here",
    "phone": "+1-555-123-4567",
    "createdAt": "2026-04-22T10:30:00.000Z",
    "updatedAt": "2026-04-22T10:30:00.000Z"
  }
}
```

---

## 5. Get All Users (with Pagination)

**Endpoint:** `GET http://localhost:4000/api/users?page=1&limit=10`

**Headers:**

```
Content-Type: application/json
```

**Query Parameters:**
| Param | Type | Default | Max |
|-------|------|---------|-----|
| page | number | 1 | - |
| limit | number | 20 | 100 |

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "userId": "user-uuid-1",
      "phone": "+1-555-123-4567",
      "createdAt": "2026-04-22T10:30:00.000Z",
      "updatedAt": "2026-04-22T10:30:00.000Z"
    },
    {
      "userId": "user-uuid-2",
      "phone": null,
      "createdAt": "2026-04-22T11:00:00.000Z",
      "updatedAt": "2026-04-22T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

**Test Different Pages:**

- `?page=2&limit=10` → Get next 10 users
- `?page=3&limit=20` → Get 20 users on page 3
- `?limit=50` → Get 50 users per page (default page=1)

---

## Complete Test Flow

### Flow 1: New User Sign-Up & Profile

1. **Send OTP** → User enters email
2. **Verify OTP** → User gets token + session
3. **Get Me** → Verify user is authenticated
4. **Update Profile** → Add phone number
5. **Get Me Again** → Confirm profile was saved

### Flow 2: View All Users

1. **Get All Users (page=1)** → See first batch
2. **Get All Users (page=2)** → See next batch
3. **Get All Users (limit=50)** → Get larger batch

---

## Error Scenarios to Test

### Invalid Email

```json
{
  "email": "not-an-email",
  "type": "sign-in"
}
```

**Expected:** 400 Bad Request (Zod validation)

### Wrong OTP

```json
{
  "email": "testuser@example.com",
  "otp": "999999",
  "name": "Test"
}
```

**Expected:** 401 Unauthorized or 400 (Better Auth rejects)

### Missing Session (Me Endpoint)

- Call `GET /api/users/me` **without** cookie
- **Expected:** 401 Unauthorized

### Invalid Pagination

- `?page=0` → **Expected:** 400 (must be positive)
- `?limit=999` → **Expected:** 400 (max is 100)

---

## Requestly Setup Tips

### Save Requests as Collections

1. Click **"+ New Collection"**
2. Name it: `User Module Tests`
3. Add each request:
   - Request OTP
   - Verify OTP
   - Get Me
   - Update Profile
   - Get All Users

### Reuse Variables

In Requestly, set **Environment Variables**:

```
BASE_URL = http://localhost:4000
EMAIL = testuser@example.com
OTP = 123456 (paste from server logs)
SESSION_COOKIE = better-auth.session_token=...
```

Then use in requests:

```
{{BASE_URL}}/api/users/otp/send
{{EMAIL}}
{{OTP}}
```

### Cookie Management

In Requestly **Headers**, use:

```
Cookie: {{SESSION_COOKIE}}
```

Or use **Requestly's built-in cookie jar** to auto-manage `Set-Cookie` from responses.

---

## Server Log Checklist

After each request, check server logs for:

| Action         | Log Message                                   |
| -------------- | --------------------------------------------- |
| Send OTP       | `OTP generated for X@X.com (sign-in): 123456` |
| Get Me         | No special log (just returns data)            |
| Update Profile | No special log (just upserts)                 |
| Get All Users  | No special log (just queries)                 |

---

## Performance Tips

- **First test:** Create 5-10 users with different profiles
- **Then test:** Get all users with pagination to see realistic data
- **Pagination test:** Try `?page=10&limit=5` to verify offset math

---

## Troubleshooting

| Issue                       | Solution                                            |
| --------------------------- | --------------------------------------------------- |
| "Unauthorized" on `/me`     | Paste session cookie from verify OTP response       |
| OTP not received            | Check server console (logs OTP, not sent via email) |
| Phone validation fails      | Use format: `+1-555-123-4567` or `+15551234567`     |
| Get All Users returns empty | Create users first via OTP flow                     |
| Pagination shows `pages: 0` | At least 1 user must exist (total > 0)              |
