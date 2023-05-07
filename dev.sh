#!/bin/bash

cp db.json devdb.json

json-server --watch devdb.json --port 3000 &
server_pid=$!

parcel ./src/index.html

# kill $server_pid

exit $?