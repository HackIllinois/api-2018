# User Documentation

### Purpose

Provides functionality for creating, modifying, and accessing users.

---

**POST /v1/user** <br />
Creates a new hacker.

Headers <br />
None

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `email` | a valid, unregistered email address | Yes |
| `password` | a password of length 8 or more | Yes |
| `confirmedPassword` | a duplicate of `password` for verification | Yes |

Request
```
{
	"email": "email@example.com",
	"password": "password123",
	"confirmedPassword": "password123"
}
```

Response
```
{
	"meta": null,
	"data": {
		"auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsQGV4YW1wbGUuY29tIiwicm9sZSI6IkhBQ0tFUiIsImlhdCI6MTQ2NjMxNDI1OCwiZXhwIjoxNDY2OTE5MDU4LCJzdWIiOiIxIn0.2DgozaTLMu1pz7Z6rpSSBNGp_bqE50sMukGM9EcHZ38"
	}
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `email` | a with the requested email already exists |
| InvalidParameterError | `confirmedPassword` | the `password` and `confirmedPassword` fields are not equal |

---

**GET /v1/user/{:id}** <br />
Retrieves information about a user. Requires requester to have either the `ADMIN`
or `STAFF` permission, or be the user itself.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />

| Parameter        | Description           |
| ---------------- | --------------------- |
| `id` | the ID of the user to retrieve |

Response
```
{
  "meta": null,
  "data": {
	"id": 1,
	"email": "email@example.com",
	"role": "HACKER",
	"registered": null,
	"created": "2016-06-19T00:01:00.000Z",
	"updated": "2016-06-19T00:01:00.000Z"
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | N/A | the requester does not have permission to request this user |
| NotFoundError | N/A | the requested user does not exist |

---
