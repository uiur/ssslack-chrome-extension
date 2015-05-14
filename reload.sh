#!/bin/bash -e

id=$(chrome-cli list links | grep "chrome://extensions/" | awk '{print $1}' | sed -E "s/^\[([0-9]+)\]$/\1/g")

if [[ -n $id ]] ; then
  chrome-cli reload -t "$id"
else
  chrome-cli open "chrome://extensions"
fi
