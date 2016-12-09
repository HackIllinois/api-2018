#!/bin/bash

source resources/scripts/env.sh test
./node_modules/mocha/bin/mocha test/test.js --slow 500 --bail --check-leaks --full-trace
