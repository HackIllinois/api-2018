#!/bin/bash

set -e

if [ "$#" -ne 2 ]; then
	echo "Usage: $0 <flyway command> <target>"
	echo "Type 'flyway' for a list of available commands"
	echo "Target is any available environment (usually 'production' or 'development')"
	exit 2
fi

FLYWAY_USERNAME=$DB_USERNAME
FLYWAY_PASSWORD=$DB_PASSWORD
FLYWAY_HOSTNAME=$DB_HOSTNAME
FLYWAY_PORT=$DB_PORT
FLYWAY_NAME=$DB_NAME

cd "$(dirname ${BASH_SOURCE[0]})"
if [ -f "../config/$2.json" ]; then
	configuration=`echo -e $(cat ../config/$2.json)`
	FLYWAY_USERNAME=`python -c "import json; print(json.loads('$configuration')['database']['primary']['user'])"`
	FLYWAY_PASSWORD=`python -c "import json; print(json.loads('$configuration')['database']['primary']['password'])"`
	FLYWAY_HOSTNAME=`python -c "import json; print(json.loads('$configuration')['database']['primary']['host'])"`
	FLYWAY_PORT=`python -c "import json; print(json.loads('$configuration')['database']['primary']['port'])"`
	FLYWAY_NAME=`python -c "import json; print(json.loads('$configuration')['database']['primary']['name'])"`
else
	echo "no configuration found for target '$2'. defaulting to environment"
fi

flyway -user=$FLYWAY_USERNAME -password=$FLYWAY_PASSWORD -url=jdbc:mysql://$FLYWAY_HOSTNAME:$FLYWAY_PORT/$FLYWAY_NAME -locations=filesystem:"$PWD/migration" -baselineOnMigrate=true -sqlMigrationSuffix=.sql $1
