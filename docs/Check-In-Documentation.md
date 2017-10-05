### POST /v1/checkin/user/{:id} 
Creates a new CheckIn associated with user `id`.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZER| Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `swag` | boolean whether user has received swag | Yes |
| `location` | string of check in location (`ECEB`, `SIEBEL`, or `DCL`) | Yes |
| `credentialsRequested` | boolean whether user requests account credentials | Yes |


Response <br />
```
{
  "meta": null,
  "data": {
    "checkin": {
      "id": 10,
      "userId": 4,
      "time": "2017-02-13T08:48:19.000Z",
      "location": "ECEB",
      "swag": true,
    },
    "credentials": {
      "id": 4,
      "userId": 4,
      "account": "username1",
      "password": "password1",
      "assigned": 1
    }
  }
}
```
Errors <br />

| Error        | Source           | Cause  |
| ---------------- | --------------------- | --------- |
| UnauthorizedError | `Authorization` | An invalid ORGANIZER authorization token was provided |
| InvalidParameterError | `id` | A checkin already exists for user `id` |
| NotFoundError | `id` | User `id` cannot be found |
| UnprocessableRequestError | `credentialsRequested` | No more unassigned credentials can be found |

---

### PUT /v1/checkin/user/{:id} 
Updates a CheckIn associated with user `id`. <br />
Note: `swag` can only be switched from false to true. 

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZER| Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `swag` | boolean whether user has received swag | No |
| `location` | string of check in location (`ECEB`, `SIEBEL`, or `DCL`) | No |


Response <br />
```
{
  "meta": null,
  "data": {
    "checkin": {
      "id": 10,
      "userId": 4,
      "time": "2017-02-13T08:48:19.000Z",
      "location": "ECEB",
      "swag": true,
    },
    "credentials": null
  }
}
```
Errors <br />

| Error        | Source           | Cause  |
| ---------------- | --------------------- | --------- |
| UnauthorizedError | `Authorization` | An invalid ORGANIZER authorization token was provided |
| NotFoundError | `id` | User `id` cannot be found |
| NotFoundError | `id` | A CheckIn cannot be found for user `id` |

---

### GET /v1/checkin/user/{:id} 
Retrieves a CheckIn with user `id`.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZER| Yes |

URL Parameters <br />
None

Response <br />
```
{
  "meta": null,
  "data": {
    "checkin": {
      "id": 10,
      "userId": 4,
      "time": "2017-02-13T08:48:19.000Z",
      "location": "ECEB",
      "swag": true,
    },
    "credentials": null
  }
}
```
Errors <br />

| Error        | Source           | Cause  |
| ---------------- | --------------------- | --------- |
| UnauthorizedError | `Authorization` | An invalid ORGANIZER authorization token was provided |
| NotFoundError | `id` | User `id` cannot be found |
| NotFoundError | `id` | A CheckIn for user `id` cannot be found |

---

### GET /v1/checkin/
Retrieves a CheckIn associated with the calling user.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />
None

Response <br />
```
{
  "meta": null,
  "data": {
    "checkin": {
      "id": 10,
      "userId": 4,
      "time": "2017-02-13T08:48:19.000Z",
      "location": "ECEB",
      "swag": true,
    },
    "credentials": null
  }
}
```
Errors <br />

| Error        | Source           | Cause  |
| ---------------- | --------------------- | --------- |
| UnauthorizedError | `Authorization` | An invalid ORGANIZER authorization token was provided |
| NotFoundError | `id` | User `id` cannot be found |
| NotFoundError | `id` | A CheckIn for user `id` cannot be found |
