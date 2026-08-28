# PSB-Onboard Skill

Transform raw professional information into structured, template-compliant Markdown files with YAML metadata.

## Overview

The PSB-Onboard skill automates the process of converting raw text descriptions of projects, achievements, skills, and client engagements into well-structured, professional documentation following the Professional Second Brain (PSB) templates.

## Features

### 1. Information Extraction
- **Automatic Parsing**: Analyzes raw text to identify key facts
- **Key Information Detection**: Extracts dates, numbers, names, roles, and outcomes
- **Confidence Scoring**: Assigns confidence levels (HIGH/MEDIUM/LOW) to each extracted fact
- **Intelligent Inference**: Makes reasonable inferences when explicit information is missing

### 2. Template Matching & Population
- **Format-Compliant**: Generates Markdown following PSB templates exactly
- **Smart Mapping**: Maps extracted facts to appropriate template fields
- **Placeholder Management**: Marks missing required information with `TBD`
- **Metadata Generation**: Creates YAML entries automatically

### 3. Completeness Validation
- **Score Calculation**: Calculates completeness percentage (0-100%)
- **Gap Identification**: Lists missing required and optional fields
- **Recommendations**: Provides suggestions for improving completeness
- **Quality Assurance**: Flags vague language and suspicious patterns

### 4. Link Suggestions
- **Smart Cross-Referencing**: Suggests related skills, projects, achievements
- **Technology-Based**: Links based on technologies and tools mentioned
- **Timeline-Based**: Identifies temporal overlaps with other documented work
- **Confidence Ranking**: Ranks suggestions by relevance

### 5. Path Generation
- **Smart Naming**: Generates appropriate file paths using slugified names
- **Category Awareness**: Organizes files into appropriate subdirectories
- **Conflict Avoidance**: Suggests unique paths

## Usage

### Basic Tool Interface

All tools follow this pattern:

```
Input: Raw text information
  ↓
Processing: Extract, validate, populate templates
  ↓
Output: Structured Markdown + YAML + Links + Completeness Score
```

### Tools Available

#### 1. Structure Project
Transform raw project information into structured project documentation.

**Input:**
```javascript
{
  rawText: "At CLIENT_A, I led migration of 150 microservices from EC2 to Kubernetes in 2023. We reduced infrastructure costs by 40% and improved deployment time from 2 hours to 15 minutes. Used Terraform for IaC, Argo for CD. Led team of 5.",
  category: "kubernetes",
  confidentialityLevel: "CONFIDENTIAL"
}
```

**Output:**
```javascript
{
  markdown: "# Kubernetes Migration Project\n\n## Project Metadata\n...",
  yamlEntry: {
    name: "Kubernetes Migration",
    client: "CLIENT_A",
    period: "2023",
    technologies: ["Kubernetes", "Terraform", "ArgoCD"],
    role: "Lead",
    team_size: 5,
    status: "needs_review"
  },
  suggestedFilePath: "projects/kubernetes/kubernetes-migration.md",
  linkedContent: [
    { type: "skill", name: "Kubernetes", path: "../../profile/skills/kubernetes.md" },
    { type: "skill", name: "Terraform", path: "../../profile/skills/terraform.md" }
  ],
  completenessScore: 0.85,
  missingFields: ["teamComposition", "businessImpact"],
  confidence: {
    projectName: "HIGH",
    client: "HIGH",
    technologies: "HIGH",
    timePeriod: "MEDIUM"
  }
}
```

#### 2. Structure Achievement
Transform raw achievement information into structured achievement documentation.

**Input:**
```javascript
{
  rawText: "I optimized our cloud infrastructure, reducing monthly costs by 40% ($200K/month) through Reserved Instances and Spot usage optimization. This involved analyzing 5000+ instances across 120+ AWS accounts and implementing automated scheduling.",
  category: "cost-optimization"
}
```

#### 3. Structure Skill
Transform raw skill information into structured skill documentation.

**Input:**
```javascript
{
  rawText: "I have 5+ years of production Kubernetes experience, managing clusters with 500+ microservices at scale. Expert in multi-cluster management, performance optimization, and security hardening."
}
```

#### 4. Structure Client
Transform raw client information into structured client documentation.

**Input:**
```javascript
{
  rawText: "Worked with a Series B fintech startup building payment processing infrastructure. Engaged for 18 months on infrastructure architecture and team leadership.",
  category: "fintech"
}
```

#### 5. Validate Completeness
Validate and score the completeness of extracted information.

