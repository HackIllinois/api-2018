#!/bin/bash
if [ -f ENV_CONFIG ]; then
    while read line; do
        [[ "$line" =~ ^#.*$ ]] && continue
        [ -z "$line" ] && continue
        export "$line";
    done < ENV_CONFIG
fi
node api.js
