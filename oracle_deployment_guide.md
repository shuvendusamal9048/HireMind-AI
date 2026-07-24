# HireMind AI — Oracle Cloud Always Free VM Deployment Guide 🚀

This guide provides step-by-step instructions to deploy **HireMind AI** on an **Oracle Cloud Always Free VM (4 Cores, 24GB RAM, 200GB NVMe SSD)**.

---

## 🛠️ Prerequisites
1. An **Oracle Cloud Account** (Sign up at [oracle.com/cloud/free/](https://www.oracle.com/cloud/free/)).
2. Your **HireMind-AI** GitHub repository URL.

---

## ⚡ Step 1: Create Free Ampere Compute Instance
1. Log in to Oracle Cloud Console -> Navigate to **Instances** -> **Create Instance**.
2. **Name**: `hiremind-production-vm`.
3. **Image**: `Ubuntu 22.04 Minimal`.
4. **Shape**: Click **Change Shape** -> Select **Ampere (ARM)** -> Set **4 OCPUs** and **24 GB RAM** (100% Always Free!).
5. **SSH Key**: Generate or upload your public SSH key to connect to the server.
6. Click **Create**.

---

## 🔓 Step 2: Open Inbound Firewall Ports (HTTP 80 & HTTPS 443)
1. On the Instance details page, click your **Virtual Cloud Network (VCN)** link.
2. Click **Security Lists** -> Click **Default Security List for your VCN**.
3. Click **Add Ingress Rules**:
   - **Source CIDR**: `0.0.0.0/0`
   - **Destination Port Range**: `80, 443, 8000`
   - **Protocol**: `TCP`
4. Click **Add Ingress Rules**.

---

## 🚀 Step 3: Server Setup & One-Command Deployment

Connect to your Oracle VM using SSH:
```bash
ssh ubuntu@YOUR_ORACLE_PUBLIC_IP
```

Run these commands inside your VM:

```bash
# 1. Update OS packages & Install Docker
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git iptables-persistent

# 2. Allow HTTP/HTTPS traffic through Ubuntu UFW Firewall
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
sudo netfilter-persistent save

# 3. Add Ubuntu user to Docker group
sudo usermod -aG docker $USER
newgrp docker

# 4. Clone your HireMind AI Repository
git clone https://github.com/YOUR_GITHUB_USERNAME/HireMind-AI.git
cd HireMind-AI

# 5. Create .env file with production keys
cat <<EOT > .env
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=hiremind_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=12345
JWT_SECRET_KEY=supersecretkey_change_me
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
MAIL_USERNAME=shuvendusamal9048@gmail.com
MAIL_PASSWORD="yvfx ysay xoau uscs"
EOT

# 6. Build and Launch the Entire Production Stack
docker compose up -d --build
```

---

## 🎉 Verification
- Open your browser and navigate to `http://YOUR_ORACLE_PUBLIC_IP`.
- Your **HireMind AI** platform is live, fully proctored, and ready for candidates & HR admins!
- Uploaded candidate PDF resumes will automatically persist inside the `backend_uploads` Docker volume.
