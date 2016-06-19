# Auth Documentation

### Purpose

Provides functionality for obtaining an authentication token.

---

**GET /v1/auth** <br />
Authenticates a user and provides a signed claim. The claim will be valid for 7 days after it is issued.

Headers <br />
None

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `email` | a registered email address | Yes |
| `password` | a password for the given email | Yes |

Request
```
{
	"email": "email@example.com",
	"password": "password123"
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
| NotFoundError | `email` | a user with the provided email address could not be found |

---

**GET /v1/auth/refresh** <br />
Provides a new token. The claim will be valid for 7 days after it is re-issued.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />
None

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
| InvalidHeaderError | `Authorization` | the authentication token was absent or invalid |

---
