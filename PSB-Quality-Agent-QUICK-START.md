# PSB Quality Agent - Quick Start Guide

Get up and running with the PSB Quality Agent in 5 minutes.

## Prerequisites

- Node.js 16+ (`node --version`)
- npm 7+ (`npm --version`)
- TypeScript compiler (`npm install -g typescript`)

## Installation

```bash
# 1. Copy agent files to your project
cp psb-quality-agent-*.ts src/
cp psb-quality-agent-*.yaml .

# 2. Install dependencies
npm install

# 3. Verify installation
npm run quality:help
```

## First Scan

```bash
# Run your first quality scan
npm run quality:scan

# Example output:
# ✅ PSB Quality Agent Ready
# 📊 Starting quality scan...
# 📁 Scanning: docs/
# 📁 Scanning: src/
# 
# ✅ Scan Complete
# 📊 Results:
#   Files scanned: 42
#   Issues found: 8
#   Overall quality: 75/100
#   Critical issues: 1
```

## Most Common Commands

### 1. Quick Quality Check
```bash
npm run quality:scan
```
**What it does:** Scans all files, reports issues, shows score.

### 2. See Full Report
```bash
npm run quality:report
```
**What it does:** Generates detailed report in JSON/Markdown/HTML.

### 3. Auto-Fix Issues (Preview First)
```bash
npm run quality:fix -- --dry-run
```
**What it does:** Shows what would be fixed without applying changes.

```bash
npm run quality:fix
```
**What it does:** Actually applies the fixes.

### 4. Set Up Daily Monitoring
```bash
npm run quality:schedule
# Then select: create → Daily Quality Check → daily
```
**What it does:** Creates automatic daily quality checks.

### 5. View Current Schedule
```bash
npm run quality:schedule -- list
```
**What it does:** Shows all scheduled scans.

## Configuration Basics

Edit `.psb/quality-agent-config.yaml`:

### Change Quality Thresholds

```yaml
quality_thresholds:
  fabrication_risk: 20        # Allow 20% risk (lower = stricter)
  evidence_coverage: 75       # Require 75% evidence (higher = stricter)
  confidentiality_risk: 5     # Allow 5% risk (lower = stricter)
```

### Exclude Directories

```yaml
scan:
  exclude_patterns:
    - node_modules/**
    - .git/**
    - dist/**
    - build/**
```

### Enable Auto-Fix

```yaml
auto_fix:
  enabled: true
  dry_run_by_default: false  # Actually apply fixes
```

## Verification Checklist

After setup, verify:

- [ ] `npm run quality:scan` completes successfully
- [ ] Report shows files scanned > 0
- [ ] At least one issue detected
- [ ] HTML report generated at `.psb/reports/quality-report-*.html`
- [ ] No error messages in output

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Command not found" | Run `npm install` in project root |
| "No files scanned" | Check `exclude_patterns` in config |
| "Report not generated" | Ensure `.psb/reports/` directory exists (`mkdir -p .psb/reports`) |
| "Permission denied" | Run `chmod +x node_modules/.bin/*` |

## Next Steps

### Learn More
- Read [Complete Documentation](PSB-Quality-Agent-README-Part1.md) for all features
- Check [API Reference](PSB-Quality-Agent-README-Part2.md#api-reference) for code examples

### Enable Notifications
```bash
# Create GitHub issues for critical problems
export GITHUB_TOKEN=ghp_xxxx
psb-quality-agent scan --notify github

# Send Slack notifications
export SLACK_WEBHOOK_URL=https://hooks.slack.com/...
psb-quality-agent scan --notify slack
```

### Set Up Pre-Commit Checks
```bash
npm run quality:install-hook
# Now runs automatically before commits
git commit -m "Update docs"
```

### Create Weekly Report
```bash
npm run quality:schedule
# Create "Weekly Report" with "weekly" interval
# Reports will generate every Sunday at 2 AM
```

## Key Files

| File | Purpose |
|------|---------|
| `psb-quality-agent-core.ts` | Main orchestration engine |
| `psb-quality-agent-cli.ts` | Command-line interface |
| `psb-quality-agent-config.yaml` | Configuration settings |
| `.psb/quality-agent-state.json` | Current quality metrics |
| `.psb/quality-history.json` | Historical trend data |
| `.psb/reports/` | Generated reports |

## Common Scenarios

### Scenario 1: Quick Team Check-In
```bash
# Generate report for team meeting
npm run quality:report -- --format markdown > quality-report.md
# Share markdown file in team chat
```

### Scenario 2: CI/CD Integration
```bash
# In your CI pipeline
npm run quality:scan
# Fails if any critical issues found
```

### Scenario 3: Before Release
```bash
# Generate comprehensive HTML dashboard
npm run quality:report -- --format html
# Open .psb/reports/quality-report-*.html in browser
# Review quality metrics before release
```

### Scenario 4: Track Improvement
```bash
# Check trend analysis
npm run quality:report -- --include-trends
# See if quality is improving, stable, or declining
```

## Performance Tips

- **Faster scans:** Add more patterns to `exclude_patterns`
- **Parallel scanning:** Increase `scan.parallel_scans` to 4-8
- **Cache results:** Set `advanced.performance.cache_ttl_seconds` to 3600

## Getting Help

```bash
# Show all available commands
npm run quality:help

# Show help for specific command
npm run quality:scan -- --help
npm run quality:fix -- --help
npm run quality:report -- --help
npm run quality:schedule -- --help

# View logs
tail -f .psb/logs/quality-agent.log
```

---

**Congratulations!** You're ready to start monitoring quality. 

For more detailed information, see [Complete Documentation](PSB-Quality-Agent-README-Part1.md).
