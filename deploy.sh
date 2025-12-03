#! /bin/bash
# "One button" deploy script to roll out new version
# Pull the new repo from Github
# Request credentials to read from private repo

# To run this script:
#   ssh deploy@...
#   cd /src/Cutie-network-
#   sudo sh deploy.sh

# add NVM so that yarn can find node (oh the tangled we we weave...)
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Retrieve newest files from the repo
#     - supply user name (richb-hanover)
#     - supply Personal Access Token
git pull

# pull all the dependencies
npm install

# build the app
npm run build

# Create timestamp in format yyyy-mm-dd-hh-mm-ss
timestamp=$(date +"%Y-%m-%d-%H-%M-%S")
# Log file name - save all the log files into the "logs" directory
logfile="logs/cutie-$timestamp.txt"

# get this host's IP address & and desired test port
ip_address="$(ip -4 route get 1.1.1.1 | awk '/src/ { print $NF; exit }')"
ip_port=5173

nohup env LOG_LEVEL=2 npm run preview -- --host "$ip_address" --port "$ip_port"  > "$logfile" 2>&1 &

echo "All set! Check at http://$ip_address:$ip_port"
