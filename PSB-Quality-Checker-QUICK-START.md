# PSB-Quality-Checker - Quick Start (5 Minutes)

Get up and running with PSB-Quality-Checker in 5 minutes.

## Installation (2 minutes)

### Step 1: Install Dependencies
```bash
npm install js-yaml
```

### Step 2: Compile TypeScript (Optional)
If you want to run as JavaScript:
```bash
npx -y typescript --version
npx tsc --lib es2020,dom --module commonjs psb-quality-checker.ts psb-repo-auditor.ts
```

Or run directly with Node.js + TypeScript interpreter:
```bash
npm install -D typescript ts-node @types/node
```

## Your First Quality Check (3 minutes)

### Step 1: Create a Simple Test File
```bash
cat > test-project.md << 'EOF'
# My Test Project

## Overview
Built a web application.

## Technologies
- JavaScript
- React

## Impact
Improved performance by 50%
EOF
```

### Step 2: Check Its Quality
```typescript
// check-sample.js
const { QualityChecker } = require('./psb-quality-checker.js');

async function main() {
  const checker = new QualityChecker();
  const result = await checker.checkFile('test-project.md');
  
  console.log('Quality Score:', result.overall_quality_score + '/100');
  console.log('Issues Found:', result.issues.length);
  
  if (result.issues.length > 0) {
    console.log('\nTop Issues:');
    result.issues.slice(0, 3).forEach(issue => {
      console.log(`  [${issue.severity.toUpperCase()}] ${issue.message}`);
    });
  }
}

main().catch(console.error);
```

### Step 3: Run It
```bash
node check-sample.js
```

**Expected Output**:
```
Quality Score: 62/100
Issues Found: 2

Top Issues:
  [WARNING] Metric "improved by 50%" lacks supporting evidence
  [INFO] Missing optional field: duration
```

## Understand Your Results

### Quality Score Ranges
- **90-100**: Excellent ✅
- **75-89**: Good 👍
- **60-74**: Fair ⚠️
- **<60**: Poor ❌

### What the Issues Mean
Each issue shows:
- **Type**: What kind of problem (fabrication, evidence, confidentiality, etc.)
- **Severity**: How serious (critical, warning, info)
- **Message**: What's wrong
- **Suggestion**: How to fix it

## Fix the Issues (Optional)

Based on the example output above, let's improve the score:

```bash
cat > test-project-fixed.md << 'EOF'
# My Test Project

## Overview
Built a web application for e-commerce.

## Duration
3 months (Jan - Mar 2023)

## Technologies
- JavaScript
- React

## Impact
Improved API response time from 500ms to 250ms (see [performance metrics](../../evidence/metrics.md))
EOF
```

Check again:
```bash
node -e "
const { QualityChecker } = require('./psb-quality-checker.js');
(async () => {
  const checker = new QualityChecker();
  const result = await checker.checkFile('test-project-fixed.md');
  console.log('New Score:', result.overall_quality_score + '/100');
  console.log('Issues:', result.issues.length);
})();
"
```

**Expected Result**: Score improved to ~85/100 ✅

## Next Steps

### 1. Check Real Files (5 min)
```bash
# Check a real project file
node -e "
const { QualityChecker } = require('./psb-quality-checker.js');
(async () => {
  const checker = new QualityChecker();
  const result = await checker.checkFile('projects/your-project.md');
  console.log('Score:', result.overall_quality_score);
  console.log('Issues:', result.issues.length);
})();
"
```

### 2. Audit Repository (10 min)
```bash
# Check all files
node -e "
const { RepositoryAuditor } = require('./psb-repo-auditor.js');
(async () => {
  const auditor = new RepositoryAuditor();
  const audit = await auditor.auditRepository();
  console.log('Health:', audit.health_status);
  console.log('Score:', audit.overall_score);
  console.log('Critical Issues:', audit.critical_issues_count);
})();
"
```

### 3. Generate Reports (15 min)
```bash
# Generate markdown report
node -e "
const { RepositoryAuditor } = require('./psb-repo-auditor.js');
(async () => {
  const auditor = new RepositoryAuditor();
  const report = await auditor.generateReport({
    scope: 'all',
    format: 'markdown'
  });
  console.log(report);
})();
"
```

### 4. Read Full Documentation
- **README.md** - Features and overview
- **USER_GUIDE.md** - Detailed usage examples
- **API_REFERENCE.md** - Complete API documentation

## Common Tasks

### Task 1: Pre-Commit Check
Ensure quality before committing:
```bash
#!/bin/bash
# check-before-commit.sh
node -e "
const fs = require('fs');
const { QualityChecker } = require('./psb-quality-checker.js');
(async () => {
  const file = process.argv[1];
  const checker = new QualityChecker();
  const result = await checker.checkFile(file);
  
  if (result.overall_quality_score < 70) {
    console.log('❌ Quality score too low:', result.overall_quality_score);
    process.exit(1);
  }
  console.log('✅ Quality check passed:', result.overall_quality_score);
})();
" "$1"
```

