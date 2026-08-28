# PSB-Quality-Checker Implementation Guide

Comprehensive technical documentation for the PSB-Quality-Checker skill, including architecture, design patterns, module structure, and implementation details.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Module Structure](#module-structure)
3. [Core Classes](#core-classes)
4. [Quality Scoring Algorithm](#quality-scoring-algorithm)
5. [Integration Points](#integration-points)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Testing Strategy](#testing-strategy)

## Architecture Overview

The PSB-Quality-Checker follows a modular, layered architecture:

```
┌─────────────────────────────────────────┐
│  Extension Interface Layer              │
│  (psb-quality-checker-extension.json)   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Orchestration Layer                    │
│  QualityChecker / RepositoryAuditor     │
└──┬──────────┬──────────┬─────────┬──────┘
   │          │          │         │
┌──▼──┐  ┌───▼──┐  ┌────▼──┐  ┌──▼───┐
│Fab- │  │Evid- │  │Confid-│  │Comp- │
│rica │  │ence  │  │ential │  │lete- │
│tion │  │Verif │  │Auditor│  │ness  │
└─────┘  └──────┘  └───────┘  └──────┘

┌────────────────────────────────────────┐
│  Validation Modules                    │
│  (8 specialized checkers)              │
└────────────────────────────────────────┘
   │          │          │         │
┌──▼──┐  ┌───▼──┐  ┌────▼──┐  ┌──▼───┐
│Cons-│  │Tech- │  │Link   │  │Struc-│
│ist- │  │nology│  │Valida │  │ture  │
│ency │  │Match │  │tion   │  │Valid │
└─────┘  └──────┘  └───────┘  └──────┘

┌─────────────────────────────────────────┐
│  Support Layer                          │
│  Metadata Index / Report Generators     │
└─────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**: Each checker handles one quality dimension
2. **Single Responsibility**: Validators focus on detection, not remediation
3. **Composition Over Inheritance**: Orchestrator composes checkers
4. **Fail-Safe**: Individual failures don't break overall checking
5. **Extensibility**: Easy to add new dimensions or customize checks

## Module Structure

### Primary Modules

#### psb-quality-checker.ts (~800 lines)

**Exports**:
- `QualityChecker` class (main orchestrator)
- `FabricationDetector` class
- `EvidenceVerifier` class
- `ConfidentialityAuditor` class
- `CompletenessScorer` class
- `ConsistencyChecker` class
- `TechnologyMatcher` class
- `StructureValidator` class
- `Issue` interface
- `QualityCheckResult` interface
- `AuditReport` interface

**Key Methods**:
```typescript
class QualityChecker {
  async checkFile(
    filePath: string, 
    dimension?: string, 
    verbose?: boolean
  ): Promise<QualityCheckResult>;

  private calculateOverallScore(
    scores: Map<string, number>
  ): number;

  private loadMetadataIndex(): Promise<MetadataIndex>;
}
```

#### psb-repo-auditor.ts (~500 lines)

**Exports**:
- `RepositoryAuditor` class
- `RepositoryAudit` interface
- Report generators (JSON, Markdown, HTML, CSV)

**Key Methods**:
```typescript
class RepositoryAuditor {
  async auditRepository(
    options?: RepositoryAuditOptions
  ): Promise<RepositoryAudit>;

  async generateReport(
    options: ReportGenerationOptions
  ): Promise<string>;

  private generateJsonReport(): string;
  private generateMarkdownReport(): string;
  private generateHtmlReport(): string;
  private generateCsvReport(): string;
}
```

## Core Classes

### 1. FabricationDetector

**Purpose**: Identify invented or unsupported claims

**Key Patterns Detected**:
- Unsubstantiated metrics (e.g., "50% improvement" without evidence)
- Vague or unmeasurable claims (e.g., "significantly improved")
- Missing quantification for achievement claims
- Red flag keywords without supporting evidence

**Implementation**:
```typescript
class FabricationDetector {
  private readonly RED_FLAGS = [
    'improved', 'delivered', 'achieved', 'implemented', 
    'optimized', 'engineered', 'designed'
  ];

  private readonly VAGUE_WORDS = [
    'significantly', 'substantially', 'greatly', 
    'dramatically', 'exceptional'
  ];

  detect(content: string, lines: string[]): Issue[] {
    // 1. Find RED_FLAG keywords
    // 2. Check for metrics (numbers, percentages)
    // 3. Verify evidence links present
    // 4. Score vague language usage
    // 5. Return issues with suggestions
  }
}
```

**Risk Scoring**:
- Base: 0 points
- Per unsubstantiated metric: +15 points
- Per vague claim without evidence: +10 points
- Per achievement without link: +5 points
- Maximum: 100 points

### 2. EvidenceVerifier

**Purpose**: Ensure all claims are backed by documentation

**Link Resolution**:
- Relative markdown links: `[text](../projects/file.md)`
- YAML references: `projects.yml#project-name`
- Internal anchors: `#section-title`

**Evidence Types**:
- Direct file references (markdown links)
- Indirect (YAML metadata cross-references)
- Implicit (mentioned in related files)

**Implementation**:
```typescript
class EvidenceVerifier {
  private extractLinks(content: string): string[] {
    // Extract markdown links [text](path) and references
  }

  private validateLink(linkPath: string): boolean {
    // Check if link target exists
    // Handle relative path resolution
    // Verify file exists in repository
  }

  verify(content: string, filePath: string): Issue[] {
    // 1. Extract all achievement claims
    // 2. Find evidence links for each claim
    // 3. Validate links resolve
    // 4. Calculate coverage percentage
    // 5. Return issues and coverage score
  }
}
```

**Coverage Calculation**:
```
coverage = (claims_with_evidence / total_achievement_claims) × 100%

- >80%: high confidence
- 50-80%: medium confidence
- <50%: low confidence (issues reported)
```

### 3. ConfidentialityAuditor

**Purpose**: Protect sensitive information from exposure

**Patterns Detected**:
```typescript
private readonly PATTERNS = {
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  API_KEY: /(api[_-]?key|token|secret)[\s]*[:=]\s*[^\s]+/gi,
  PHONE: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  IP_ADDRESS: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  SALARY: /\$[\d,]+(?:k|K)?|\b\d+[kK]\b/g,
  SOCIAL_SECURITY: /\b\d{3}-\d{2}-\d{4}\b/g,
  CREDIT_CARD: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g
};
```

**Severity Levels**:
- **CRITICAL**: Credentials, API keys, email addresses
- **WARNING**: Unredacted client names, salaries, IP addresses
- **INFO**: Internal metrics, specific identifiers

**Implementation**:
```typescript
class ConfidentialityAuditor {
  audit(content: string, filePath: string): Issue[] {
    // 1. Apply each pattern regex
    // 2. Collect matches with line numbers
    // 3. Determine severity based on pattern
    // 4. Generate suggestions for redaction
    // 5. Calculate confidentiality risk score
  }

  private calculateRisk(matches: number): number {
    // Risk increases with number of exposed items
    // Each critical match: +20 points
    // Each warning match: +5 points
  }
}
```

### 4. CompletenessScorer

**Purpose**: Assess documentation completeness

**Document Type Mappings**:
```typescript
const REQUIRED_SECTIONS = {
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
};
```

**Scoring Algorithm**:
```
completeness_score = (found_required / total_required) × 100%

Issues triggered if:
- Any required field missing: -20 points each
- Only 1-2 optional fields present: +info
- >50% of optional fields missing: +warning
```

### 5. ConsistencyChecker

**Purpose**: Verify YAML metadata matches markdown content

**Checks Performed**:
1. **Project Consistency**:
   - Project names match across files
   - Technologies match between markdown and projects.yml
   - Dates don't conflict

2. **Skill Consistency**:
   - Skill names match skills.yml
   - Proficiency levels consistent
   - Experience durations add up

3. **Client Consistency**:
   - Client names consistent (or properly redacted)
   - Industry classification matches
   - Engagement types align

**Implementation**:
```typescript
class ConsistencyChecker {
  private metadataIndex: MetadataIndex;

  async check(filePath: string, content: string): Promise<Issue[]> {
    // 1. Load YAML metadata into index
    // 2. Parse markdown content
    // 3. Extract key entities (projects, skills, clients)
    // 4. Cross-reference with metadata
    // 5. Report inconsistencies
  }
}
```

### 6. TechnologyMatcher

**Purpose**: Ensure technologies mentioned are registered

**Validation Process**:
```typescript
class TechnologyMatcher {
  private registeredTechs: Set<string>;

  async match(content: string): Promise<Issue[]> {
    // 1. Load technologies from technologies.yml
    // 2. Extract tech mentions from content
    // 3. Match against registered list (case-insensitive)
    // 4. Suggest registration for unknown techs
    // 5. Check for common aliases/variants
  }

  private detectTechs(content: string): string[] {
    // Pattern matching for common tech mentions
    // Handle abbreviations (e.g., "JS" → "JavaScript")
    // Extract from code blocks and mentions
  }
}
```

**Common Aliases Handled**:
- JS ↔ JavaScript
- TS ↔ TypeScript
- K8s ↔ Kubernetes
- DB ↔ Database
- API ↔ REST/GraphQL APIs

### 7. StructureValidator

**Purpose**: Verify markdown follows templates

**Template Validation**:
```typescript
const MARKDOWN_STRUCTURE = {
  project: {
    headers: ['# Project Title', '## Overview', '## Technologies', 
              '## Impact', '## Duration'],
    patterns: {
      'has_code_block': /```[\s\S]*?```/,
      'has_metrics': /\d+%|\$[\d,]+|[\d,]+ users/i,
      'has_images': /!\[.*?\]\(.*?\)/
    }
  },
  skill: {
    headers: ['# Skill Name', '## Proficiency', '## Experience'],
    patterns: {
      'proficiency_valid': /(beginner|intermediate|advanced|expert)/i
    }
  }
};
```

**Checks Performed**:
1. Header hierarchy correctness (H1 → H2 → H3)
2. Required sections present and in order
3. Markdown syntax validity
4. Code block formatting
5. Link syntax correctness

### 8. StructureValidator

**Overall Quality Score Calculation**:

```typescript
calculateOverallScore(dimensions: ScoreDimensions): number {
  const weights = {
    average_file_score: 0.40,
    fabrication_risk: 0.25,      // 100 - risk
    confidentiality_risk: 0.25,  // 100 - risk
    completeness_score: 0.10
  };

  const fabricationComponent = (100 - dimensions.fabricationRisk) * weights.fabrication_risk;
  const confidentialityComponent = (100 - dimensions.confidentialityRisk) * weights.confidentiality_risk;
  const completenessComponent = dimensions.completenessScore * weights.completeness_score;
  const fileScoreComponent = dimensions.avgFileScore * weights.average_file_score;

  return Math.round(
    fabricationComponent +
    confidentialityComponent +
    completenessComponent +
    fileScoreComponent
  );
}
```

**Score Interpretation**:
- 90-100: Excellent (production-ready)
- 75-89: Good (minor issues)
- 60-74: Fair (address warnings)
- <60: Poor (critical issues present)

## Integration Points

### 1. Extension Manifest Integration

The `psb-quality-checker-extension.json` defines:

```json
{
  "tools": [
    {
      "name": "check-quality",
      "description": "Check quality of single file",
      "input": {
        "type": "object",
        "properties": {
          "filePath": { "type": "string" },
          "dimension": { "type": "string" },
          "verbose": { "type": "boolean" }
        },
        "required": ["filePath"]
      }
    }
  ],
  "commands": [
    {
      "command": "psb-quality-checker.checkFile",
      "title": "PSB: Check File Quality"
    }
  ]
}
```

### 2. Metadata Index Integration

```typescript
interface MetadataIndex {
  projects: Map<string, ProjectMetadata>;
  skills: Map<string, SkillMetadata>;
  technologies: Map<string, TechMetadata>;
  clients: Map<string, ClientMetadata>;
  experience: Map<string, ExperienceMetadata>;
}

async function loadMetadataIndex(): Promise<MetadataIndex> {
  const index: MetadataIndex = {
    projects: new Map(),
    skills: new Map(),
    technologies: new Map(),
    clients: new Map(),
    experience: new Map()
  };

  // Load each YAML file with error handling
  try {
    const projectsYml = readFileSync('metadata/projects.yml', 'utf8');
    const projectsData = yaml.load(projectsYml);
    // Populate index.projects
  } catch (e) {
    console.warn('Could not load projects.yml');
  }

  return index;
}
```

### 3. Report Generation Integration

```typescript
async generateReport(options: ReportGenerationOptions): Promise<string> {
  const audit = await this.auditRepository(options);

  switch (options.format) {
    case 'json':
      return this.generateJsonReport(audit);
    case 'markdown':
      return this.generateMarkdownReport(audit);
    case 'html':
      return this.generateHtmlReport(audit);
    case 'csv':
      return this.generateCsvReport(audit);
    default:
      return JSON.stringify(audit, null, 2);
  }
}
```

## Error Handling

### Graceful Degradation

The system is designed to continue even when individual components fail:

```typescript
try {
  // Load metadata
  this.metadataIndex = await this.loadMetadataIndex();
} catch (e) {
  console.warn('Metadata load failed, continuing without consistency checks');
  this.metadataIndex = createEmptyIndex();
}

// Individual checker failures
checkers.forEach(checker => {
  try {
    const issues = checker.check(content);
    allIssues.push(...issues);
  } catch (e) {
    console.warn(`${checker.name} failed:`, e.message);
  }
});
```

### Error Types and Responses

| Error | Handling | Impact |
|-------|----------|--------|
| File not found | Report as critical issue | Check fails gracefully |
| YAML parse error | Warn, skip that dimension | Other checks continue |
| Link validation timeout | Assume broken, report issue | Check completes |
| Memory exhaustion | Stream files if >100MB | Audit completes slower |

## Performance Optimization

### 1. Metadata Caching

```typescript
private metadataCache: Map<string, MetadataIndex> = new Map();
private cacheExpiry: number = 5 * 60 * 1000;  // 5 minutes

async loadMetadataIndex(): Promise<MetadataIndex> {
  const now = Date.now();
  
  // Check cache
  if (this.metadataCache.has('main')) {
    const cached = this.metadataCache.get('main');
    if (now - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
  }

  // Load fresh
  const index = await this.buildMetadataIndex();
  this.metadataCache.set('main', { data: index, timestamp: now });
  return index;
}
```

### 2. Parallel Processing

For repository audits:

```typescript
async auditRepository(options?: RepositoryAuditOptions): Promise<RepositoryAudit> {
  const files = await this.getFileList(options.scope);
  
  // Process in batches of 10
  const batchSize = 10;
  const results: FileQuality[] = [];

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(f => this.checkFile(f))
    );
    results.push(...batchResults);
  }

  return this.aggregateResults(results);
}
```

### 3. Early Exit Optimization

```typescript
detect(content: string): Issue[] {
  const issues: Issue[] = [];
  
  // Exit early if fabrication score already critical
  if (this.fabricationScore > 80) {
    return [{
      type: 'fabrication',
      severity: 'critical',
      message: 'Multiple unsupported claims detected'
    }];
  }

  // Continue with detailed analysis
  // ...
  
  return issues;
}
```

## Testing Strategy

### Unit Tests (per module)

```typescript
describe('FabricationDetector', () => {
  let detector: FabricationDetector;

  beforeEach(() => {
    detector = new FabricationDetector();
  });

  it('should detect unsupported metrics', () => {
    const content = 'Improved performance by 50%';
    const issues = detector.detect(content, [content]);
    expect(issues).toContainEqual(
      expect.objectContaining({ type: 'fabrication' })
    );
  });

  it('should ignore metrics with evidence links', () => {
    const content = 'Improved performance by 50% [evidence](../projects/x.md)';
    const issues = detector.detect(content, [content]);
    expect(issues).toHaveLength(0);
  });
});
```

### Integration Tests

```typescript
describe('QualityChecker (integration)', () => {
  it('should orchestrate all dimensions', async () => {
    const result = await checker.checkFile('test-project.md');
    
    expect(result).toHaveProperty('overall_quality_score');
    expect(result).toHaveProperty('issues');
    expect(result).toHaveProperty('audit_report');
    expect(result.audit_report).toHaveProperty('fabrication_risk');
    expect(result.audit_report).toHaveProperty('confidentiality_risk');
    expect(result.audit_report).toHaveProperty('completeness_score');
    expect(result.audit_report).toHaveProperty('evidence_coverage');
  });
});
```

### Test Scenarios

See **PSB-Quality-Checker-TEST-SCENARIOS.md** for 20+ comprehensive test cases covering:
- All 8 quality dimensions
- Edge cases and boundary conditions
- Error handling and recovery
- Performance benchmarks
- Integration scenarios

## Extending the System

### Adding a New Quality Dimension

1. **Create checker class**:
```typescript
class MyNewChecker {
  check(content: string, filePath: string): Issue[] {
    // Implementation
  }
}
```

2. **Register with QualityChecker**:
```typescript
private newChecker = new MyNewChecker();

async checkFile(filePath: string): Promise<QualityCheckResult> {
  // Add to checker iteration
  this.checkers.push(this.newChecker);
}
```

3. **Add to audit report**:
```typescript
audit_report: {
  // ... existing fields
  my_new_dimension: number;
}
```

4. **Update scoring weights** if affecting overall score.

## Configuration & Tuning

See **PSB-Quality-Checker-CONFIGURATION.md** for:
- Threshold customization
- Risk level adjustments
- Score weight modifications
- Pattern additions/removals
- Document type mappings

---

**Next Steps**:
- Review [USER_GUIDE.md](PSB-Quality-Checker-USER-GUIDE.md) for usage patterns
- Check [API_REFERENCE.md](PSB-Quality-Checker-API-REFERENCE.md) for full type definitions
- Consult [TEST_SCENARIOS.md](PSB-Quality-Checker-TEST-SCENARIOS.md) for validation approaches
