### Purpose

Provides functionality for Events

---

**GET /v1/event** <br />
Obtain current events.

Headers <br />
None

URL Parameters <br />
None

Response
```
{
    "meta": null,
    "data": [
        {
            "id": 8,
            "name": "Breakfast",
            "description": "You get food",
            "startTime": "2015-01-22T03:37:34.000Z",
            "endTime": "2017-02-22T03:59:34.000Z",
            "tag": "PRE_EVENT",
            "locations": [
                {
                    "id": 7,
                    "eventId": 8,
                    "locationId": 1
                }
            ]
        }
    ]
}
```

---

**GET /v1/event/location/all** <br />
Returns all currently stored location objects.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token from a ORGANIZER | Yes |

URL Parameter <br />
None

Response
```
{
  "meta": null,
  "data": [
    {
      "id": 1,
      "name": "siebel center",
      "shortName": "Siebel",
      "longitude": 88.2249,
      "latitude": 40.1138
    }
  ]
}
```

---

**POST /v1/event/** <br />
Create an event. Locations must already exist

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token from a ORGANIZER | Yes |

Request
```
{
  "event" : {
    "name": "Breakfast",
    "description": "You get food",
    "tag": "PRE_EVENT",
    "startTime": "2015-01-22T09:37:34.000+0600",
    "endTime": "2017-02-22T09:59:34.000+0600"
  },
  "eventLocations": [{
    "locationId": 1
  }]
}
```

Response:
```
{
    "meta": null,
    "data": {
        "event": {
            "name": "Breakfast",
            "description": "You get food",
            "tag": "PRE_EVENT",
            "startTime": "2015-01-22 03:37:34",
            "endTime": "2017-02-22 03:59:34",
            "id": 8
        },
        "eventLocations": [
            {
                "locationId": 1,
                "eventId": 8,
                "id": 7
            }
        ]
    }
}
```

Some notes:

Tag can either be `HACKATHON` or `SCHEDULE` for `ANNOUNCEMENT` view the `Announcement` documentation

Errors: <br />

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `name` | an event with that name has already been created |

---

**POST /v1/event/location** <br />
Creates a location to use with the events

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token from an ORGANIZER| Yes |

Request
```
{
    "name": "Siebel Center",
    "latitude": 40.1138,
    "longitude": 88.2249
}
```

Response:
```
{
  "meta": null,
  "data": {
    "name": "siebel center",
    "latitude": 40.1138,
    "longitude": 88.2249,
    "id": 1
  }
}
```

Errors: <br />

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `name` | a location with that name has already been created |

---
