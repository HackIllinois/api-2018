cd "$(dirname ${BASH_SOURCE[0]})"

USER=${LOCAL_MYSQL_USER:='root'}
PASSWORD=${LOCAL_MYSQL_PASSWORD:=''}
DB='hackillinois-2017'

if [ "$#" -ne 1 ]; then
	echo "Usage: $0 <flyway command>"
	echo "Type 'flyway' for a list of available commands"
	exit 2
fi

flyway -user=$USER -password=$PASSWORD  -url=jdbc:mysql://localhost:3306/$DB -locations=filesystem:${PWD}/migration -baselineOnMigrate=true -sqlMigrationSuffix=.sql $1
