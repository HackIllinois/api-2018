### Purpose

---

**POST /v1/recruiter/interest** <br />
Creates a new recruiter interest

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for SPONSOR | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `attendeeUserId` | The attendee's user id | Yes |
| `comments` | a string of length up to 255 characters | No |
| `favorite` | a boolean | No |

Request
```
{
	"attendeeUserId": 2,
	"comments": "Meh",
    "favorite": 1
}
```

Response
```
{
        "meta": null,
        "data": {
         "appId": "1",
         "recruiterId": 3,
         "attendeeId": 2,
         "comments": "Meh",
         "favorite": 1,
        }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | user | the requesting user is not an organizer |

---

**GET /v1/recruiter/interest/all** <br />
Retrieve a project by ID

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ALL | Yes |

URL Parameters <br />
None

Response
```
{
    "meta": null,
    "data": [
        {
            "appId": 2,
            "recruiterId": 3,
            "attendeeId": 2,
            "comments": "nice",
            "favorite": 0,
            "created": "2018-02-22T04:51:55.000Z",
            "updated": "2018-02-22T22:21:47.000Z"
        }
    ]
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | user | the requesting user is not an organizer |

---

**PUT /v1/recruiter/interest/{:id}** <br />
Updates an existing project with new attributes

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZERS | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `id` | the id of the project to update | Yes |
| `comments` | a string of length up to 255 characters | No |
| `favorite` | a boolean | No |

Request
```
{
	"comments": "Meh",
    "favorite": 1
}
```

Response
```
{
    "meta": null,
    "data": {
        "appId": 2,
        "recruiterId": 3,
        "attendeeId": 2,
        "comments": "nice",
        "favorite": 0,
        "created": "2018-02-22T04:51:55.000Z",
        "updated": "2018-02-22T22:39:08.341Z"
    }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | user | the requesting user is not an organizer |
