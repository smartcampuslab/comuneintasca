#!/bin/sh
DATA_WEBAPP_NAME="comuneintasca-oc"

grep "DEVELOPMENT=true" ../js/services/conf.js &>/dev/null
if [ $? == 0 ]; then
  DATA_HOST_NAME="vas-dev"
else
  DATA_HOST_NAME="tn"
fi
echo "host: $DATA_HOST_NAME"

curl -H "Content-Type: application/json" -d '{"updated":{}}' "https://$DATA_HOST_NAME.smartcampuslab.it/$DATA_WEBAPP_NAME/sync?since=0" -o trento.json
if [ $? == 0 ]; then
  PROFILE="opencontent.json"
  echo "profile: $PROFILE"
  node opencontent.js >$PROFILE
fi
