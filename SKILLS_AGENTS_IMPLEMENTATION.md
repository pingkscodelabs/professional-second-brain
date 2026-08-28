# PSB Skills & Agents Implementation Guide

## Overview

This document provides detailed implementation guidance for building 5 custom skills and 5 autonomous agents for the Professional Second Brain (PSB) repository.

## Architecture

```
Professional Second Brain Repository
        ↓
┌───────────────────────────────────┐
│   GitHub Copilot Instructions     │
│   (.github/copilot-instructions)  │
└───────────────────────────────────┘
        ↓
   ┌────────────────────────────────┐
   │     Custom Skills Layer        │
   ├────────────────────────────────┤
   │ • psb-onboard                  │
   │ • psb-cv-builder               │
   │ • psb-quality-checker          │
   │ • psb-analyzer                 │
   │ • psb-interview-coach          │
   └────────────────────────────────┘
        ↓
   ┌────────────────────────────────┐
   │   Autonomous Agents Layer      │
   ├────────────────────────────────┤
   │ • psb-ingestion-agent (bulk)   │
   │ • psb-quality-agent (QA)       │
   │ • psb-curator-agent (analysis) │
   │ • psb-cv-agent (generation)    │
   │ • psb-interview-prep-agent     │
   └────────────────────────────────┘
        ↓
  Generated Outputs:
  • CVs, Resumes
  • Interview Q&A
  • Career Insights
  • Quality Reports
```

## Skill 1: PSB-Onboard

### Purpose
Automatically structure raw professional information into PSB templates.

### Input
- Raw text about a project, skill, or achievement
- Context about what type of information it is

### Output
- Properly formatted Markdown file following template
- YAML metadata entry
- Links to related content (if applicable)

### Implementation: Tool Interface

```typescript
interface OnboardInput {
  informationType: "project" | "skill" | "achievement" | "client" | "adr";
  rawText: string;
  category?: string;  // e.g., "aws", "terraform", "leadership"
  confidentialityLevel?: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "SECRET";
}

interface OnboardOutput {
  markdown: string;           // Structured content
  yamlEntry: object;         // Metadata entry
  suggestedFilePath: string; // Where to save
  linkedContent?: string[];  // Suggested links
  missingFields: string[];   // What still needs filling
}
```

### Workflow

```
1. User provides raw information
   ↓
2. Skill analyzes type and extracts key information
   ↓
3. Maps to appropriate template
   ↓
4. Populates required fields
   ↓
5. Identifies missing critical information
   ↓
6. Suggests related content to link
   ↓
7. Generates YAML metadata entry
   ↓
8. Returns structured output ready to commit
```

### Example Usage

**Input:**
```
Type: Project
Text: "At CLIENT_A, I led migration of 150 microservices from EC2 to Kubernetes in 2023. 
We reduced infrastructure costs by 40% and improved deployment time from 2 hours to 15 minutes. 
Used Terraform for IaC, Argo for CD. Led team of 5."
```

**Output:**
```markdown
# Kubernetes Migration Project

## Project Metadata
- Project Name: Microservices to Kubernetes Migration
- Client: CLIENT_A
- Time Period: 2023-01-01 to 2023-06-30
- Role: Lead Architect
- Team Size: 5

## Business Outcomes
- 40% infrastructure cost reduction
- Deployment time: 2h → 15min (92% improvement)

## Technologies
- Kubernetes
- Terraform
- ArgoCD

[... continues with template structure ...]
```

## Skill 2: PSB-CV-Builder

### Purpose
Generate tailored CVs from repository evidence.

### Input
- Job description (or role title/company name)
- Optional: CV format preference, length limits

### Output
- Tailored resume/CV
- Sourced bullets with evidence links
- Gap analysis
- Confidence scores per claim

### Implementation: Tool Interface

```typescript
interface CVBuilderInput {
  jobDescription?: string;  // Full JD or just role title
  format?: "resume" | "cv" | "linkedin";
  maxLength?: number;      // pages or words
  targetLevel?: "junior" | "mid" | "senior" | "staff" | "principal";
}

interface CVBuilderOutput {
  cv: {
    summary: string;
    skills: Array<{skill: string; level: string; evidence: string}>;
    experience: Array<{
      title: string;
      company: string;
      period: string;
      bullets: Array<{text: string; sourceFile: string}>;
    }>;
  };
  analysis: {
    matchScore: number;           // 0-100
    strongAreas: string[];
    gapAreas: string[];
    fabricationRisk: string[];    // None if all verified
  };
  sources: {[bulletId: string]: string};  // Link to evidence
}
```

