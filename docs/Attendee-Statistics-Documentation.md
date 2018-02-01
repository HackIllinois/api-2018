### Purpose

Provides functionality for statistics. Registration, RSVP, and live event stats are computed in realtime.

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
{
    "meta": null,
    "data": {
        "registration": {
            "school": {
                "University of Illinois at Urbana-Champaign": 4
            },
            "transportation": {
                "BUS_REQUESTED": 0,
                "INTERNATIONAL": 0,
                "IN_STATE": 0,
                "NOT_NEEDED": 9,
                "OUT_OF_STATE": 0
            },
            "diet": {
                "GLUTEN_FREE": 0,
                "NONE": 9,
                "VEGAN": 0,
                "VEGETARIAN": 0
            },
            "shirtSize": {
                "L": 0,
                "M": 8,
                "S": 0,
                "XL": 0
            },
            "gender": {
                "FEMALE": 0,
                "MALE": 9,
                "NON_BINARY": 0,
                "OTHER": 0
            },
            "graduationYear": {
                "2019": 3
            },
            "isNovice": {
                "0": 0,
                "1": 9
            },
            "status": {
                "ACCEPTED": 0,
                "PENDING": 0,
                "REJECTED": 0,
                "WAITLISTED": 0
            },
            "major": {
                "Computer Science": 4
            },
            "attendees": {
                "count": 9
            }
        },
        "rsvp": {
            "school": {
                "University of Illinois at Urbana-Champaign": 1
            },
            "transportation": {
                "BUS_REQUESTED": 0,
                "INTERNATIONAL": 0,
                "IN_STATE": 0,
                "NOT_NEEDED": 1,
                "OUT_OF_STATE": 0
            },
            "diet": {
                "GLUTEN_FREE": 0,
                "NONE": 1,
                "VEGAN": 0,
                "VEGETARIAN": 0
            },
            "shirtSize": {
                "L": 0,
                "M": 1,
                "S": 0,
                "XL": 0
            },
            "gender": {
                "FEMALE": 0,
                "MALE": 1,
                "NON_BINARY": 0,
                "OTHER": 0
            },
            "graduationYear": {
                "2019": 1
            },
            "isNovice": {
                "0": 0,
                "1": 1
            },
            "major": {
                "Computer Science": 1
            },
            "attendees": {
                "count": 0
            }
        },
        "liveevent": {
            "attendees": {
                "count": 17
            },
            "events": {
                "Example Event": 1
            }
        }
    }
}

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
{
    "meta": null,
    "data": {
		"school": {
			"University of Illinois at Urbana-Champaign": 4
		},
		"transportation": {
			"BUS_REQUESTED": 0,
			"INTERNATIONAL": 0,
			"IN_STATE": 0,
			"NOT_NEEDED": 9,
			"OUT_OF_STATE": 0
		},
		"diet": {
			"GLUTEN_FREE": 0,
			"NONE": 9,
			"VEGAN": 0,
			"VEGETARIAN": 0
		},
		"shirtSize": {
			"L": 0,
			"M": 8,
			"S": 0,
			"XL": 0
		},
		"gender": {
			"FEMALE": 0,
			"MALE": 9,
			"NON_BINARY": 0,
			"OTHER": 0
		},
		"graduationYear": {
			"2019": 3
		},
		"isNovice": {
			"0": 0,
			"1": 9
		},
		"status": {
			"ACCEPTED": 0,
			"PENDING": 0,
			"REJECTED": 0,
			"WAITLISTED": 0
		},
		"major": {
			"Computer Science": 4
		},
		"attendees": {
			"count": 9
		}
    }
}

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
{
    "meta": null,
    "data": {
		"school": {
			"University of Illinois at Urbana-Champaign": 1
		},
		"transportation": {
			"BUS_REQUESTED": 0,
			"INTERNATIONAL": 0,
			"IN_STATE": 0,
			"NOT_NEEDED": 1,
			"OUT_OF_STATE": 0
		},
		"diet": {
			"GLUTEN_FREE": 0,
			"NONE": 1,
			"VEGAN": 0,
			"VEGETARIAN": 0
		},
		"shirtSize": {
			"L": 0,
			"M": 1,
			"S": 0,
			"XL": 0
		},
		"gender": {
			"FEMALE": 0,
			"MALE": 1,
			"NON_BINARY": 0,
			"OTHER": 0
		},
		"graduationYear": {
			"2019": 1
		},
		"isNovice": {
			"0": 0,
			"1": 1
		},
		"major": {
			"Computer Science": 1
		},
		"attendees": {
			"count": 0
		}
    }
}
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
{
    "metad null,
    "data": {
		"attendees": {
			"count": 17
		},
		"events": {
			"Example Event": 1
		}
    }
}
```

Errors: <br>

| Error        | Source | Cause  |
| ------------ | ------ | ------ |
| InvalidHeaderError | `Authorization` | the authentication token was invalid or absent |

---