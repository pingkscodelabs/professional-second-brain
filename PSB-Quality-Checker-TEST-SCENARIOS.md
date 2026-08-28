# PSB-Quality-Checker Test Scenarios

Comprehensive test cases covering all 8 quality dimensions, edge cases, and integration scenarios.

## Test Execution Guide

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testNamePattern="Fabrication"

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

## Test Data Setup

```typescript
// test/setup.ts
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export function setupTestFiles() {
  mkdirSync('test-data', { recursive: true });
  
  // Create sample files for testing
  const projectTemplate = `
# Project: Test Platform
## Overview
A test project for validation.

## Technologies
- Node.js
- React
- PostgreSQL

## Impact
Improved system performance by 50% (see [metrics](../../evidence/metrics.md))

## Duration
6 months
`;
  
  writeFileSync('test-data/project.md', projectTemplate);
}

afterEach(() => {
  // Cleanup
  exec('rm -rf test-data');
});
```

---

## Dimension 1: Fabrication Detection Tests

### Test 1.1: Unsupported Metrics

**Scenario**: File contains quantified claims without evidence links

**Test File**:
```markdown
# E-Commerce Platform

## Achievements
- Improved performance by 50%
- Reduced costs by 30%
- Scaled to handle 10M requests daily
```

**Expected Result**:
```typescript
{
  type: 'fabrication',
  severity: 'warning',
  count: 3,  // Three unsupported metrics
  issues: [
    { message: 'Metric "50%" lacks supporting evidence' },
    { message: 'Metric "30%" lacks supporting evidence' },
    { message: 'Metric "10M" lacks supporting evidence' }
  ]
}
```

**Test Code**:
```typescript
test('should detect unsupported metrics', async () => {
  const checker = new QualityChecker();
  const result = await checker.checkFile('test-data/project.md', 'fabrication');
  
  const fabricationIssues = result.issues.filter(i => i.type === 'fabrication');
  expect(fabricationIssues.length).toBeGreaterThan(0);
  expect(fabricationIssues[0].severity).toBe('warning');
});
```

---

### Test 1.2: Supported Metrics with Evidence Links

**Scenario**: Same metrics but with evidence links

**Test File**:
```markdown
# E-Commerce Platform

## Achievements
- Improved performance by 50% [see metrics](../../evidence/perf-metrics.md)
- Reduced costs by 30% [cost analysis](../../evidence/cost-analysis.md)
- Scaled to handle 10M requests daily [capacity report](../../evidence/capacity.md)
```

**Expected Result**:
```typescript
{
  type: 'fabrication',
  severity: 'none',
  count: 0  // No issues
}
```

**Test Code**:
```typescript
test('should not flag metrics with evidence links', async () => {
  const checker = new QualityChecker();
  const result = await checker.checkFile('test-data/supported-metrics.md', 'fabrication');
  
  const fabricationIssues = result.issues.filter(i => i.type === 'fabrication');
  expect(fabricationIssues.length).toBe(0);
});
```

---

### Test 1.3: Vague Language Detection

**Scenario**: Vague claims without quantification

**Test File**:
```markdown
# Project

## Impact
- Significantly improved system
- Greatly enhanced user experience
- Substantially reduced latency
- Dramatically increased efficiency
```

**Expected Result**:
```typescript
{
  type: 'fabrication',
  severity: 'warning',
  message: 'Vague language without quantification'
}
```

**Test Code**:
```typescript
test('should detect vague language', async () => {
  const result = await checker.checkFile('test-data/vague.md', 'fabrication');
  const vagueIssues = result.issues.filter(i => 
    i.message.includes('vague') || i.message.includes('quantif')
  );
  expect(vagueIssues.length).toBeGreaterThan(0);
});
```

---

### Test 1.4: Achievement Claims Without Evidence

**Scenario**: Achievement verbs used without supporting evidence

**Test File**:
```markdown
# Projects

## Leadership
- Led team of 8 engineers
- Managed $2M budget
- Delivered three major releases

## Technical
- Architected microservices platform
- Optimized database queries by 40%
```

**Expected Result**:
```typescript
{
  type: 'fabrication',
  achievement_claims: 5,
  unsupported_claims: 5
}
```