### Workflow

```
1. Parse job description
   ↓
2. Extract required capabilities/keywords
   ↓
3. Search repository for matching projects/skills
   ↓
4. Rank by relevance and recency
   ↓
5. Extract measurable achievements (with numbers)
   ↓
6. Generate tailored CV bullets
   ↓
7. Add sources/evidence links
   ↓
8. Calculate match score and identify gaps
   ↓
9. Flag any claims that lack evidence
   ↓
10. Return CV + analysis
```

### Example Usage

**Input:**
```
Job Description: "We're hiring a Senior Platform Engineer...
Must have: Kubernetes, Terraform, AWS, 5+ years infrastructure experience,
team leadership, cost optimization focus..."
```

**Output:**
```markdown
# CV: Platform Engineer - ClientName

## Professional Summary
Led infrastructure transformation at 3 major organizations, specializing in cloud 
platform engineering. Designed and deployed Kubernetes infrastructure serving 500+ 
microservices. Drove $2.3M annual infrastructure cost optimization through 
automation and governance frameworks.

## Technical Skills
**Expert** (5+ years production)
- Kubernetes (Architecture, Multi-cluster management, Scaling)
- Terraform (Governance frameworks, Module development, Team workflows)
- AWS (100+ accounts, Multi-region, Cost optimization)

**Advanced** (2-3 years production)
- CI/CD Platforms (ArgoCD, GitHub Actions)
- Infrastructure Automation (Ansible, Helm)

## Experience

### Staff Platform Engineer - CLIENT_A (2021-2023)
- Led Kubernetes adoption across 15 teams, 150+ microservices
  *Evidence: projects/kubernetes/microservices-migration.md*
- Designed Terraform governance framework reducing provisioning time 60%
  *Evidence: projects/terraform/governance-framework.md*
- Achieved $2.3M annual cost optimization through Reserved Instances + Spot usage
  *Evidence: evidence/achievements/cost-optimization-initiative.md*

[... continues ...]

## Gap Analysis
❌ Deep SRE/observability focus (you have moderate experience)
❌ Service mesh architecture (not documented)
✓ Everything else matches or exceeds requirements
```

## Skill 3: PSB-Quality-Checker

### Purpose
Ensure repository meets quality and confidentiality standards.

### Input
- File path or repository root
- Check type: "all", "evidence", "confidentiality", "metadata"

### Output
- Quality report with issues
- Severity levels (ERROR, WARNING, INFO)
- Actionable recommendations

### Implementation: Tool Interface

```typescript
interface QualityCheckInput {
  scope: "file" | "directory" | "repository";
  path: string;
  checkTypes?: ("evidence" | "confidentiality" | "metadata" | "links" | "consistency")[];
}

interface QualityCheckIssue {
  severity: "ERROR" | "WARNING" | "INFO";
  file: string;
  line?: number;
  type: string;  // e.g., "missing_evidence", "exposed_secret", "broken_link"
  message: string;
  suggestion: string;
}

interface QualityCheckOutput {
  issues: QualityCheckIssue[];
  summary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    infos: number;
  };
  score: number;  // 0-100
  recommendations: string[];
}
```

### Quality Checks

#### Evidence Checks
- ❌ Claims without supporting evidence
- ❌ Vague descriptions ("very good at X")
- ❌ Missing metrics in achievements
- ❌ Skill classifications without projects
- ❌ Years listed without production evidence

#### Confidentiality Checks
- ❌ Exposed API keys, passwords, tokens
- ❌ Real client names in CONFIDENTIAL files
- ❌ Private URLs or IP addresses
- ❌ Unredacted financial details
- ⚠️ Missing confidentiality classification

#### Metadata Checks
- ❌ Missing required YAML fields
- ❌ Broken links to other files
- ❌ Inconsistent formats
- ⚠️ Missing metadata entries

#### Consistency Checks
- ❌ Conflicting information
- ⚠️ Outdated timestamps
- ⚠️ Missing backlinks

### Example Usage

**Input:**
```
Check file: projects/aws/cost-optimization.md
Types: ["evidence", "confidentiality"]
```