### Task 2: Check for Confidential Info
Scan before sharing:
```bash
node -e "
const { QualityChecker } = require('./psb-quality-checker.js');
(async () => {
  const checker = new QualityChecker();
  const result = await checker.checkFile('projects/case-study.md', 'confidentiality');
  
  const confIssues = result.issues.filter(i => i.type === 'confidentiality');
  if (confIssues.length > 0) {
    console.log('⚠️ Confidentiality issues found:');
    confIssues.forEach(issue => {
      console.log('  -', issue.message);
      console.log('   ', issue.suggestion);
    });
    process.exit(1);
  }
  console.log('✅ No confidentiality issues');
})();
"
```

### Task 3: Find Poorly Documented Projects
Identify files that need work:
```bash
node -e "
const { RepositoryAuditor } = require('./psb-repo-auditor.js');
(async () => {
  const auditor = new RepositoryAuditor();
  const audit = await auditor.auditRepository({
    scope: 'projects',
    includeFiles: true
  });
  
  const poor = audit.files.filter(f => f.quality_score < 70);
  console.log('Files below 70:', poor.length);
  poor.slice(0, 5).forEach(f => {
    console.log('  -', f.path, '(' + f.quality_score + '/100)');
  });
})();
"
```

## Troubleshooting

### "Cannot find module 'js-yaml'"
```bash
npm install js-yaml
npm install --save-dev @types/js-yaml @types/node
```

### "Quality score seems wrong"
Run with verbose mode:
```bash
node -e "
const { QualityChecker } = require('./psb-quality-checker.js');
(async () => {
  const checker = new QualityChecker();
  const result = await checker.checkFile('file.md', null, true);
  console.log(JSON.stringify(result, null, 2));
})();
" > quality-debug.json
```

### "Metadata files not found"
The checker works without metadata. Make sure YAML files are in `metadata/` directory if you want consistency checks:
```
metadata/
  ├── projects.yml
  ├── skills.yml
  ├── technologies.yml
  ├── clients.yml
  └── experience.yml
```

## Quality Score Improvements

Here's what boosts your score:

| Issue | Impact | Fix |
|-------|--------|-----|
| Unsubstantiated metric | -15 points | Add evidence link |
| Missing evidence | -10 points | Link to source |
| Exposed email | -20 points | Replace with [CLIENT_A] |
| Missing section | -20 points | Add required section |
| Vague language | -10 points | Use specific metrics |
| Unredacted client name | -5 points | Use CLIENT_CODE |
| Broken link | -10 points | Fix or remove link |

## Tips for High Scores

1. **Link everything**: Every metric/claim needs a link to evidence
2. **Redact confidential info**: Use CLIENT_A, not real names
3. **Be specific**: "30% faster" beats "much faster"
4. **Complete required sections**: Title, Description, Impact (for projects)
5. **Keep it updated**: Stale info gets flagged

## Common Quality Scores

| Type | Typical Score | Issues |
|------|---------------|--------|
| Well-documented project | 85-95 | 0-1 minor |
| Average project | 70-80 | 2-3 improvements needed |
| New/incomplete project | 60-70 | Several issues |
| Poorly maintained | <60 | Confidentiality or critical issues |

## What Each Dimension Checks

| Dimension | Checks | Typical Issues |
|-----------|--------|---|
| Fabrication | Unsupported claims | "50% improvement" without evidence |
| Evidence | Supporting links | Claims lack proof |
| Confidentiality | Sensitive data | Email addresses, client names |
| Completeness | Required fields | Missing sections |
| Consistency | YAML vs markdown | Mismatched project names |
| Technology | Tech registry | Tech not in technologies.yml |
| Links | Cross-references | Broken or missing links |
| Structure | Markdown format | Wrong header hierarchy |

## Read Next

1. **For detailed usage**: See [USER_GUIDE.md](PSB-Quality-Checker-USER-GUIDE.md)
2. **For API reference**: See [API_REFERENCE.md](PSB-Quality-Checker-API-REFERENCE.md)
3. **For customization**: See [CONFIGURATION.md](PSB-Quality-Checker-CONFIGURATION.md)
4. **For deployment**: See [DEPLOYMENT.md](PSB-Quality-Checker-DEPLOYMENT.md)

---

**🎉 You're done!** You now know how to use PSB-Quality-Checker. 

**Next**: Check your first file and improve the quality score!

**Questions?** See the FAQ in [USER_GUIDE.md](PSB-Quality-Checker-USER-GUIDE.md#faq)
