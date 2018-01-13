[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/HackIllinois/api?utm_source=badge&utm_medium=badge)
[![Build Status](https://travis-ci.org/HackIllinois/api.svg?branch=staging)](https://travis-ci.org/HackIllinois/api)

# HackIllinois API

The back-end services supporting HackIllinois are stored here. Looking to
contribute? See the [contribution guidelines](/CONTRIBUTING.md) and [setup documentation](/SETUP.md).

## Documentation

All documentation is available on the [project wiki](https://github.com/HackIllinois/api/wiki).

## Configuration

The API is configured using configuration files placed in the `config` directory. The
naming convention is `{NODE_ENV}.config`, where `NODE_ENV` is an environment variable
set to prior to starting the API.

We have provided templates in the directory already with all available configuration options.
These templates are named `{NODE_ENV}.json.template`. You should copy these templates into
files named `{NODE_ENV}.config` and fill them with sensible values; these values can be raw
values or existing environment variables. In the Vagrant development box, this
is already handled for you.

Note that changes to the templates are committed to the project codebase, but
changes to any `*.config` files are ignored.

#### Amazon Web Services

Additionally, an [AWS shared credentials file](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
can be made available with configuration options for those systems under the profile
identified by `hackillinois-api`. Be sure to set the `AWS` configuration key to `1` and
add the key `AWS_PROFILE` to your configuration with your corresponding profile name (see 'Overrides').

#### Considerations

Not all configuration options must be set during development (but all options _should_
be set in production). When certain keys are left empty, the API determines whether
or not it can use a local alternative or a default value at startup.

#### Overrides

Some configuration keys are more easily set via environment variables (especially in production). The
following table provides the environment variable names that will (if set) override the corresponding
configuration key values.

| Name | Overriding Key | Possible Values |
| ---- | --- | --------------- |
| AWS | aws.enabled |0 or 1 |
| SECRET | auth.secret | Any string |
| APP_PORT | port | Any valid port number |
| SUPERUSER_EMAIL | superuser.email | Any valid email |
| SUPERUSER_PASSWORD | superuser.password | Any string |
| MAIL_KEY | mail.key | Any string |
| GITHUB_CLIENT_ID | auth.github.id | Any string |
| GITHUB_CLIENT_SECRET | auth.github.secret | Any String |
| GITHUB_MOBILE_REDIRECT | auth.github.mobileRedirect | Any String |
| DB_NAME | database.primary.name | Any valid MySQL schema name |
| DB_USERNAME | database.primary.user | Any string |
| DB_PASSWORD | database.primary.password | Any string |
| DB_HOSTNAME | database.primary.host | Any valid URI |
| DB_PORT | database.primary.port | Any valid port number |
| REDIS_HOST | redis.host | IP address |
| REDIS_PORT | redis.port | Any valid port number |

## Running the API

To run the API, choose a target (`dev` or `prod`) and run:
```
npm run [target]
```

Note that `node` (and in development, `nodemon`) must be on your path and that the configuration
for the target environment must be present in the `config` directory. The development server will
restart automatically when changes are made. To stop the API, type `Control-C`.

## Testing the API

Environment variables should be set in `test.config`. With these values set, run

``` shell
npm test
```

which will output the test results, as well as any linter errors that may occur.
