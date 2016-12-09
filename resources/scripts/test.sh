#!/bin/bash

source resources/scripts/env.sh test
mocha test/test.js --slow 500 --bail --check-leaks —full-trace