#!/bin/sh
#VERSION="nightly"
VERSION="1.0.0-beta.6"
curl "http://code.ionicframework.com/$VERSION/css/ionic.min.css" >ionic.min.css
curl "http://code.ionicframework.com/$VERSION/js/ionic.bundle.min.js" >ionic.bundle.min.js
