# PSB-Quality-Checker User Guide

Practical guide with detailed examples, workflows, and best practices for using the PSB-Quality-Checker skill in your Professional Second Brain repository.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Workflows](#basic-workflows)
3. [Dimension-Specific Usage](#dimension-specific-usage)
4. [Common Scenarios](#common-scenarios)
5. [Interpreting Results](#interpreting-results)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

## Getting Started

### Installation & Setup

```bash
# 1. Navigate to PSB root
cd ~/projects/professional-second-brain

# 2. Ensure Node.js and npm installed
node --version  # Should be v14+
npm --version

# 3. Install dependencies
npm install js-yaml @types/node @types/js-yaml

# 4. Compile TypeScript
npx tsc --lib es2020,dom --module commonjs psb-quality-checker.ts psb-repo-auditor.ts

# 5. Verify installation
node -e "const q = require('./psb-quality-checker.js'); console.log('Ready!')"
```

### First Check

```typescript
// quick-check.js
const { QualityChecker } = require('./psb-quality-checker.js');

async function quickCheck() {
  const checker = new QualityChecker();
  
  // Check your first file
  const result = await checker.checkFile('projects/my-first-project.md');
  
  console.log(`Quality Score: ${result.overall_quality_score}/100`);
  console.log(`Issues Found: ${result.issues.length}`);
  
  if (result.issues.length > 0) {
    console.log('\nTop Issues:');
    result.issues
      .sort((a, b) => {
        const severity = { critical: 0, warning: 1, info: 2 };
        return severity[a.severity] - severity[b.severity];
      })
      .slice(0, 3)
      .forEach(issue => {
        console.log(`  [${issue.severity.toUpperCase()}] ${issue.message}`);
        console.log(`  → ${issue.suggestion}`);
      });
  }
}

quickCheck().catch(console.error);
```

Run it: `node quick-check.js`

## Basic Workflows

### Workflow 1: Pre-Commit Quality Check

**Scenario**: Ensure all changes meet quality standards before committing

```bash
#!/bin/bash
# pre-commit-check.sh

echo "Running pre-commit quality checks..."

# Get staged files
STAGED_FILES=$(git diff --cached --name-only | grep -E '\.(md|yml)$')

if [ -z "$STAGED_FILES" ]; then
  echo "No markdown files to check."
  exit 0
fi

# Check each file
FAILED=0
for file in $STAGED_FILES; do
  echo -n "Checking $file... "
  
  SCORE=$(node -e "
    const { QualityChecker } = require('./psb-quality-checker.js');
    (async () => {
      const checker = new QualityChecker();
      const result = await checker.checkFile('$file');
      console.log(result.overall_quality_score);
    })()
  ")
  
  if [ "$SCORE" -lt 70 ]; then
    echo "FAIL ($SCORE/100)"
    FAILED=$((FAILED + 1))
  else
    echo "OK ($SCORE/100)"
  fi
done

if [ $FAILED -gt 0 ]; then
  echo "⚠ $FAILED files failed quality check. Run checks and fix issues before committing."
  exit 1
fi

echo "✓ All files passed quality checks!"
exit 0
```

Install as git hook:
```bash
cp pre-commit-check.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Workflow 2: Weekly Repository Audit

**Scenario**: Monitor overall repository health and identify high-risk areas

```typescript
// weekly-audit.ts
import { RepositoryAuditor } from './psb-repo-auditor';

async function weeklyAudit() {
  const auditor = new RepositoryAuditor();
  
  console.log('Starting weekly PSB quality audit...\n');
  
  // Run full audit
  const audit = await auditor.auditRepository({ 
    scope: 'all',
    includeFiles: true
  });
  
  // Display summary
  console.log('=== Repository Health Report ===');
  console.log(`Health Status: ${audit.health_status.toUpperCase()}`);
  console.log(`Overall Score: ${audit.overall_score}/100`);
  console.log(`Audited Files: ${audit.files.length}`);
  console.log(`Critical Issues: ${audit.critical_issues_count}`);
  console.log(`Warning Issues: ${audit.warning_issues_count}`);
  
  // Identify problem files
  const problematicFiles = audit.files
    .filter(f => f.quality_score < 60)
    .sort((a, b) => a.quality_score - b.quality_score);
  
  if (problematicFiles.length > 0) {
    console.log('\n⚠ Files Below Quality Threshold (60):');
    problematicFiles.forEach(file => {
      console.log(`  - ${file.path}: ${file.quality_score}/100`);
      console.log(`    Issues: ${file.critical_issues} critical, ${file.issues_count} total`);
    });
    
    console.log('\nGenerate detailed report:');
    const report = await auditor.generateReport({
      scope: 'all',
      format: 'markdown',
      detailed: true
    });
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync('quality-reports/weekly-audit.md', report);
    console.log('✓ Detailed report saved to quality-reports/weekly-audit.md');
  } else {
    console.log('✓ All files above quality threshold!');
  }
}

weeklyAudit().catch(console.error);
```

Run: `npx ts-node weekly-audit.ts`

### Workflow 3: Onboarding New Content

**Scenario**: Validate new project/skill documentation meets PSB standards

```typescript
// validate-new-content.ts
import { QualityChecker } from './psb-quality-checker';

interface NewContentValidation {
  filePath: string;
  minQualityScore?: number;
  requiredDimensions?: string[];
}

async function validateNewContent(options: NewContentValidation) {
  const checker = new QualityChecker();
  const minScore = options.minQualityScore || 80;
  
  console.log(`Validating: ${options.filePath}`);
  console.log(`Minimum Quality Score Required: ${minScore}/100\n`);
  
  const result = await checker.checkFile(options.filePath, null, true);
  
  // Check overall score
  if (result.overall_quality_score < minScore) {
    console.log(`❌ REJECTED: Quality score ${result.overall_quality_score}/100 below threshold`);
    displayIssues(result.issues);
    return false;
  }
  
  // Check specific dimensions if requested
  if (options.requiredDimensions) {
    const auditReport = result.audit_report;
    
    for (const dimension of options.requiredDimensions) {
      const score = auditReport[`${dimension}_score`] || auditReport[`${dimension}_risk`];
      
      if (score < 70) {
        console.log(`❌ REJECTED: ${dimension} score ${score} below 70`);
        const relevantIssues = result.issues.filter(i => i.type.includes(dimension));
        displayIssues(relevantIssues);
        return false;
      }
    }
  }
  
  // Check for critical issues
  const criticalIssues = result.issues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    console.log(`❌ REJECTED: ${criticalIssues.length} critical issues found`);
    displayIssues(criticalIssues);
    return false;
  }
  
  // Passed!
  console.log('✅ APPROVED: Content meets all quality standards');
  console.log(`   Overall Score: ${result.overall_quality_score}/100`);
  
  // Show warnings for improvement
  const warningIssues = result.issues.filter(i => i.severity === 'warning');
  if (warningIssues.length > 0) {
    console.log(`\n💡 ${warningIssues.length} suggested improvements:`);
    displayIssues(warningIssues.slice(0, 3));
  }
  
  return true;
}

function displayIssues(issues: any[]) {
  issues.forEach(issue => {
    console.log(`  • [${issue.type.toUpperCase()}] ${issue.message}`);
    console.log(`    → ${issue.suggestion}`);
  });
}

// Usage
validateNewContent({
  filePath: 'projects/new-platform.md',
  minQualityScore: 85,
  requiredDimensions: ['fabrication', 'confidentiality', 'completeness']
}).then(approved => {
  process.exit(approved ? 0 : 1);
});
```

## Dimension-Specific Usage

### Fabrication Detection

**When to use**: When adding new claims or achievements to your PSB

**Example scenario**: You just added "Improved system performance by 50%" to a project

```typescript
const result = await checker.checkFile('projects/platform.md', 'fabrication');

// Result might include:
{
  issues: [{
    type: 'fabrication',
    severity: 'warning',
    location: '15',
    message: 'Metric claim "improved by 50%" lacks supporting evidence',
    suggestion: 'Add evidence link: [See metrics](../evidence/project-metrics.md) or rephrase as "improved performance (see deployment logs)"'
  }]
}
```

**How to fix**:
1. **Add evidence link**: `[50% improvement](../evidence/project-xyz-metrics.md)`
2. **Rephrase as soft claim**: "Significantly improved system performance"
3. **Be specific**: "Reduced API response time from 500ms to 250ms"

### Confidentiality Audit

**When to use**: Before sharing any content externally or committing sensitive files

**Example scenario**: You're adding a case study about a client project

```typescript
const result = await checker.checkFile('projects/client-case-study.md', 'confidentiality');

// Might detect:
{
  issues: [
    {
      type: 'confidentiality',
      severity: 'critical',
      location: '10',
      message: 'Exposed email address detected: client-manager@acme.com',
      suggestion: 'Replace with redacted identifier: [CLIENT_A_CONTACT] or remove entirely'
    },
    {
      type: 'confidentiality',
      severity: 'warning',
      location: '22',
      message: 'Client name not redacted: Acme Corp',
      suggestion: 'Replace "Acme Corp" with "CLIENT_A" or "Major Financial Services Company"'
    },
    {
      type: 'confidentiality',
      severity: 'warning',
      location: '45',
      message: 'Salary/budget information detected: $2.5M budget',
      suggestion: 'Replace with generic term: "multi-million dollar enterprise project"'
    }
  ]
}
```

**Best practices**:
- Use client codes: CLIENT_A, CLIENT_B, etc.
- Redact real names: "Major Tech Company" instead of "Microsoft"
- Generalize metrics: "six-figure budget" instead of "$500K"
- Avoid specific email addresses

### Evidence Verification

**When to use**: After writing claims to ensure they're backed by documentation

**Example scenario**: You claim "Led team of 8 engineers"

```typescript
const result = await checker.checkFile('projects/leadership-project.md', 'evidence');

// Might report:
{
  audit_report: {
    evidence_coverage: 45,  // 45% - medium confidence
  },
  issues: [
    {
      type: 'missing_evidence',
      severity: 'warning',
      message: 'Achievement claim lacks supporting evidence link',
      suggestion: 'Add link to team structure or project documentation'
    }
  ]
}
```

**How to fix**:
```markdown
# Original
Led team of 8 engineers through product launch.

# Fixed
Led team of 8 engineers through product launch (see [project details](../../projects/platform-v2.md#team) and [team roster](../../teams/engineering-team-2023.md))
```

### Completeness Scoring

**When to use**: When creating new projects or skills to ensure all required info is present

**Example scenario**: New project file created

```typescript
const result = await checker.checkFile('projects/new-project.md');

// Completeness score might be 60/100
{
  issues: [
    {
      type: 'completeness',
      severity: 'warning',
      message: 'Missing required field: impact metrics',
      suggestion: 'Add "## Impact" section with specific business outcomes'
    },
    {
      type: 'completeness',
      severity: 'info',
      message: 'Missing optional field: team size',
      suggestion: 'Consider adding team composition for context (optional)'
    }
  ]
}
```

**Template checklist for projects**:
- ✅ Title
- ✅ Overview/Description
- ✅ Technologies used
- ✅ Duration
- ✅ Your role
- ✅ Outcomes/Impact
- ⭕ Team size (optional)
- ⭕ Client industry (optional)

## Common Scenarios

### Scenario 1: Fixing a Low-Scoring File

**Situation**: `npm run check-file projects/platform.md` returns 52/100

**Process**:

```typescript
// Step 1: Get detailed analysis
const result = await checker.checkFile('projects/platform.md', null, true);

// Step 2: Categorize issues by severity
const critical = result.issues.filter(i => i.severity === 'critical');  // Fix first
const warnings = result.issues.filter(i => i.severity === 'warning');   // Fix second
const info = result.issues.filter(i => i.severity === 'info');          // Optional

console.log(`Critical: ${critical.length}, Warnings: ${warnings.length}, Info: ${info.length}`);

// Step 3: Display all issues with suggestions
result.issues.forEach(issue => {
  console.log(`\n${issue.type.toUpperCase()} (${issue.severity})`);
  console.log(`Line ${issue.location}: ${issue.message}`);
  console.log(`Fix: ${issue.suggestion}`);
});

// Step 4: Edit file based on suggestions
// (Edit the file)

// Step 5: Re-check
const updated = await checker.checkFile('projects/platform.md');
console.log(`Score improved to: ${updated.overall_quality_score}/100`);
```

**Common fixes**:
1. **Add evidence links** - For all quantified claims
2. **Redact confidential info** - Replace names, emails, salaries
3. **Add missing sections** - Complete all required headers
4. **Rephrase vague claims** - Be specific and measurable
5. **Fix markdown structure** - Ensure proper header hierarchy

### Scenario 2: Auditing All Projects

**Situation**: "I want to know which projects need quality improvements"

```typescript
async function auditAllProjects() {
  const auditor = new RepositoryAuditor();
  
  // Audit only projects
  const audit = await auditor.auditRepository({
    scope: 'projects',
    includeFiles: true
  });
  
  // Categorize by quality
  const excellent = audit.files.filter(f => f.quality_score >= 90);
  const good = audit.files.filter(f => f.quality_score >= 75 && f.quality_score < 90);
  const fair = audit.files.filter(f => f.quality_score >= 60 && f.quality_score < 75);
  const poor = audit.files.filter(f => f.quality_score < 60);
  
  console.log(`
Excellent (${excellent.length}): ${excellent.map(f => f.path).join(', ') || 'None'}
Good (${good.length}): ${good.map(f => f.path).join(', ') || 'None'}
Fair (${fair.length}): ${fair.map(f => f.path).join(', ') || 'None'}
Poor (${poor.length}): ${poor.map(f => f.path).join(', ') || 'None'}
  `);
  
  if (poor.length > 0) {
    console.log('Priority improvements needed for:', poor.map(f => f.path).join(', '));
  }
}
```

### Scenario 3: CI/CD Integration

**Situation**: "I want quality checks to block PRs with low scores"

```yaml
# .github/workflows/quality-check.yml
name: Quality Check

on: [pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      
      - name: Install dependencies
        run: npm install js-yaml @types/node
      
      - name: Compile quality checker
        run: npx tsc --lib es2020,dom --module commonjs psb-quality-checker.ts
      
      - name: Check modified files
        run: |
          FILES=$(git diff --name-only origin/main...HEAD | grep -E '\.(md|yml)$' || true)
          for file in $FILES; do
            echo "Checking $file..."
            node check-pr-file.js "$file"
          done
```

## Interpreting Results

### Quality Score Ranges

| Score | Status | Action Required |
|-------|--------|-----------------|
| 90-100 | ✅ Excellent | Ready to share/commit |
| 75-89 | 👍 Good | Minor improvements suggested |
| 60-74 | ⚠️ Fair | Address warnings before sharing |
| <60 | ❌ Poor | Fix critical issues |

### Audit Report Interpretation

```typescript
audit_report: {
  fabrication_risk: 15,        // ✓ Low (0-30 is good)
  confidentiality_risk: 3,     // ✓ Very Low
  completeness_score: 85,      // ✓ High
  evidence_coverage: 72        // ~ Medium (aim for >80%)
}
```

**Reading the scores**:
- **Fabrication Risk (0-100)**: How likely the content has unsupported claims
  - 0-30: Good (well-supported claims)
  - 30-60: Fair (some claims lack evidence)
  - 60-100: Poor (many unsupported claims)

- **Confidentiality Risk (0-100)**: How likely sensitive info is exposed
  - 0: No sensitive data found
  - 1-30: Minor issues (IPs, internal metrics)
  - 31-60: Moderate issues (unredacted names)
  - 61-100: Critical (credentials, real emails)

- **Completeness Score (0-100)**: What % of required sections are present
  - 90-100: All required sections present
  - 70-89: Most required sections present
  - 50-69: Missing some required sections
  - <50: Missing major sections

- **Evidence Coverage (0-100)**: What % of claims have supporting evidence
  - 80-100: Well-supported (high confidence)
  - 50-79: Partially supported (medium confidence)
  - <50: Poorly supported (low confidence)

## Best Practices

### 1. Document First, Check Later

Don't let the checker slow down your documentation flow. Write first, check after:

```
1. Write content freely
2. Run quality check
3. Fix issues iteratively
4. Commit when passing
```

### 2. Use Specific Metrics

**❌ Vague**:
- "Significantly improved performance"
- "Delivered high-quality solution"
- "Led large team"

**✅ Specific**:
- "Improved API response time from 500ms to 250ms (see metrics link)"
- "Delivered solution serving 10M+ daily users"
- "Led team of 8 engineers across 3 time zones"

### 3. Link Early, Link Often

Every quantified claim needs supporting evidence:

```markdown
✅ Good:
Reduced deployment time from 45 minutes to 15 minutes 
(see [deployment metrics](../../evidence/deployment-metrics.md))

❌ Bad:
Reduced deployment time from 45 minutes to 15 minutes
```

### 4. Redact Everything Confidential

When in doubt, redact it out:

```
Real Name → Client Code
john.doe@company.com → [CLIENT_CONTACT]
Acme Corp → Major Financial Services Company
$2.5M → Multi-million dollar engagement
192.168.1.5 → [INTERNAL_IP]
```

### 5. Keep Technologies Updated

Register new technologies in `technologies.yml`:

```yaml
# Add new technologies when you first use them
- name: "Kubernetes"
  category: "DevOps"
  proficiency: "intermediate"
  years: 3
```

### 6. Regular Maintenance

- Run full audit monthly
- Fix critical issues within 48 hours
- Review warnings monthly
- Update documentation as projects progress

## Troubleshooting

### Problem: "File quality score dropped"

**Possible causes**:
1. Added new unsubstantiated claims
2. Lost evidence links in refactoring
3. Accidentally exposed confidential info

**Solution**:
```bash
# Compare against last good version
git diff HEAD~1 projects/file.md

# Identify recent changes
# Re-check to see what triggered the drop
npm run check-file -- projects/file.md --verbose

# Review recent commits for unintended changes
```

### Problem: "False positive confidentiality warning"

**Scenario**: IP address pattern matches IP within code example

**Solution**:
```markdown
# Use code blocks for IP addresses to avoid detection
Example: In the deployment config:
```
192.168.1.5    # This won't trigger in code block
```
```

### Problem: "Completeness score stuck at 60%"

**Reason**: Missing required sections

**Solution**:
```typescript
// Check what sections are required
const requiredSections = {
  project: ['title', 'description', 'technologies', 'impact'],
  skill: ['name', 'proficiency', 'experience_years']
};

// Compare against your file
// Add missing sections
```

## FAQ

**Q: Can I customize quality thresholds?**
A: Yes! See PSB-Quality-Checker-CONFIGURATION.md for threshold customization.

**Q: How often should I run audits?**
A: At minimum weekly. Consider daily for active development phases.

**Q: Can I export reports for my manager/team?**
A: Yes! Use `generate-report` with format: 'markdown', 'html', 'csv', or 'json'.

**Q: Does the checker support non-English documentation?**
A: Pattern matching works for any language, but specific rules (like fabrication detection) are optimized for English.

**Q: Can I ignore certain files?**
A: Yes! Use `ignorePatterns` option or configure in settings.

**Q: How do I know if my completeness score is good?**
A: 80%+ is excellent, 70-79% is good, 60-69% needs improvement.

**Q: What if I disagree with a quality issue?**
A: Review the suggestion, decide if it applies, and either fix it or document why you're skipping it.

---

**Need help?** Check the README for quick start, IMPLEMENTATION.md for architecture, or API_REFERENCE.md for complete type details.
