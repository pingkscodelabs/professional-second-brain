# PSB Quality Agent - Deployment Checklist

Complete this checklist before deploying PSB Quality Agent to production.

## Pre-Deployment Phase

### Environment Setup

- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm 7+ installed (`npm --version`)
- [ ] TypeScript compiler available
- [ ] Git installed and configured
- [ ] Sufficient disk space for reports (minimum 100MB)
- [ ] Required environment variables defined:
  - [ ] `GITHUB_TOKEN` (if using GitHub integration)
  - [ ] `SLACK_WEBHOOK_URL` (if using Slack notifications)
  - [ ] `EMAIL_SERVICE_KEY` (if using email notifications)
  - [ ] `PSB_QUALITY_ENV` set to "production"

### Code Verification

- [ ] All TypeScript files present:
  - [ ] `psb-quality-agent-types.ts`
  - [ ] `psb-quality-agent-core.ts`
  - [ ] `psb-quality-agent-scheduler.ts`
  - [ ] `psb-quality-agent-reporter.ts`
  - [ ] `psb-quality-agent-cli.ts`
  - [ ] `psb-quality-agent-extension.json` (if using VS Code)
- [ ] Configuration file present and valid:
  - [ ] `psb-quality-agent-config.yaml`
  - [ ] YAML syntax validated (no errors)
  - [ ] All required settings configured
- [ ] Package manifest present:
  - [ ] `psb-quality-agent-package.json`
  - [ ] All scripts defined correctly
- [ ] Documentation complete:
  - [ ] Part 1 README present
  - [ ] Part 2 README present
  - [ ] Quick Start guide present
  - [ ] API reference reviewed

### Dependencies

- [ ] Run `npm install` successfully
- [ ] All dependencies resolved:
  - [ ] `js-yaml` installed
  - [ ] `chalk` installed
- [ ] Dev dependencies installed:
  - [ ] `typescript`
  - [ ] `ts-node`
  - [ ] `jest`
  - [ ] `eslint`
- [ ] No security vulnerabilities:
  - [ ] Run `npm audit` and fix issues
  - [ ] No high-severity vulnerabilities
  - [ ] No critical vulnerabilities

### Code Quality

- [ ] TypeScript compilation successful:
  - [ ] Run `npm run build` without errors
  - [ ] No type errors
  - [ ] No compilation warnings
- [ ] Linting passes:
  - [ ] Run `npm run lint` without errors
  - [ ] Code style consistent
- [ ] Code formatting applied:
  - [ ] Run `npm run format`
  - [ ] All files properly formatted

### Configuration Validation

- [ ] Configuration file syntax valid:
  - [ ] YAML parses without errors
  - [ ] No invalid characters
- [ ] Quality thresholds reasonable:
  - [ ] Fabrication risk threshold: 0-50 (recommended 15-30)
  - [ ] Evidence coverage threshold: 50-100 (recommended 75+)
  - [ ] Confidentiality risk threshold: 0-20 (recommended 5-10)
  - [ ] Other dimensions reasonable (30-100)
- [ ] Scan patterns configured:
  - [ ] Include patterns set correctly
  - [ ] Exclude patterns prevent scanning unneeded dirs
  - [ ] At least 10 files will be scanned
- [ ] Report settings configured:
  - [ ] Report directory exists: `.psb/reports/`
  - [ ] Report formats selected (JSON, Markdown, HTML, CSV)
- [ ] Auto-fix settings configured:
  - [ ] Auto-fix enabled/disabled as intended
  - [ ] Severity levels appropriate
  - [ ] Dry-run preference set
- [ ] Notification settings configured:
  - [ ] Notification channels selected
  - [ ] Credentials/tokens configured
  - [ ] Severity filters set appropriately

---

## Integration Phase

### Quality Checker Integration

- [ ] Quality checker skill installed:
  - [ ] Location: `.psb/skills/psb-quality-checker-skill/`
  - [ ] Version compatible (1.0.0+)
- [ ] Quality checker integration tested:
  - [ ] Run `npm run test` to verify integration
  - [ ] No import errors
  - [ ] Detection logic working
- [ ] Quality dimensions verified:
  - [ ] All 8 dimensions working:
    - [ ] Fabrication risk detection
    - [ ] Evidence coverage analysis
    - [ ] Confidentiality risk scanning
    - [ ] Completeness checking
    - [ ] Consistency validation
    - [ ] Technology alignment checking
    - [ ] Link validity verification
    - [ ] Structure validation

### Repository Structure

- [ ] `.psb/` directory structure created:
  ```
  .psb/
  ├── config/
  │   └── quality-agent-config.yaml
  ├── logs/
  │   └── quality-agent.log
  ├── reports/
  │   └── (generated reports)
  ├── state/
  │   ├── quality-agent-state.json
  │   └── quality-history.json
  └── schedules/
      └── (schedule definitions)
  ```
