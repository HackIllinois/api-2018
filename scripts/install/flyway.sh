#!/bin/bash
set -e

curl -o /tmp/flyway.tar.gz -s -S https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0.3/flyway-commandline-4.0.3-linux-x64.tar.gz

sudo mkdir -p /opt/flyway
sudo tar -xf /tmp/flyway.tar.gz -C /opt/flyway --strip-components=1
sudo chmod 755 /opt/flyway/flyway
sudo ln -s /opt/flyway/flyway /usr/local/bin/flyway
