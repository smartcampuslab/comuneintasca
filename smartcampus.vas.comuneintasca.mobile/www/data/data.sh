#!/bin/sh
DATA_WEBAPP_NAME="comuneintasca-multi"
DATA_WEBAPP_MULTI="RicadiInTasca"

grep "var DEVELOPMENT=true;" ../js/services/conf.js &>/dev/null
if [ $? == 0 ]; then
  DATA_HOST_NAME="vas-dev"
else
  DATA_HOST_NAME="tn"
fi
echo "host: $DATA_HOST_NAME"

curl -H "Content-Type: application/json" -d '{"updated":{}}' "https://$DATA_HOST_NAME.smartcommunitylab.it/$DATA_WEBAPP_NAME/sync/$DATA_WEBAPP_MULTI?since=0" -o data.json
if [ $? == 0 ]; then
  PROFILE="opencontent.json"
  echo "profile: $PROFILE"
  node opencontent.js >$PROFILE
fi