**Input:**
```javascript
{
  informationType: "project",
  extractedData: { /* structured data */ }
}
```

**Output:**
```javascript
{
  isComplete: true,
  completenessScore: 0.85,
  missingFields: ["teamComposition"],
  recommendations: [
    {
      priority: "MEDIUM",
      message: "Complete recommended fields: teamComposition",
      fields: ["teamComposition"]
    }
  ]
}
```

## Information Extraction Details

### What Gets Extracted

The extractor identifies and classifies:

**Dates & Timelines**
- Date ranges (2023-2024, Jan 2023 to Dec 2023)
- Single years and months
- Relative timing (last year, recently)

**Numbers & Metrics**
- Team sizes
- Scale (microservices, systems, users)
- Percentages and improvements
- Currency amounts (cost savings)
- Durations (hours, days, months)

**Names & Roles**
- Project names
- Client/company names
- Your role (Lead Architect, Principal Engineer, etc.)
- Team member roles

**Technologies**
- Languages (Python, JavaScript, Java, Go, etc.)
- Platforms (AWS, Kubernetes, Terraform, etc.)
- Databases (PostgreSQL, MongoDB, Redis, etc.)
- Tools (Docker, Jenkins, ArgoCD, etc.)

**Business Outcomes**
- Cost savings
- Performance improvements
- Efficiency gains
- Revenue impact
- Scale reached

### Confidence Scoring

Each extracted field is assigned a confidence level:

- **HIGH**: Directly stated in the text with clear evidence
- **MEDIUM**: Reasonably inferred from context
- **LOW**: Unclear or missing, requires verification

Example:
```
HIGH Confidence:
- Explicitly mentioned: "150 microservices"
- Direct statement: "2023 to 2024"
- Clear role: "led the team"

MEDIUM Confidence:
- Inferred: cost savings from "reduced costs" (exact % not given)
- Contextual: team size from "worked with" language

LOW Confidence:
- Missing explicit client name
- Vague timeline like "took about 6 months"
- Unclear scope or impact
```

## Template Filling Algorithm

1. **Extract Information**: Parse raw text using multiple pattern matchers
2. **Classify Confidence**: Assign HIGH/MEDIUM/LOW to each field
3. **Map to Template**: Match extracted fields to template placeholders
4. **Fill Values**: Replace placeholders with extracted values or TBD
5. **Add Confidence Notes**: Append section documenting LOW confidence items
6. **Generate YAML**: Create metadata entry
7. **Suggest Links**: Identify related content to reference
8. **Score Completeness**: Calculate coverage of required vs optional fields

## Completeness Scoring

Scoring is calculated as:

```
Base Score: 100 points

Deductions:
- Each missing REQUIRED field: -10 points
- Each missing RECOMMENDED field: -3 points
- Each TBD placeholder: -2 points
- Vague language patterns: -1 to -5 points

Final Score: 0-100 (normalized to 0.0-1.0)

Status:
- 85-100%: Complete (ready to commit)
- 70-84%: Needs minor work
- 50-69%: Needs significant work
- Below 50%: Incomplete
```

## Supported Information Types

### Project
For software projects, infrastructure initiatives, or major technical work.

**Required Fields**:
- Project Name
- Client
- Time Period
- Role
- Business Outcome

**Optional Fields**:
- Team Size
- Technologies
- Scale
- Challenges

### Achievement
For measurable accomplishments and business impact.

**Required Fields**:
- Title
- Date
- Business Impact
- Metrics

**Optional Fields**:
- Context
- Technical Outcome
- Technologies
- Scale

### Skill
For professional capabilities and technical expertise.

**Required Fields**:
- Skill Name
- Category
- Level (EXPERT/ADVANCED/INTERMEDIATE/BEGINNER/LEARNING/EXPOSURE)

**Optional Fields**:
- Years of Experience
- Production Experience
- Expertise Areas

### Client
For client engagements and consulting work.

**Required Fields**:
- Client Name
- Industry
- Engagement Period

**Optional Fields**:
- Engagement Type
- Scale
- Major Projects

### ADR (Architecture Decision Record)
For technical decisions and their rationales.

**Required Fields**:
- Title
- Context
- Decision
- Rationale
- Consequences

## File Organization

After running the tool, organize files as follows:

```
├── .github/
│   └── extensions/
│       └── psb-onboard/
│           ├── extension.json          # Tool manifest
│           ├── index.js                # Main handler
│           ├── lib/
│           │   ├── extractor.js       # Information extraction
│           │   ├── templates.js        # Markdown templates
│           │   ├── validator.js        # Completeness validation
│           │   └── linker.js           # Link suggestions
│           └── README.md               # This file
```

