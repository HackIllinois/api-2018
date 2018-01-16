### Purpose

Provides functionality for creating, modifying, and accessing users.

---

**POST /v1/user** <br />
Creates a new user without a role.

Headers <br />
None

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `email` | a valid, unregistered email address | Yes |
| `password` | a password of length 8 to 50 characters | Yes |

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
| InvalidParameterError | `email` | a user with the requested email already exists |
| InvalidParameterError | `password` | the `password` field is outside the allowed range |

---

**POST /v1/user/accredited** <br />
Creates a new user with an automatically-generated password and the specified role.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for an ADMIN or STAFF | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `email` | a valid, unregistered email address | Yes |
| `role` | any valid role | Yes |

Role Values <br />

| ROLE | Who are part of the role |
| ---------------- | --------------------- |
| `ALL` | `ADMIN, STAFF, SPONSOR, MENTOR, VOLUNTEER, ATTENDEE`|
| `SUPERUSER ` | `ADMIN` |
| `ORGANIZERS ` | `ADMIN, STAFF` |
| `HOSTS` | `ADMIN, STAFF, VOLUNTEER` |
| `NON_PROFESSIONALS` | `ADMIN, STAFF, VOLUNTEER, ATTENDEE` |
| `PROFESSIONALS` | `SPONSOR, MENTOR` |
| `ORGANIZERS ` | `ADMIN, STAFF` |

Note that you can give a new accredited user any role within the ALL role as well

Request
```
{
	"email": "staff@example.com",
	"role": "STAFF"
}
```

Response
```
{
  "meta": null,
  "data": {
	"id": 2,
	"email": "staff@example.com",
	"created": "2016-06-19T00:01:00.000Z",
	"updated": "2016-06-19T00:01:00.000Z",
        "roles": [{
          "role": "STAFF",
          "active": 1
        }]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | N/A | the requester does not have permission to create the requested type of user |
| InvalidParameterError | `email` | a with the requested email already exists |
| InvalidParameterError | `role` | the provided role is invalid (check capitalization and spelling) |

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
	"created": "2016-06-19T00:01:00.000Z",
	"updated": "2016-06-19T00:01:00.000Z",
        "roles": [{
          "role": "ATTENDEE",
          "active": 1
        }],
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | N/A | the requester does not have permission to request this user |
| NotFoundError | N/A | the requested user does not exist |

---

**POST /v1/user/reset**

Provides a token to reset the User's password, sent via email. This token will expire in 7 days.

Headers

None

URL Parameters

None

Request Parameters

| Parameters | Description                             | Required |
|------------|-----------------------------------------|----------|
| `email`    | User's email that they registered with. | Yes      |

Request

```
{
    "email": "email@example.com"
}
```

Response

```
{
    "meta":null,
    "data":{}
}
```

Errors:

| Error         | Source  | Cause                                           |
|---------------|---------|-------------------------------------------------|
| NotFoundError | `email` | A user with the given email could not be found. |

---

**PUT /v1/user/contactinfo**

Allows a user created with the GitHub OAuth authentication scheme to change their contact email if they do not want to use their primary GitHub email as their contact email.

Headers

None

URL Parameters

None

Request Parameters

| Parameters | Description                             | Required |
|------------|-----------------------------------------|----------|
| `newEmail` | The new email the user wishes to use as their contact info  | Yes      |

Request

```
{
    "email": "newemail@example.com"
}
```

Response

```
{
  "meta": null,
  "data": {
	"id": 1,
	"email": "newemail@example.com",
	"created": "2016-06-19T00:01:00.000Z",
	"updated": "2016-06-19T00:01:00.000Z",
        "roles": [{
          "role": "ATTENDEE",
          "active": 1
        }],
  }
}
```

Errors:

| Error         | Source  | Cause                                           |
|---------------|---------|-------------------------------------------------|
| UnprocessableRequestError | `user` | Users under a basic authentication scheme can not change their contact info |

---
