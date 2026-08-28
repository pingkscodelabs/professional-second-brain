# PSB-Quality-Checker Configuration Guide

Complete customization guide for adjusting quality scoring, thresholds, patterns, and behavior.

## Overview

The PSB-Quality-Checker can be customized to match your specific quality standards. Configuration can be done via:

1. **QualityCheckerOptions** - Passed to constructor
2. **Environment variables** - Global system settings
3. **Configuration file** - psb-quality-config.json (optional)
4. **Direct code modifications** - For permanent changes

---

## Customization Levels

### Level 1: Constructor Options (Easiest)

```typescript
const checker = new QualityChecker({
  metadataPath: 'metadata',
  cacheMetadata: true,
  customPatterns: { /* ... */ },
  thresholds: { /* ... */ }
});
```

### Level 2: Configuration File (Recommended)

Create `psb-quality-config.json` in project root:

```json
{
  "quality": {
    "thresholds": { /* ... */ },
    "weights": { /* ... */ }
  },
  "patterns": { /* ... */ },
  "customization": { /* ... */ }
}
```

### Level 3: Environment Variables (Advanced)

```bash
PSB_QUALITY_FABRICATION_THRESHOLD=50
PSB_QUALITY_CACHE_TIMEOUT=300000
```

### Level 4: Code Modifications (Permanent)

Edit constants in `psb-quality-checker.ts` directly.

---

## Configuration Options

### 1. Thresholds

#### Fabrication Risk Thresholds

```typescript
interface FabricationThresholds {
  RED_FLAGS: number;              // Points per unsupported metric (default: 15)
  VAGUE_WORDS: number;            // Points per vague claim (default: 10)
  NO_EVIDENCE: number;            // Points for metric without link (default: 15)
  MAX_RISK: number;               // Maximum risk score (default: 100)
}
```

**Configuration**:
```json
{
  "thresholds": {
    "fabrication": {
      "RED_FLAGS": 15,
      "VAGUE_WORDS": 10,
      "NO_EVIDENCE": 15,
      "MAX_RISK": 100
    }
  }
}
```

**Tuning Guide**:
- Increase RED_FLAGS if too many false positives
- Decrease if missing real fabrication
- Adjust based on your expected metric density

---

#### Confidentiality Risk Thresholds

```typescript
interface ConfidentialityThresholds {
  CRITICAL_PER_MATCH: number;    // Points per critical match (default: 20)
  WARNING_PER_MATCH: number;     // Points per warning match (default: 5)
  MAX_RISK: number;              // Maximum risk score (default: 100)
}
```

**Configuration**:
```json
{
  "thresholds": {
    "confidentiality": {
      "CRITICAL_PER_MATCH": 20,
      "WARNING_PER_MATCH": 5,
      "MAX_RISK": 100
    }
  }
}
```

**Tuning Guide**:
- Increase CRITICAL_PER_MATCH to be more strict about credentials
- Decrease to allow more sensitive data (not recommended)

---

#### Completeness Thresholds

```typescript
interface CompletenessThresholds {
  REQUIRED_FIELD_MISSING: number; // -points per missing required (default: 20)
  MIN_OPTIONAL_FIELDS: number;   // Warn if below this % (default: 50)
}
```

**Configuration**:
```json
{
  "thresholds": {
    "completeness": {
      "REQUIRED_FIELD_MISSING": 20,
      "MIN_OPTIONAL_FIELDS": 50
    }
  }
}
```

---

#### Evidence Coverage Thresholds

```typescript
interface EvidenceThresholds {
  HIGH_CONFIDENCE: number;       // >80% coverage (default: 80)
  MEDIUM_CONFIDENCE: number;    // 50-80% coverage (default: 50)
  LOW_CONFIDENCE: number;       // <50% coverage (default: 0)
}
```

**Configuration**:
```json
{
  "thresholds": {
    "evidence": {
      "HIGH_CONFIDENCE": 80,
      "MEDIUM_CONFIDENCE": 50
    }
  }
}
```

