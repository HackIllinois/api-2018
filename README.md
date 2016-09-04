# HackIllinois API (2017)

The back-end services supporting HackIllinois 2017 are stored here.

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

Our application is deployed with Node.js v4.4.3. It is recommended that you install
this version exactly, although using a different release version (v4.4.x) will
probably work too.

The production-ready version of Node.js can be downloaded from [here](https://nodejs.org/dist/v4.4.3/) or from your favorite package manager.

#### MySQL Version

Our primary datastore is deployed MySQL 5.7.11. Again, it is recommended that you
install this version exactly, although we typically use a different release version
(5.7.x) during development.

The production-ready version of MySQL is not typically available for direct download,
although some mirrors may have this version available. Instead, it is sufficient to
get the latest 5.7.x download from [here](http://dev.mysql.com/downloads/mysql/) or
from your favorite package manager.

## Configuration

The following environment variables can be used to configure the API for your system:

| Variable | Possible Values | Purpose |
| -------- | --------------- | ------- |
| NODE_ENV | 'production' or 'development' | Determines how environment should be configured |
| HACKILLINOIS_SECRET | Any string | Sets the master secret (required on production) |
| HACKILLINOIS_PORT | Any valid port number | Overrides default port (8080) |
| HACKILLINOIS_SUPERUSER_EMAIL | Any valid email | Overrides the default superuser email ('admin@example.com') |
| HACKILLINOIS_SUPERUSER_PASSWORD | Any string | Overrides the default superuser password ('ABCD1234!') |
| HACKILLINOIS_MAIL_KEY | Any string | Sets the mail service API key |
| LOCAL_MYSQL_USERNAME | Any string | Overrides default MySQL username ('root') |
| LOCAL_MYSQL_PASSWORD | Any string | Overrides default MySQL password ('') |
| LOCAL_MYSQL_HOST | Any valid URI | Overrides default MySQL host ('127.0.0.1') |
| LOCAL_MYSQL_PORT | Any valid port number | Overrides default MySQL port (3306) |

You should set `NODE_ENV` to `development`, as this variable is required. The API
will exit with an unsuccessful error code if it finds that this variable is missing.
To save time, you might add this variable to your PATH, or to a `bash_profile` as
an export.

Developers contributing to a feature that involves email transmissions
will need to set the `HACKILLINOIS_MAIL_KEY` to a valid SparkPost API key.

Developers contributing to a feature that involves any AWS
products will also need to set up an
[AWS shared credentials file](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
with the profile `hackillinois-api`.

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
Further, you'll need to create a schema called `hackillinois-2017` on your local MySQL instance.

Once you have both of these tasks completed, run `./database/flyway.sh migrate`
from the root of the project directory. This will run all migration scripts available to-date.
If you see any errors, such as an inability to access the database, make sure you have
set up the schema correctly and that you have set any necessary MySQL environment
variables listed in the configuration section above.

Note that if you're looking to contribute to this codebase, you should read the
[database README](/database/README.md) as well. It contains important information that all
contributors should be familiar with.

## Starting Up

A local API instance can be created on port 8080 via the following, executed from
the root of the project directory:

```
node api.js
```

Use `Control-C` to kill the server. Note that `node` must be on your path.

## Documentation

All documentation is available on the [project wiki](https://github.com/HackIllinois/api-2017/wiki).

## Issues

Please use the issue tracker to submit issues about features currently in `master`
or `staging`.

Any issues found in a feature branch (i.e. not in `master` or `staging`)
should be communicated to the active developer(s) directly, unless there is an open
pull-request for that feature branch. In the latter case, just leave a comment on
the pull-request detailing the issue preventing a merge.
