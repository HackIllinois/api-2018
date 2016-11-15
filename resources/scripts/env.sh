#!/bin/bash

RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'
if [ -f config/$1.config ]; then
	while read line; do
		[[ "$line" =~ ^#.*$ ]] && continue
		[ -z "$line" ] && continue
		eval export "$line";
	done < config/$1.config
else
	if [[ $1 == *"dev"* ]]; then
		echo -e "${RED}Missing a development configuration (dev.config)\n${NC}"
	elif [[ $1 == *"prod"* ]]; then
		echo -e "${RED}Missing a production configuration (prod.config)\n${NC}"
	else
		echo -e "${RED}Missing configuration parameter (specify 'prod' or 'dev')\n${NC}"
	fi
	exit 1
fi
