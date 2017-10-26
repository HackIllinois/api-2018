### Purpose

Provides functionality for uploading and retrieving blobs.

---

**POST /v1/upload/resume** <br />
Accepts a byte-stream to be associated as the uploading user's resume. The stream must meet the following criteria:
* Under 2MB in length
* Matches MIME type `application/pdf`

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |
| `Content-Length` | the size of the blob in bytes | Yes |
| `Content-Type` | the MIME type of the blob | Yes |

URL Parameters <br />
None

Request Parameters <br />
None

Request <br />
The body may include only the raw byte-stream of the upload

Response
```
{
    "meta": null,
    "data": {
        "id": 1,
        "ownerId": 3,
        "key": "5f695bdd-cc2d-4833-9b28-22a76072c00a",
        "bucket": "example-bucket",
        "created": "2016-08-12T04:00:00.000Z", 
        "updated": "2016-08-12T04:00:00.000Z"
    }
 }
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| UnauthorizedError | N/A | the requester does not have permission to upload a file |
| UnsupportedMediaType | N/A | the byte-stream's file type is not permitted |
| EntityTooLargeError | N/A | the byte-stream's length is over the specified limit |

---

**GET /v1/upload/resume/:id** <br />
Retrieves a resume from storage.

Headers <br />

| Header        | Description           | Required  |
| ------------- | --------------------- | --------- |
| `Authorization` | a valid authentication token | Yes |

URL Parameters <br />

| Parameter  | Description     | Required  |
| -----| --------------------- | --------- |
| `id` | the id of the upload to replace | Yes |

Response
The body will include only the byte-stream of the requested resume

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was absent or invalid |
| NotFoundError | id | the provided upload ID does not exist |

---

**PUT /v1/upload/resume/:id** <br />
Updates the resume currently associated with the uploading user. The usage of this endpoint is very similar to the POST resume endpoint above; see its content in addition to the content provided here.

URL Parameters <br />

| Parameter  | Description     | Required  |
| -----| --------------------- | --------- |
| `id` | the id of the upload to replace | Yes |

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| NotFoundError | id | the provided upload ID does not exist |

---
