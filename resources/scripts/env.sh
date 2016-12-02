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
		echo -e "${RED}Missing a development configuration file\nPlease add a file called ${1}.config in the config directory\n${YELLOW}See the 'Configuration' section of the README for more information\n${NC}"
	elif [[ $1 == *"prod"* ]]; then
		echo -e "${RED}Missing a production configuration file\nPlease add a file called ${1}.config in the config directory\n${YELLOW}See the 'Configuration' section of the README for more information\n${NC}"
	elif [[ $1 == *"test"* ]]; then
    		echo -e "${RED}Missing a test configuration file\nPlease add a file called ${1}.config in the config directory\n${YELLOW}See the 'Configuration' section of the README for more information\n${NC}"
    fi
	exit 1
fi
