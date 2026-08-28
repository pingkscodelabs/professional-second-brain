# PSB Quality Agent - Integration & Deployment Guide

## Overview

This guide provides step-by-step instructions for integrating and deploying the PSB Quality Agent into your Professional Second Brain repository.

## What's Included

The PSB Quality Agent package includes:

### Core Modules (TypeScript)
- **psb-quality-agent-types.ts** (9.6 KB) - Complete type system and interfaces
- **psb-quality-agent-core.ts** (26 KB) - Main orchestration engine
- **psb-quality-agent-scheduler.ts** (8 KB) - Scheduling system
- **psb-quality-agent-reporter.ts** (18.6 KB) - Multi-format report generation
- **psb-quality-agent-cli.ts** (18.2 KB) - Command-line interface

### Configuration
- **psb-quality-agent-config.yaml** (7.6 KB) - Production configuration
- **psb-quality-agent-package.json** (2.6 KB) - NPM manifest
- **psb-quality-agent-extension.json** (6 KB) - VS Code extension config

### Documentation
- **PSB-Quality-Agent-README-Part1.md** (17.2 KB) - Feature overview and configuration
- **PSB-Quality-Agent-README-Part2.md** (23.7 KB) - Reports, scheduling, integrations
- **PSB-Quality-Agent-QUICK-START.md** (5.3 KB) - 5-minute setup guide
- **PSB-Quality-Agent-DEPLOYMENT-CHECKLIST.md** (12.9 KB) - Deployment verification
- **psb-quality-agent-test-scenarios.ts** (20.8 KB) - Comprehensive test scenarios

**Total: ~175 KB of production-ready code and documentation**

## Directory Structure

After installation, your project will have:

```
project-root/
├── src/
│   ├── psb-quality-agent-types.ts
│   ├── psb-quality-agent-core.ts
│   ├── psb-quality-agent-scheduler.ts
│   ├── psb-quality-agent-reporter.ts
│   └── psb-quality-agent-cli.ts
│
├── .psb/
│   ├── config/
│   │   └── quality-agent-config.yaml
│   ├── logs/
│   │   └── quality-agent.log
│   ├── reports/
│   │   ├── quality-report-*.json
│   │   ├── quality-report-*.md
│   │   ├── quality-report-*.html
│   │   └── quality-report-*.csv
│   ├── state/
│   │   ├── quality-agent-state.json
│   │   └── quality-history.json
│   └── schedules/
│       └── *.json
│
├── psb-quality-agent-config.yaml
├── psb-quality-agent-package.json
├── psb-quality-agent-extension.json
├── psb-quality-agent-test-scenarios.ts
│
├── PSB-Quality-Agent-README-Part1.md
├── PSB-Quality-Agent-README-Part2.md
├── PSB-Quality-Agent-QUICK-START.md
├── PSB-Quality-Agent-DEPLOYMENT-CHECKLIST.md
│
└── package.json (updated)
```

## Installation Steps

### Step 1: Copy Files

```bash
# Copy TypeScript modules to src/
cp psb-quality-agent-*.ts src/

# Copy configuration file
cp psb-quality-agent-config.yaml .

# Copy package manifest
cp psb-quality-agent-package.json .

# Copy extension config (optional, for VS Code)
cp psb-quality-agent-extension.json .

# Copy test scenarios
cp psb-quality-agent-test-scenarios.ts .
```

### Step 2: Create Directory Structure

```bash
# Create .psb directory structure
mkdir -p .psb/{config,logs,reports,state,schedules}

# Create initial configuration
cp psb-quality-agent-config.yaml .psb/config/

# Set proper permissions
chmod -R 755 .psb
```

### Step 3: Update NPM Dependencies

Add to your `package.json`:

```json
{
  "dependencies": {
    "js-yaml": "^4.1.0",
    "chalk": "^4.1.2"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.0.0",
    "@types/node": "^20.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

Or use the provided `psb-quality-agent-package.json` as template.

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Verify Installation

```bash
# Build TypeScript
npm run build

# Run help command
npm run quality:help

# Expected output:
# ✅ PSB Quality Agent Ready
# Commands:
#   scan     - Scan repository for quality issues
#   monitor  - Continuous monitoring mode
#   report   - Generate quality reports
#   fix      - Apply auto-fixes to issues
#   schedule - Manage scan schedules
```

## Configuration

### Basic Configuration

Edit `.psb/config/quality-agent-config.yaml`:

```yaml
# Basic settings
version: "1.0.0"
environment: "production"
log_level: "info"

