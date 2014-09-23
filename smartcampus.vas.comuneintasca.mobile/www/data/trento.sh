#!/bin/sh
grep "DEVELOPMENT=true" ../js/services/conf.js &>/dev/null
if [ $? == 0 ]; then
  DATA_HOST_NAME="vas-dev"
else
  DATA_HOST_NAME="tn"
fi
echo "host: $DATA_HOST_NAME"
curl -H "Content-Type: application/json" -d '{"updated":{}}' "https://$DATA_HOST_NAME.smartcampuslab.it/comuneintasca/sync?since=0" -o trento.json