- [ ] Permissions set correctly:
  - [ ] `.psb/` directory: 755
  - [ ] Log files: 644
  - [ ] State files: 644
  - [ ] Report files: 644
- [ ] Git configuration updated:
  - [ ] `.psb/reports/` added to `.gitignore`
  - [ ] `.psb/logs/` added to `.gitignore`
  - [ ] `.psb/state/` NOT in `.gitignore` (track state)

### Notification Channels

#### GitHub Integration (if enabled)
- [ ] GitHub token configured
- [ ] Repository accessibility verified
- [ ] Issue creation permissions tested:
  - [ ] Create test issue: `psb-quality-agent scan --test-notify github`
  - [ ] Verify issue created successfully
- [ ] Labels configured (if using custom labels)

#### Slack Integration (if enabled)
- [ ] Slack webhook URL configured
- [ ] Webhook connectivity tested:
  - [ ] Send test message: `psb-quality-agent scan --test-notify slack`
  - [ ] Verify message received in channel
- [ ] Channel permissions verified

#### Email Integration (if enabled)
- [ ] Email service configured:
  - [ ] Service type: SendGrid/AWS SES/Mailgun
  - [ ] API key configured
  - [ ] Sender address verified
- [ ] Test email sent successfully:
  - [ ] `psb-quality-agent scan --test-notify email`
  - [ ] Email received by test recipient
- [ ] Email templates validated

---

## Testing Phase

### Functional Testing

- [ ] Manual scan test:
  - [ ] Run `npm run quality:scan`
  - [ ] Verify files detected
  - [ ] Verify issues found
  - [ ] Verify report generated
  - [ ] Verify quality scores calculated
- [ ] Report generation test:
  - [ ] JSON report generated: `.psb/reports/*.json`
  - [ ] Markdown report generated: `.psb/reports/*.md`
  - [ ] HTML report generated: `.psb/reports/*.html`
  - [ ] CSV report generated: `.psb/reports/*.csv`
- [ ] Auto-fix test (if enabled):
  - [ ] Dry-run: `npm run quality:fix -- --dry-run`
  - [ ] Review proposed changes
  - [ ] Apply fixes: `npm run quality:fix`
  - [ ] Verify changes applied
- [ ] Scheduler test:
  - [ ] Create test schedule: `npm run quality:schedule create "Test" daily`
  - [ ] List schedules: `npm run quality:schedule list`
  - [ ] Delete test schedule: `npm run quality:schedule delete test-id`
- [ ] Monitoring test (if enabled):
  - [ ] Run: `npm run quality:monitor`
  - [ ] Verify continuous operation
  - [ ] Verify periodic scans trigger

### Performance Testing

- [ ] Scan performance:
  - [ ] Time to scan 10 files: < 5 seconds
  - [ ] Time to scan 50 files: < 20 seconds
  - [ ] Time to scan 100+ files: < 60 seconds
  - [ ] Memory usage: < 500MB
- [ ] Report generation performance:
  - [ ] JSON report: < 1 second
  - [ ] Markdown report: < 1 second
  - [ ] HTML report: < 2 seconds
  - [ ] CSV report: < 1 second
- [ ] Scheduler performance:
  - [ ] Schedule creation: < 100ms
  - [ ] Schedule execution: < 5 seconds
  - [ ] Memory growth: < 10MB per hour
- [ ] Under load:
  - [ ] Run 5 concurrent scans: stable
  - [ ] Generate 10 reports: stable
  - [ ] Monitor 24+ hours: no memory leaks

### Error Handling Testing

- [ ] Invalid configuration:
  - [ ] Test with malformed YAML
  - [ ] Test with invalid thresholds
  - [ ] Test with missing required fields
  - [ ] Verify graceful error handling
- [ ] File system errors:
  - [ ] Test with read-only directory
  - [ ] Test with insufficient disk space
  - [ ] Test with missing directories
  - [ ] Verify recovery/retry logic
- [ ] Network errors (if notifications enabled):
  - [ ] Simulate network timeout
  - [ ] Test notification retry
  - [ ] Verify fallback behavior
- [ ] Quality checker failures:
  - [ ] Test with missing checker skill
  - [ ] Test with checker errors
  - [ ] Verify graceful degradation

### Integration Testing

- [ ] CLI integration:
  - [ ] All commands work: scan, monitor, report, fix, schedule
  - [ ] Help text displays correctly
  - [ ] Error messages clear and helpful
- [ ] Configuration integration:
  - [ ] YAML configuration loads correctly
  - [ ] Environment variable overrides work
  - [ ] Default values apply when not specified
- [ ] State persistence:
  - [ ] State file created after first scan
  - [ ] State file persists across restarts
  - [ ] History file created and updated
  - [ ] Trend calculations work with persisted data
