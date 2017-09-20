**POST /v1/rsvp/attendee** <br />
Creates a new rsvp.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `isAttending` | boolean | Yes |
| `type` | type of their attendance: ['CREATE', 'CONTRIBUTE']| If isAttending is true |

Request
```
{
  "isAttending": true
  "type": "CREATE"
}
```

Response
```
{
  "meta": null,
  "data": {
    "id": 1,
    "attendeeId": 1, 
    "isAttending": true,
    "type": "CREATE"
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `Attendee` | an RSVP for the requested attendee already exists |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |
---

**GET /v1/rsvp/attendee** <br />
Allows requester to retrieve their rsvp. Requires requester to have already rsvp'ed.

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
    "id": 1,
    "attendeeId": 1, 
    "isAttending": true,
    "type": "CREATE"
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |
| NotFoundError | N/A | a rsvp doesn't exist for the attendee|

---

**GET /v1/rsvp/attendee/{:id}** <br />
Retrieves information about a rsvp. Requires requester to have either the `ADMIN`
or `STAFF` permission. Identical to `GET /v1/rsvp/attendee`.

---

**PUT /v1/rsvp/attendee** <br />
Updates an attendee rsvp.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `isAttending` | boolean | Yes |
| `type` | type of their attendance: ['CREATE', 'CONTRIBUTE']| If isAttending is true |

Request
```
{
  "isAttending": false
}
```

Response
```
{
  "meta": null,
  "data": {
    "id": 1,
    "attendeeId": 1, 
    "isAttending": false
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| NotFoundError | `attendeeId` | a rsvp was not found for the attendee |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |

---