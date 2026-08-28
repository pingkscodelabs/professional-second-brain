# PSB-Ingestion-Agent Quick Start Guide

Get up and running with PSB-Ingestion-Agent in 5 minutes.

---

## Installation

### 1. Install Dependencies

```bash
cd /path/to/professional-second-brain
npm install js-yaml
```

### 2. Verify Files Are Present

```bash
# Check that these files exist:
ls -1 psb-ingestion-agent*.ts
ls -1 psb-ingestion-agent-extension.json
```

---

## 5-Minute Tutorial

### Step 1: Single Item Ingestion

```typescript
import { PSBIngestionAgent } from './psb-ingestion-agent';

const agent = new PSBIngestionAgent();

const result = await agent.ingestSingle(
  "Led migration of 150 microservices to Kubernetes, reducing infrastructure costs by 40% and improving deployment time from 2 hours to 15 minutes",
  "projects"
);

console.log(`✓ Ingested: ${result.ingestion_result.successful} items`);
console.log(`✓ Quality Score: ${result.created_files[0]?.quality_score}`);
console.log(`✓ File Created: ${result.created_files[0]?.path}`);
```

**Output:**
```
✓ Ingested: 1 items
✓ Quality Score: 85
✓ File Created: projects/kubernetes/kubernetes-migration.md
```

### Step 2: Batch Ingestion from Text File

**Create `content.txt`:**
```
Led 5-person team on Kubernetes migration project at FinTech startup
Architected microservices platform using Docker, Kubernetes, and Terraform
Optimized cloud infrastructure costs by 40% through containerization
Implemented CI/CD pipeline using ArgoCD and GitHub Actions
5+ years experience with Kubernetes
Expert in cloud architecture and DevOps
AWS certified solutions architect
Led team through agile transformation
```

**Ingest it:**
```typescript
const result = await agent.ingest({
  content_source: 'file',
  content: ['content.txt'],
  category: 'projects',
  mode: 'batch',
  quality_threshold: 60,
  skip_duplicates: true,
  verbose: true
});

console.log(`✓ Processed: ${result.ingestion_result.processed}`);
console.log(`✓ Successful: ${result.ingestion_result.successful}`);
console.log(`✓ Created: ${result.created_files.length} files`);
```

### Step 3: CSV Batch Import

**Create `bulk_import.csv`:**
```csv
category,content
projects,Led Kubernetes migration project at fintech startup
projects,Architected microservices platform using Docker
skills,Kubernetes (5+ years)
skills,AWS (certified solutions architect)
skills,Terraform (infrastructure as code)
achievements,Reduced infrastructure costs by 40%
achievements,Improved deployment time from 2 hours to 15 minutes
clients,FinTech startup - 2 year engagement
```

**Ingest it:**
```typescript
const result = await agent.ingestFromCSV('bulk_import.csv', {
  quality_threshold: 65,
  auto_commit: false
});

console.log(`✓ Imported: ${result.ingestion_result.successful} items`);
console.log(`✓ Issues: ${result.issues.length}`);
result.issues.forEach(issue => {
  console.log(`  - ${issue.message}`);
});
```

### Step 4: JSON Batch Import

**Create `bulk_import.json`:**
```json
[
  {
    "category": "projects",
    "content": "Led team of 5 on Kubernetes migration project, reducing costs by 40%"
  },
  {
    "category": "achievements",
    "content": "Improved deployment time from 2 hours to 15 minutes"
  },
  {
    "category": "skills",
    "content": "5+ years experience with Kubernetes and cloud architecture"
  },
  {
    "category": "clients",
    "content": "Fintech startup - 2 year engagement building microservices platform"
  }
]
```

**Ingest it:**
```typescript
const result = await agent.ingestFromJSON('bulk_import.json', {
  quality_threshold: 70,
  auto_commit: false
});

console.log(`✓ Imported: ${result.ingestion_result.successful} items`);
```

### Step 5: Check Status

```typescript
const stats = await agent.getStatistics();

console.log('Repository Statistics:');
console.log(`  Projects: ${stats.projects}`);
console.log(`  Skills: ${stats.skills}`);
console.log(`  Achievements: ${stats.achievements}`);
console.log(`  Clients: ${stats.clients}`);
```

---

## Common Recipes