- [ ] Multi-format report generation:
  - [ ] All formats specified generate correctly
  - [ ] Report content consistent across formats
  - [ ] All dimensions included in reports

---

## Production Deployment

### Pre-Production

- [ ] Staging environment test (optional):
  - [ ] Deploy to staging first
  - [ ] Run full test suite
  - [ ] Monitor for 24-48 hours
  - [ ] Validate all metrics
  - [ ] Get stakeholder approval
- [ ] Documentation review:
  - [ ] README reviewed by technical lead
  - [ ] Configuration guide reviewed
  - [ ] API documentation complete
  - [ ] Deployment guide verified
- [ ] Rollback plan documented:
  - [ ] How to stop the agent
  - [ ] How to revert configuration
  - [ ] How to restore from backup
  - [ ] Escalation contacts identified

### Production Deployment

- [ ] Backup created:
  - [ ] Backup of `.psb/` directory
  - [ ] Backup of configuration
  - [ ] Backup of historical data
- [ ] Deployment executed:
  - [ ] Copy all files to production
  - [ ] Set permissions correctly
  - [ ] Verify file integrity (checksum)
- [ ] Services started:
  - [ ] Core agent process started
  - [ ] Scheduler started (if applicable)
  - [ ] Monitoring activated
  - [ ] Notifications tested
- [ ] Monitoring configured:
  - [ ] Log aggregation set up
  - [ ] Metrics collection enabled
  - [ ] Alerts configured
  - [ ] Dashboard created

### Post-Deployment Validation

- [ ] Verify agent is running:
  - [ ] Process running: `ps aux | grep quality-agent`
  - [ ] Logs being generated: `tail -f .psb/logs/quality-agent.log`
  - [ ] No errors in logs
- [ ] Verify scans execute:
  - [ ] First scan completes successfully
  - [ ] Report generated
  - [ ] State file updated
- [ ] Verify notifications working:
  - [ ] Critical issues trigger alerts
  - [ ] Notifications reach correct channels
  - [ ] Alert content is clear and actionable
- [ ] Verify monitoring continues:
  - [ ] Scheduled scans trigger on time
  - [ ] Reports generate as scheduled
  - [ ] Trend data accumulating

### 24-Hour Monitoring

- [ ] Daily scan executed successfully
- [ ] Report generated and accessible
- [ ] No errors or warnings in logs
- [ ] Quality metrics stable or improving
- [ ] Notifications working as expected
- [ ] CPU usage reasonable (< 10% of 1 core)
- [ ] Memory usage stable (< 500MB)
- [ ] Disk usage acceptable (< 1GB reports)

---

## Ongoing Operations

### Weekly Tasks

- [ ] Review quality reports
- [ ] Check trend analysis
- [ ] Address critical issues
- [ ] Verify scheduler running
- [ ] Monitor log file size (rotate if > 100MB)

### Monthly Tasks

- [ ] Full audit of all configurations
- [ ] Review historical trends
- [ ] Update exclusion patterns if needed
- [ ] Backup historical data
- [ ] Review and update thresholds if needed
- [ ] Test notification channels

### Quarterly Tasks

- [ ] Security audit of configuration
- [ ] Performance review and optimization
- [ ] Update dependencies (`npm audit`)
- [ ] Review and update documentation
- [ ] Plan feature improvements
- [ ] Capacity planning for growing repository

---

## Rollback Procedure

If issues occur, rollback as follows:

```bash
# 1. Stop the agent
npm run quality:stop

# 2. Restore backup configuration
cp /backup/.psb/quality-agent-config.yaml .psb/

# 3. Restore backup state (optional)
cp /backup/.psb/state/ .psb/

# 4. Remove or comment out schedules (if needed)
rm .psb/schedules/*

# 5. Restart agent with previous version
npm run quality:start

# 6. Verify operation
npm run quality:scan
```

---

## Handoff Checklist

Before handing off to operations team:

- [ ] All documentation provided and reviewed
- [ ] Configuration guide created and tested
- [ ] Troubleshooting guide available
- [ ] Support contact information provided
- [ ] Escalation procedures documented
- [ ] Monitoring dashboard set up
- [ ] Alert thresholds configured
- [ ] Backup procedures in place
- [ ] Disaster recovery plan documented
- [ ] Operations team trained

---

## Success Criteria

Deployment is successful when:

✅ Agent successfully scans repository daily
✅ Quality reports generated in all formats
✅ No errors in logs for 7+ days
✅ All 8 quality dimensions functioning
✅ Notifications reaching team
✅ Trend data accumulating (7+ days history)
✅ Performance metrics within limits
✅ Zero security issues
✅ Full documentation accessible
✅ Team can operate autonomously

---

**Deployment Complete!** The PSB Quality Agent is now monitoring your repository.
