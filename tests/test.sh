json-server --watch testdb.json --port 3000 &
server_pid=$!
vitest --run --reporter verbose --coverage ./coverage/coverage.json

kill $server_pid

exit $?