**Output:**
```
Quality Report: cost-optimization.md
Score: 72/100

ERRORS (3):
[1.1] Missing metrics in business impact
  Location: Line 15, "Business Impact" section
  Issue: Claims "significant cost savings" but no numbers
  Suggestion: Add specific amounts, e.g., "$2.3M annual savings"

[2.1] Client name exposed
  Location: Line 8, client name is "Goldman Sachs"
  Issue: This is CONFIDENTIAL - should be anonymized
  Suggestion: Change to "CLIENT_A" per confidentiality.md guidelines

[2.2] Exposed internal URL
  Location: Line 42, contains "192.168.x.x" IP address
  Issue: Private infrastructure details exposed
  Suggestion: Remove specific IPs, describe generically

WARNINGS (2):
[3.1] Missing confidentiality classification
  Location: Top of file
  Suggestion: Add "Confidentiality Level: CONFIDENTIAL"

[4.1] No evidence link for "expert-level architecture"
  Location: Line 20
  Suggestion: Link to related ADR or architecture decision

RECOMMENDATIONS:
1. Add specific cost numbers to business impact
2. Anonymize client name to CLIENT_A
3. Remove all internal IP addresses
4. Add confidentiality classification
5. After fixes: Run check again
```

## Skill 4: PSB-Analyzer

### Purpose
Analyze career trajectory, skills patterns, and generate insights.

### Input
- Analysis type: "skills", "projects", "scale", "gaps"
- Optional date range, category filter

### Output
- Statistical analysis
- Pattern identification
- Recommendations
- Visualizations (ASCII charts)

### Implementation: Tool Interface

```typescript
interface AnalyzerInput {
  analysisType: "skills" | "projects" | "scale" | "gaps" | "trajectory" | "all";
  dateRange?: {start: string; end: string};
  category?: string;
}

interface AnalyzerOutput {
  analysis: string;              // Formatted report
  statistics: {
    totalProjects: number;
    avgTeamSize: number;
    maxScale: string;
    skillSpread: string[];
    [key: string]: any;
  };
  patterns: string[];            // Identified themes
  recommendations: string[];     // Actionable insights
  visualizations?: string[];     // ASCII charts
}
```

### Analysis Types

#### Skills Analysis
- Skill progression over time
- Most-used technologies
- Underutilized skills
- Gaps vs target role
- Certifications by technology

#### Projects Analysis
- Project count by technology
- Average project duration
- Team size distribution
- Business impact correlation
- Complexity trends

#### Scale Analysis
- Systems managed (AWS accounts, Kubernetes clusters, etc.)
- Teams led (size progression)
- Users impacted
- Scale over time

#### Gap Analysis
- Current skills vs target role
- Missing certifications
- Experience gaps
- Technology gaps

#### Trajectory Analysis
- Career progression
- Skill improvement over time
- Increasing responsibility
- Moving from IC to leadership
- Domain depth vs breadth

### Example Usage

**Input:**
```
Analysis: all
Target: Staff Engineer role
```

**Output:**
```
═══════════════════════════════════════════
    Professional Second Brain Analysis
═══════════════════════════════════════════

CAREER TRAJECTORY (2018-2024)
────────────────────────────────
2018: Junior Engineer (1 project, 2-person team)
2019: Mid-level (3 projects, 5-person avg team)
2021: Senior (5 projects, 10-person avg team)
2023: Staff (7 projects, 15-person avg team) ← Current

SKILLS EVOLUTION
────────────────
Kubernetes:  LEARNING (2019) → INTERMEDIATE (2021) → ADVANCED (2023) → EXPERT (2024)
Terraform:   INTERMEDIATE (2020) → ADVANCED (2021) → EXPERT (2023)
AWS:         INTERMEDIATE (2019) → EXPERT (2023)
Leadership:  BEGINNER (2020) → INTERMEDIATE (2022) → ADVANCED (2024)

IDENTIFIED PATTERNS
────────────────────
✓ Consistent progression in Infrastructure/Platform specialization
✓ Strong upward trajectory in team leadership
✓ Technology depth in AWS, Kubernetes, Terraform ecosystem
⚠ Limited exposure to: Distributed systems, SRE/observability
⚠ Limited breadth in: Data engineering, AI/ML

SCALE METRICS
──────────────
Total systems managed:        500+ microservices
AWS infrastructure:           150+ accounts
Teams led:                    3+ (cumulative)
Average team size:            8-12 people
Largest infrastructure scope: Multi-region, 15 teams, 500 services

STAFF ENGINEER READINESS
─────────────────────────
✓ READY (85/100):
  • Architectural leadership demonstrated
  • Scale experience verified
  • Technical depth in multiple areas
  • Mentorship/leadership experience
  • Business impact awareness

⚠ GAPS TO ADDRESS:
  1. Distributed systems experience (add system design projects)
  2. SRE/observability depth (limited production experience)
  3. Publish thought leadership (talks, blog posts, papers)
  4. Cross-domain knowledge (add 1-2 adjacent areas)

RECOMMENDATIONS FOR NEXT 6 MONTHS
──────────────────────────────────
1. Lead one major distributed systems project
2. Document 3 complex architecture decisions (ADRs)
3. Mentorship: Formalize mentor role for 2 engineers
4. Visibility: Write 2-3 internal architecture posts
5. Learning: Take observability-focused project

With these additions, you'd be 95+ ready for Staff Engineer roles.
```

