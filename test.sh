#!/bin/bash

cp db.json testdb.json

json-server --watch testdb.json --port 3000 &
server_pid=$!

jest --coverage

kill $server_pid

exit $?