---

### 2. Score Weights

Adjust how each dimension contributes to overall score:

```typescript
interface ScoreWeights {
  file_quality: number;          // Default: 0.40 (40%)
  fabrication_risk: number;      // Default: 0.25 (25%)
  confidentiality_risk: number;  // Default: 0.25 (25%)
  completeness_score: number;    // Default: 0.10 (10%)
}
```

**Configuration**:
```json
{
  "weights": {
    "file_quality": 0.40,
    "fabrication_risk": 0.25,
    "confidentiality_risk": 0.25,
    "completeness_score": 0.10
  }
}
```

**Total must equal 1.0**

**Tuning Examples**:

```json
{
  "scenario": "Security-focused organization",
  "weights": {
    "file_quality": 0.30,
    "fabrication_risk": 0.20,
    "confidentiality_risk": 0.40,
    "completeness_score": 0.10
  }
}
```

```json
{
  "scenario": "Evidence-focused organization",
  "weights": {
    "file_quality": 0.50,
    "fabrication_risk": 0.30,
    "confidentiality_risk": 0.10,
    "completeness_score": 0.10
  }
}
```

---

### 3. Health Status Thresholds

Determine repository health rating:

```typescript
interface HealthThresholds {
  EXCELLENT: number;    // >= this score (default: 90)
  GOOD: number;        // >= this score (default: 75)
  FAIR: number;        // >= this score (default: 60)
  POOR: number;        // < this score (default: 60)
  CRITICAL_ISSUES: number;  // Issues to trigger critical (default: 10)
}
```

**Configuration**:
```json
{
  "health_status": {
    "excellent": 90,
    "good": 75,
    "fair": 60,
    "critical_issues": 10,
    "poor_issues": 5
  }
}
```

---

### 4. Custom Patterns

Add or modify regex patterns for detection:

#### Fabrication Patterns

```json
{
  "patterns": {
    "fabrication": {
      "red_flags": [
        "improved",
        "delivered",
        "achieved",
        "implemented",
        "optimized",
        "engineered",
        "designed",
        "custom_keyword"
      ],
      "vague_words": [
        "significantly",
        "substantially",
        "greatly",
        "dramatically",
        "exceptional",
        "worldclass"
      ]
    }
  }
}
```

#### Confidentiality Patterns

```json
{
  "patterns": {
    "confidentiality": {
      "EMAIL": "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
      "API_KEY": "(api[_-]?key|token|secret)[\\s]*[:=]\\s*[^\\s]+",
      "PHONE": "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b",
      "IP_ADDRESS": "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
      "SALARY": "\\$[\\d,]+(?:k|K)?|\\b\\d+[kK]\\b",
      "SSN": "\\b\\d{3}-\\d{2}-\\d{4}\\b",
      "CREDIT_CARD": "\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b",
      "CUSTOM": "YOUR_PATTERN_HERE"
    }
  }
}
```

**Example: Add Company Name Pattern**

```json
{
  "patterns": {
    "confidentiality": {
      "COMPANY_NAME": "(?:Acme|TechCorp|SecretCompany)"
    }
  }
}
```

---

### 5. Document Type Mappings

Define required and optional sections:

```json
{
  "document_types": {
    "project": {
      "required": [
        "title",
        "description",
        "technologies",
        "impact",
        "duration"
      ],
      "optional": [
        "team_size",
        "budget",
        "client",
        "metrics",
        "lessons_learned"
      ]
    },
    "skill": {
      "required": [
        "name",
        "proficiency",
        "experience_years"
      ],
      "optional": [
        "certifications",
        "endorsements",
        "projects_using",
        "related_skills"
      ]
    },
    "achievement": {
      "required": [
        "title",
        "description",
        "date",
        "impact"
      ],
      "optional": [
        "technologies",
        "team_contribution",
        "metrics"
      ]
    },
    "client": {
      "required": [
        "name_redacted",
        "industry",
        "engagement_type",
        "duration"
      ],
      "optional": [
        "project_count",
        "technologies",
        "outcomes",
        "relationship_owner"
      ]
    }
  }
}
```

