### Purpose

Provides functionality for publishing and retrieving announcements.


**POST /v1/announcement** <br />
Creates a new announcement 

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ADMIN | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `title` | the title of the announcement (50 chars max) | Yes |
| `description` | the description of the announcement (1000 chars max) | Yes |

Request
```
{
  "title": "Example Announcement",
  "description": "This is an example announcement"
}
```

Response
```
{
  "id": 1,
  "title": "Example Announcement",
  "description": "This is an example announcement",
  "created": "2017-02-13T03:53:49.000Z"
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | N/A | the given authorization token was invalid |
| InvalidParameterError | `title` | the given title was invalid |
| InvalidParameterError | `description` | the given description was invalid |

---

**GET /v1/announcement/all?before=x&after=x&limit=x** <br />
Retrieve all announcements before and/or after a specific date, up to a certain limit.

Headers <br />
None

URL Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `before` | ISO string representing a UTC date | No |
| `after` | ISO string representing a UTC date | No |
| `limit` | an integer | No |

Request Parameters <br />
None

Response
```
{
  "meta": null,
  "data": [
    {
      "id": 2,
      "title": "The Second Announcement",
      "description": "This announcement is the second.",
      "created": "2017-02-13T03:55:16.000Z"
    },
    {
      "id": 1,
      "title": "The First Announcement",
      "description": "This announcement is the first.",
      "created": "2017-02-13T03:53:49.000Z"
    }
  ]
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | N/A | the given authorization token was invalid |

---

**PUT /v1/announcement/:id** <br />
Updates an existing announcement. This endpoint is identical to POST `/v1/announcement` except for the `:id` parameter, which must be the ID of an existing announcement. 

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | N/A | the given authorization token was invalid |
| InvalidParameterError | `id` | the given id was not found |

---

**DELETE /v1/announcement/:id** <br />
Deletes an existing announcement. 

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ADMIN | Yes |

Errors <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | N/A | the given authorization token was invalid |
| InvalidParameterError | `id` | the given id was not found |
