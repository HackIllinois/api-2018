**POST /v1/registration/attendee** <br />
Creates a new attendee registration.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `attendee` | a JSON object containing the Attendee Parameters below | Yes |
| `ecosystemInterests` | an array of JSON objects of length at least one and at most two, each containing the EcosystemInterest parameters below | Yes |
| `extras` | an array of JSON objects of length at most three, each containing the ExtraInfo parameters below | No |
| `collaborators` | an array of JSON objects of length at most eight, each containing the RequestedCollaborator parameters below | No |

Attendee Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `firstName` | the user's first name of length 255 or less | Yes |
| `lastName` | the user's last name of length 255 or less | Yes |
| `shirtSize` | a string of length 1 from the following options: ['S', 'M', 'L', 'XL'] | Yes |
| `diet` | a string from the following options: ['NONE', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE'] | Yes |
| `age` | a number between 13 and 115 | Yes |
| `graduationYear` | a number between 2017 and 2024 | Yes |
| `transportation` | a string from the following options: ['NOT_NEEDED', 'BUS_REQUESTED', 'IN_STATE', 'OUT_OF_STATE', 'INTERNATIONAL'] | Yes |
| `school` | the user's school of length 255 or less | Yes |
| `major` | the user's major of length 255 or less | Yes |
| `gender` | a string from the following options: ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'] | Yes |
| `professionalInterest` | a string from the following options: ['NONE', 'INTERNSHIP', 'FULLTIME', 'BOTH'] | Yes |
| `github` | the user's GitHub handle of length 50 or less | Yes |
| `linkedin` | the user's LinkedIn handle of length 50 or less | Yes |
| `interests` | the user's interests of length 255 or less | Yes |
| `isNovice` | a boolean indicating whether or not the user is a novice | Yes |
| `isPrivate` | a boolean indicating whether or not the user's information is private | Yes |
| `hasLightningInterest` | a boolean indicating whether the user is interested in giving a short talk | No |
| `phoneNumber` | the user's phone number, formatted as a string of length 15 or less | No |



EcosystemInterest Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `ecosystemId` | the id for the ecosystem the user is interested in | Yes |



Project Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `name` | the name of the project of length 100 or less | Yes |
| `description` | the description of the project of length 255 or less | Yes |
| `repo` | the repo for the project of length 150 or less | Yes |
| `isSuggestion` | a boolean indicating whether or not the user intends to suggest the project or create the project | Yes |



ExtraInfo Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `info` | the extra information provided by the user of length 255 or less | Yes |



RequestedCollaborator Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `collaborator` | the requested collaborator's email of length 255 or less | Yes |

Request
```
{
	"attendee": {
                "firstName": "John",
                "lastName": "Doe",
                "shirtSize": "M",
                "diet": "NONE",
                "age": 19,
                "graduationYear": 2019,
                "transportation": "NOT_NEEDED",
                "school": "University of Illinois at Urbana-Champaign",
                "major": "Computer Science",
                "gender": "MALE",
                "professionalInterest": "BOTH",
                "github": "JDoe1234",
                "linkedin": "JDoe5678",
                "interests": "CS",
                "isNovice": true,
                "isPrivate": false,
                "hasLightningInterest": false,
                "phoneNumber": "12345678910"
	},
	"ecosystemInterests": [
		{
                    "ecosystemId": 1
		}
	],
	"projects": [
		{
            		"name": "HackIllinois API",
            		"description": "API written in NodeJS + Express. Supports HackIllinois 2017",
            		"repo": "http://www.github.com/hackillinois/api-2017",
            		"isSuggestion": true
		}
	],
	"collaborators": [
		{
            		"collaborator": "collaborator@hackillinois.org"
		}
	],
	"extras": [
		{
            		"info": "One of the projects I'm really proud of is my HelloWorld Machine. It says 'Hello World' in ten different languages!"
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
    "diet": "NONE",
    "age": 19,
    "graduationYear": 2019,
    "transportation": "NOT_NEEDED",
    "school": "University of Illinois at Urbana-Champaign",
    "major": "Computer Science",
    "gender": "MALE",
    "professionalInterest": "BOTH",
    "github": "JDoe1234",
    "linkedin": "JDoe5678",
    "interests": "CS",
    "isNovice": true,
    "isPrivate": false,
    "hasLightningInterest": false,
    "phoneNumber": "12345678910",
    "status": null,
    "resume": null,
    "ecosystemInterests": [
      {
        "ecosystemId": 1,
        "attendeeId": 1,
        "id": 1
      }
    ],
    "projects": [
      {
        "name": "HackIllinois API",
        "description": "API written in NodeJS + Express. Supports HackIllinois 2017",
        "repo": "http://www.github.com/hackillinois/api-2017",
        "isSuggestion": true,
        "attendeeId": 1,
        "id": 1
      }
    ],
    "collaborators": [
      {
        "collaborator": "collaborator@hackillinois.org",
        "attendeeId": 1,
        "id": 1
      }
    ],
    "extras": [
      {
        "info": "One of the projects I'm really proud of is my HelloWorld Machine. It says 'Hello World' in ten different languages!",
        "attendeeId": 1,
        "id": 1
      }
    ]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `User` | an Attendee for the requested user already exists |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |
---

**GET /v1/registration/attendee** <br />
Allows requester to retrieve information about their attendee registration. Requires requester to have an attendee registration.

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
    "diet": "NONE",
    "age": 19,
    "graduationYear": 2019,
    "transportation": "NOT_NEEDED",
    "school": "University of Illinois at Urbana-Champaign",
    "major": "Computer Science",
    "gender": "MALE",
    "professionalInterest": "BOTH",
    "github": "JDoe1234",
    "linkedin": "JDoe5678",
    "interests": "CS",
    "isNovice": true,
    "isPrivate": false,
    "hasLightningInterest": false,
    "phoneNumber": "12345678910",
    "status": null,
    "resume": null,
    "ecosystemInterests": [
      {
        "ecosystemId": 1,
        "attendeeId": 1,
        "id": 1
      }
    ],
    "projects": [
      {
        "name": "HackIllinois API",
        "description": "API written in NodeJS + Express. Supports HackIllinois 2017",
        "repo": "http://www.github.com/hackillinois/api-2017",
        "isSuggestion": true,
        "attendeeId": 1,
        "id": 1
      }
    ],
    "collaborators": [
      {
        "collaborator": "collaborator@hackillinois.org",
        "attendeeId": 1,
        "id": 1
      }
    ],
    "extras": [
      {
        "info": "One of the projects I'm really proud of is my HelloWorld Machine. It says 'Hello World' in ten different languages!",
        "attendeeId": 1,
        "id": 1
      }
    ]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |
| NotFoundError | N/A | an attendee registration doesn't exist for the user |

---

**GET /v1/registration/attendee/{:id}** <br />
Retrieves information about an attendee. Requires requester to have either the `ADMIN`
or `STAFF` permission. Identical to `GET /v1/registration/attendee`.

---

**GET /v1/registration/attendee/user{:id}** <br />
Retrieves information about an attendee. Requires requester to have a `host` role.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |


URL Parameters <br />

| Parameter        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `id` | the id of the user whose attendee information the volunteer wants | Yes |

Response
```
{
  "meta": null,
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "shirtSize": "M",
    "diet": "NONE"
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |
| NotFoundError | N/A | an attendee registration doesn't exist for the user |

---

**PUT /v1/registration/attendee** <br />
Updates an attendee registration.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `attendee` | a JSON object containing the Attendee Parameters below | Yes |
| `ecosystemInterests` | an array of JSON objects of length at least one and at most two, each containing the EcosystemInterest parameters below | Yes |
| `extras` | an array of JSON objects of length at most three, each containing the ExtraInfo parameters below | No |
| `collaborators` | an array of JSON objects of length at most eight, each containing the RequestedCollaborator parameters below | No |

Attendee Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `firstName` | the user's first name of length 255 or less | Yes |
| `lastName` | the user's last name of length 255 or less | Yes |
| `shirtSize` | a string of length 1 from the following options: ['S', 'M', 'L', 'XL'] | Yes |
| `diet` | a string from the following options: ['NONE', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE'] | Yes |
| `age` | a number between 13 and 115 | Yes |
| `graduationYear` | a number between 2017 and 2024 | Yes |
| `transportation` | a string from the following options: ['NOT_NEEDED', 'BUS_REQUESTED', 'IN_STATE', 'OUT_OF_STATE', 'INTERNATIONAL'] | Yes |
| `school` | the user's school of length 255 or less | Yes |
| `major` | the user's major of length 255 or less | Yes |
| `gender` | a string from the following options: ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'] | Yes |
| `professionalInterest` | a string from the following options: ['INTERNSHIP', 'FULLTIME', 'BOTH'] | Yes |
| `github` | the user's Github handle of length 50 or less | Yes |
| `linkedin` | the user's LinkedIn handle of length 50 or less | Yes |
| `interests` | the user's interests of length 255 or less | Yes |
| `isNovice` | a boolean indicating whether or not the user is a novice | Yes |
| `isPrivate` | a boolean indicating whether or not the user's information is private | Yes |
| `hasLightningInterest` | a boolean indicating whether the user is interested in giving a short talk | No |
| `phoneNumber` | the user's phone number, formatted as a string of length 15 or less | No |


EcosystemInterest Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `ecosystemId` | the id for the ecosystem the user is interested in | Yes |
| `id` | the preexisting id of an EcosystemInterest to be updated | No|


Project Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `name` | the name of the project of length 100 or less | Yes |
| `description` | the description of the project of length 255 or less | Yes |
| `repo` | the repo for the project of length 150 or less | Yes |
| `isSuggestion` | a boolean indicating whether or not the user intends to suggest the project or create the project | Yes |
| `id` | the preexisting id of a Project to be updated | No|


ExtraInfo Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `info` | the extra information provided by the user of length 255 or less | Yes |
| `id` | the preexisting id of an ExtraInfo to be updated | No|


RequestedCollaborator Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `collaborator` | the requested collaborator's email of length 255 or less | Yes |
| `id` | the preexisting id of a collaborator to be updated | No|

Request
```
{
	"attendee": {
		"firstName": "Jane",
		"lastName": "Doe",
		"shirtSize": "M",
                "diet": "NONE",
                "age": 19,
                "graduationYear": 2019,
                "transportation": "NOT_NEEDED",
                "school": "University of Illinois at Urbana-Champaign",
                "major": "Computer Science",
                "gender": "MALE",
                "professionalInterest": "BOTH",
                "github": "JDoe1234",
                "linkedin": "JDoe5678",
                "interests": "CS",
                "isNovice": true,
                "isPrivate": false,
                "hasLightningInterest": false,
                "phoneNumber": "12345678910"
	},
	"ecosystemInterests": [
		{
                    "ecosystemId": 2,
                    "id": 1
		}
	],
	"projects": [
		{
                    "name": "HackIllinois API",
                    "description": "API written in NodeJS + Express. Supports HackIllinois 2017.",
                    "repo": "http://www.github.com/hackillinois/api-2017",
                    "isSuggestion": true,
                    "id": 1
		}
	],
	"collaborators": [
		{
                    "collaborator": "collaborator2@hackillinois.org",
                    "id": 1                 
		}
	],
	"extras": [
		{
            	    "info": "One of the projects I'm really proud of is my GoodbyeWorld Machine. It says 'Goodbye World' in ten different languages!",
                    "id": 1     
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
    "firstName": "Jane",
    "lastName": "Doe",
    "shirtSize": "M",
    "diet": "NONE",
    "age": 19,
    "graduationYear": 2019,
    "transportation": "NOT_NEEDED",
    "school": "University of Illinois at Urbana-Champaign",
    "major": "Computer Science",
    "gender": "MALE",
    "professionalInterest": "BOTH",
    "github": "JDoe1234",
    "linkedin": "JDoe5678",
    "interests": "CS",
    "isNovice": true,
    "isPrivate": false,
    "hasLightningInterest": false,
    "phoneNumber": "12345678910",
    "status": null,
    "ecosystemInterests": [
      {
        "ecosystemId": 2,
        "attendeeId": 1,
        "id": 1
      }
    ],
    "projects": [
      {
        "name": "HackIllinois API",
        "description": "API written in NodeJS + Express. Supports HackIllinois 2017.",
        "repo": "http://www.github.com/hackillinois/api-2017",
        "isSuggestion": true,
        "attendeeId": 1,
        "id": 1
      }
    ],
    "collaborators": [
      {
        "collaborator": "collaborator2@hackillinois.org",
        "attendeeId": 1,
        "id": 1
      }
    ],
    "extras": [
      {
        "info": "One of the projects I'm really proud of is my GoodbyeWorld Machine. It says 'Goodbye World' in ten different languages!",
        "attendeeId": 1,
        "id": 1
      }
    ]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| NotFoundError | `id` | an id for a given related object was not found |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |

---

**PUT /v1/registration/attendee/{:id}** <br />
Updates an attendee registration. Requires requester to have either the ADMIN or STAFF permission. Identical to `PUT /v1/registration/attendee`.