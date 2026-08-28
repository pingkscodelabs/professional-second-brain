# PSB Quality Agent - Complete Documentation (Part 1/2)

## Table of Contents (Full Document)
1. Overview & Core Features
2. Architecture & Design
3. Installation & Setup
4. Configuration Guide
5. Usage & CLI Commands
6. Quality Dimensions (8 types)
7. Report Formats (JSON, Markdown, HTML, CSV)
8. Scheduling & Monitoring
9. Auto-Fix Capabilities
10. Integrations (GitHub, Slack, Email)
11. Dashboard & Visualization
12. Trend Analysis & Metrics
13. Notifications System
14. Performance Optimization
15. Troubleshooting Guide
16. API Reference
17. Code Examples
18. FAQ & Best Practices
19. Contributing Guidelines
20. License & Support

---

## Overview

The **PSB Quality Agent** is an autonomous quality monitoring and maintenance system for the Professional Second Brain repository. It continuously scans content, detects quality issues across 8 dimensions, applies automatic fixes, generates comprehensive reports, and provides actionable recommendations.

### Key Capabilities

- **Continuous Auditing**: Scheduled and on-demand repository scans
- **Multi-Dimensional Analysis**: Evaluates 8 quality dimensions simultaneously
- **Fabrication Detection**: Identifies factual inaccuracies and unsubstantiated claims
- **Confidentiality Auditing**: Detects sensitive data exposure
- **Auto-Fix**: Automatically resolves simple quality issues
- **Trend Analysis**: Tracks quality metrics over time
- **Multi-Format Reporting**: JSON, Markdown, HTML, and CSV exports
- **Smart Notifications**: Alerts on critical issues with configurable channels
- **Pre-Commit Hooks**: Validates content before commits
- **Scalability**: Handles 100+ files efficiently

---

## Core Features

### 1. Continuous Auditing
Scan repository on schedule or on-demand with configurable intervals:
- Hourly scans for critical monitoring
- Daily scans for routine quality checks
- Weekly scans for comprehensive audits
- Monthly deep-dive analysis

### 2. Issue Detection
Identifies issues across 8 quality dimensions:
- Fabrication Risk
- Evidence Coverage
- Confidentiality Risk
- Completeness
- Consistency
- Technology Alignment
- Link Validity
- Structure Validation

### 3. Trend Analysis
Tracks quality metrics with:
- Historical score comparison
- Trend identification (improving/stable/declining)
- Velocity measurement (fast/moderate/slow)
- Degradation alerts

### 4. Auto-Fix
Automatically remediate simple issues:
- Text replacements
- Missing information addition
- Redundant element removal
- Format standardization

### 5. Reporting
Generate comprehensive reports in multiple formats:
- JSON for programmatic access
- Markdown for GitHub integration
- HTML for dashboard visualization
- CSV for data analysis

### 6. Notifications
Alert on quality issues:
- Console messages
- Slack integration (optional)
- Email notifications (optional)
- GitHub issue creation

### 7. Recommendations
Provide actionable improvement suggestions:
- Evidence strengthening recommendations
- Structure optimization advice
- Consistency fixes
- Link validation guidance

### 8. Pre-Commit Hooks
Prevent quality degradation:
- Automatic pre-commit validation
- Configurable quality thresholds
- Block commits that fail checks

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│          PSB Quality Agent System Architecture              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  CLI Layer        [scan] [monitor] [report] [fix]           │
│      ↓                                                        │
│  Orchestration    PSBQualityAgent Core Engine               │
│      ↓                                                        │
│  Analysis         Quality Checker Skill (8-dimensions)      │
│      ↓                                                        │
│  Processing       Reporter | Scheduler | State Manager      │
│      ↓                                                        │
│  Output           Reports | Logs | History | Notifications  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Module Responsibilities

| Module | Responsibility |
|--------|-----------------|
| psb-quality-agent-types.ts | Type definitions and interfaces |
| psb-quality-agent-core.ts | Main orchestration engine |
| psb-quality-agent-scheduler.ts | Scheduled operation management |
| psb-quality-agent-reporter.ts | Multi-format report generation |
| psb-quality-agent-cli.ts | Command-line interface |
| psb-quality-agent-config.yaml | Configuration file |