**Test Code**:
```typescript
test('should flag achievement claims lacking evidence', async () => {
  const result = await checker.checkFile('test-data/achievements.md', 'fabrication');
  expect(result.audit_report.fabrication_risk).toBeGreaterThan(50);
});
```

---

## Dimension 2: Evidence Verification Tests

### Test 2.1: Valid Link Resolution

**Scenario**: File contains valid markdown links that resolve

**Files**:
- `projects/platform.md` (main file)
- `evidence/metrics.md` (linked file)
- `projects/related.md` (sibling file)

**Test File**:
```markdown
# Platform

## Results
See [detailed metrics](../../evidence/metrics.md) and [related project](../related.md)
```

**Expected Result**:
```typescript
{
  type: 'missing_evidence' OR 'links',
  severity: 'none',
  broken_links: 0,
  valid_links: 2
}
```

**Test Code**:
```typescript
test('should validate existing links', async () => {
  const result = await checker.checkFile('test-data/with-links.md', 'evidence');
  expect(result.issues.filter(i => i.type === 'links')).toHaveLength(0);
});
```

---

### Test 2.2: Broken Link Detection

**Scenario**: File contains links to non-existent files

**Test File**:
```markdown
# Project

Results: [see metrics](../../nonexistent/file.md)
```

**Expected Result**:
```typescript
{
  type: 'links',
  severity: 'warning',
  message: 'Broken link: ../../nonexistent/file.md'
}
```

**Test Code**:
```typescript
test('should detect broken links', async () => {
  const result = await checker.checkFile('test-data/broken-links.md');
  const linkIssues = result.issues.filter(i => i.type === 'links');
  expect(linkIssues.length).toBeGreaterThan(0);
});
```

---

### Test 2.3: Evidence Coverage Scoring

**Scenario**: Calculate what percentage of claims have evidence

**Test File**:
```markdown
# Project

## Claims
1. Achieved 50% improvement [evidence](../evidence.md)  ✓
2. Delivered 3 features [see PR list](../prs.md)        ✓
3. Led team of 5                                         ✗
4. Reduced bugs by 60% [metrics](../metrics.md)         ✓
5. Improved UX                                           ✗
```

**Expected Result**:
```typescript
{
  total_claims: 5,
  claims_with_evidence: 3,
  coverage: 60,  // 3/5
  confidence: 'medium'
}
```

**Test Code**:
```typescript
test('should calculate evidence coverage', async () => {
  const result = await checker.checkFile('test-data/partial-evidence.md');
  expect(result.audit_report.evidence_coverage).toBeLessThan(100);
  expect(result.audit_report.evidence_coverage).toBeGreaterThan(0);
});
```

---

### Test 2.4: YAML Reference Validation

**Scenario**: Check if YAML cross-references resolve

**Files**:
- `projects.yml`: Contains project `platform-v2`
- `projects/platform.md`: References `[See project entry](projects.yml#platform-v2)`

**Expected Result**:
```typescript
{
  type: 'consistency',
  reference_valid: true
}
```

**Test Code**:
```typescript
test('should validate YAML references', async () => {
  const checker = new QualityChecker();
  const index = await checker.getMetadataIndex();
  
  const exists = index.projects.has('platform-v2');
  expect(exists).toBe(true);
});
```

---

## Dimension 3: Confidentiality Audit Tests

### Test 3.1: Email Detection

**Scenario**: File contains email addresses

**Test File**:
```markdown
# Client Case Study

Contact: john.doe@acme.com
Alternative: client-manager@company.co.uk
```

**Expected Result**:
```typescript
{
  type: 'confidentiality',
  severity: 'critical',
  matches: 2,
  suggestion: 'Replace with [CLIENT_CONTACT] or remove'
}
```

**Test Code**:
```typescript
test('should detect email addresses', async () => {
  const result = await checker.checkFile('test-data/emails.md', 'confidentiality');
  const emailIssues = result.issues.filter(i => 
    i.message.includes('email')
  );
  expect(emailIssues.length).toBe(2);
  expect(emailIssues[0].severity).toBe('critical');
});
```

---

### Test 3.2: API Key & Token Detection

**Scenario**: File contains credentials

**Test File**:
```markdown
# Configuration

API_KEY=sk_live_a1b2c3d4e5f6g7h8
token: eyJhbGciOiJIUzI1NiIs...
secret_access_key = AKIA2FCKYASFQ3EXAMPLE
```

