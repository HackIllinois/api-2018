[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/HackIllinois/api-2017?utm_source=badge&utm_medium=badge)
[![Build Status](https://travis-ci.org/HackIllinois/api-2017.svg?branch=staging)](https://travis-ci.org/HackIllinois/api-2017)

# HackIllinois API

The back-end services supporting HackIllinois are stored here. Looking to
contribute? See the [contribution guidelines](/CONTRIBUTING.md) and [setup documentation](/SETUP.md).

## Documentation

All documentation is available on the [project wiki](https://github.com/HackIllinois/api-2017/wiki).

## Configuration

The API is configured using configuration files placed in the `config` directory. The
naming convention is `{ENV}.config`, where `{ENV}` is the target environment (like `dev` or `prod`).

We have provided templates in the directory already with all available configuration options.
These templates are named `{ENV}.config.template`. You should copy these templates into
files named `{ENV}.config` and fill them with sensible values; these values can be raw
values or existing environment variables. In the Vagrant development box, this
is already handled for you.

Note that changes to the templates are committed to the project codebase, but
changes to any `*.config` files are ignored.

A list of configuration keys is provided below:

| Key | Possible Values | Purpose |
| --- | --------------- | ------- |
| NODE_ENV | 'production', 'development', 'testing' | Determines how environment should be configured |
| AWS | 0 or 1 | Whether or not to use AWS |
| HACKILLINOIS_SECRET | Any string | Sets the master secret |
| HACKILLINOIS_PORT | Any valid port number | Sets the port |
| HACKILLINOIS_SUPERUSER_EMAIL | Any valid email | Sets the default superuser email |
| HACKILLINOIS_SUPERUSER_PASSWORD | Any string | Sets the default superuser password |
| HACKILLINOIS_MAIL_KEY | Any string | Sets the mail service API key |
| DB_NAME |  Any valid MySQL schema name | Sets database name |
| DB_USERNAME | Any string | Sets MySQL username |
| DB_PASSWORD | Any string | Sets MySQL password |
| DB_HOSTNAME | Any valid URI | Sets MySQL host |
| DB_PORT | Any valid port number | Sets MySQL port |
| REDIS_HOST | IP address | Sets Redis host |
| REDIS_PORT | Any valid port number | Sets Redis port |

#### Amazon Web Services

Additionally, an [AWS shared credentials file](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
can be made available with configuration options for those systems under the profile
identified by `hackillinois-api`. Be sure to set the `AWS` configuration key to `1` and
add the key `AWS_PROFILE` to your configuration with your corresponding profile name.

#### Considerations

Not all configuration options must be set during development (but all options _should_
be set in production). When certain keys are left empty, the API determines whether
or not it can use a local alternative or a default value at startup.

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