---

## Installation

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- Git (for repository operations)
- TypeScript 5.0+

### Installation Steps

```bash
# 1. Navigate to repository
cd professional-second-brain

# 2. Install dependencies
npm install

# 3. Copy quality agent files to repository root
cp psb-quality-agent-*.ts ./
cp psb-quality-agent-*.yaml ./
cp psb-quality-agent-*.json ./

# 4. Build TypeScript
npm run build

# 5. Verify installation
npx ts-node psb-quality-agent-cli.ts --version
# Output: PSB Quality Agent v1.0.0
```

### Docker Installation

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY psb-quality-agent-* ./

# Set up volume for repository
VOLUME ["/repo"]
WORKDIR /repo

CMD ["npm", "start"]
```

---

## Configuration

The agent is configured via `psb-quality-agent-config.yaml`. Key sections:

### Quality Thresholds

```yaml
quality_thresholds:
  overall: 70              # Target overall quality score
  fabrication_risk: 30     # Maximum acceptable fabrication risk
  confidentiality_risk: 10 # Critical confidentiality threshold
  completeness: 75         # Minimum content completeness
  consistency: 80          # Minimum internal consistency
  technology_alignment: 75 # Technology compatibility score
  evidence_coverage: 70    # Minimum evidence presence
  link_validity: 85        # Valid links percentage
```

### Scan Intervals

```yaml
scan_intervals:
  hourly: false   # Continuous real-time monitoring
  daily: true     # Daily routine quality check
  weekly: true    # Weekly comprehensive audit
  monthly: false  # Monthly deep-dive analysis
```

### Auto-Fix Settings

```yaml
auto_fix:
  enabled: true                           # Enable auto-fixing
  dimensions:                             # Fixable dimensions
    - completeness
    - consistency
    - structure
    - links
  severity_levels:                        # Auto-fix severity
    - info
    - warning
  dry_run_by_default: false               # Apply fixes by default
```

### Notification Configuration

```yaml
notifications:
  enabled: true
  channels:
    - console                  # Console output
    # - slack                  # Slack integration
    # - email                  # Email notifications
    # - github                 # GitHub issues
  rules:
    confidentiality_violation:
      enabled: true
      channels: [console]
      severity: critical
    quality_degradation:
      enabled: true
      channels: [console]
      severity: warning
      threshold_percentage: 5
```

---

## Usage Quick Start

### Command Examples

```bash
# Run immediate scan
npx ts-node psb-quality-agent-cli.ts scan .

# Generate markdown report
npx ts-node psb-quality-agent-cli.ts report markdown report.md

# Start daily monitoring
npx ts-node psb-quality-agent-cli.ts monitor daily

# Apply auto-fixes (preview only)
npx ts-node psb-quality-agent-cli.ts fix --dry-run

# Manage schedules
npx ts-quality-agent-cli.ts schedule list
npx ts-quality-agent-cli.ts schedule create "Daily Check" daily
npx ts-quality-agent-cli.ts schedule start
```

### Programmatic Usage

```typescript
import { PSBQualityAgent } from './psb-quality-agent-core';
import { QualityAgentInput } from './psb-quality-agent-types';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

// Load configuration
const configContent = fs.readFileSync('psb-quality-agent-config.yaml', 'utf-8');
const config = yaml.load(configContent) as any;

// Initialize agent
const agent = new PSBQualityAgent(config);

// Execute scan
const result = await agent.execute({
  operation: 'scan',
  scope: 'repository',
  target_path: '.',
  quality_threshold: 70,
  report_format: 'markdown',
  auto_fix_enabled: false
});

// Handle results
console.log(`Overall Quality: ${result.quality_scores.overall}/100`);
console.log(`Issues Found: ${result.scan_result.issues_found}`);

if (result.trend_analysis) {
  console.log(`Trend: ${result.trend_analysis.trend}`);
}
```

---

## CLI Commands Reference

### scan
Run immediate quality audit on repository or specific path.

```bash
psb-quality-agent scan [path]

