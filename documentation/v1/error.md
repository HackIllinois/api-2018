# Error Documentation

### Purpose

Provides detailed information about an issue that occurred while processing a request.

---

**ApiError** <br>
Returned when an unknown error occurs and the API cannot resolve the problem.

Example
```
{
  "meta": null,
  "error": {
	"type": "ApiError",
	"status": 500,
	"title": "API Error",
	"message": "An error occurred. If this persists, please contact us",
	"source": null
  }
}
```

---

**UnprocessableRequestError** <br>
Returned when a specific aspect of the request is not applicable.

Example
```
{
  "meta": null,
  "error": {
	"type": "UnprocessableRequestError",
	"status": 400,
	"title": "Unprocessable Request",
	"message": "The server received a request that could not be processed",
	"source": null
  }
}
```

---

**MissingParameterError** <br>
Returned when a specific parameter of the request is missing.

Example
```
{
  "meta": null,
  "error": {
	"type": "MissingParameterError",
	"status": 400,
	"title": "Missing Parameter",
	"message": "One or more parameters were missing from the request",
	"source": id
  }
}
```

---

**InvalidParameterError** <br>
Returned when a specific parameter of the request is invalid or not applicable.

Example
```
{
  "meta": null,
  "error": {
	"type": "InvalidParameterError",
	"status": 400,
	"title": "Invalid Parameter",
	"message": "One or more parameters present in the request were invalid",
	"source": id
  }
}
```

---

**InvalidHeaderError** <br>
Returned when a specific parameter in the header of a request is invalid or not applicable.

Example
```
{
  "meta": null,
  "error": {
	"type": "InvalidHeaderError",
	"status": 400,
	"title": "Invalid Header",
	"message": "One or more headers present in the request were invalid",
	"source": Authorization
  }
}
```

---

**NotFoundError** <br>
Returned when a requeste resource cannot be found.

Example
```
{
  "meta": null,
  "error": {
	"type": "NotFoundError",
	"status": 404,
	"title": "Not Found",
	"message": "The requested resource could not be found",
	"source": id
  }
}
```

---

**UnauthorizedError** <br>
Returned when the requester is not allowed to access a specific resource.

Example
```
{
  "meta": null,
  "error": {
	"type": "UnauthorizedError",
	"status": 401,
	"title": "Unauthorized",
	"message": "The requested resource cannot be accessed with the provided credentials",
	"source": null
  }
}
```

---
