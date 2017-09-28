#!/bin/bash
export NODE_ENV=test
./node_modules/eslint/bin/eslint.js --cache --fix api.js api test \
&& ./node_modules/mocha/bin/mocha test/test.js --reporter dot --slow 500 --check-leaks --full-trace
