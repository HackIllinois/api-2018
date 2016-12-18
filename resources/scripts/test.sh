#!/bin/bash

source resources/scripts/env.sh test
./node_modules/mocha/bin/mocha test/test.js --slow 500 --check-leaks --full-trace