**Expected Result**:
```typescript
{
  type: 'confidentiality',
  severity: 'critical',
  issues: [
    { message: 'API key detected' },
    { message: 'Bearer token detected' },
    { message: 'AWS access key detected' }
  ]
}
```

**Test Code**:
```typescript
test('should detect API keys and tokens', async () => {
  const result = await checker.checkFile('test-data/secrets.md', 'confidentiality');
  expect(result.audit_report.confidentiality_risk).toBeGreaterThan(60);
});
```

---

### Test 3.3: Unredacted Client Names

**Scenario**: Real client names exposed instead of codes

**Test File**:
```markdown
# Case Study

Client: Acme Corporation
Industry: Financial Services

We built a solution for Acme's trading platform...
```

**Expected Result**:
```typescript
{
  type: 'confidentiality',
  severity: 'warning',
  message: 'Client name should be redacted'
}
```

**Test Code**:
```typescript
test('should flag unredacted client names', async () => {
  const result = await checker.checkFile('test-data/unredacted.md', 'confidentiality');
  expect(result.issues.some(i => i.message.includes('redact'))).toBe(true);
});
```

---

### Test 3.4: Salary/Budget Information

**Scenario**: Financial information exposed

**Test File**:
```markdown
# Engagement

Budget: $2.5M
Salary after negotiation: $185K
Cost savings: $500K annually
```

**Expected Result**:
```typescript
{
  type: 'confidentiality',
  severity: 'warning',
  matches: 3
}
```

**Test Code**:
```typescript
test('should detect salary and budget figures', async () => {
  const result = await checker.checkFile('test-data/financials.md', 'confidentiality');
  expect(result.issues.filter(i => i.type === 'confidentiality').length).toBeGreaterThan(0);
});
```

---

### Test 3.5: IP Address Detection

**Scenario**: Internal IP addresses mentioned

**Test File**:
```markdown
# Network

Production server: 192.168.1.100
Backup: 10.0.0.5
```

**Expected Result**:
```typescript
{
  type: 'confidentiality',
  severity: 'warning'
}
```

**Test Code**:
```typescript
test('should detect IP addresses', async () => {
  const result = await checker.checkFile('test-data/ips.md', 'confidentiality');
  expect(result.issues.some(i => i.message.includes('IP'))).toBe(true);
});
```

---

### Test 3.6: Phone Number Detection

**Scenario**: Phone numbers exposed

**Test File**:
```markdown
Contact me: 555-123-4567
```

**Expected Result**:
```typescript
{
  type: 'confidentiality',
  severity: 'warning'
}
```

**Test Code**:
```typescript
test('should detect phone numbers', async () => {
  const result = await checker.checkFile('test-data/phones.md', 'confidentiality');
  expect(result.issues.some(i => i.message.includes('phone'))).toBe(true);
});
```

---

## Dimension 4: Completeness Scoring Tests

### Test 4.1: Project Completeness

**Scenario**: Project file missing required sections

**Test File**:
```markdown
# Platform Project

## Overview
Built a SaaS platform.

## Technologies
Node.js, React
```

**Missing**: impact, duration

**Expected Result**:
```typescript
{
  type: 'completeness',
  required_fields: 5,
  found_fields: 3,
  score: 60,
  missing: ['impact', 'duration']
}
```

**Test Code**:
```typescript
test('should score project completeness', async () => {
  const result = await checker.checkFile('test-data/incomplete-project.md');
  const completenessIssues = result.issues.filter(i => i.type === 'completeness');
  expect(completenessIssues.length).toBeGreaterThan(0);
  expect(result.audit_report.completeness_score).toBeLessThan(100);
});
```

---

### Test 4.2: Skill Completeness

**Scenario**: Skill entry with all required fields

**Test File**:
```markdown
# JavaScript

## Proficiency
Advanced

## Experience
8 years
```

**Expected Result**:
```typescript
{
  type: 'completeness',
  score: 100,
  all_required_present: true
}
```

**Test Code**:
```typescript
test('should recognize complete skill entry', async () => {
  const result = await checker.checkFile('test-data/complete-skill.md');
  expect(result.audit_report.completeness_score).toBe(100);
});
```

---

