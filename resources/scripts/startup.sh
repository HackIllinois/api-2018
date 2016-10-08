#!/bin/bash
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'
if [ -f config/$1_ENV_CONFIG ]; then
    while read line; do
        [[ "$line" =~ ^#.*$ ]] && continue
        [ -z "$line" ] && continue
        export "$line";
    done < config/$1_ENV_CONFIG
else
    echo -e "${RED}Missing a ${1} configuration file\nPlease add a file called ${1}_ENV_CONFIG in the config directory\n${YELLOW}Take a look at config/${1}_ENV_CONFIG.template for an example on how the structure the file${NC}"
    exit 1
fi
node api.js
