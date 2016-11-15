FROM node:4.6.2

# ports
EXPOSE 8080

# set the working directory
RUN  mkdir /usr/local/api
WORKDIR /usr/local/api

# install dependencies
# (improves build time when no additional modules were added)
COPY ./package.json ./package.json
RUN  npm install

# copy the the api into the container
COPY . .

# launch the api
CMD  ["npm", "run", "prod"]