## Implementation Notes

### Key Algorithms

**Text Pattern Matching**
- Uses regex patterns for robust matching
- Multiple pattern attempts for redundancy
- Case-insensitive matching where appropriate

**Confidence Calculation**
- Based on field explicitness and specificity
- Vague/short values = MEDIUM/LOW confidence
- Missing values = LOW confidence
- Explicit/detailed values = HIGH confidence

**Link Suggestion**
- Technology-based: Links skills matching mentioned technologies
- Client-based: Links to client documentation
- Project-based: Links related projects and achievements
- Ranked by relevance and confidence

### Limitations & Assumptions

1. **Language**: Expects English-language input
2. **Context**: Works best with professional/technical descriptions
3. **Metrics**: Attempts to extract numbers but may miss implicit metrics
4. **Anonymization**: CLIENT_A format expected for client anonymization
5. **Confidence**: Scoring is heuristic-based, may need human review

## Examples

### Example 1: Project Structuring

**Input Raw Text:**
```
Last year I led a Kubernetes migration. We moved 150 microservices from EC2 to Kubernetes. Took about 6 months. Reduced costs significantly. Used Terraform for IaC.
```

**Extracted Information:**
```
- projectName: "Kubernetes Migration" (HIGH)
- client: TBD (LOW)
- timePeriod: "Last year" → inferred as 2024 (MEDIUM)
- role: "Led" (HIGH)
- teamSize: TBD (LOW)
- technologies: ["Kubernetes", "Terraform", "EC2"] (HIGH)
- scale: "150 microservices" (HIGH)
- businessOutcome: "Reduced costs significantly" (MEDIUM - vague amount)
- timeTaken: "6 months" (HIGH)
```

**Completeness Score:** 60%

**Missing Required:**
- Client name
- Specific cost savings amount

**Recommendations:**
1. Provide client name or anonymize (CLIENT_A)
2. Specify exact cost reduction percentage
3. Document team composition
4. Describe business impact in metrics

### Example 2: Achievement Structuring

**Input Raw Text:**
```
I optimized our AWS infrastructure by implementing Reserved Instances strategy and Spot instance automation. This reduced our monthly cloud bill from $500K to $300K - a 40% reduction saving the company $2.4M annually. I automated the entire optimization process, reducing manual overhead by 90%.
```

**Extracted Information:**
```
- title: "AWS Infrastructure Cost Optimization" (HIGH)
- date: inferred current year (MEDIUM)
- businessImpact: "40% cost reduction" (HIGH)
- metrics:
  - cost_savings: "$200K/month" (HIGH)
  - annual_savings: "$2.4M" (HIGH)
  - automation_improvement: "90% overhead reduction" (HIGH)
- technologies: ["AWS", "Reserved Instances", "Spot Instances"] (HIGH)
- scale: TBD (MEDIUM)
```

**Completeness Score:** 85%

**Next Steps:**
1. Document total infrastructure scale
2. Describe timeline and phases
3. List team members involved
4. Add technical depth details

## Future Enhancements

- [ ] Multi-language support
- [ ] Structured data input validation
- [ ] Integration with existing repository metadata
- [ ] Automated duplicate detection
- [ ] AI-powered fact verification
- [ ] Interactive refinement UI
- [ ] Batch processing multiple items
- [ ] Confidence threshold customization
- [ ] Custom template support
- [ ] Integration with CV generation

## Troubleshooting

### Issue: Low Confidence Scores
**Solution**: Provide more specific details in the raw text:
- Use exact numbers instead of "many" or "several"
- Include specific dates instead of "last year"
- Name clients explicitly or use CLIENT_A format
- Describe outcomes with metrics

### Issue: Missing Critical Information
**Solution**: Fill in TBD fields manually:
1. Identify which fields have TBD
2. Provide the missing information
3. Update the Markdown file
4. Run validation again

### Issue: Incorrectly Extracted Values
**Solution**: The extraction algorithm uses pattern matching which may have false positives:
1. Review the extracted values in the output
2. Correct any mistakes directly in the Markdown file
3. Re-validate completeness
4. Note patterns that don't work for future improvement

## Contributing

To improve the extractor:

1. Document new pattern recognition cases
2. Test with various input formats
3. Add new technology keywords as needed
4. Improve confidence scoring heuristics

## License

MIT

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
