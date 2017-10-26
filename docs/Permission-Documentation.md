### Purpose

Provides functionality for a client to check permissions of a user.

---

**GET /v1/permission/organizer** <br />
Checks if user has organizer permissions.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />
None

Request Parameters <br />
None

Response
```
{
  "meta": null,
  "data": {
    "allowed": true
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |