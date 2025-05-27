# Use the official Jenkins LTS image as base
FROM jenkins/jenkins:lts

# Switch to root user to install packages
USER root

# Install Docker CLI (from previous steps)
RUN apt-get update && \
    apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# Install build tools for node-gyp
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ && \
    rm -rf /var/lib/apt/lists/*

# Switch back to Jenkins user
USER jenkins