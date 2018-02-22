### Purpose

Provides utilities for applicant decisions


**GET /v1/registration/attendee/all?category=x&ascending=x&page=x&count=x** <br />
Retrieve all attendees

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZER | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `page` | the page of the list of projects | No |
| `count` | the number of projects by page | No |
| `category` | the category to sort by | No |
| `ascending` | 0 or 1 depending on what order to sort by | No |


Response
```
{
  "meta": null,
  "data": {
    "attendees": [
      {
        "id": 3,
        "userId": 2,
        "firstName": "Aaron",
        "lastName": "Rodgers",
        "shirtSize": "M",
        "diet": "NONE",
        "age": 33,
        "graduationYear": 2005,
        "transportation": "NOT_NEEDED",
        "school": "UCB",
        "major": "CS",
        "gender": "MALE",
        "professionalInterest": "INTERNSHIP",
        "github": "aaronRodgers",
        "linkedin": "aaronRodgers",
        "interests": "Deep Learning",
        "status": "ACCEPTED",
        "isNovice": 0,
        "isPrivate": 1,
        "hasLightningInterest": 0,
        "phoneNumber": null,
        "priority": 5,
        "wave": 4,
        "reviewer": "Michael McCarthy",
        "reviewTime": 1000,
        "acceptedEcosystemId": null
      },
      {
        "id": 2,
        "userId": 1,
        "firstName": "Jay",
        "lastName": "Cutler",
        "shirtSize": "M",
        "diet": "NONE",
        "age": 33,
        "graduationYear": 2005,
        "transportation": "NOT_NEEDED",
        "school": "Vanderbilt",
        "major": "CS",
        "gender": "MALE",
        "professionalInterest": "FULLTIME",
        "github": "jokeCutler",
        "linkedin": "jokeCutler",
        "interests": "Deep Learning",
        "status": "REJECTED",
        "isNovice": 0,
        "isPrivate": 1,
        "hasLightningInterest": 0,
        "phoneNumber": null,
        "priority": 5,
        "wave": 4,
        "reviewer": "John Fox",
        "reviewTime": 1000,
        "acceptedEcosystemId": null
      }
    ]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `page` | the value passed to `page` is not valid |
| InvalidParameterError | `count` | the value passed to `count` is not valid |
| InvalidParameterError | `category` | the value passed to `category` is not valid |
| InvalidParameterError | `ascending` | the value passed to `ascending` is not valid |

---

**GET /v1/registration/attendee/search?category=x&ascending=x&page=x&count=x&query=x** <br />
Retrieve all attendees

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZER | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `page` | the page of the list of projects | No |
| `count` | the number of projects by page | No |
| `category` | the category to sort by | No |
| `ascending` | 0 or 1 depending on what order to sort by | No |
| `query` | either the first or last name of the applicant | Yes |


Response
```
{
  "meta": null,
  "data": {
    "attendees": [
      {
        "id": 3,
        "userId": 2,
        "firstName": "Aaron",
        "lastName": "Rodgers",
        "shirtSize": "M",
        "diet": "NONE",
        "age": 33,
        "graduationYear": 2005,
        "transportation": "NOT_NEEDED",
        "school": "UCB",
        "major": "CS",
        "gender": "MALE",
        "professionalInterest": "INTERNSHIP",
        "github": "aaronRodgers",
        "linkedin": "aaronRodgers",
        "interests": "Deep Learning",
        "status": "ACCEPTED",
        "isNovice": 0,
        "isPrivate": 1,
        "hasLightningInterest": 0,
        "phoneNumber": null,
        "priority": 5,
        "wave": 4,
        "reviewer": "Michael McCarthy",
        "reviewTime": 1000,
        "acceptedEcosystemId": null
      },
      {
        "id": 2,
        "userId": 1,
        "firstName": "Jay",
        "lastName": "Cutler",
        "shirtSize": "M",
        "diet": "NONE",
        "age": 33,
        "graduationYear": 2005,
        "transportation": "NOT_NEEDED",
        "school": "Vanderbilt",
        "major": "CS",
        "gender": "MALE",
        "professionalInterest": "FULLTIME",
        "github": "jokeCutler",
        "linkedin": "jokeCutler",
        "interests": "Deep Learning",
        "status": "REJECTED",
        "isNovice": 0,
        "isPrivate": 1,
        "hasLightningInterest": 0,
        "phoneNumber": null,
        "priority": 5,
        "wave": 4,
        "reviewer": "John Fox",
        "reviewTime": 1000,
        "acceptedEcosystemId": null
      }
    ]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `page` | the value passed to `page` is not valid |
| InvalidParameterError | `count` | the value passed to `count` is not valid |
| InvalidParameterError | `category` | the value passed to `category` is not valid |
| InvalidParameterError | `ascending` | the value passed to `ascending` is not valid |
| InvalidParameterError | `query` | the value passed to `query` is not valid |

---

**GET /v1/registration/attendee/filter?category=x&ascending=x&page=x&count=x&query=x&filterCategory=x&filterVal=x** <br />
Filters out attendees

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZER | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `page` | the page of the list of projects | No |
| `count` | the number of projects by page | No |
| `category` | the category to sort by | No |
| `ascending` | 0 or 1 depending on what order to sort by | No |
| `filterCategory` | attendee category to filter attendees by | Yes |
| `filterVal` | value to filter by | Yes |


Response
```
{
  "meta": null,
  "data": {
    "attendees": [
      {
        "id": 3,
        "userId": 2,
        "firstName": "Aaron",
        "lastName": "Rodgers",
        "shirtSize": "M",
        "diet": "NONE",
        "age": 33,
        "graduationYear": 2005,
        "transportation": "NOT_NEEDED",
        "school": "UCB",
        "major": "CS",
        "gender": "MALE",
        "professionalInterest": "INTERNSHIP",
        "github": "aaronRodgers",
        "linkedin": "aaronRodgers",
        "interests": "Deep Learning",
        "status": "ACCEPTED",
        "isNovice": 0,
        "isPrivate": 1,
        "hasLightningInterest": 0,
        "phoneNumber": null,
        "priority": 5,
        "wave": 4,
        "reviewer": "Michael McCarthy",
        "reviewTime": 1000,
        "acceptedEcosystemId": null
      },
      {
        "id": 2,
        "userId": 1,
        "firstName": "Jay",
        "lastName": "Cutler",
        "shirtSize": "M",
        "diet": "NONE",
        "age": 33,
        "graduationYear": 2005,
        "transportation": "NOT_NEEDED",
        "school": "Vanderbilt",
        "major": "CS",
        "gender": "MALE",
        "professionalInterest": "FULLTIME",
        "github": "jokeCutler",
        "linkedin": "jokeCutler",
        "interests": "Deep Learning",
        "status": "REJECTED",
        "isNovice": 0,
        "isPrivate": 1,
        "hasLightningInterest": 0,
        "phoneNumber": null,
        "priority": 5,
        "wave": 4,
        "reviewer": "John Fox",
        "reviewTime": 1000,
        "acceptedEcosystemId": null
      }
    ]
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `page` | the value passed to `page` is not valid |
| InvalidParameterError | `count` | the value passed to `count` is not valid |
| InvalidParameterError | `category` | the value passed to `category` is not valid |
| InvalidParameterError | `ascending` | the value passed to `ascending` is not valid |
| InvalidParameterError | `query` | the value passed to `query` is not valid |

---

**PUT /v1/registration/attendee/decision/:id** <br />
Applies a decision to an attendess

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZER | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `id` | the id of the attendee to apply a decision to | Yes |
| `priority` | the priority of the attendee | Yes |
| `wave` | the acceptance wave of the attendee | Yes |
| `status` | the status applied to the attendee | Yes |
| `acceptedEcosystemId` | the ecosystem the attendee is accepted in | No |


Request
```
{
	"priority": 5,
	"wave": 3,
	"status": "ACCEPTED",
        "acceptedEcosystemId": 2
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
    "priority": 5,
    "wave": 3,
    "status": "ACCEPTED",
    "acceptedEcosystemId": "2",
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
| InvalidParameterError | `body` | if any of the body params passed in are invalid |

---
