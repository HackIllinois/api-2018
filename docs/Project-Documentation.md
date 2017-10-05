### Purpose

Provides functionality for creating, modifying, and accessing projects.

---

**POST /v1/project** <br />
Creates a new project

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZERS | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `name` | a valid, unused name of length up to 100 characters | Yes |
| `description` | a string of length up to 255 characters | Yes |
| `repo` | a link to the project of length up to 255 characters | No |
| `isPublished` | boolean denoting the state of the project | No |

Request
```
{
	"name": "ReactJS",
	"description": "A declarative, efficient, and flexible JavaScript library for building user interfaces", 
    "repo": "https://github.com/facebook/react",
    "isPublished": true
}
```

Response
```
{
        "meta": null,
        "data": {
             "name": "ReactJS",
             "description": "A declarative, efficient, and flexible JavaScript library for building user interfaces",
             "repo": "https://github.com/facebook/react",
             "isPublished": true,
             "id": 1
        }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `name` | a project with the requested name already exists |
| UnauthorizedError | user | the requesting user is not an organizer |

---

**GET /v1/project/{:id}** <br />
Retrieve a project by ID

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ALL | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `id` | the id of the project to retrieve | Yes |


Response
```
{
        "meta": null,
        "data": {
             "id": 1,
             "name": "ReactJS",
             "description": "A declarative, efficient, and flexible JavaScript library for building user interfaces",
             "repo": "https://github.com/facebook/react",
             "isPublished": true
        }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| NotFoundError | `id` | a project with the requested id does not exist |
| UnauthorizedError | user | the requesting user is not an organizer |

---

**PUT /v1/project/{:id}** <br />
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
| `name` | a valid, unused name of length up to 100 characters | Yes |
| `description` | a string of length up to 255 characters | Yes |
| `repo` | a link to the project of length up to 255 characters | Yes |
| `isPublished` | boolean denoting the state of the project | No |

Request
```
{
	"name": "React Native",
	"description": "A framework for building native apps with React", 
    "repo": "https://github.com/facebook/react-native",
    "isPublished": true
}
```

Response
```
{
        "meta": null,
        "data": {
             "name": "React Native",
             "description": "A framework for building native apps with React",
             "repo": "https://github.com/facebook/react-native",
             "isPublished": true,
             "id": 1
        }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `name` | a project with the requested name already exists |
| UnauthorizedError | user | the requesting user is not an organizer |


---

**GET /v1/project/all/{:page}?count=x&published=x** <br />
Retrieve all projects 

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ALL | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `page` | the page of the list of projects | Yes |
| `count` | the number of projects by page | Yes |
| `published` | 0 or 1 depending on the state of the projects wanted | Yes |


Response
```
{
  "meta": null,
  "data": {
    "projects": [
      {
        "id": 26,
        "name": "Testing project 22",
        "description": "testing new update method",
        "repo": "hello",
        "isPublished": 1
      },
      {
        "id": 25,
        "name": "Testing project 20",
        "description": "testing new update method",
        "repo": "hello",
        "isPublished": 1
      },
      {
        "id": 24,
        "name": "Testing new Update 7",
        "description": "testing new update method",
        "repo": "http://github.com",
        "isPublished": 1
      },
      {
        "id": 27,
        "name": "Testing new Update 65",
        "description": "testing new update method",
        "repo": "http://github.com",
        "isPublished": 1
      },
      {
        "id": 23,
        "name": "Testing new Update 4",
        "description": "testing new update method",
        "repo": "http://github.com",
        "isPublished": 1
      },
      {
        "id": 19,
        "name": "new name, new number",
        "description": "testing new update method",
        "repo": "new repo",
        "isPublished": 1
      },
      {
        "id": 20,
        "name": "new name, new number",
        "description": "testing new update method",
        "repo": "new repo",
        "isPublished": 1
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
| InvalidParameterError | `published` | the value passed to `published` is not valid |

---

**POST /v1/project/mentor** <br />
Creates a new project-mentor relationship

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZERS | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `project_id` | a valid id of the project in question | Yes |
| `mentor_id` | a valid id of the mentor to add to the project | Yes |

Request
```
{
	"project_id": 1,
    "mentor_id": 5
}
```

Response
```
{
  "meta": null,
  "data": {
    "id": 29,
    "projectId": 1,
    "mentorId": 5
  }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `project_id` | a project with the requested id does not exist |
| InvalidParameterError | `mentor_id` | a mentor with the requested id does not exist |

---

**DELETE /v1/project/mentor** <br />
Deletes a project-mentor relationship

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token for ORGANIZERS | Yes |

URL Parameters <br />
None

Request Parameters <br />

| Parameter        | Description           | Required  |
| ---------------- | --------------------- | --------- |
| `project_id` | a valid id of the project in question | Yes |
| `mentor_id` | a valid id of the mentor to add to the project | Yes |

Request
```
{
	"project_id": 1,
    "mentor_id": 5
}
```

Response
```
{
  "meta": null,
  "data": {}
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidParameterError | `project_id` | a project with the requested id does not exist |
| InvalidParameterError | `mentor_id` | a mentor with the requested id does not exist |
