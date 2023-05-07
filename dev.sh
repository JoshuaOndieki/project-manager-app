#!/bin/bash

cp db.json devdb.json

json-server --watch devdb.json --port 3000 &

parcel ./src/index.html

exit $?