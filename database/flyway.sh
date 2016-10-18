cd "$(dirname ${BASH_SOURCE[0]})"

if [ "$#" -ne 1 ]; then
	echo "Usage: $0 <flyway command>"
	echo "Type 'flyway' for a list of available commands"
	exit 2
fi

flyway -user=$DB_USERNAME -password=$DB_PASSWORD  -url=jdbc:mysql://$DB_HOSTNAME:$DB_PORT/$DB_NAME -locations=filesystem:${PWD}/migration -baselineOnMigrate=true -sqlMigrationSuffix=.sql $1
