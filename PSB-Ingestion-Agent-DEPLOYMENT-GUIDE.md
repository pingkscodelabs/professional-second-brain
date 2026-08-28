# PSB-Ingestion-Agent Deployment Guide

Complete deployment, configuration, and operational procedures for PSB-Ingestion-Agent.

---

## Table of Contents

1. [Pre-Deployment Requirements](#pre-deployment-requirements)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Testing & Validation](#testing--validation)
5. [Production Deployment](#production-deployment)
6. [Operational Procedures](#operational-procedures)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Rollback Procedures](#rollback-procedures)
9. [Performance Tuning](#performance-tuning)

---

## Pre-Deployment Requirements

### System Requirements

✅ **Minimum Specs:**
- Node.js 16.x or higher
- 512MB RAM (2GB recommended for batches >500 items)
- 1GB free disk space
- macOS, Linux, or Windows (with WSL)

✅ **Verify Installation:**
```bash
node --version  # v16.0.0 or higher
npm --version   # v8.0.0 or higher
```

### Repository Requirements

✅ **Existing Files Check:**
```bash
# Verify PSB structure exists
ls -d metadata projects skills achievements clients
ls metadata/*.yml

# Verify git repository
git status  # Should show no errors
```

✅ **Backup Existing Data:**
```bash
# Create backup before deployment
tar -czf psb-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  metadata/ projects/ skills/ achievements/ clients/

# Or use git
git tag backup-pre-ingestion-deployment
git branch backup-pre-ingestion-deployment
```

### Dependency Check

✅ **Install Required Packages:**
```bash
npm install js-yaml@4.1.0
npm install --save-dev @types/node typescript
```

✅ **Verify Installation:**
```bash
npm list js-yaml  # Should show 4.1.0+
npx tsc --version # Should show 5.0.0+
```

---

## Installation Steps

### Step 1: Acquire Files

```bash
# Copy extension files to repository root
cd /path/to/professional-second-brain

# Copy core TypeScript files
cp /source/psb-ingestion-agent-core.ts ./
cp /source/psb-ingestion-agent.ts ./
cp /source/psb-ingestion-agent-extension.json ./

# Copy documentation
cp /source/PSB-Ingestion-Agent-*.md ./

# Verify files
ls -lh psb-ingestion-agent*
```

### Step 2: Install Dependencies

```bash
# Install js-yaml
npm install js-yaml@4.1.0

# Verify installation
npm list js-yaml
```

### Step 3: Verify TypeScript Compilation

```bash
# Test compilation (if using TypeScript)
npx tsc psb-ingestion-agent-core.ts --noEmit
npx tsc psb-ingestion-agent.ts --noEmit

# Should complete without errors
```

### Step 4: Initialize Backups

```bash
# Create backup directory
mkdir -p .backups
chmod 700 .backups

# Create initial backup
cp -r metadata .backups/metadata-pre-deployment
cp -r projects .backups/projects-pre-deployment
```

### Step 5: Register with Extension System

```bash
# If using GitHub Copilot extension system
copilot install --extension psb-ingestion-agent-extension.json

# Or add to .github/extensions/
mkdir -p .github/extensions
cp psb-ingestion-agent* .github/extensions/
```

---

## Configuration

### Configuration File (Optional)

**Create `psb-ingestion.config.json`:**
```json
{
  "agent": {
    "verbose": false,
    "root_dir": ".",
    "backup_enabled": true,
    "backup_dir": ".backups"
  },
  "processing": {
    "mode": "batch",
    "quality_threshold": 60,
    "skip_duplicates": true,
    "rollback_on_failure": true,
    "checkpoint_interval": 10
  },
  "git": {
    "auto_commit": false,
    "commit_prefix": "[PSB-Ingestion]"
  },
  "thresholds": {
    "fabrication_risk": 30,
    "confidentiality_risk": 10,
    "completeness_minimum": 50,
    "evidence_coverage_minimum": 40
  }
}
```

### Environment Variables

```bash
# Create .env file
cat > .env << EOF
PSB_INGESTION_VERBOSE=false
PSB_INGESTION_QUALITY_THRESHOLD=60
PSB_INGESTION_AUTO_COMMIT=false
PSB_INGESTION_ROLLBACK_ON_FAILURE=true
PSB_INGESTION_BACKUP_DIR=.backups
EOF

# Export variables
export $(cat .env | xargs)
```

### Customize Thresholds

**Edit in `psb-ingestion-agent.ts`:**

```typescript
// Line ~80: Default configuration
const defaults = {
  mode: 'batch',
  auto_commit: false,
  quality_threshold: 60,        // CUSTOMIZE
  skip_duplicates: true,        // CUSTOMIZE
  rollback_on_failure: true,    // CUSTOMIZE
  verbose: false               // CUSTOMIZE
};
```

### Integration Setup

**If using with psb-onboard-skill:**
```typescript
import { PSBIngestionAgent } from './psb-ingestion-agent';
import { PSBOnboardSkill } from './psb-onboard-extension';

const agent = new PSBIngestionAgent();
const onboard = new PSBOnboardSkill();

// Link skills
agent.setOnboardSkill(onboard);
```

**If using with quality checker:**
```typescript
import { PSBQualityChecker } from './psb-quality-checker';

const checker = new PSBQualityChecker();
agent.setQualityChecker(checker);
```

---

## Testing & Validation

### Unit Testing

**Create `test-ingestion.ts`:**
```typescript
import { PSBIngestionAgent } from './psb-ingestion-agent';

async function testBasicIngestion() {
  console.log('🧪 Test 1: Single item ingestion...');
  
  const agent = new PSBIngestionAgent();
  const result = await agent.ingestSingle(
    "Led team on Kubernetes migration project",
    "projects",
    { quality_threshold: 60 }
  );
  
  console.assert(result.ingestion_result.successful === 1, 'Should have 1 success');
  console.assert(result.created_files.length === 1, 'Should create 1 file');
  console.log('✅ Test 1 passed\n');
}

async function testBatchProcessing() {
  console.log('🧪 Test 2: Batch processing...');
  
  const agent = new PSBIngestionAgent();
  const items = [
    "Project 1 description",
    "Project 2 description",
    "Project 3 description"
  ];
  
  const result = await agent.ingest({
    content_source: 'text',
    content: items,
    category: 'projects',
    mode: 'batch',
    quality_threshold: 50
  });
  
  console.assert(result.ingestion_result.processed === 3, 'Should process 3 items');
  console.log('✅ Test 2 passed\n');
}

async function testCSVImport() {
  console.log('🧪 Test 3: CSV import...');
  
  const agent = new PSBIngestionAgent();
  const csv_data = `category,content
projects,Project description
skills,Skill description`;
  
  const result = await agent.ingest({
    content_source: 'csv',
    content: csv_data,
    category: 'all',
    quality_threshold: 50
  });
  
  console.assert(result.ingestion_result.successful > 0, 'Should have successes');
  console.log('✅ Test 3 passed\n');
}

async function runTests() {
  try {
    await testBasicIngestion();
    await testBatchProcessing();
    await testCSVImport();
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
```

**Run tests:**
```bash
npx ts-node test-ingestion.ts
```

### Integration Testing

```bash
# Test 1: Create sample content
cat > test-content.txt << 'EOF'
Led migration of 150 microservices to Kubernetes
Reduced infrastructure costs by 40%
Implemented CI/CD pipeline with ArgoCD
5+ years Kubernetes experience
Expert in cloud architecture
EOF

# Test 2: Run ingestion
npx ts-node -e "
import { PSBIngestionAgent } from './psb-ingestion-agent';
const agent = new PSBIngestionAgent();
agent.setVerbose(true);
agent.ingest({
  content_source: 'file',
  content: ['test-content.txt'],
  category: 'all',
  quality_threshold: 50
}).then(r => console.log('Result:', r));
"

# Test 3: Verify output
ls -la projects/
ls -la skills/
```

### Validation Checklist

✅ **Pre-Production Validation:**
- [ ] Dependencies installed correctly
- [ ] TypeScript compiles without errors
- [ ] Basic single-item ingestion works
- [ ] Batch processing handles 50+ items
- [ ] CSV import parses correctly
- [ ] JSON import works
- [ ] Metadata files updated
- [ ] Git commits work (if enabled)
- [ ] Quality scoring produces reasonable values
- [ ] Duplicate detection activates
- [ ] Error handling works
- [ ] Rollback checkpoint created
- [ ] Audit trail generated

---

## Production Deployment

### Pre-Deployment Checklist

```bash
# 1. Final backup
tar -czf backup-pre-production-$(date +%Y%m%d).tar.gz \
  metadata/ projects/ skills/ achievements/ clients/

# 2. Create git branch
git checkout -b ingestion-deployment
git tag deployment-pre-ingestion

# 3. Final validation
npx ts-node test-ingestion.ts

# 4. Check disk space
df -h | grep "/$"  # Need at least 1GB free

# 5. Check system load
uptime  # Should be reasonable
```

### Deployment Command

```bash
# Set deployment mode
export DEPLOYMENT_ENV=production
export PSB_INGESTION_QUALITY_THRESHOLD=70

# Create initial checkpoint
mkdir -p .backups
git stash

# Deploy files
cp psb-ingestion-agent* ./

# Stage files
git add psb-ingestion-agent*
git commit -m "Deploy PSB-Ingestion-Agent v1.0"

# Create deployment tag
git tag -a ingestion-deployment-v1.0 -m "PSB-Ingestion-Agent deployment"

# Push to remote (if using)
git push origin ingestion-deployment
git push origin ingestion-deployment-v1.0
```

### Post-Deployment Validation

```bash
# 1. Verify files present
ls -la psb-ingestion-agent*

# 2. Test basic functionality
npx ts-node -e "
import { PSBIngestionAgent } from './psb-ingestion-agent';
new PSBIngestionAgent().getStatistics().then(s => console.log('Stats:', s));
"

# 3. Check metadata
cat metadata/projects.yml | head -10

# 4. Verify git history
git log --oneline | head -5
```

---

## Operational Procedures

### Daily Operations

#### Morning Checklist

```bash
#!/bin/bash
# Daily operations checklist

echo "📋 PSB-Ingestion Daily Checklist"
echo "================================"

# 1. Check disk space
echo -n "💾 Disk space: "
df -h / | tail -1 | awk '{print $4 " free (" $5 " used)"}'

# 2. Verify backup
echo -n "💾 Backups: "
ls -1 .backups/ | wc -l
echo " checkpoints"

# 3. Check metadata consistency
echo "📊 Repository status:"
echo "  Projects: $(grep -c '^  - name:' metadata/projects.yml 2>/dev/null || echo 0)"
echo "  Skills: $(grep -c '^  - name:' metadata/skills.yml 2>/dev/null || echo 0)"

# 4. Check git status
echo "📈 Git status:"
git status -s | head -5
```

#### Regular Import Process

```bash
#!/bin/bash
# Standard ingestion process

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
SOURCE_FILE="import_$TIMESTAMP.csv"

# 1. Prepare content
echo "Preparing content..."
# (Populate $SOURCE_FILE with content)

# 2. Create backup
echo "Creating backup..."
mkdir -p .backups
cp -r metadata .backups/metadata-$TIMESTAMP
git stash

# 3. Run ingestion
echo "Running ingestion..."
npx ts-node -e "
import { PSBIngestionAgent } from './psb-ingestion-agent';
const agent = new PSBIngestionAgent();
agent.setVerbose(true);
agent.ingestFromCSV('$SOURCE_FILE', {
  quality_threshold: 65,
  auto_commit: false
}).then(r => {
  console.log('Results:', r.ingestion_result);
  if (r.ingestion_result.failed > 0) {
    console.log('Issues:', r.issues);
  }
});
"

# 4. Review results
echo "Review results above"

# 5. Manual commit
git add metadata/ projects/ skills/ achievements/ clients/
git commit -m "[PSB-Ingestion] Bulk import $TIMESTAMP"
```

### Monitoring Ingestion Operations

```typescript
async function monitorIngestion(batchSize = 100) {
  const agent = new PSBIngestionAgent();
  agent.setVerbose(true);
  
  const items = getItemsToIngest();
  
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    
    console.log(`\n📊 Processing chunk ${Math.floor(i / batchSize) + 1}...`);
    
    const result = await agent.ingest({
      content_source: 'text',
      content: chunk,
      category: 'projects',
      quality_threshold: 65
    });
    
    // Log metrics
    console.log(`  ✓ Success: ${result.ingestion_result.successful}/${result.ingestion_result.processed}`);
    console.log(`  ⚠️  Warnings: ${result.ingestion_result.warnings}`);
    console.log(`  ❌ Failed: ${result.ingestion_result.failed}`);
    
    // Wait between chunks
    await sleep(5000);
  }
}
```

---

## Monitoring & Maintenance

### Key Metrics to Track

1. **Success Rate**: Target >95%
   ```bash
   successful_count / total_count
   ```

2. **Average Quality Score**: Target >70
   ```bash
   sum(quality_scores) / count
   ```

3. **Processing Speed**: Target 1-2 items/second
   ```bash
   total_time / item_count
   ```

4. **Duplicate Detection Rate**: Monitor (no target)
   ```bash
   duplicates_detected / total_items
   ```

### Maintenance Tasks

#### Weekly

```bash
#!/bin/bash
# Weekly maintenance

echo "🔧 Weekly Maintenance"

# 1. Audit quality scores
echo "Checking quality scores..."
find projects -name "*.md" -type f | wc -l
echo "Projects in repository"

# 2. Check for orphaned files
echo "Scanning for orphaned references..."
# (Compare metadata files with actual files)

# 3. Verify backups
echo "Verifying backups..."
ls -lhS .backups/ | head -10

# 4. Clean old backups (keep last 30)
echo "Cleaning old backups..."
ls -t .backups/ | tail -n +31 | xargs -r rm -rf
```

#### Monthly

```bash
#!/bin/bash
# Monthly maintenance

echo "🔧 Monthly Maintenance"

# 1. Full consistency check
echo "Running consistency checks..."
# Verify all metadata entries have corresponding files
# Verify all files have metadata entries

# 2. Performance baseline
echo "Collecting performance metrics..."
# Average processing time
# Success rate trends
# Quality score trends

# 3. Update documentation
echo "Reviewing documentation..."
# Check for outdated procedures
# Review FAQ for new issues

# 4. Archive old checkpoints
echo "Archiving old checkpoints..."
find .backups -mtime +30 -exec tar -czf {}.tar.gz {} \;
```

### Health Check Script

```typescript
import { PSBIngestionAgent } from './psb-ingestion-agent';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function healthCheck() {
  console.log('🏥 PSB-Ingestion Health Check\n');
  
  const agent = new PSBIngestionAgent();
  let issues = 0;
  
  // 1. Check files
  console.log('📁 Files:');
  const required_files = [
    'psb-ingestion-agent-core.ts',
    'psb-ingestion-agent.ts',
    'psb-ingestion-agent-extension.json'
  ];
  
  for (const file of required_files) {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      issues++;
    }
  }
  
  // 2. Check metadata files
  console.log('\n📊 Metadata:');
  const metadata_files = ['projects.yml', 'skills.yml', 'achievements.yml', 'clients.yml'];
  
  for (const file of metadata_files) {
    const path = `metadata/${file}`;
    if (fs.existsSync(path)) {
      const data = yaml.load(fs.readFileSync(path, 'utf-8')) as any;
      const count = Object.values(data)[0]?.length || 0;
      console.log(`  ✅ ${file}: ${count} entries`);
    } else {
      console.log(`  ⚠️  ${file} - not found`);
    }
  }
  
  // 3. Check repository status
  console.log('\n📈 Repository:');
  const stats = await agent.getStatistics();
  console.log(`  Projects: ${stats.projects || 0}`);
  console.log(`  Skills: ${stats.skills || 0}`);
  console.log(`  Achievements: ${stats.achievements || 0}`);
  console.log(`  Clients: ${stats.clients || 0}`);
  
  // 4. Check backups
  console.log('\n💾 Backups:');
  const backup_count = fs.readdirSync('.backups/').length;
  console.log(`  Checkpoints: ${backup_count}`);
  
  // Results
  console.log(`\n${issues === 0 ? '✅ HEALTHY' : '⚠️  ISSUES FOUND'}\n`);
}

healthCheck().catch(console.error);
```

---

## Rollback Procedures

### Rollback to Backup

```bash
#!/bin/bash
# Rollback to previous state

BACKUP_DATE="${1:-latest}"

if [ "$BACKUP_DATE" = "latest" ]; then
  BACKUP=$(ls -t .backups/metadata-* | head -1 | xargs -n1 basename)
else
  BACKUP="metadata-$BACKUP_DATE"
fi

if [ -z "$BACKUP" ]; then
  echo "❌ No backup found"
  exit 1
fi

echo "🔄 Rolling back to $BACKUP..."

# 1. Stash current changes
git stash

# 2. Restore from backup
cp -r ".backups/$BACKUP" metadata/

# 3. Verify restore
echo "✅ Restored from $BACKUP"

# 4. Manual commit
git add metadata/
git commit -m "Rollback: Restored from $BACKUP"

echo "✅ Rollback complete"
```

### Partial Rollback

```bash
#!/bin/bash
# Rollback specific metadata file

FILE="${1:-projects}"
BACKUP_DATE="${2:-latest}"

BACKUP_FILE=".backups/metadata-$BACKUP_DATE/$FILE.yml"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Backup not found: $BACKUP_FILE"
  exit 1
fi

echo "🔄 Rolling back $FILE.yml..."
cp "$BACKUP_FILE" "metadata/$FILE.yml"
echo "✅ Rollback complete"
```

---

## Performance Tuning

### Memory Optimization

For large batches (>500 items):

```typescript
// Process in chunks instead of all at once
const chunk_size = 100;

for (let i = 0; i < items.length; i += chunk_size) {
  const chunk = items.slice(i, i + chunk_size);
  
  const result = await agent.ingest({
    content_source: 'text',
    content: chunk,
    category: 'projects'
  });
  
  // Allow garbage collection between chunks
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

### Speed Optimization

For time-sensitive operations:

```typescript
// Reduce validation overhead
const result = await agent.ingest({
  content_source: 'csv',
  content: csv_data,
  quality_threshold: 40,  // Lower = faster
  skip_duplicates: false  // Skip comparison = faster
});
```

### Disk I/O Optimization

```bash
# Use SSD if possible
# Pre-allocate space
fallocate -l 1G projects/

# Monitor I/O
iostat -x 1
```

---

## Support & Troubleshooting

### Getting Help

```bash
# View logs
tail -100 ingestion.log

# Test connectivity
git status
npm list js-yaml

# Check system resources
free -h
df -h
top -b -n 1
```

### Escalation Path

1. **Check documentation**
   - PSB-Ingestion-Agent-README.md
   - PSB-Ingestion-Agent-QUICK-START.md

2. **Review logs and issues**
   - Check audit trail in result object
   - Review error messages

3. **Contact support**
   - Document the issue
   - Provide configuration used
   - Share relevant logs (sanitized)

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0  
**Status**: Production Ready
