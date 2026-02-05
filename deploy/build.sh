#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

docker build -t registry.teuzcode.hr/sikirevci:latest .
docker push registry.teuzcode.hr/sikirevci:latest
