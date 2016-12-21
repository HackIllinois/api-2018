#!/bin/bash

./database/flyway.sh migrate prod

source resources/scripts/env.sh prod
node api.js
