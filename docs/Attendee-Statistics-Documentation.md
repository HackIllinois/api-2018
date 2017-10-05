### Purpose

Provides functionality for statistics. Registration and RSVP stats are cached for 10 minutes before being requeried, live event stats are cached for two minutes.

---

**GET /v1/stats/all** <br />
Fetch all stats

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

```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |

---

**GET /v1/stats/registration** <br />
Fetch all attendee stats from registration

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

```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |

---

**GET /v1/stats/rsvp** <br />
Fetch all stats from attendees who have been accepted and RSVP'ed yes

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

```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |

---

**GET /v1/stats/live** <br />
Fetch all ecosystems stats for checkedin attendedees, and tracked event stats

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

```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |

---