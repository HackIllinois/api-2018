#!/bin/bash

source resources/scripts/env.sh $2

cd "$(dirname ${BASH_SOURCE[0]})"

if [ "$#" -ne 2 ]; then
	echo "Usage: $0 <flyway command> <target>"
	echo "Type 'flyway' for a list of available commands"
	echo "Target is any available environment (usually dev or prod)"
	exit 2
fi

flyway -user=$DB_USERNAME -password=$DB_PASSWORD  -url=jdbc:mysql://$DB_HOSTNAME:$DB_PORT/$DB_NAME -locations=filesystem:"$PWD/migration" -baselineOnMigrate=true -sqlMigrationSuffix=.sql $1
