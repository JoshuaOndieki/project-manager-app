#!/bin/bash
json-server --watch tests/testdb.json --port 3000 &
server_pid=$!

# vitest --reporter verbose --coverage ./coverage/coverage.json --coverage-provider istanbul
vitest run --coverage **/*.js --config ./vitest.config.ts

kill $server_pid

exit $?