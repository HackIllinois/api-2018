### Purpose

Provides functionality for obtaining an authentication token.

---

**POST /v1/auth** <br />
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

**POST /v1/auth/reset**

Resets the user's password to the given one. This will return a new token for the user that will be valid for 7-days.

Headers

None

URL Parameters

None

Request Parameters

| Parameter  | Description                                                                                           | Required |
|------------|-------------------------------------------------------------------------------------------------------|----------|
| `token`    | The token that was sent to the user via email.                                                        | Yes      |
| `password` | The new password the user wants to change their password to. Must be a length of 8 characters or more | Yes      |


Request

```
{
    "token": "0.imoolhq4hscn59kkq4cdq6srergcogb",
    "password": "new_password123"
}
```

Response

```
{
    "meta": null,
    "data":
    {
        "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6eyJpc0Z1bGZpbGxlZCI6ZmFsc2UsImlzUmVqZWN0ZWQiOmZhbHNlfSwicm9sZSI6eyJpc0Z1bGZpbGxlZCI6ZmFsc2UsImlzUmVqZWN0ZWQiOmZhbHNlfSwiaWF0IjoxNDY5NzM3NjE5LCJleHAiOjE0NzAzNDI0MTksInN1YiI6IltvYmplY3QgUHJvbWlzZV0ifQ.Ftnw9niIg_g-ICvANEi5xaY6zr_yWs41LkrHNzGW330"
    }
}
```

Errors:

| Error                 | Source     | Cause                                                                                                                                                             |
|-----------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TokenExpirationError  | `token`    | The given token has already expired. Please issue a new token. Any subsequent calls to reset the password using the same token will return NotFoundError instead. |
| NotFoundError         | `token`    | The given token cannot be found. The user may have already reset their password, issued a new token, or the token as been deleted because it has already expired. |
| InvalidParameterError | `password` | The given password cannot be used. The password is less than 8 characters.                                                                                        |

---

**GET /v1/auth/**

Requests a code for a Github user

Headers

None

URL Parameters

None

Request Parameters

None

Response

Redirects to the Github Authorization page which will redirect to the appropriate callback url, based on whether the client was a native or web application with the resulting code attached as a query parameter

---

**GET /v1/auth/github**

Exchanges a Github code for a valid OAuth2.0 access token

Headers

None

URL Parameters

| Parameter  | Description                                                                                           | Required |
|------------|-------------------------------------------------------------------------------------------------------|----------|
| `code`     | A valid Github access code                                                                            | Yes      |

Request Parameters

None

Response

```
{
    "meta": null,
    "data":
    {
        "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6eyJpc0Z1bGZpbGxlZCI6ZmFsc2UsImlzUmVqZWN0ZWQiOmZhbHNlfSwicm9sZSI6eyJpc0Z1bGZpbGxlZCI6ZmFsc2UsImlzUmVqZWN0ZWQiOmZhbHNlfSwiaWF0IjoxNDY5NzM3NjE5LCJleHAiOjE0NzAzNDI0MTksInN1YiI6IltvYmplY3QgUHJvbWlzZV0ifQ.Ftnw9niIg_g-ICvANEi5xaY6zr_yWs41LkrHNzGW330"
    }
}
```

---