# Quality thresholds (0-100, where applicable)
quality_thresholds:
  fabrication_risk: 20          # Lower is better (max risk allowed)
  evidence_coverage: 75         # Higher is better
  confidentiality_risk: 5       # Lower is better
  completeness: 75              # Higher is better
  consistency: 75               # Higher is better
  technology_alignment: 75      # Higher is better
  link_validity: 85             # Higher is better
  structure: 75                 # Higher is better

# Scan configuration
scan:
  parallel_scans: 4             # Number of concurrent file scans
  include_patterns:
    - "**/*.md"
    - "**/*.txt"
    - "**/*.yaml"
  exclude_patterns:
    - "node_modules/**"
    - ".git/**"
    - "dist/**"
    - ".psb/**"

# Auto-fix configuration
auto_fix:
  enabled: true
  dry_run_by_default: false
  severity_levels:
    - info
    - warning
```

### Environment Variables

Override configuration via environment:

```bash
export PSB_QUALITY_ENV=production
export PSB_QUALITY_SCAN_PARALLEL=8
export PSB_QUALITY_THRESHOLD_FABRICATION=25
export PSB_QUALITY_THRESHOLD_EVIDENCE=80
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
export SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

## First Run

### Quick Start

```bash
# Run your first quality scan
npm run quality:scan

# Expected output:
# ✅ PSB Quality Agent Ready
# 📊 Starting quality scan...
# 📁 Scanning: docs/
# 📁 Scanning: src/
# ⏳ Processing findings...
#
# ✅ Scan Complete
# 📊 Results:
#    Files scanned: 42
#    Issues found: 8
#    Overall quality: 75/100
#    Critical issues: 1
#    Warning issues: 4
#    Info issues: 3
#
# 📈 Quality Scores:
#    Fabrication risk: 15/100 (✅ Low risk)
#    Evidence coverage: 80/100 (✅ Strong)
#    Confidentiality risk: 5/100 (✅ Excellent)
#    Completeness: 72/100 (⚠️ Good)
#    Consistency: 81/100 (✅ Strong)
#    Technology alignment: 78/100 (✅ Strong)
#    Link validity: 88/100 (✅ Strong)
#    Structure: 76/100 (✅ Strong)
#
# 📊 Trend Analysis:
#    Trend: Improving ⬆️
#    Improvement: +8.5% from last scan
#    Velocity: Moderate
#
# 📋 Report generated: .psb/reports/quality-report-2024-01-15.json
```

### Generate Report

```bash
# Generate HTML dashboard
npm run quality:report -- --format html
# Opens at: .psb/reports/quality-report-*.html

# Generate Markdown for documentation
npm run quality:report -- --format markdown
# Saves to: .psb/reports/quality-report-*.md

# Generate CSV for spreadsheet analysis
npm run quality:report -- --format csv
# Saves to: .psb/reports/quality-report-*.csv
```

## Integration Points

### 1. GitHub Actions

Add to `.github/workflows/quality-check.yml`:

```yaml
name: Quality Check
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run quality:scan
      
      - name: Comment on PR
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '⚠️ Quality check failed. See [report](...)' 
            })
```

### 2. Pre-Commit Hooks

```bash
# Install hook
npm run quality:install-hook

# Now runs before every commit
git commit -m "Update docs"
# → Quality agent validates files
# → Blocks commit if issues found
# → Shows suggestions for fixes
```

### 3. Scheduled Monitoring

```bash
# Set up daily quality checks
npm run quality:schedule create "Daily Check" daily

# Weekly comprehensive reports
npm run quality:schedule create "Weekly Report" weekly

# Start scheduler
npm run quality:schedule start
```

### 4. Team Notifications

#### Slack Integration
```bash
export SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
npm run quality:scan --notify slack
# Posts to: #quality-monitoring
```

#### GitHub Issues
```bash
export GITHUB_TOKEN=ghp_xxxx
npm run quality:scan --notify github
# Creates GitHub issues for critical problems
```

#### Email Reports
```bash
export EMAIL_SERVICE=sendgrid
export EMAIL_API_KEY=SG.xxxx
npm run quality:scan --notify email
# Sends report to: team@example.com
```

## Common Use Cases

### Use Case 1: Team Quality Review

```bash
# Generate comprehensive report for team meeting
npm run quality:report -- --format markdown > quality-review.md

# Share report
git add quality-review.md
git commit -m "docs: quality review for Jan 15"
git push

# Team reviews in PR
```

### Use Case 2: Release Gate