**Custom Document Type**:

```json
{
  "document_types": {
    "publication": {
      "required": [
        "title",
        "publication_name",
        "date",
        "link"
      ],
      "optional": [
        "co_authors",
        "impact_count",
        "industry"
      ]
    }
  }
}
```

---

### 6. Technology Aliases

Map common abbreviations to canonical names:

```json
{
  "technology_aliases": {
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "k8s": "kubernetes",
    "db": "database",
    "api": "rest api",
    "ci/cd": "continuous integration",
    "vm": "virtual machine",
    "aws": "amazon web services",
    "gcp": "google cloud platform"
  }
}
```

---

### 7. Metadata Configuration

Configure paths to YAML metadata files:

```json
{
  "metadata": {
    "projects_file": "metadata/projects.yml",
    "skills_file": "metadata/skills.yml",
    "technologies_file": "metadata/technologies.yml",
    "clients_file": "metadata/clients.yml",
    "experience_file": "metadata/experience.yml",
    "cache_timeout_ms": 300000,
    "required_on_load": false
  }
}
```

---

### 8. Severity Mappings

Customize how issues are severity-ranked:

```json
{
  "severity": {
    "critical": {
      "confidence": "high",
      "blocking": true,
      "must_fix": true,
      "examples": [
        "exposed API key",
        "real client name",
        "confidential email"
      ]
    },
    "warning": {
      "confidence": "medium",
      "blocking": false,
      "must_fix": false,
      "examples": [
        "unsupported metric",
        "missing evidence",
        "unredacted IP"
      ]
    },
    "info": {
      "confidence": "low",
      "blocking": false,
      "must_fix": false,
      "examples": [
        "missing optional field",
        "minor formatting issue",
        "suggestion for improvement"
      ]
    }
  }
}
```

---

## Configuration File Examples

### Example 1: Security-First Organization

```json
{
  "name": "Security-First Configuration",
  "weights": {
    "file_quality": 0.20,
    "fabrication_risk": 0.15,
    "confidentiality_risk": 0.50,
    "completeness_score": 0.15
  },
  "thresholds": {
    "confidentiality": {
      "CRITICAL_PER_MATCH": 30,
      "WARNING_PER_MATCH": 10,
      "MAX_RISK": 100
    }
  },
  "patterns": {
    "confidentiality": {
      "COMPANY_NAME": "Acme|SecretCorp|MyCompany"
    }
  }
}
```

### Example 2: Startup (Agile, Less Strict)

```json
{
  "name": "Startup Fast-Track",
  "weights": {
    "file_quality": 0.60,
    "fabrication_risk": 0.20,
    "confidentiality_risk": 0.10,
    "completeness_score": 0.10
  },
  "thresholds": {
    "fabrication": {
      "RED_FLAGS": 20,
      "VAGUE_WORDS": 15,
      "NO_EVIDENCE": 10
    }
  },
  "document_types": {
    "project": {
      "required": ["title", "description", "impact"],
      "optional": ["technologies", "duration", "team_size"]
    }
  }
}
```

### Example 3: Enterprise (Comprehensive)

```json
{
  "name": "Enterprise Standards",
  "weights": {
    "file_quality": 0.40,
    "fabrication_risk": 0.30,
    "confidentiality_risk": 0.20,
    "completeness_score": 0.10
  },
  "thresholds": {
    "fabrication": {
      "RED_FLAGS": 10,
      "VAGUE_WORDS": 5,
      "NO_EVIDENCE": 20
    },
    "evidence": {
      "HIGH_CONFIDENCE": 85,
      "MEDIUM_CONFIDENCE": 60
    }
  },
  "health_status": {
    "excellent": 95,
    "good": 85,
    "fair": 70
  }
}
```

---

