FROM node:4.6.2

# ports
EXPOSE 8080

# install flyway command line tool (and java...)
WORKDIR /tmp
RUN  wget https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0.3/flyway-commandline-4.0.3-linux-x64.tar.gz \
		&& tar -xzf flyway-commandline-4.0.3-linux-x64.tar.gz \
		&& mv flyway-4.0.3 /opt/flyway-4.0.3 \
		&& ln -s /opt/flyway-4.0.3/jre/bin/java /usr/local/bin/java \
		&& ln -s /opt/flyway-4.0.3/flyway /usr/local/bin/flyway \
		&& rm -rf /tmp/flyway-* \

# set up the api's working directory
RUN  mkdir /usr/local/api
WORKDIR /usr/local/api

# install dependencies
# (improves build time when no additional modules were added)
COPY ./package.json ./package.json
RUN  npm install

# copy the rest of the api into the container
COPY . .

# launch the api
CMD  ["npm", "run", "prod"]
