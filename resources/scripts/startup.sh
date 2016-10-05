#!/bin/bash
if [ -f config/$1_ENV_CONFIG ]; then
    while read line; do
        [[ "$line" =~ ^#.*$ ]] && continue
        [ -z "$line" ] && continue
        export "$line";
    done < config/$1_ENV_CONFIG
fi
node api.js
