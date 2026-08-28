# PSB-Quality-Checker API Reference

Complete type definitions, class methods, and function signatures for the PSB-Quality-Checker system.

## Table of Contents

1. [Core Types](#core-types)
2. [QualityChecker Class](#qualitychecker-class)
3. [Quality Dimension Checkers](#quality-dimension-checkers)
4. [RepositoryAuditor Class](#repositoryauditor-class)
5. [Report Types](#report-types)
6. [Utility Functions](#utility-functions)

## Core Types

### QualityCheckResult

```typescript
interface QualityCheckResult {
  overall_quality_score: number;      // 0-100
  issues: Issue[];
  confidence: 'high' | 'medium' | 'low';
  audit_report: AuditReport;
  metadata?: {
    filePath: string;
    fileType: 'markdown' | 'yaml' | 'json';
    processingTime: number;          // milliseconds
    linesAnalyzed: number;
    linksChecked: number;
  };
}
```

### Issue

```typescript
interface Issue {
  type: IssueType;
  severity: IssueSeverity;
  location: string;                 // Line number or reference
  message: string;                  // Human-readable description
  suggestion: string;               // How to fix
  confidence?: 'high' | 'medium' | 'low';
  evidence?: string;                // Supporting context
}

type IssueType = 
  | 'fabrication'
  | 'missing_evidence'
  | 'confidentiality'
  | 'consistency'
  | 'structure'
  | 'links'
  | 'completeness'
  | 'technology';

type IssueSeverity = 'critical' | 'warning' | 'info';
```

### AuditReport

```typescript
interface AuditReport {
  fabrication_risk: number;        // 0-100
  confidentiality_risk: number;    // 0-100
  completeness_score: number;      // 0-100
  evidence_coverage: number;       // 0-100
  structure_score?: number;        // 0-100
  consistency_score?: number;      // 0-100
  technology_score?: number;       // 0-100
  links_validity?: number;         // 0-100 (percentage of valid links)
}
```

### MetadataIndex

```typescript
interface MetadataIndex {
  projects: Map<string, ProjectMetadata>;
  skills: Map<string, SkillMetadata>;
  technologies: Map<string, TechMetadata>;
  clients: Map<string, ClientMetadata>;
  experience: Map<string, ExperienceMetadata>;
}

interface ProjectMetadata {
  name: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  clientCode?: string;
  impact?: string;
}

interface SkillMetadata {
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years: number;
  endorsements?: number;
}

interface TechMetadata {
  name: string;
  category: string;
  version?: string;
  proficiency?: string;
}

interface ClientMetadata {
  code: string;
  industry: string;
  engagementType: string;
  duration: string;
}

interface ExperienceMetadata {
  title: string;
  company?: string;
  duration: string;
  technologies?: string[];
}
```

## QualityChecker Class

### Constructor

```typescript
class QualityChecker {
  constructor(options?: QualityCheckerOptions) {
    // Initialize checkers with optional custom configuration
  }
}

interface QualityCheckerOptions {
  metadataPath?: string;           // Path to metadata directory (default: 'metadata')
  cacheMetadata?: boolean;         // Cache loaded metadata (default: true)
  customPatterns?: {
    fabrication?: RegExp[];
    confidentiality?: RegExp[];
    vague?: RegExp[];
  };
  thresholds?: {
    fabricationRisk?: number;
    confidentialityRisk?: number;
    completenessMin?: number;
  };
}
```

### Methods

#### checkFile()

```typescript
async checkFile(
  filePath: string,
  dimension?: string,
  verbose?: boolean
): Promise<QualityCheckResult>
```

**Parameters**:
- `filePath` (string, required): Path to file to check (relative to repo root)
- `dimension` (string, optional): Specific dimension to check
  - `'fabrication'`, `'evidence'`, `'confidentiality'`, `'consistency'`, `'completeness'`, `'technology'`, `'structure'`, `'links'`
  - If omitted, checks all dimensions
- `verbose` (boolean, optional): Include detailed debugging info (default: false)

**Returns**: Promise<QualityCheckResult>

**Example**:
```typescript
// Check all dimensions
const result = await checker.checkFile('projects/platform.md');

// Check specific dimension
const fabResult = await checker.checkFile('projects/platform.md', 'fabrication');

// Verbose mode
const detailedResult = await checker.checkFile('projects/platform.md', null, true);
```

**Throws**:
- `Error` if file not found or unreadable
- `Error` if metadata loading fails (caught gracefully, continues with other checks)

---

#### checkFiles()

```typescript
async checkFiles(
  filePaths: string[],
  options?: BatchCheckOptions
): Promise<QualityCheckResult[]>
```

**Parameters**:
- `filePaths` (string[], required): Array of file paths to check
- `options` (BatchCheckOptions, optional):
  ```typescript
  interface BatchCheckOptions {
    parallel?: number;             // Parallel checks (default: 10)
    stopOnError?: boolean;         // Stop if any file errors (default: false)
    progressCallback?: (current: number, total: number) => void;
  }
  ```

**Returns**: Promise<QualityCheckResult[]>

**Example**:
```typescript
const paths = ['projects/a.md', 'projects/b.md', 'skills/c.md'];
const results = await checker.checkFiles(paths, { parallel: 5 });

// With progress tracking
const results = await checker.checkFiles(paths, {
  progressCallback: (current, total) => {
    console.log(`Progress: ${current}/${total}`);
  }
});
```

---

#### getMetadataIndex()

```typescript
async getMetadataIndex(): Promise<MetadataIndex>
```

**Returns**: Promise<MetadataIndex> with all loaded metadata

**Example**:
```typescript
const index = await checker.getMetadataIndex();
const projectNames = Array.from(index.projects.keys());
const technologies = Array.from(index.technologies.keys());
```

---

#### clearCache()

```typescript
clearCache(): void
```

Clears the metadata cache. Useful if metadata files have changed.

---

### Private Methods (For Extension)

#### calculateOverallScore()

```typescript
private calculateOverallScore(
  scores: Map<string, number>
): number
```

**Score Calculation**:
```
overall = (
  (scores['file_quality'] ?? 0) * 0.40 +
  (100 - (scores['fabrication_risk'] ?? 0)) * 0.25 +
  (100 - (scores['confidentiality_risk'] ?? 0)) * 0.25 +
  (scores['completeness'] ?? 0) * 0.10
) rounded to nearest integer
```

---

## Quality Dimension Checkers

### FabricationDetector

```typescript
class FabricationDetector {
  detect(
    content: string,
    lines: string[]
  ): Issue[]
}
```

**Pattern Detection**:
- Red flags: 'improved', 'delivered', 'achieved', 'implemented', 'optimized'
- Vague language: 'significantly', 'substantially', 'greatly'
- Unsubstantiated metrics: Numbers without links

**Risk Scoring**:
- Per unsubstantiated metric: +15 points
- Per vague claim: +10 points
- Maximum: 100

**Example**:
```typescript
const detector = new FabricationDetector();
const issues = detector.detect(content, lines);
// Returns: Issue[] with type: 'fabrication'
```

---

### EvidenceVerifier

```typescript
class EvidenceVerifier {
  verify(
    content: string,
    filePath: string
  ): Issue[]
}
```

**Link Validation**:
- Markdown links: `[text](path)`
- YAML references: `file.yml#key`
- Internal anchors: `#section`

**Coverage Calculation**:
```
coverage = (claims_with_evidence / total_achievement_claims) * 100%

high confidence: >80%
medium confidence: 50-80%
low confidence: <50%
```

**Example**:
```typescript
const verifier = new EvidenceVerifier();
const issues = verifier.verify(content, 'projects/platform.md');
// coverage available in audit_report.evidence_coverage
```

---

### ConfidentialityAuditor

```typescript
class ConfidentialityAuditor {
  audit(
    content: string,
    filePath: string
  ): Issue[]
}
```

**Patterns Detected**:
```typescript
{
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  API_KEY: /(api[_-]?key|token|secret)[\s]*[:=]\s*[^\s]+/gi,
  PHONE: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  IP_ADDRESS: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  SALARY: /\$[\d,]+(?:k|K)?|\b\d+[kK]\b/g,
  SSN: /\b\d{3}-\d{2}-\d{4}\b/g,
  CREDIT_CARD: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g
}
```

**Severity by Pattern**:
- CRITICAL: API_KEY, EMAIL, CREDIT_CARD
- WARNING: PHONE, IP_ADDRESS, SSN, SALARY
- INFO: Unredacted client names

**Example**:
```typescript
const auditor = new ConfidentialityAuditor();
const issues = auditor.audit(content, 'projects/sensitive.md');
```

---

### CompletenessScorer

```typescript
class CompletenessScorer {
  score(
    content: string,
    fileType: string
  ): { score: number; issues: Issue[] }
}
```

**Document Type Mappings**:
```typescript
{
  project: {
    required: ['title', 'description', 'technologies', 'impact', 'duration'],
    optional: ['team_size', 'budget', 'client', 'metrics']
  },
  skill: {
    required: ['name', 'proficiency', 'experience_years'],
    optional: ['certifications', 'endorsements', 'projects_using']
  },
  achievement: {
    required: ['title', 'description', 'date', 'impact'],
    optional: ['technologies', 'team_contribution']
  },
  client: {
    required: ['name_redacted', 'industry', 'engagement_type', 'duration'],
    optional: ['project_count', 'technologies', 'outcomes']
  }
}
```

**Scoring**:
```
score = (found_required / total_required) * 100%

Issues per missing required field: severity warning
Issues per incomplete optional coverage: severity info
```

---

### ConsistencyChecker

```typescript
class ConsistencyChecker {
  async check(
    filePath: string,
    content: string,
    metadataIndex: MetadataIndex
  ): Promise<Issue[]>
}
```

**Checks Performed**:
- Project name consistency across files
- Technology references match technologies.yml
- Skill proficiency levels consistent
- Client names properly redacted
- Date ranges don't conflict

**Example**:
```typescript
const index = await checker.getMetadataIndex();
const checker = new ConsistencyChecker();
const issues = await checker.check('projects/file.md', content, index);
```

---

### TechnologyMatcher

```typescript
class TechnologyMatcher {
  async match(
    content: string,
    metadataIndex: MetadataIndex
  ): Promise<Issue[]>
}
```

**Matching Strategy**:
- Case-insensitive exact match
- Common alias handling (JS→JavaScript, K8s→Kubernetes)
- Partial match detection
- Version number handling

**Common Aliases**:
```typescript
{
  'js': 'javascript',
  'ts': 'typescript',
  'k8s': 'kubernetes',
  'db': 'database',
  'api': 'rest api'
  // ... more aliases
}
```

**Issues Generated**:
- Unregistered technology: severity warning
- Suggestion: Register in technologies.yml

---

### StructureValidator

```typescript
class StructureValidator {
  validate(
    content: string
  ): Issue[]
}
```

**Markdown Checks**:
- Header hierarchy correctness (H1 → H2 → H3)
- Required headers present
- Code block syntax validity
- Link syntax correctness
- List formatting consistency

**Template Validation by Type**:
```typescript
{
  project: {
    headers: ['# Title', '## Overview', '## Technologies', '## Impact'],
    patterns: {
      'has_metrics': /\d+%|\$[\d,]+/,
      'has_links': /\[.*?\]\(.*?\)/
    }
  }
  // ... more templates
}
```

---

## RepositoryAuditor Class

### Constructor

```typescript
class RepositoryAuditor {
  constructor(qualityChecker?: QualityChecker) {
    // Uses provided checker or creates new instance
  }
}
```

### Methods

#### auditRepository()

```typescript
async auditRepository(
  options?: RepositoryAuditOptions
): Promise<RepositoryAudit>
```

**Parameters**:
```typescript
interface RepositoryAuditOptions {
  scope?: 'projects' | 'skills' | 'achievements' | 'clients' | 'all';
  minQualityScore?: number;        // Filter files below score
  includeFiles?: boolean;          // Include file-level details (default: true)
  maxFiles?: number;               // Process limit (default: unlimited)
  ignorePatterns?: string[];       // Glob patterns to ignore
}
```

**Returns**:
```typescript
interface RepositoryAudit {
  timestamp: string;
  overall_score: number;
  health_status: 'critical' | 'poor' | 'fair' | 'good' | 'excellent';
  files_audited: number;
  critical_issues_count: number;
  warning_issues_count: number;
  info_issues_count: number;
  files: FileQuality[];
  summary: AuditSummary;
}

interface FileQuality {
  path: string;
  quality_score: number;
  issues_count: number;
  critical_issues: number;
  warning_issues: number;
}

interface AuditSummary {
  avg_quality_score: number;
  highest_scoring_file: string;
  lowest_scoring_file: string;
  by_dimension: DimensionMetrics[];
}

interface DimensionMetrics {
  dimension: string;
  avg_score: number;
  critical_count: number;
}
```

**Example**:
```typescript
const auditor = new RepositoryAuditor();

// Full audit
const audit = await auditor.auditRepository({ scope: 'all' });

// Skills audit with details
const skillsAudit = await auditor.auditRepository({
  scope: 'skills',
  includeFiles: true,
  minQualityScore: 70
});

console.log(`Health: ${audit.health_status}`);
console.log(`Critical Issues: ${audit.critical_issues_count}`);
```

---

#### generateReport()

```typescript
async generateReport(
  options: ReportGenerationOptions
): Promise<string>
```

**Parameters**:
```typescript
interface ReportGenerationOptions {
  scope?: 'projects' | 'skills' | 'achievements' | 'clients' | 'all';
  format: 'json' | 'markdown' | 'html' | 'csv';
  detailed?: boolean;              // Include file-level details
  includeMetrics?: boolean;        // Include statistical charts
  outputPath?: string;             // Optional: write to file
}
```

**Returns**: Promise<string> with formatted report

**Example**:
```typescript
// Generate markdown report
const markdownReport = await auditor.generateReport({
  scope: 'projects',
  format: 'markdown',
  detailed: true
});

// Generate HTML report with metrics
const htmlReport = await auditor.generateReport({
  scope: 'all',
  format: 'html',
  includeMetrics: true,
  outputPath: 'quality-reports/audit.html'
});

// Generate CSV for spreadsheet analysis
const csvReport = await auditor.generateReport({
  scope: 'skills',
  format: 'csv'
});
```

---

#### getHealthStatus()

```typescript
async getHealthStatus(): Promise<HealthStatus>
```

**Returns**:
```typescript
interface HealthStatus {
  status: 'critical' | 'poor' | 'fair' | 'good' | 'excellent';
  overall_score: number;
  reason: string;
  recommendations: string[];
}
```

**Status Determination**:
- CRITICAL: confidentiality_risk > 60 OR critical_issues > 10
- POOR: critical_issues > 5 OR overall_score < 60
- FAIR: warning_issues > 2 OR overall_score < 75
- GOOD: overall_score 75-89
- EXCELLENT: overall_score ≥ 90

---

## Report Types

### JSON Report

```typescript
interface JsonReport {
  generated_at: string;
  version: string;
  repository: {
    name: string;
    branch: string;
    files_scanned: number;
  };
  audit: RepositoryAudit;
  dimensions: {
    [key: string]: DimensionReport;
  };
}

interface DimensionReport {
  description: string;
  average_score: number;
  files_with_issues: number;
  recommendations: string[];
}
```

### Markdown Report

Example structure:
```markdown
# PSB Quality Audit Report

**Generated**: 2024-01-15 14:30 UTC  
**Scope**: All  
**Files Audited**: 47  

## Executive Summary
- Overall Health: GOOD
- Overall Score: 82/100
- Critical Issues: 0
- Warnings: 5

## By Dimension
### Fabrication Risk: 18/100 ✓
### Confidentiality Risk: 5/100 ✓
...

## File Details
| File | Score | Critical | Warnings |
|------|-------|----------|----------|
| projects/a.md | 92 | 0 | 0 |
...
```

### HTML Report

Interactive dashboard with:
- Overall metrics visualization
- File quality breakdown chart
- Issue distribution by type
- Dimension comparison
- Drill-down file details

### CSV Report

```csv
Path,Quality_Score,Critical_Issues,Warnings,Fabrication_Risk,Confidentiality_Risk,Completeness,Evidence_Coverage
projects/a.md,92,0,0,12,2,95,85
skills/b.md,78,0,1,25,8,72,65
...
```

---

## Utility Functions

### loadYamlFile()

```typescript
function loadYamlFile(filePath: string): Record<string, any>
```

Loads and parses YAML file with error handling.

---

### resolveFilePath()

```typescript
function resolveFilePath(relativePath: string, baseDir: string): string
```

Resolves relative paths to absolute paths, handling ../ and ./ references.

---

### getLineContent()

```typescript
function getLineContent(lines: string[], lineNumber: number): string
```

Safely retrieves line content with bounds checking.

---

### escapeRegex()

```typescript
function escapeRegex(str: string): string
```

Escapes special characters for regex matching.

---

## Error Handling

All methods use consistent error handling:

```typescript
try {
  const result = await checker.checkFile(path);
} catch (error) {
  if (error instanceof FileNotFoundError) {
    // Handle missing file
  } else if (error instanceof MetadataError) {
    // Handle metadata loading issue
  } else {
    // Handle generic error
  }
}
```

---

## Performance Characteristics

| Operation | Time | Memory |
|-----------|------|--------|
| checkFile | 200-500ms | 5MB |
| checkFiles (10) | 2-3s | 15MB |
| auditRepository (100 files) | 5-10s | 30MB |
| generateReport (HTML) | 2-3s | 10MB |

---

## Type Exports

All types can be imported:

```typescript
import type {
  QualityCheckResult,
  Issue,
  AuditReport,
  RepositoryAudit,
  MetadataIndex,
  QualityCheckerOptions,
  RepositoryAuditOptions,
  ReportGenerationOptions
} from './psb-quality-checker';

import { QualityChecker, RepositoryAuditor } from './psb-quality-checker';
```

---

**See also**: [README](PSB-Quality-Checker-README.md), [Implementation Guide](PSB-Quality-Checker-IMPLEMENTATION.md), [User Guide](PSB-Quality-Checker-USER-GUIDE.md)