### Recipe 1: Import Your CV

Convert your CV into structured PSB entries:

```typescript
import fs from 'fs';

// Read CV text
const cv_text = fs.readFileSync('my_cv.txt', 'utf-8');

// Split by sections (modify as needed)
const projects = cv_text.match(/PROJECTS:(.*?)SKILLS:/s)[1];
const skills = cv_text.match(/SKILLS:(.*?)EXPERIENCE:/s)[1];
const experience = cv_text.match(/EXPERIENCE:(.*?)$/s)[1];

// Ingest each section
const project_result = await agent.ingestSingle(projects, 'projects');
const skill_result = await agent.ingestSingle(skills, 'skills');
const exp_result = await agent.ingestSingle(experience, 'achievements');

console.log('✓ CV imported successfully!');
```

### Recipe 2: Bulk Import with Retry

Automatically retry failed items:

```typescript
const items = ['item1', 'item2', 'item3', ...];
let failed = [];

const result = await agent.ingest({
  content_source: 'text',
  content: items,
  category: 'projects'
});

// Collect failed items
result.issues
  .filter(i => i.severity === 'error')
  .forEach(i => {
    failed.push(i.item);
  });

// Retry with lower threshold
if (failed.length > 0) {
  console.log(`Retrying ${failed.length} failed items...`);
  const retry_result = await agent.ingest({
    content_source: 'text',
    content: failed,
    category: 'projects',
    quality_threshold: 40  // Lower threshold
  });
  console.log(`✓ Retry successful: ${retry_result.ingestion_result.successful}`);
}
```

### Recipe 3: Monitor Progress on Large Batches

```typescript
const big_batch = Array(1000).fill('Sample project content...');

const result = await agent.ingest({
  content_source: 'text',
  content: big_batch,
  category: 'projects',
  verbose: true  // Enable progress logging
});

const { current, total, percentage, estimated_time_remaining } = result.progress;
console.log(`\nCompleted: ${percentage}% (${current}/${total})`);
console.log(`Time taken: ${Math.round((Date.now() - start_time) / 1000)}s`);
```

### Recipe 4: Quality-First Processing

Only accept high-quality items:

```typescript
const result = await agent.ingest({
  content_source: 'file',
  content: items,
  category: 'projects',
  quality_threshold: 80,  // Strict quality
  skip_duplicates: true,
  verbose: true
});

// Review rejections
const low_quality = result.issues.filter(i => 
  i.message.includes('Quality score')
);

console.log(`\n⚠️  ${low_quality.length} items below quality threshold`);
low_quality.forEach(issue => {
  console.log(`  - ${issue.suggestion}`);
});
```

### Recipe 5: Auto-Commit with Audit Trail

```typescript
const start = Date.now();

const result = await agent.ingest({
  content_source: 'csv',
  content: csv_data,
  category: 'all',
  auto_commit: true,  // Auto-commit to git
  verbose: true
});

// Generate summary
const duration = Math.round((Date.now() - start) / 1000);
console.log(`\n📊 Ingestion Summary`);
console.log(`   Time: ${duration}s`);
console.log(`   Success Rate: ${Math.round(result.ingestion_result.successful / result.ingestion_result.processed * 100)}%`);
console.log(`   Files Created: ${result.created_files.length}`);
console.log(`   Issues: ${result.issues.length}`);
console.log(`\n   Audit trail has ${result.audit_trail.length} entries`);

// Write audit to file
fs.writeFileSync(
  `audit-${Date.now()}.json`,
  JSON.stringify(result.audit_trail, null, 2)
);
```

---

## Command-Line Usage

### Using via Node Script

**Create `ingest.js`:**
```javascript
import { PSBIngestionAgent } from './psb-ingestion-agent.ts';

const agent = new PSBIngestionAgent();
agent.setVerbose(true);

const config = {
  content_source: process.argv[2],  // 'text', 'file', 'csv', 'json'
  content: process.argv[3],         // content or file path
  category: process.argv[4] || 'projects',
  quality_threshold: parseInt(process.argv[5]) || 60
};

agent.ingest(config).then(result => {
  console.log('\n✅ Complete!');
  console.log(`Successful: ${result.ingestion_result.successful}/${result.ingestion_result.processed}`);
  process.exit(result.ingestion_result.failed > 0 ? 1 : 0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
```

