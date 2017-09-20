### Purpose

Provides functionality for Events

---

**GET /v1/eventsapi** <br />
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
      "id": 1,
      "name": "Breakfast",
      "shortName": "BF",
      "tracking": 1,
      "description": "You get food",
      "created": "2017-02-24T19:53:06.000Z",
      "updated": "2017-02-24T19:53:06.000Z",
      "startTime": "2015-01-22T09:37:34.000Z",
      "endTime": "2017-02-22T09:59:34.000Z",
      "tag": "HACKATHON",
      "locations": [
        {
          "id": 1,
          "eventId": 1,
          "locationId": 1
        }
      ]
    }
  ]
}
```

---

**GET /v1/eventsapi/location** <br />
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

**POST /v1/eventsapi/** <br />
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
		"shortName": "BF",
		"description": "You get food",
		"tracking": true,
		"tag": "HACKATHON",
		"startTime": "2015-01-22 03:37:34",
		"endTime": "2017-02-22 03:59:34"
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
    "id": 2,
    "name": "Breakfast",
    "shortName": "BF",
    "tracking": 1,
    "description": "You get food",
    "created": "2017-02-24T19:53:06.000Z",
    "updated": "2017-02-24T19:53:06.000Z",
    "startTime": "2015-01-22T09:37:34.000Z",
    "endTime": "2017-02-22T09:59:34.000Z",
    "tag": "HACKATHON",
    "locations": [
      {
        "id": 4,
        "eventId": 2,
        "locationId": 1
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

**POST /v1/eventsapi/location** <br />
Creates a location to use with the events

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token from an ORGANIZER| Yes |

Request
```
{
    "name": "Siebel Center",
    "shortName": "Siebel",
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
    "shortName": "Siebel",
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