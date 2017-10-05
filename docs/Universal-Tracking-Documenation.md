### Purpose

Implements a distributed system to allow volunteers to scan attendee qr codes and figure out whether they have already partaken in a Universally Tracked Event.


**POST /v1/tracking** <br />
Creates a new tracked event

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for Organizer| Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `name` | the name of the event (255 chars max) | Yes |
| `duration` | how long the event takes in seconds | Yes |

Request
```
{
  "name": "Monday Dinner",
  "duration": "3600"
}
```

Response
```
{
  "id": 1,
  "name": "Monday Dinner",
  "duration": "3600",
  "created": "2017-02-13T03:53:49.000Z",
  "count": 0
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| | N/A | the given authorization token was invalid |
| InvalidTrackingStateError | `name` | this event is already being tracked |
| InvalidTrackingStateError | `eventTracking` | an event is currently being tracked |

---

**GET /v1/tracking/:id <br />
Allows a volunteer to register an attendee as a participant in an event

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for a Volunteer| Yes |

URL Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `id` | The id of the user to check | Yes|

Request Parameters <br />
None

Response
```
200 OK
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| | N/A | the given authorization token was invalid |
| InvalidTrackingStateError | eventTracking | no event is currently being tracked |
| InvalidParameterError| id | this user has already partaken in the currently tracked event |


---