## Skill 5: PSB-Interview-Coach

### Purpose
Prepare for interviews using actual documented experience.

### Input
- Target role/company
- Interview type: "behavioral", "technical", "architecture", "mock"
- Optional: Specific topics to focus on

### Output
- Relevant interview questions
- Answer frameworks
- STAR stories from your experience
- Mock interview if requested

### Implementation: Tool Interface

```typescript
interface InterviewCoachInput {
  targetRole: string;
  interviewType?: "behavioral" | "technical" | "architecture" | "all";
  focusAreas?: string[];
  conductMockInterview?: boolean;
}

interface InterviewCoachOutput {
  questions: Array<{
    question: string;
    category: string;
    difficulty: string;
    relatedProjects: string[];
    answerFramework: string;
    commonMistakes: string[];
    strongAnswerExample: string;
  }>;
  starStories: Array<{
    title: string;
    file: string;
    relevantFor: string[];
  }>;
  recommendations: string[];
  mockInterviewTranscript?: string;
}
```

### Example Usage

**Input:**
```
Target Role: Senior Platform Engineer at TechCorp
Interview Type: technical
```

**Output:**
```
═══════════════════════════════════════════
    Interview Preparation: Platform Engineer
═══════════════════════════════════════════

YOUR STRONGEST AREAS (Based on documented experience)
─────────────────────────────────────────────────────
✓ Kubernetes at scale (150+ microservices)
✓ Terraform infrastructure as code (5+ years)
✓ AWS multi-account management (100+ accounts)
✓ Team leadership (scaled from 2 to 15)
✓ Cost optimization (drove $2.3M savings)

INTERVIEW QUESTIONS YOU'LL LIKELY GET
─────────────────────────────────────

Q1: Architectural Decisions (HARD)
"Tell me about a time you had to make a major architectural decision 
that had trade-offs. Walk me through your decision-making process."

Answer Framework:
1. Context: Situation and constraints
2. Problem: What had to be solved
3. Options: Multiple approaches considered
4. Decision: What you chose and why
5. Trade-offs: What you gained/lost
6. Outcome: Results and impact
7. Lessons: What you learned

Your Best Example: Kubernetes Migration Project
Evidence: projects/kubernetes/microservices-migration.md
Expected strong areas: Scale, cost impact, team coordination

Follow-up Questions Likely:
- "What would you do differently?"
- "How did you handle resistance?"
- "How did you measure success?"

---

Q2: Scaling Problems (MEDIUM-HARD)
"Describe a time you had to solve a scaling problem. What was the constraint 
and how did you approach it?"

Your Best Answer: 
Reference: Kubernetes cluster scaling project
Scale: 150 microservices, multi-region
Problem: Deployment time was 2+ hours
Solution: Implemented ArgoCD + Terraform automation
Result: 15-minute deployments (92% improvement)

---

Q3: Leadership & Influence (HARD)
"Tell me about a time you had to influence people without direct authority."

Your Story: Terraform governance framework adoption
File: evidence/achievements/terraform-adoption.md
Why strong: Shows influence, business impact, stakeholder management

RECOMMENDED STAR STORIES TO PREPARE
───────────────────────────────────
1. "Microservices to Kubernetes Migration" [TECHNICAL + LEADERSHIP]
   Shows: Architecture, scale, team leadership, business impact
   
2. "Cost Optimization Initiative" [BUSINESS IMPACT + EXECUTION]
   Shows: Business acumen, analytical thinking, ownership
   
3. "Terraform Governance Adoption" [LEADERSHIP + INFLUENCE]
   Shows: Influence without authority, stakeholder management, adoption

AREAS TO BE CAREFUL ABOUT (Limited evidence)
──────────────────────────────────────────────
⚠ Observability/SRE questions (limited production experience)
   Recommendation: Review industry best practices, prepare honest assessment

⚠ Distributed systems deep dives (not much documented)
   Recommendation: Link to relevant projects, emphasize what you have

MOCK INTERVIEW SUGGESTION
──────────────────────────
Ready to do a mock interview now? I can:
1. Ask questions in random order (realistic)
2. Give feedback on answer quality
3. Suggest improvements
4. Rate your responses

Would you like to proceed? (y/n)
```