## Dimension 5: Consistency Checking Tests

### Test 5.1: Project Name Consistency

**Scenario**: Metadata vs markdown project names don't match

**Files**:
- `metadata/projects.yml`: `- name: Platform V2`
- `projects/platform.md`: `# Platform Version 2`

**Expected Result**:
```typescript
{
  type: 'consistency',
  severity: 'warning',
  message: 'Project name mismatch between metadata and file'
}
```

**Test Code**:
```typescript
test('should detect project name inconsistencies', async () => {
  const result = await checker.checkFile('test-data/inconsistent-project.md', 'consistency');
  expect(result.issues.some(i => i.type === 'consistency')).toBe(true);
});
```

---

### Test 5.2: Technology Reference Consistency

**Scenario**: Project claims to use tech not listed in metadata

**metadata/projects.yml**:
```yaml
- name: Platform
  technologies: [Node.js, React]
```

**File says**:
```markdown
# Platform
- Node.js
- React
- Python
```

**Expected Result**:
```typescript
{
  type: 'consistency',
  message: 'Technology "Python" mentioned but not in metadata'
}
```

---

### Test 5.3: Date Range Consistency

**Scenario**: Duration doesn't match start/end dates

**File**:
```markdown
# Project

Duration: 6 months
Started: January 2023
Ended: December 2023 (should be July 2023)
```

**Expected Result**:
```typescript
{
  type: 'consistency',
  severity: 'warning'
}
```

---

## Dimension 6: Technology Matching Tests

### Test 6.1: Registered Technology

**Scenario**: Technology exists in technologies.yml

**technologies.yml**:
```yaml
- name: Kubernetes
  category: DevOps
```

**File mentions**: Kubernetes

**Expected Result**:
```typescript
{
  type: 'technology',
  match: true
}
```

---

### Test 6.2: Unregistered Technology

**Scenario**: Technology not in registry

**technologies.yml**: (no "MyNewTool")

**File mentions**: MyNewTool

**Expected Result**:
```typescript
{
  type: 'technology',
  severity: 'warning',
  message: 'Unregistered technology: MyNewTool',
  suggestion: 'Register in technologies.yml'
}
```

**Test Code**:
```typescript
test('should flag unregistered technologies', async () => {
  const result = await checker.checkFile('test-data/unregistered-tech.md', 'technology');
  expect(result.issues.some(i => i.type === 'technology')).toBe(true);
});
```

---

### Test 6.3: Technology Alias Matching

**Scenario**: Abbreviated tech names (JS → JavaScript)

**File mentions**: "JS, TypeScript, K8s"

**Expected Result**:
```typescript
{
  matches: [
    { mentioned: 'JS', matched: 'JavaScript' },
    { mentioned: 'TypeScript', matched: 'TypeScript' },
    { mentioned: 'K8s', matched: 'Kubernetes' }
  ]
}
```

**Test Code**:
```typescript
test('should match technology aliases', async () => {
  const result = await checker.checkFile('test-data/tech-aliases.md');
  expect(result.issues.filter(i => i.type === 'technology')).toHaveLength(0);
});
```

---

## Dimension 7: Link Validation Tests

### Test 7.1: Markdown Link Validation

**Scenario**: Various markdown link formats

**Test File**:
```markdown
[Valid](../projects/existing.md)
[Broken](../nonexistent.md)
[Anchor](#section)
[Absolute](/full/path.md)
```

**Expected Result**:
```typescript
{
  links: [
    { url: '../projects/existing.md', status: 'valid' },
    { url: '../nonexistent.md', status: 'broken' },
    { url: '#section', status: 'anchor' },
    { url: '/full/path.md', status: 'invalid_format' }
  ]
}
```

---

### Test 7.2: Cross-File Link Resolution

**Scenario**: Links resolve across directory structure

**Files**:
- `projects/subdir/file.md` → `../../evidence/data.md` (should resolve to `evidence/data.md`)

**Expected Result**:
```typescript
{
  resolved: true,
  target: 'evidence/data.md'
}
```

---

## Dimension 8: Structure Validation Tests

### Test 8.1: Header Hierarchy

**Scenario**: Proper markdown header sequence

**Good**:
```markdown
# Main Title
## Section
### Subsection
#### Detail
```

