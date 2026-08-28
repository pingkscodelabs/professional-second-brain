# PSB CV Agent - Deployment Guide

## Deployment Overview

This guide covers deployment strategies for the PSB CV Agent across various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Deployment](#local-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Systemd Service](#systemd-service)
6. [Production Checklist](#production-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Scaling Strategies](#scaling-strategies)

---

## Prerequisites

### System Requirements

| Component | Requirement |
|-----------|-------------|
| OS | Linux, macOS, Windows |
| Node.js | 16.0.0 or higher |
| npm | 7.0.0 or higher |
| Disk Space | 500MB minimum |
| RAM | 512MB minimum |
| Network | Access to CV Builder Skill endpoint |

### Dependencies

```bash
# Core
npm install js-yaml pdfkit markdown-it

# Development
npm install --save-dev typescript ts-node @types/node jest @types/jest

# Optional (for HTTP server)
npm install express cors dotenv
```

### Environment Setup

```bash
# Create directory structure
mkdir -p /opt/psb-cv-agent/{storage,logs,config,cache}
mkdir -p /opt/psb-cv-agent/storage/{cvs,history,analytics}
mkdir -p /opt/psb-cv-agent/logs/{agent,errors}

# Set permissions
chmod -R 755 /opt/psb-cv-agent
chmod -R 755 /opt/psb-cv-agent/storage
chmod -R 755 /opt/psb-cv-agent/logs
```

---

## Local Deployment

### Step 1: Install and Build

```bash
# Navigate to PSB directory
cd /opt/psb-cv-agent

# Copy files
cp psb-cv-agent.ts ./
cp psb-cv-agent-config.yaml ./config/
cp psb-cv-agent-package.json ./package.json

# Install dependencies
npm ci

# Build TypeScript
npx tsc psb-cv-agent.ts --target ES2020 --module commonjs --outDir dist

# Verify build
ls -la dist/psb-cv-agent.js
```

### Step 2: Configure

```bash
# Edit configuration
nano config/psb-cv-agent-config.yaml

# Key settings to customize:
# - cvDirectory: /opt/psb-cv-agent/storage/cvs
# - logDirectory: /opt/psb-cv-agent/logs
# - cvBuilder.endpoint: http://localhost:3000
```

### Step 3: Test

```bash
# Test basic functionality
node dist/psb-cv-agent.js --test

# Test CV generation
npm test

# Check configuration
node -e "const yaml = require('js-yaml'); const fs = require('fs'); console.log(JSON.stringify(yaml.load(fs.readFileSync('config/psb-cv-agent-config.yaml', 'utf8')), null, 2));"
```

### Step 4: Run Locally

```bash
# Development mode with watch
npm run dev

# Production mode
npm start

# In background
nohup npm start > logs/cv-agent.log 2>&1 &
```

---

## Docker Deployment

### Build Docker Image

Create Dockerfile:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl

# Copy files
COPY psb-cv-agent.ts package.json package-lock.json ./
COPY psb-cv-agent-config.yaml ./config/

# Install dependencies
RUN npm ci --only=production

# Build TypeScript
RUN npx tsc psb-cv-agent.ts --target ES2020 --module commonjs --outDir dist

# Create directories
RUN mkdir -p storage/cvs storage/history storage/analytics logs

# Expose port (if using HTTP server)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/psb-cv-agent.js"]
```

### Build Image

```bash
# Build
docker build -t psb-cv-agent:latest .

# Tag
docker tag psb-cv-agent:latest psb-cv-agent:1.0.0

# Verify
docker images | grep psb-cv-agent
```

### Run Container

```bash
# Basic run
docker run -d \
  --name psb-cv-agent \
  -p 3000:3000 \
  -v $(pwd)/storage:/app/storage \
  -v $(pwd)/logs:/app/logs \
  psb-cv-agent:latest

# With environment variables
docker run -d \
  --name psb-cv-agent \
  -p 3000:3000 \
  -e CV_BUILDER_ENDPOINT=http://cv-builder:3000 \
  -e LOG_LEVEL=info \
  -v $(pwd)/storage:/app/storage \
  -v $(pwd)/logs:/app/logs \
  psb-cv-agent:latest

# With resource limits
docker run -d \
  --name psb-cv-agent \
  --memory="512m" \
  --cpus="1" \
  -p 3000:3000 \
  -v $(pwd)/storage:/app/storage \
  -v $(pwd)/logs:/app/logs \
  psb-cv-agent:latest
```

### Docker Compose

Create docker-compose.yml:

```yaml
version: '3.8'

services:
  psb-cv-agent:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: psb-cv-agent
    ports:
      - "3000:3000"
    environment:
      - CV_BUILDER_ENDPOINT=http://psb-cv-builder:3000
      - LOG_LEVEL=info
      - NODE_ENV=production
    volumes:
      - ./storage:/app/storage
      - ./logs:/app/logs
      - ./config:/app/config
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  psb-cv-builder:
    image: psb-cv-builder:latest
    container_name: psb-cv-builder
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Deploy with Compose

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f psb-cv-agent

# Stop services
docker-compose down

# Clean up
docker-compose down -v
```

---

## Kubernetes Deployment

### Create Deployment Manifest

Create deployment.yaml:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: psb-cv-agent-config
  namespace: default
data:
  psb-cv-agent-config.yaml: |
    agent:
      name: PSB CV Agent
      version: 1.0.0
    storage:
      cvDirectory: /data/cvs
      historyDirectory: /data/history
      analyticsDirectory: /data/analytics
    cvBuilder:
      endpoint: http://psb-cv-builder:3000
      timeout: 30000

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: psb-cv-agent
  namespace: default
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: psb-cv-agent
  template:
    metadata:
      labels:
        app: psb-cv-agent
        version: "1.0.0"
    spec:
      containers:
      - name: psb-cv-agent
        image: psb-cv-agent:1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: CV_BUILDER_ENDPOINT
          value: "http://psb-cv-builder:3000"
        - name: LOG_LEVEL
          value: "info"
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 1000m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
        volumeMounts:
        - name: storage
          mountPath: /data
        - name: config
          mountPath: /app/config
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: psb-cv-agent-storage
      - name: config
        configMap:
          name: psb-cv-agent-config

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: psb-cv-agent-storage
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi

---
apiVersion: v1
kind: Service
metadata:
  name: psb-cv-agent
  namespace: default
spec:
  type: ClusterIP
  ports:
  - port: 3000
    targetPort: 3000
    protocol: TCP
  selector:
    app: psb-cv-agent

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: psb-cv-agent-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: psb-cv-agent
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f deployment.yaml

# Check deployment status
kubectl get deployment psb-cv-agent
kubectl get pods -l app=psb-cv-agent

# Check service
kubectl get service psb-cv-agent

# View logs
kubectl logs -f deployment/psb-cv-agent

# Scale manually
kubectl scale deployment psb-cv-agent --replicas=5

# Monitor
kubectl top pods -l app=psb-cv-agent
kubectl describe pod psb-cv-agent-xxxxx
```

---

## Systemd Service

### Create Service File

Create /etc/systemd/system/psb-cv-agent.service:

```ini
[Unit]
Description=PSB CV Agent Service
After=network.target
Wants=network-online.target
Documentation=https://github.com/professional-second-brain/psb-cv-agent

[Service]
Type=simple
User=psb
Group=psb
WorkingDirectory=/opt/psb-cv-agent

# Environment
Environment="NODE_ENV=production"
Environment="CV_BUILDER_ENDPOINT=http://localhost:3000"
EnvironmentFile=/etc/psb-cv-agent/env

# Start command
ExecStart=/usr/bin/node /opt/psb-cv-agent/dist/psb-cv-agent.js

# Auto-restart on failure
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/opt/psb-cv-agent/storage /opt/psb-cv-agent/logs

# Resource limits
LimitNOFILE=65535
MemoryLimit=512M

[Install]
WantedBy=multi-user.target
```

### Enable and Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable psb-cv-agent

# Start service
sudo systemctl start psb-cv-agent

# Check status
sudo systemctl status psb-cv-agent

# View logs
sudo journalctl -u psb-cv-agent -f

# Stop service
sudo systemctl stop psb-cv-agent

# Restart
sudo systemctl restart psb-cv-agent
```

---

## Production Checklist

### Pre-Deployment

- [ ] Code reviewed and tested
- [ ] TypeScript compiled without errors
- [ ] All dependencies installed
- [ ] Configuration file reviewed and customized
- [ ] Storage directories created with correct permissions
- [ ] Logging configuration set up
- [ ] Health checks configured
- [ ] Security settings reviewed

### Deployment

- [ ] Environment variables set correctly
- [ ] CV Builder Skill endpoint verified
- [ ] Database/storage backend ready
- [ ] Network connectivity tested
- [ ] SSL/TLS certificates installed (if applicable)
- [ ] Firewall rules configured
- [ ] Load balancer configured (if applicable)
- [ ] Backup strategy in place

### Post-Deployment

- [ ] Service started and running
- [ ] Health checks passing
- [ ] Logs being written correctly
- [ ] Monitoring and alerting configured
- [ ] Performance baselines established
- [ ] Rollback plan documented
- [ ] Team trained on operations

### Security

- [ ] API authentication configured
- [ ] Rate limiting enabled
- [ ] Data encryption configured
- [ ] Secrets management in place
- [ ] Audit logging enabled
- [ ] Access controls configured
- [ ] Regular backups scheduled
- [ ] Security scanning configured

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check service health
curl http://localhost:3000/health

# Check configuration
curl http://localhost:3000/config

# Check metrics
curl http://localhost:3000/metrics
```

### Log Monitoring

```bash
# View recent logs
tail -f logs/cv-agent.log

# Search for errors
grep ERROR logs/cv-agent.log

# Analyze performance
grep generation_time logs/cv-agent.log | tail -100
```

### Performance Monitoring

```bash
# Monitor memory usage
watch -n 1 'ps aux | grep psb-cv-agent'

# Monitor disk usage
du -sh storage/
du -sh logs/

# Monitor network connections
netstat -tupn | grep 3000
```

### Maintenance Tasks

```bash
# Cleanup old logs (older than 30 days)
find logs -type f -mtime +30 -delete

# Cleanup old analytics (older than 90 days)
find storage/analytics -type f -mtime +90 -delete

# Backup data
tar -czf backup-$(date +%Y%m%d).tar.gz storage/

# Verify integrity
npm test

# Update dependencies
npm update

# Security audit
npm audit
```

---

## Scaling Strategies

### Horizontal Scaling

```bash
# Scale out with multiple instances
# Use load balancer to distribute requests across instances
# Each instance maintains separate storage or use shared storage

# Docker example
docker run -d --name psb-cv-agent-1 -p 3001:3000 psb-cv-agent:latest
docker run -d --name psb-cv-agent-2 -p 3002:3000 psb-cv-agent:latest
docker run -d --name psb-cv-agent-3 -p 3003:3000 psb-cv-agent:latest

# Use nginx or HAProxy for load balancing
```

### Vertical Scaling

```bash
# Increase resources for single instance
# Increase max parallel generations
# Increase memory and CPU allocation
# Optimize batch processing

# In config.yaml
performance:
  maxParallelGenerations: 10  # Increase from 5
```

### Caching Strategy

```yaml
# Enable caching for repeated requests
performance:
  cacheEnabled: true
  cacheTTL: 3600  # 1 hour

# Clear cache when needed
node -e "require('./psb-cv-agent.js').clearCache();"
```

### Database Optimization

```bash
# Regular cleanup
node -e "require('./psb-cv-agent.js').cleanupOldData({days: 90});"

# Archive old data
tar -czf archive-$(date +%Y%m%d).tar.gz cv-history/
rm -rf cv-history/*
```

---

## Rollback Procedures

### Before Deployment

1. Create backup of current version
2. Document current configuration
3. Test rollback procedure

### Rollback Steps

```bash
# Stop new version
sudo systemctl stop psb-cv-agent

# Restore previous version
cp dist.backup/psb-cv-agent.js dist/

# Restore configuration
cp config.backup/psb-cv-agent-config.yaml config/

# Start service
sudo systemctl start psb-cv-agent

# Verify
curl http://localhost:3000/health
```

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/psb-cv-agent

# Rollback to previous version
kubectl rollout undo deployment/psb-cv-agent

# Rollback to specific revision
kubectl rollout undo deployment/psb-cv-agent --to-revision=2

# Check status
kubectl rollout status deployment/psb-cv-agent
```

---

## Support & Troubleshooting

For issues during deployment, refer to:
- [README.md](PSB-CV-Agent-README.md) - Troubleshooting section
- [QUICK-START.md](PSB-CV-Agent-QUICK-START.md) - Common issues
- Project repository for issue tracking

---

**Deployment complete! Monitor the service and refer to [Monitoring & Maintenance](#monitoring--maintenance) for ongoing operations.**
