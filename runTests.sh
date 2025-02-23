#!/bin/bash

docker compose -f docker-compose-e2e.yml up --build --attach e2e-tests

echo "Removendo containers temporários..."
docker compose -f docker-compose-e2e.yml down --volumes --remove-orphans
