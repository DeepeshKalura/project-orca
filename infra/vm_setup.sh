#!/bin/bash
# This cloud-init script provisions the VM to be a Docker host for Freqtrade.

# --- Log everything for debugging ---
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "--- Installing Docker ---"
apt-get update
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "--- Adding 'freqtrader' user to docker group ---"
usermod -aG docker freqtrader

echo "--- Preparing Freqtrade directories and files ---"
# Run the following as the 'freqtrader' user
sudo -u freqtrader -i <<'EOF'
cd /home/freqtrader
# Create the main directory as per the official docs
mkdir -p ft_userdata/user_data
cd ft_userdata
# Download the standard docker-compose file
curl https://raw.githubusercontent.com/freqtrade/freqtrade/stable/docker-compose.yml -o docker-compose.yml
# Pull the latest Freqtrade image to save time later
docker compose pull
EOF

echo "--- VM setup complete. Ready for Freqtrade configuration. ---"