---

## Agent 1: PSB-Ingestion-Agent

**Role**: Batch onboard professional information

**Trigger**: User provides structured information dump (e.g., from old CV, notes, documentation)

**Workflow**:
1. Accept bulk career data
2. Segment by category
3. For each item:
   - Match to appropriate template
   - Run onboard skill
   - Validate output
4. Link related content
5. Populate metadata
6. Generate summary report
7. Ask for validation before committing

**Timeline**: 1-2 hours for typical career history

---

## Agent 2: PSB-Quality-Agent

**Role**: Continuous quality assurance

**Trigger**: After file changes OR scheduled (weekly)

**Workflow**:
1. Scan repository for recent changes
2. Run quality-checker skill on modified files
3. Categorize issues (critical, important, nice-to-have)
4. Generate report with fixes
5. Suggest pull request with auto-fixes (if safe)
6. Flag critical issues for manual review

**Timeline**: 5-10 minutes for full repo scan

---

## Agent 3: PSB-Curator-Agent

**Role**: Analyze patterns and discover insights

**Trigger**: Scheduled monthly OR on-demand

**Workflow**:
1. Run analyzer skill on entire repository
2. Identify patterns, themes, strengths
3. Find underutilized skills
4. Suggest content to create
5. Detect gaps vs. known career goals
6. Generate monthly "career health report"
7. Recommend next steps for development

**Timeline**: 10-15 minutes for analysis

---

## Agent 4: PSB-CV-Agent

**Role**: End-to-end CV generation

**Trigger**: "Generate CV for [role]"

**Workflow**:
1. If job description provided: parse it
2. Run CV-builder skill
3. Generated CV review
4. Run quality-checker on output
5. Generate 2-3 variations (emphasizing different angles)
6. Present options with analysis
7. Allow refinement/customization
8. Output final resume

**Timeline**: 2-3 minutes per CV

---

## Agent 5: PSB-Interview-Prep-Agent

**Role**: Comprehensive interview preparation

**Trigger**: "Prep for [company/role]"

**Workflow**:
1. Analyze target role
2. Run interview-coach skill
3. Generate relevant questions
4. Select best STAR stories from your experience
5. Optional: Conduct mock interview
6. Provide coaching feedback
7. Generate personalized prep guide
8. Track progress across multiple interviews

**Timeline**: 15-30 minutes for prep, 1+ hour for mock interview

---

## Implementation Priorities

### Week 1-2: MVP Foundation
- [ ] Scaffold skill projects
- [ ] Implement psb-onboard skill
- [ ] Implement psb-cv-builder skill
- [ ] Test with sample data
- [ ] Document usage

### Week 3: Quality & Analysis
- [ ] Implement psb-quality-checker skill
- [ ] Implement psb-analyzer skill
- [ ] Deploy quality-agent
- [ ] Run baseline report

### Week 4-5: Interview Prep
- [ ] Implement psb-interview-coach skill
- [ ] Deploy interview-prep-agent
- [ ] Test with mock scenarios

### Week 6+: Advanced Features
- [ ] Ingestion-agent
- [ ] Curator-agent
- [ ] Canvas UI enhancements
- [ ] Performance optimization

---

## Success Criteria

- ✅ All MVP skills functional and tested
- ✅ Onboarding time reduced from 20min to 5min per item
- ✅ CV generation working (1-2 min from job description)
- ✅ Zero quality check failures in repository
- ✅ Interview prep provides actionable insights
- ✅ All agents working autonomously

---

## Next Steps

1. Approve implementation plan
2. Start Week 1-2 development
3. Create agents as skills mature
4. Expand based on usage feedback

