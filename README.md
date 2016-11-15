[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/HackIllinois/api-2017?utm_source=badge&utm_medium=badge)

# HackIllinois API (2017)

The back-end services supporting HackIllinois 2017 are stored here. Looking to
contribute? See the [contribution guidelines](/CONTRIBUTING.md).

## Setup

We use Node.js + Express in the application layer. The MySQL RDBMS is used as
our primary datastore in the persistence layer.

####  Software Version Note

If you are a front-end developer that wants to use a local instance of the API
or someone who just wants to run the API for novelty, the most-accessible
major releases of the following software will likely work for you.

These version notes are more important for back-end developers who will be committing
code to this repository.

#### Node.js Version

Our application is deployed with Node.js v4.6.2. It is recommended that you install
this version, although using a different release version (v4.6.x) will
probably work too.

The production-ready version of Node.js can be downloaded from [here](https://nodejs.org/dist/v4.6.2/).

#### MySQL Version

Our primary datastore is deployed MySQL 5.7.11. Again, it is recommended that you
install this version exactly, although we typically use a different release version
(5.7.x) during development.

The production-ready version of MySQL is not typically available for direct download,
although some mirrors may have this version available. Instead, it is sufficient to
get the latest 5.7.x download from [here](http://dev.mysql.com/downloads/mysql/) or
from your favorite package manager.

## Configuration

The API is configured using configuration files placed in the `config` directory. The
naming convention is `{ENV}.config`, where `{ENV}` is the target environment (like `dev` or `prod`).

We have provided templates in the directory already with all available configuration options.
These templates are named `{ENV}.config.template`. You should copy these templates into
files named `{ENV}.config` and fill them with sensible values; these values can be raw
values or existing environment variables. Note that changes to the templates are
commited to the project codebase, but changes to any `*.config` files are ignored.

A list of configuration keys is provided below:

| Key | Possible Values | Purpose |
| --- | --------------- | ------- |
| NODE_ENV | 'production' or 'development' | Determines how environment should be configured |
| PROFILE | Any string | Presents an externally-meaningful identifier |
| HACKILLINOIS_SECRET | Any string | Sets the master secret (required on production) |
| HACKILLINOIS_PORT | Any valid port number | Overrides default port (8080) |
| HACKILLINOIS_SUPERUSER_EMAIL | Any valid email | Overrides the default superuser email ('admin@example.com') |
| HACKILLINOIS_SUPERUSER_PASSWORD | Any string | Overrides the default superuser password ('ABCD1234!') |
| HACKILLINOIS_MAIL_KEY | Any string | Sets the mail service API key |
| DB_NAME |  Any valid MySQL schema name | Overrides default name (hackillinois) |
| DB_USERNAME | Any string | Overrides default MySQL username ('root') |
| DB_PASSWORD | Any string | Overrides default MySQL password ('') |
| DB_HOSTNAME | Any valid URI | Overrides default MySQL host ('127.0.0.1') |
| DB_PORT | Any valid port number | Overrides default MySQL port (3306) |

Additionally, an [AWS shared credentials file](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
can be made available with configuration options for those systems under the profile
identified by the `PROFILE` configuration key. We do not handle AWS-specific configuration
options in our configuration files.

#### Considerations

Not all configuration options must be set during development (although all options should
be set in production). When certain keys are left empty, the API determines whether
or not it can use a local alternative or a default value at startup. Here are some
considerations that will help you determine which keys to set as you develop:

* Anyone contributing to a feature that involves email transmissions
will need to set the `HACKILLINOIS_MAIL_KEY` to a valid SparkPost API key.
* Anyone contributing to a feature that involves any AWS products will need to set
up an AWS shared credentials file (see above)

Note that this API is targeted for hosting via AWS, so any AWS-specific settings
(e.g. those in IAM roles) are used by this API before settings in any environment
variables or other credentials files.

## Installation

#### Dependencies

A typical `package.json` is present in the root of the project directory. You can
use it to install all of the dependencies at once by running the following:

```
npm install
```

Note that your current directory must be the root of the project.

#### Database

To begin, you will need the [FlywayDB command line tool](http://flywaydb.org/documentation/commandline/).
Further, you'll need to create a new schema for the API on your local MySQL instance.
Make sure that all configuration keys related to the database have the correct values!

Once you have both of these tasks completed, run `npm run dev-migrations`
from the root of the project directory. This will run all migration scripts available to-date.
If you see any errors, such as an inability to access the database, make sure you have
set up the schema correctly and that you have set any necessary MySQL environment
variables listed in the configuration section above.

Note that if you're looking to contribute to this codebase, you should read the
[database README](/database/README.md) as well. It contains important information that all
contributors should be familiar with.

## Starting Up

A local API instance can be created on port 8080 via the following commands,
executed from the root of the project directory. Note that in development, you must
to install the process manager `nodemon` globally via `[sudo] npm install -g nodemon`.

To run the API for development:
```
npm run dev
```

Note that `node` must and `nodemon` must be on your path and that the configuration
for the target environment must be present in the `config` directory. The server will
restart automatically when changes are made. To stop the API, simply type `Control-C`.

For production, we build a Docker image and deploy this to a container ecosystem. You can
find the Dockerfile in the project root directory.

## Logging

The API access logs are available in `/temp/logs/api.log` during development, but
are periodically pushed to AWS CloudWatch during in production (and are not accessible
until they are pushed). Note that these logs are optimized for searchability, not
readability.

## Documentation

All documentation is available on the [project wiki](https://github.com/HackIllinois/api-2017/wiki).

## Issues

Please use the issue tracker to submit issues about features currently in `master`
or `staging`.

Any issues found in a feature branch (i.e. not in `master` or `staging`)
should be communicated to the active developer(s) directly, unless there is an open
pull-request for that feature branch. In the latter case, just leave a comment on
the pull-request detailing the issue preventing a merge.
