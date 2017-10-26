### Purpose

Provides functionality for creating, modifying, and accessing registrations for mentors.

---

**POST /v1/registration/mentor** <br />
Creates a new mentor registration.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `mentor` | a JSON object containing the Mentor Parameters below | Yes |
| `ideas` | an array of JSON objects of length at least one, each containing the Idea Parameters below | Yes |

Mentor Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `firstName` | the user's first name of length 255 or less | Yes |
| `lastName` | the user's last name of length 255 or less | Yes |
| `shirtSize` | a string of length 1 from the following options: ['S', 'M', 'L', 'XL'] | Yes |
| `github` | the user's Github handle of length 50 or less | No |
| `location` | the user's location of length 255 or less | Yes |
| `summary` | a brief description of the user's background of length 255 or less | Yes |
| `occupation` | the user's occupation of length 255 or less | Yes |

Idea Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `link` | the URL for the project | Yes |
| `contributions` | brief description of past contributions | Yes |
| `ideas` | ideas for project improvements | Yes |

Request
```
{
	"mentor": {
		"firstName": "John",
		"lastName": "Doe",
		"shirtSize": "M",
		"github": "JDoe1234",
		"location": "Champaign, Illinois",
		"summary": "I am a master's student at the University of Illinois.",
		"occupation": "Software Developer"
	},
	"ideas": [
		{
			"link": "https://github.com/PrairieLearn/PrairieLearn",
			"contributions": "Fixed bugs; added documentation.",
			"ideas": "Add features."
		}
	]
}
```

Response
```
{
  "meta": null,
  "data": {
    "id": 1,
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "shirtSize": "M",
    "github": "JDoe1234",
    "location": "Champaign, Illinois",
    "summary": "I am a master's student at the University of Illinois.",
    "occupation": "Software Developer",
    "status": null,
    "ideas": [
      {
        "link": "https://github.com/PrairieLearn/PrairieLearn",
        "contributions": "Fixed bugs; added documentation.",
        "ideas": "Add features.",
        "mentorId": 1,
        "id": 1
      }
    ]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `User` | a mentor for the requested user already exists |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |

---

**GET /v1/registration/mentor** <br />
Allows requester to retrieve information about their mentor registration. Requires requester to have a mentor registration.

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
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "shirtSize": "M",
    "github": "JDoe1234",
    "location": "Champaign, Illinois",
    "summary": "I am a master's student at the University of Illinois.",
    "occupation": "Software Developer",
    "status": null,
    "ideas": [
      {
        "id": 1,
        "mentorId": 1,
        "link": "https://github.com/PrairieLearn/PrairieLearn",
        "contributions": "Fixed some bugs; added documentation.",
        "ideas": "Add features."
      }
    ]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |
| NotFoundError | N/A | a mentor registration doesn't exist for the user |

---

**GET /v1/registration/mentor/{:id}** <br />
Retrieves information about a mentor. Requires requester to have either the `ADMIN`
or `STAFF` permission. Identical to `GET /v1/registration/mentor`.

---

**PUT /v1/registration/mentor** <br />
Updates a mentor registration.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `mentor` | a JSON object containing the Mentor Parameters below | Yes |
| `ideas` | an array of JSON objects of length at least one, each containing the Idea Parameters below | Yes |

Mentor Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `firstName` | the user's first name of length 255 or less | Yes |
| `lastName` | the user's last name of length 255 or less | Yes |
| `shirtSize` | a string of length 1 from the following options: ['S', 'M', 'L', 'XL'] | Yes |
| `github` | the user's Github handle of length 50 or less | No |
| `location` | the user's location of length 255 or less | Yes |
| `summary` | a brief description of the user's background of length 255 or less | Yes |
| `occupation` | the user's occupation of length 255 or less | Yes |

Idea Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `id` | the preexisting id of an idea to be updated | No |
| `link` | the URL for the project | Yes |
| `contributions` | brief description of past contributions | Yes |
| `ideas` | ideas for project improvements | Yes |

Request
```
{
	"mentor": {
		"firstName": "John",
		"lastName": "Doe",
		"shirtSize": "M",
		"github": "JDoe1234",
		"location": "Champaign, Illinois",
		"summary": "I am a master's student at the University of Illinois.",
		"occupation": "Software Developer"
	},
	"ideas": [
		{
			"id: 1,
			"link": "https://github.com/PrairieLearn/PrairieLearn",
			"contributions": "Fixed some bugs; added documentation.",
			"ideas": "Add features."
		}
	]
}
```

Response
```
{
  "meta": null,
  "data": {
    "id": 1,
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "shirtSize": "M",
    "github": "JDoe1234",
    "location": "Champaign, Illinois",
    "summary": "I am a master's student at the University of Illinois.",
    "occupation": "Software Developer",
    "status": null,
    "ideas": [
      {
        "id": 1,
        "mentorId": 1,
        "link": "https://github.com/PrairieLearn/PrairieLearn",
        "contributions": "Fixed some bugs; added documentation.",
        "ideas": "Add features."
      }
    ]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |
| NotFoundError | `id` | an idea with the given ID does not exist |


---

**PUT /v1/registration/mentor/{:id}** <br />
Updates a mentor registration. Requires requester to have either the `ADMIN`
or `STAFF` permission. Identical to `PUT /v1/registration/mentor`.
