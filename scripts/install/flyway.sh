#!/bin/bash
set -e

curl -o /tmp/flyway.tar.gz -s -S https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0.3/flyway-commandline-4.0.3-linux-x64.tar.gz

mkdir -p /opt/flyway
tar -xf /tmp/flyway.tar.gz -C /opt/flyway --strip-components=1
chmod 755 /opt/flyway/flyway
ln -s /opt/flyway/flyway ~/bin/flyway