# Examples:
psb-quality-agent scan .              # Scan entire repo
psb-quality-agent scan ./docs         # Scan specific directory
psb-quality-agent scan ./docs/file.md # Scan specific file
```

### monitor
Start continuous quality monitoring with specified interval.

```bash
psb-quality-agent monitor [interval] [duration]

# Examples:
psb-quality-agent monitor daily              # Run daily
psb-quality-agent monitor hourly 240         # Hourly for 4 hours
psb-quality-agent monitor weekly             # Run weekly
```

### report
Generate quality report in specified format.

```bash
psb-quality-agent report [format] [output]

# Examples:
psb-quality-agent report json               # Print JSON
psb-quality-agent report markdown report.md # Save Markdown
psb-quality-agent report html report.html   # Generate HTML
psb-quality-agent report csv report.csv     # Export CSV
```

### fix
Apply automatic fixes to detected quality issues.

```bash
psb-quality-agent fix [--dry-run]

# Examples:
psb-quality-agent fix                      # Apply fixes
psb-quality-agent fix --dry-run            # Preview only
psb-quality-agent fix completeness         # Fix dimension
```

### schedule
Manage scheduled quality operations.

```bash
psb-quality-agent schedule <operation> [args]

# List operations
psb-quality-agent schedule list

# Create new schedule
psb-quality-agent schedule create "Daily Check" daily

# Delete schedule
psb-quality-agent schedule delete schedule-1234567890

# Start/stop scheduler
psb-quality-agent schedule start
psb-quality-agent schedule stop
```

---

## Quality Dimensions

### 1. Fabrication Risk (0-100, lower is better)

**Definition:** Measures presence of unsubstantiated claims and factual inaccuracies.

**Detection Criteria:**
- Unsourced assertions without citations
- Contradictory statements within document
- False or unverifiable citations
- Made-up examples or scenarios
- Exaggerated claims lacking evidence

**Example Issue:**
```
FABRICATION RISK - HIGH
  File: docs/technology-guide.md:45
  Severity: WARNING
  Issue: "React has 99.9% guaranteed type safety" - unsourced claim
  Suggestion: Add supporting evidence or remove claim
  Auto-fixable: No (requires manual review)
```

**Improvement Strategy:**
- Add citations for all major claims
- Link to authoritative sources
- Include real examples and case studies
- Verify all facts before publishing

---

### 2. Evidence Coverage (0-100, higher is better)

**Definition:** Measures completeness of supporting evidence for claims.

**Detection Criteria:**
- Missing citations for important claims
- Weak or questionable evidence sources
- Incomplete references or broken links
- Unsubstantiated recommendations
- Lack of expert references

**Example Issue:**
```
EVIDENCE COVERAGE - LOW
  File: docs/best-practices.md:120
  Severity: INFO
  Issue: Recommendation lacks supporting evidence
  Suggestion: Add research studies, metrics, or expert quotes
  Auto-fixable: No (requires content additions)
```

**Improvement Strategy:**
- Research and cite authoritative sources
- Include metrics and data where applicable
- Reference expert opinions and case studies
- Link to detailed supporting documentation

---

### 3. Confidentiality Risk (0-100, lower is better)

**Definition:** Identifies exposure of sensitive data that should be protected.

**Detection Criteria:**
- API keys or authentication credentials
- Personal information (emails, phone numbers)
- Proprietary data or trade secrets
- Internal IP addresses or URLs
- Database connection strings
- Private keys or tokens

**Example Issue:**
```
CONFIDENTIALITY RISK - CRITICAL
  File: .env.example:10
  Severity: CRITICAL
  Issue: Actual API key exposed: "sk_live_abc123..." 
  Suggestion: Replace with placeholder "your_api_key_here"
  Auto-fixable: Yes (replace with placeholder)
