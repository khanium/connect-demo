#!/usr/bin/env bash

# ***********************************************************************************************************
# deploy-couchbase-project.sh
#
#   Usage: ./deploy-couchbase-project.sh [options]
#
#   This will deploy a new development project with Couchbase on OpenShift environment.
#
#   Options:
#
#     --cluster=<s>           The cluster address (default: localhost)
#     --username=<s>          Cluster Admin or RBAC username (default: Administrator)
#     --password=<s>          Cluster Admin or RBAC password (default: password)
#     --output=<s>            Destination to output the file (default: indexes-build-2018-10-10T09:27:11.csv)
#     --port=<s>              The port to use (default: 8091)
#     --protocol=<s>          The protocol to use (default: http)
# ***********************************************************************************************************

# set the defaults, these can all be overriden as environment variables or passed via the cli
OC_ADMIN_USER=${OC_ADMIN_USER:='kubeadmin'}
OC_ADMIN_PASSWORD=${OC_ADMIN_PASSWORD:='HeJWN-ckbCA-Q96Ds-Sj763'}
OC_API_ADDRESS=${OC_API_ADDRESS:='https://api.crc.testing:6443'}
CB_USERNAME=${CB_USERNAME:='Administrator'}
CB_PASSWORD=${CB_PASSWORD:='password'}
CLUSTER=${CLUSTER:='localhost'}
PORT=${PORT:='8091'}
PROTOCOL=${PROTOCOL:='http'}
TIMEOUT=${TIMEOUT:=5}
OUTPUT_FILE="indexes-build-$(date +"%Y-%m-%dT%H:%M:%S").txt"
CAO_VERSION=${CAO_VERSION:='2.0.2'}
MOBILE_ENABLED=${MOBILE_ENABLED:=false}
APP_PROJECT_DIR=${APP_PROJECT_DIR:='../../backoffice/demo-connect/'}

# parse any cli arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -c|--cluster) CLUSTER=${2} && shift 2;;
    -r|--port) PORT=${2} && shift 2;;
    -s|--protocol) PROTOCOL=${2} && shift 2;;
    -t|--timeout) TIMEOUT=${2} && shift 2;;
    -f|--file) OUTPUT_FILE=${2} && shift 2;;
    -u|--username) CB_USERNAME=${2} && shift 2;;
    -p|--password)
      # if no password was specified prompt for one
      if [[ "${2:-}" == "" || "${2:-}" == --* ]]; then
        stty -echo # disable keyboard input
        read -p "Password: " -r CB_PASSWORD # prompt the user for the password
        stty echo # enable keyboard input
        echo # new line
        tput cuu1 && tput el # clear the previous line
        shift
      else
        CB_PASSWORD="${2}" # set the passed password
        shift 2
      fi
      ;;
    *)
      error "invalid option: '$1'."
      exit 1
      ;;
  esac
done

# make sure jq exists
if [ "$(command -v jq)" = "" ]; then
  echo >&2 "jq command is required, see (https://stedolan.github.io/jq/download)";
  exit 1;
fi


# 1. Login
echo '[1/7] login oc cluster...'
oc login -u $OC_ADMIN_USER -p $OC_ADMIN_PASSWORD $OC_API_ADDRESS

# 2. Checking Previous Installations
echo '[2/7] checking previous installations...'
CRD=$(oc get crd couchbasebuckets.couchbase.com | grep couchbasebuckets.couchbase.com)
if [[ $CRD != couchbasebuckets.couchbase.com* ]]; then
   echo '   - Installing couchbase  CRD..'
   oc create -f $CAO_VERSION/crd.yaml
   echo '   - Installing Couchbase Admission Controller...'
   $CAO_VERSION/bin/cbopcfg --no-operator --image-pull-secret rh-catalog | oc create -f -
fi

# 3. Create Namespaces

dev=$(oc get namespace -o name | egrep "couchbase|apps" | cut -d '-' -f2 | sort -n  | grep -o -E '[0-9]+' | sort -n | tail -1)

if [[ -z $dev ]]; then
  dev=0
  echo '   - no previous namespace found.'
else
  dev=$(echo $dev | sed 's/^0*//')
  echo " my dev is $dev"
fi

dev=$((dev + 1)) 

dev=$(printf "%03d" $dev)
echo " dev: $dev"
db_ns="dev-$dev-couchbase"
app_ns="dev-$dev-apps"

echo "projects: $projects"
echo "[3/7] create development [$db_ns, $app_ns] project..."
echo "   - project: $db_ns"
oc create namespace $db_ns
echo "   - project: $app_ns]" 
oc create namespace $app_ns
oc project $db_ns


# 4. Deploying Couchbase Operator
echo '[4/7] deploying Couchbase operator...'
$CAO_VERSION/bin/cbopcfg --no-admission --image-pull-secret rh-catalog --namespace $db_ns | oc create -n $db_ns -f -

operator_status=""

while [[ $operator_status !=  couchbase-operator* ]]
do
  sleep 2
  operator_status=$(oc get deployments couchbase-operator | grep "1/1")
done

oc get deployments

# 5. Deploying Couchbase Cluster Server
echo '[5/7] deploying Couchbase cluster...'

echo '   - Creating application buckets '
oc create -f configs/dev_01_cluster_buckets.yaml  
oc get CouchbaseBuckets

echo '   - Creating application users '
oc create -f configs/dev_02_cluster_app_users.yaml 
oc create -f configs/dev_03_cluster_sgw_users.yaml  
oc get CouchbaseUsers

echo '   - Deploying Couchbase Cluster'
oc create -f configs/dev_04_cluster_server.yaml

cluster_name=$(oc get couchbasecluster -o yaml | egrep -r "name: *" | sed 's/^.*: //' | head -1)
size=3 # TODO extract number of expected nodes
total=0
last_total=0
echo "         ClusterName: $cluster_name"
echo "              # Pods: $size " 

# wait for completing cluster deployment...
while [ $total -ne $size ]
do
   sleep 2
   total=$(oc get pods | grep $cluster_name | grep 1/1 | grep Running | wc -l)
done

oc get pods

echo ""

# 6. Deploying Applications
echo '[6/7] deploying Applications...'

current_dir=$(echo $PWD)
cd "$APP_PROJECT_DIR"
echo "current dir: $current_dir"
echo "app dir: $APP_PROJECT_DIR"
echo $PWD
oc project $app_ns
mvn package oc:deploy -Popenshift

# TODO check app deployment
oc get pods

cd $current_dir
oc project $db_ns


if [ "$MOBILE_ENABLED" = true ]; then

   # 7. Deploying Mobile 
   echo '[7/7] deploying Mobile Servers/Services...'

   oc create -f configs/dev_05_sync_gateway.yaml

   sgw_name=$(oc get deployment sync-gateway -o yaml | egrep -r "name: *" | sed 's/^.*: //' | head -1)
   size=2
   total=0
   last_total=0
   echo "         Sync GAteway Name: $sgw_name"
   echo "                    # Pods: $size "

   # wait for completing cluster deployment...
   while [ $total -ne $size ]
   do
      sleep 2
      total=$(oc get pods | grep $sgw_name | grep 1/1 | grep Running | wc -l)
   done

   oc get pods

   echo ""

   oc create -f configs/dev_06_sgw_service.yaml

   oc get services sync-gateway-service

fi