**Run it:**
```bash
# Single item
node ingest.js text "Led team on Kubernetes migration" projects 70

# From file
node ingest.js file content.txt projects 65

# From CSV
node ingest.js csv bulk_import.csv all 60

# From JSON
node ingest.js json bulk_import.json all 70
```

---

## Next Steps

### 1. Read the Full Documentation
See `PSB-Ingestion-Agent-README.md` for:
- Complete API reference
- All configuration options
- Troubleshooting guide
- Integration examples

### 2. Explore Advanced Features
- **Duplicate Detection**: Configure similarity thresholds
- **Quality Checks**: Customize 8-dimension scoring
- **Metadata Management**: Update YAML automatically
- **Error Recovery**: Implement rollback strategies

### 3. Integrate with Your Workflow
- Add to CI/CD pipeline
- Create custom import templates
- Set up scheduled ingestions
- Monitor quality metrics

### 4. Customize as Needed
- Adjust quality thresholds
- Configure duplicate handling
- Extend metadata updates
- Add custom validators

---

## Troubleshooting Quick Fix

### Issue: Nothing happens after running ingest()

**Check 1:** Are you awaiting the promise?
```typescript
// ❌ Wrong
agent.ingest(config);

// ✅ Correct
const result = await agent.ingest(config);
```

**Check 2:** Is the metadata directory present?
```bash
ls -la metadata/
# Should show: projects.yml, skills.yml, achievements.yml, clients.yml
```

### Issue: "Cannot find module"

```bash
# Install dependencies
npm install js-yaml

# Or if using TypeScript
npm install --save-dev typescript ts-node @types/node
```

### Issue: Quality scores always low

```typescript
// Lower the threshold
const result = await agent.ingest({
  ...config,
  quality_threshold: 40  // Start lower
});

// Review the issues to understand why
result.issues.forEach(issue => {
  console.log(`${issue.item}: ${issue.message}`);
});
```

### Issue: Git commit fails

```typescript
// Disable auto-commit for testing
const result = await agent.ingest({
  ...config,
  auto_commit: false  // Manual commit instead
});

// Then commit manually
fs.execSync('git add metadata/', { stdio: 'inherit' });
fs.execSync('git commit -m "PSB ingestion"', { stdio: 'inherit' });
```

---

## Example Output

### Single Item Result
```
📥 Loading content...
✓ Loaded 1 items
⚙️  Processing batch...
✓ Processed 1 items
💾 Writing files...
✓ Created 1 files
📝 Updating metadata...
✓ Updated metadata in 1 files

✅ Ingestion completed!
Summary: 1/1 successful

{
  ingestion_result: { processed: 1, successful: 1, failed: 0, warnings: 0, skipped: 0 },
  created_files: [
    {
      path: 'projects/kubernetes/kubernetes-migration.md',
      type: 'projects',
      quality_score: 85
    }
  ],
  updated_metadata: [
    { file: 'metadata/projects.yml', entries_added: 1, entries_updated: 0 }
  ],
  issues: [],
  progress: { current: 1, total: 1, percentage: 100, estimated_time_remaining: 0 }
}
```

### Batch Import Result
```
✓ Imported 7 items from CSV
Summary:
  Processed:  7
  Successful: 6
  Failed:     0
  Warnings:   1
  Skipped:    0

Created Files:
  - projects/kubernetes-migration.md (quality: 85)
  - projects/microservices-platform.md (quality: 78)
  - skills/kubernetes.md (quality: 90)
  - skills/aws.md (quality: 88)
  - skills/terraform.md (quality: 82)
  - achievements/cost-reduction.md (quality: 92)

Metadata Updated:
  - metadata/projects.yml (2 added)
  - metadata/skills.yml (3 added)
  - metadata/achievements.yml (1 added)

Issues:
  - clients/fintech-startup.md: Quality score 55 below threshold 60
    → Review and enhance client information
```

---

## Support

**Need help?** Check:
1. This Quick Start guide
2. Full README: `PSB-Ingestion-Agent-README.md`
3. Inline code comments
4. Example usage patterns

**Report issues** in the repository with:
- Configuration used
- Input content
- Full error message
- System info (Node version, OS)

---

**Happy Ingesting! 🚀**
