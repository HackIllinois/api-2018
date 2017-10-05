### Purpose

Provides functionality for creating, modifying, and accessing ecosystems.

---

**POST /v1/ecosystem** <br />
Creates a new ecosystem

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZERS | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `name` | a valid, unused name of length up to 100 characters | Yes |

Request
```
{
	"name": "Javascript"
}
```

Response
```
{
        "meta": null,
        "data": {
             "name": "Javascript",
             "id": 1
        }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `name` | an ecosystem with the requested name already exists |
| UnauthorizedError | user | the requesting user is not an organizer |

---

**GET /v1/ecosystem/all** <br />
Retrieves all ecosystems in the database

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZERS | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| None


Response
```
{
  "meta": null,
  "data": [
    {
      "id": 2,
      "name": "Android"
    },
    {
      "id": 5,
      "name": "Is"
    },
    {
      "id": 6,
      "name": "Better"
    },
    {
      "id": 7,
      "name": "Than"
    },
    {
      "id": 8,
      "name": "iOS"
    }
  ]
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | user | the requesting user is not an organizer |

---

**DELETE /v1/ecosystem** <br />
Deletes an existing ecosystem

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZERS | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `name` | a valid, unused name of length up to 100 characters | Yes |

Request
```
{
	"name": "Javascript"
}
```

Response
```
{
  "meta": null,
  "data": {}
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `name` | an ecosystem with the requested name already exists |
| UnauthorizedError | user | the requesting user is not an organizer |
