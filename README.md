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

## Installation

#### Dependencies
A typical `package.json` is present in the root of the project directory. You can
use it to install all of the dependencies at once by running the following:

```
npm install
```

Note that your current directory must be the root of the project.

#### Database

All database-specific installation is described in the [database README](/database/README.md). Please refer to it for details on how to get a local
database instance running that can accommodate our API.

## Configuration

The following environment variables can be used to configure the API for your system:

| Variable | Possible Values | Purpose |
| -------- | --------------- | ------- |
| NODE_ENV | 'production' or 'development' | Determines how environment should be configured |
| HACKILLINOIS_PORT | Any valid port number | Overrides default port (8080) |
| LOCAL_MYSQL_USERNAME | Any string | Overrides default MySQL username ('root') |
| LOCAL_MYSQL_PASSWORD | Any string | Overrides default MySQL password ('') |
| LOCAL_MYSQL_HOST | Any valid URI | Overrides default MySQL host ('127.0.0.1') |
| LOCAL_MYSQL_PORT | Any valid port number | Overrides default MySQL port (3306) |

You should set `NODE_ENV` to `development`, as this variable is required. The API
will exit with an unsuccessful error code if it finds that this variable is missing.
To save time, you might add this variable to your PATH, or to a `bash_profile` as
an export.

## Starting Up

A local API instance can be created on port 8080 via the following, executed from
the root of the project directory:

```
node api.js
```

Use `Control-C` to kill the server. Note that Windows users will need to use
Powershell or this command will fail!

## Issues

Please use the issue tracker to submit issues about features currently in `master`
or `staging`.
