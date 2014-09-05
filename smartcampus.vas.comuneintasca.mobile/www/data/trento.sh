#!/bin/sh
curl -H "Content-Type: application/json" -d '{"updated":{}}' "https://vas-dev.smartcampuslab.it/comuneintasca/sync?since=0" -o trento.json