```bash
# Before release, verify quality
npm run quality:scan -- --quality-threshold 80

# Exit code 0 = ready to release
# Exit code 1 = quality issues block release
```

### Use Case 3: Automated Fixes

```bash
# Preview what would be fixed
npm run quality:fix -- --dry-run

# Review proposed changes
# If satisfied, apply fixes
npm run quality:fix

# Commit fixed files
git add -A
git commit -m "fix: automated quality improvements"
```

### Use Case 4: Continuous Monitoring

```bash
# Set up monitoring
npm run quality:monitor

# Agent runs 24/7
# - Daily automated scans
# - Notifications on issues
# - Weekly comprehensive reports
# - Trend analysis and insights
```

## Performance Tuning

### For Faster Scans

```yaml
# .psb/config/quality-agent-config.yaml
scan:
  parallel_scans: 8              # Increase parallelization
  cache_enabled: true            # Enable result caching
  incremental_scan: true         # Only changed files

exclude_patterns:
  - "node_modules/**"            # Skip node_modules
  - "dist/**"                    # Skip build output
  - "vendor/**"                  # Skip dependencies
```

### For Better Accuracy

```yaml
quality_checker:
  deep_analysis: true            # More thorough checks
  check_external_links: true     # Verify all links
  evidence_verification: true    # Verify citations
```

## Troubleshooting

### Scan Not Finding Files

```bash
# Check include patterns
cat .psb/config/quality-agent-config.yaml | grep -A 5 include_patterns

# Test patterns
npm run quality:scan -- --debug

# If patterns not matching, update:
# scan:
#   include_patterns:
#     - "**/*.md"
#     - "**/*.txt"
```

### Reports Not Generating

```bash
# Verify report directory exists
mkdir -p .psb/reports
chmod 755 .psb/reports

# Check disk space
df -h .psb/

# Try generating single format
npm run quality:report -- --format json
```

### Scheduler Not Running

```bash
# Verify scheduler started
ps aux | grep quality-agent

# Check if running
npm run quality:schedule list

# Restart if needed
npm run quality:schedule stop
npm run quality:schedule start

# Check logs
tail -f .psb/logs/quality-agent.log
```

## Next Steps

1. **Read Documentation**
   - Start with [Quick Start](PSB-Quality-Agent-QUICK-START.md)
   - Review [Complete Documentation](PSB-Quality-Agent-README-Part1.md)
   - Check [Advanced Features](PSB-Quality-Agent-README-Part2.md)

2. **Configure for Your Needs**
   - Adjust quality thresholds
   - Set up notification channels
   - Configure schedules

3. **Integrate with Workflow**
   - Add to CI/CD pipeline
   - Set up pre-commit hooks
   - Enable team notifications

4. **Start Monitoring**
   - Run first scan
   - Review initial report
   - Address critical issues
   - Enable scheduled monitoring

5. **Track Progress**
   - Monitor quality trends
   - Celebrate improvements
   - Use metrics for planning

## Support

### Getting Help

```bash
# Show all commands
npm run quality:help

# Show command-specific help
npm run quality:scan -- --help
npm run quality:fix -- --help
npm run quality:report -- --help

# View logs
tail -f .psb/logs/quality-agent.log

# Check status
npm run quality:status
```

### Reporting Issues

1. Check troubleshooting section above
2. Review configuration with `npm run quality:validate`
3. Collect logs: `tar czf quality-agent-logs.tar.gz .psb/logs/`
4. File GitHub issue with logs and configuration

## Success Metrics

Your deployment is successful when:

- ✅ First scan completes without errors
- ✅ Report generates in all formats
- ✅ Quality scores calculated for all 8 dimensions
- ✅ No critical issues preventing use
- ✅ Team can access and understand reports
- ✅ Scheduled scans execute on time
- ✅ Notifications deliver correctly
- ✅ Trend data accumulates over 7+ days

## Advanced Topics

### Custom Quality Dimensions

Extend agent with custom checks:

```typescript
// In psb-quality-agent-core.ts
private async detectCustomDimension(file: string): Promise<number> {
  // Your custom detection logic
  return score; // 0-100
}
```

### Batch Operations

Process multiple repositories:

```bash
npm run quality:scan -- --batch repos.json
# repos.json contains paths to scan
```

### Webhook Integration

Receive quality metrics via webhook:

```bash
npm run quality:setup-webhook
# URL: https://your-domain.com/quality-webhook
# Receives POST with scan results
```

---

**Ready to start?** Follow the installation steps above and check out the [Quick Start Guide](PSB-Quality-Agent-QUICK-START.md)!