```

**Improvement Strategy:**
- Use placeholders for all credentials (.env.example)
- Never commit actual secrets
- Review all files before committing
- Use environment variables for sensitive data
- Implement pre-commit hooks to catch secrets

---

### 4. Completeness (0-100, higher is better)

**Definition:** Measures information sufficiency and thoroughness.

**Detection Criteria:**
- Missing required sections in documentation
- Incomplete explanations or workflows
- Absent code examples or use cases
- Incomplete troubleshooting guidance
- Missing setup or configuration steps

**Example Issue:**
```
COMPLETENESS - MEDIUM
  File: docs/setup-guide.md
  Severity: WARNING
  Issue: Installation section missing troubleshooting steps
  Suggestion: Add "Troubleshooting" section with common issues
  Auto-fixable: No (requires content additions)
```

**Improvement Strategy:**
- Follow documentation templates
- Include setup, usage, and troubleshooting sections
- Provide complete code examples
- Add configuration options reference
- Include FAQ section

---

### 5. Consistency (0-100, higher is better)

**Definition:** Detects contradictions and standardization issues.

**Detection Criteria:**
- Conflicting information across documents
- Inconsistent terminology or naming conventions
- Format inconsistencies (spacing, structure, style)
- Contradictory recommendations or guidance
- Version mismatches

**Example Issue:**
```
CONSISTENCY - MEDIUM
  Files: docs/guide-v1.md, docs/guide-v2.md
  Severity: WARNING
  Issue: Same concept "widget" (v1) vs "component" (v2)
  Suggestion: Standardize terminology across all documents
  Auto-fixable: No (requires manual review)
```

**Improvement Strategy:**
- Create and maintain style guide
- Use consistent terminology throughout
- Follow consistent formatting conventions
- Keep related documents in sync
- Use version control for documentation

---

### 6. Technology Alignment (0-100, higher is better)

**Definition:** Verifies technical accuracy and compatibility.

**Detection Criteria:**
- Outdated syntax or deprecated patterns
- Incompatible versions of dependencies
- API mismatches or breaking changes
- Deprecated programming patterns
- Obsolete technology recommendations

**Example Issue:**
```
TECHNOLOGY ALIGNMENT - LOW
  File: docs/tutorial.md:50
  Severity: WARNING
  Issue: Uses deprecated React class component syntax
  Suggestion: Update to React functional components with hooks
  Auto-fixable: No (requires code review)
```

**Improvement Strategy:**
- Keep technology documentation current
- Test code examples with current versions
- Document version compatibility
- Include migration guides for breaking changes
- Reference official documentation

---

### 7. Link Validity (0-100, higher is better)

**Definition:** Validates all references and hyperlinks.

**Detection Criteria:**
- Broken external links (404s, timeouts)
- Invalid or malformed URLs
- Dead internal references
- Circular reference chains
- Missing anchor links

**Example Issue:**
```
LINK VALIDITY - MEDIUM
  File: docs/readme.md:25
  Severity: INFO
  Issue: Link to "/old-documentation" returns 404
  Suggestion: Update to current documentation path
  Auto-fixable: Yes (update URL or remove link)
```

**Improvement Strategy:**
- Regularly validate all links
- Update broken links immediately
- Use relative paths for internal links
- Implement link checking in CI/CD
- Maintain link registry for renamed files

---

### 8. Structure Validation (0-100, higher is better)

**Definition:** Ensures proper document organization and hierarchy.

**Detection Criteria:**
- Multiple H1 headers (should have one main title)
- Improper heading hierarchy (H1 to H3 skip)
- Orphaned sections without parent headers
- Missing table of contents
- Inconsistent structure across similar documents

**Example Issue:**
```
STRUCTURE VALIDATION - MEDIUM
  File: docs/architecture.md
  Severity: INFO
  Issue: Multiple H1 headers (should have one main title)
  Suggestion: Change extra H1s to H2s for proper hierarchy
  Auto-fixable: Yes (promote/demote headers)
```

**Improvement Strategy:**
- Use proper markdown header hierarchy
- Include table of contents
- Follow consistent document structure
- Use clear section headings
- Group related content logically

---

**End of Part 1**

See Part 2 for:
- Report Formats (JSON, Markdown, HTML, CSV)
- Scheduling & Monitoring
- Auto-Fix Capabilities
- Integrations & Notifications
- Dashboard & Visualization
- Performance & Troubleshooting
- API Reference & Examples
- FAQ & Contributing
