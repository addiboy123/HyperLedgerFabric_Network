
docker compose -f ./artifacts/docker-compose.fabric.yml up -d

sleep 5
./createChannel.sh

sleep 2

./deployChaincode.sh

sleep 2
docker compose -f ./artifacts/docker-compose.app.yml up -d