## Loading Configuration

### From Constructor

```typescript
import { QualityChecker } from './psb-quality-checker';

const checker = new QualityChecker({
  thresholds: {
    fabricationRisk: 50,
    confidentialityRisk: 30
  },
  customPatterns: {
    fabrication: ['my_keyword']
  }
});
```

### From File

```typescript
import * as fs from 'fs';

const configFile = fs.readFileSync('psb-quality-config.json', 'utf8');
const config = JSON.parse(configFile);

const checker = new QualityChecker(config);
```

### From Environment

```bash
export PSB_QUALITY_CONFIG="psb-quality-config.json"
export PSB_QUALITY_MIN_SCORE=70
export PSB_QUALITY_CACHE_TIMEOUT=600000

node check-file.js
```

---

## Common Customizations

### Scenario 1: Stricter Fabrication Detection

**Goal**: Flag more unsubstantiated claims

```json
{
  "thresholds": {
    "fabrication": {
      "RED_FLAGS": 10,
      "VAGUE_WORDS": 5,
      "NO_EVIDENCE": 20
    }
  },
  "weights": {
    "fabrication_risk": 0.40
  }
}
```

### Scenario 2: Skip Completeness Check

**Goal**: Don't enforce all required fields

```json
{
  "weights": {
    "completeness_score": 0.01
  },
  "document_types": {
    "project": {
      "required": ["title"],
      "optional": []
    }
  }
}
```

### Scenario 3: Lenient Confidentiality

**Goal**: Only flag credentials, not IPs or phone numbers

```json
{
  "patterns": {
    "confidentiality": {
      "EMAIL": "[pattern]",
      "API_KEY": "[pattern]",
      "CREDIT_CARD": "[pattern]"
    }
  }
}
```

### Scenario 4: Custom Technology Set

**Goal**: Only validate against specific technologies

```json
{
  "technologies_allowed": [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL"
  ]
}
```

### Scenario 5: Higher Quality Bar for Production

**Goal**: Require score >90 for production docs

```json
{
  "quality_gates": {
    "production": 90,
    "staging": 75,
    "draft": 50
  }
}
```

---

## Configuration Best Practices

### 1. Start Conservative
Begin with default (strict) settings, then relax:
```json
{
  "comment": "Start here, loosen gradually based on feedback"
}
```

### 2. Document Your Changes
```json
{
  "organization": "MyOrg",
  "created_date": "2024-01-15",
  "rationale": "We prioritize security over completeness",
  "reviewed_by": "security-team@org.com"
}
```

### 3. Version Your Config
```json
{
  "config_version": "1.0.0",
  "compatible_checker_version": ">=1.0.0"
}
```

### 4. Test Changes
Before deploying new config:
```bash
# Test on sample files
npm run check-file -- sample.md

# Compare with previous config
# Verify quality scores reasonable
```

### 5. Monitor Impact
Track if stricter/looser settings help or hurt:
- Are users happy with score ranges?
- Are false positives increasing?
- Are real issues being caught?

---

## Validation

Validate configuration syntax:

```bash
# Check JSON validity
jq . psb-quality-config.json

# Check weights sum to 1.0
jq '.weights | values | add' psb-quality-config.json
# Output should be 1.0

# Check all patterns have regex
jq '.patterns.confidentiality | keys' psb-quality-config.json
```

---

## Resetting to Defaults

To go back to factory settings:

```bash
rm psb-quality-config.json
npm run clear-cache  # Clear configuration cache
npm run check-file -- test.md  # Uses built-in defaults
```

---

## Support

For configuration questions:
- Check API_REFERENCE.md for type details
- Review examples in this file
- Test changes on small file set first
- Document rationale for non-standard settings

---

**Next Steps**: Review [USER_GUIDE.md](PSB-Quality-Checker-USER-GUIDE.md) for usage patterns, or [API_REFERENCE.md](PSB-Quality-Checker-API-REFERENCE.md) for programmatic access.