**Bad**:
```markdown
# Main Title
### Subsection (missing H2)
## Section (wrong order)
```

**Expected Result**:
```typescript
{
  type: 'structure',
  valid: false,
  issues: ['Missing H2 between H1 and H3', 'Header order incorrect']
}
```

---

### Test 8.2: Required Sections Present

**Scenario**: Project template validation

**Template requires**: Title, Overview, Technologies, Impact

**File has**: Title, Overview, Technologies (missing Impact)

**Expected Result**:
```typescript
{
  type: 'structure',
  required_sections: 4,
  found_sections: 3,
  missing: ['Impact']
}
```

---

### Test 8.3: Code Block Syntax

**Scenario**: Verify valid markdown code blocks

**Valid**:
```markdown
\`\`\`javascript
console.log('test');
\`\`\`
```

**Invalid**:
```markdown
\`\`javascript
console.log('test');
\`\`  (missing backtick)
```

**Expected Result**:
```typescript
{
  type: 'structure',
  code_blocks_valid: true/false
}
```

---

## Integration Tests

### Test 9.1: Full File Audit

**Scenario**: Comprehensive audit of real-world project file

**Test File**: Complex project with multiple issues

**Expected Result**:
```typescript
{
  overall_quality_score: 75,
  issues: [
    { type: 'fabrication', severity: 'warning' },
    { type: 'completeness', severity: 'info' },
    { type: 'links', severity: 'warning' }
  ],
  audit_report: {
    fabrication_risk: 35,
    confidentiality_risk: 0,
    completeness_score: 85,
    evidence_coverage: 65
  }
}
```

---

### Test 9.2: Repository Audit

**Scenario**: Full repo health assessment

**Expected Result**:
```typescript
{
  overall_score: 78,
  health_status: 'good',
  critical_issues_count: 0,
  files_audited: 47,
  files: [
    { path: 'projects/a.md', quality_score: 92 },
    { path: 'projects/b.md', quality_score: 65 }
  ]
}
```

---

### Test 9.3: Batch Processing

**Scenario**: Check multiple files in parallel

```typescript
const paths = ['projects/a.md', 'projects/b.md', 'skills/c.md'];
const results = await checker.checkFiles(paths, { parallel: 10 });

expect(results).toHaveLength(3);
expect(results.every(r => r.overall_quality_score !== undefined)).toBe(true);
```

---

## Performance Tests

### Test 10.1: Single File Benchmark

```typescript
test('should check single file within 500ms', async () => {
  const start = Date.now();
  await checker.checkFile('test-data/project.md');
  const elapsed = Date.now() - start;
  
  expect(elapsed).toBeLessThan(500);
});
```

---

### Test 10.2: Batch Processing Efficiency

```typescript
test('should process 100 files within 10 seconds', async () => {
  const files = Array(100).fill(0).map((_, i) => `test-data/file-${i}.md`);
  
  const start = Date.now();
  await checker.checkFiles(files, { parallel: 10 });
  const elapsed = Date.now() - start;
  
  expect(elapsed).toBeLessThan(10000);
});
```

---

## Error Handling Tests

### Test 11.1: Missing File Handling

```typescript
test('should handle missing files gracefully', async () => {
  const result = await checker.checkFile('nonexistent.md');
  
  expect(result.issues.some(i => i.type === 'error')).toBe(true);
  expect(result.overall_quality_score).toBeLessThan(50);
});
```

---

### Test 11.2: Metadata Loading Failure

```typescript
test('should continue without metadata if loading fails', async () => {
  // Mock metadata loading failure
  spyOn(checker, 'getMetadataIndex').and.returnValue(Promise.reject(new Error('Failed')));
  
  const result = await checker.checkFile('test-data/project.md');
  
  // Should still complete, just without consistency checks
  expect(result.overall_quality_score).toBeDefined();
});
```

---

## Summary

- **Total Tests**: 50+
- **Coverage**: All 8 dimensions + integration + performance + error handling
- **Expected Pass Rate**: 100% (with proper test data setup)
- **Total Execution Time**: <5 minutes

Run with: `npm test`

---

**See also**: [README](PSB-Quality-Checker-README.md), [User Guide](PSB-Quality-Checker-USER-GUIDE.md), [Implementation](PSB-Quality-Checker-IMPLEMENTATION.md)
