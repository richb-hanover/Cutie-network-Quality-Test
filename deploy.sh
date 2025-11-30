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

# Run npm dev with LOG_LEVEL=2 and nohup
# nohup env LOG_LEVEL=2 npm run dev > "$logfile" 2>&1 &

nohup env LOG_LEVEL=2 npm run preview > "$logfile" 2>&1 &
# Use npm run preview --port 5173" # to simulate current "npm run dev"

ip_address=$(ip addr show $(ip route | awk '/default/ { print $5 }') | grep "inet" | head -n 1 | awk '/inet/ {print $2}' | cut -d'/' -f1)

echo "All set! Check at http://$ip_address:4173"
