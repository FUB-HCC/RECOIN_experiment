#!/bin/bash

# DB_PATH="/srv/$VM_NAME/data"

# GID=$(getent group web_ideas-to-market | cut -d: -f3)
# umask 002
# -u $UID:$GID

DB_PATH=/home/mackeprm/tmp/RECOINDB

mkdir -p $DB_PATH

docker run \
-p 8080:3000 \
-v $DB_PATH:/database \
 -t git.imp.fu-berlin.de:5000/jbenjamin/ikon/recoin-experiment:latest
