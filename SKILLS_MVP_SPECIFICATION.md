# MVP Skills Implementation Specification

## Skill 1: PSB-Onboard

### Purpose
Transform raw professional information into structured, template-compliant Markdown files with automatically populated metadata.

### Technical Specification

#### Inputs
```typescript
{
  informationType: "project" | "skill" | "achievement" | "client" | "adr";
  rawText: string;
  category?: string;
  confidentialityLevel?: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "SECRET";
  linkSuggestions?: boolean;  // default: true
}
```

#### Processing Steps

1. **Extract Key Information**
   - Use Claude's understanding to parse raw text
   - Identify key facts: dates, numbers, names, roles, outcomes
   - Classify confidence for each extracted fact (HIGH/MEDIUM/LOW)

2. **Template Matching**
   - Match to appropriate template (project/skill/achievement/etc.)
   - Identify required vs optional fields
   - Map extracted facts to template fields

3. **Populate Template**
   - Fill extracted facts into Markdown template
   - Mark unclear/missing fields with `TBD`
   - Add confidence indicators for low-confidence extractions

4. **Extract Metrics & Evidence**
   - Identify quantifiable claims (numbers, percentages, scale)
   - Flag vague claims that need clarification
   - Suggest where evidence could come from

5. **Generate Metadata**
   - Create YAML entry for metadata files
   - Generate appropriate file path suggestion
   - Create backlink references

6. **Suggest Links**
   - Based on technologies/skills mentioned
   - Based on timeframe overlaps
   - Suggest files that should reference this new content

#### Output Format

```markdown
# [Auto-Generated] Project/Skill/Achievement Name

[Populated from template with extracted information]

---

## Metadata

**File Path**: projects/aws/project-name.md
**Status**: Needs Review (missing X fields)
**Completeness**: 75% (9/12 required fields filled)

## Extracted Information Summary

### High Confidence (Directly stated)
- Fact 1
- Fact 2

### Medium Confidence (Inferred)
- Assumption 1 [needs confirmation]
- Assumption 2 [needs confirmation]

### Missing Critical Information
- Business metrics/impact (TBD)
- Team size details (TBD)
- Timeline specifics (TBD)

## Suggested Metadata Entry

```yaml
projects:
  - name: "Project Name"
    client: "CLIENT_A"
    period: "YYYY-MM to YYYY-MM"
    technologies: ["AWS", "Terraform"]
    status: "needs_review"
    documentation_link: "projects/aws/project-name.md"
```

## Suggested Linking

This project should be linked from:
- `metadata/projects.yml` ← Add entry above
- Skills: Terraform (projects array), AWS (projects array)
- Achievement: [Related achievement] if any
- Client: CLIENT_A > projects list

## Next Steps

1. Review extracted information for accuracy
2. Fill in TBD/missing fields
3. Verify metrics and claims
4. Run quality check
5. Commit to repository
```

#### Error Handling

```
If raw text is too vague:
→ Ask clarifying questions
→ Provide template with guidance
→ Suggest what information is needed

If contradictions detected:
→ Flag conflicting information
→ Ask user to clarify
→ Store both versions pending clarification

If claim seems exaggerated:
→ Flag as "NEEDS_VERIFICATION"
→ Suggest evidence sources
→ Require explicit user confirmation
```

### Usage Examples

#### Example 1: Structuring a Project

**Input:**
```
Type: Project
Text: "Last year I led a Kubernetes migration. We moved 150 microservices 
from EC2 to Kubernetes. Took about 6 months. Reduced costs significantly.
Used Terraform for IaC."
```

**Output:**
```markdown
# Kubernetes Migration Project

## Project Metadata

| Field | Value |
|-------|-------|
| Project Name | Microservices to Kubernetes Migration |
| Client | TBD |
| Time Period | 2023 to 2024 (approx) |
| Role | Lead Architect |
| Team Size | TBD |

## Business Outcomes

**Cost Reduction**: Significant (TBD - specific amount needed)

## Technical Context

**Scale**: 150+ microservices migrated
**Infrastructure**: EC2 → Kubernetes
**Timeline**: ~6 months

## Key Technologies

- Kubernetes
- Terraform
- AWS

---

## Summary of Extracted Information

**High Confidence** (Directly stated):
- 150 microservices migrated
- EC2 to Kubernetes migration
- Took ~6 months
- Led by you
- Used Terraform for IaC

**Medium Confidence** (Inferred):
- Significant cost reduction implies 20-40% savings typical
- 6-month timeline suggests medium-large scale project
- Leadership role implies team coordination

**Missing Critical Information**:
- [ ] Specific cost savings amount ($X or X%)
- [ ] Exact timeline (months/dates)
- [ ] Client name or anonymized name
- [ ] Team size and composition
- [ ] Specific challenges overcome
- [ ] Performance/reliability improvements

## Metadata Entry

```yaml
- name: "Microservices to Kubernetes Migration"
  client: "TBD"
  period: "2023-01 to 2024-01"
  technologies: ["Kubernetes", "Terraform", "AWS"]
  team_size: TBD
  status: "needs_review"
  documentation_link: "projects/kubernetes/microservices-migration.md"
```

## Suggested Linking

**Should link to**:
- Skills: [Kubernetes](../../profile/skills-matrix.md#kubernetes)
- Skills: [Terraform](../../profile/skills-matrix.md#terraform)
- Skills: [AWS](../../profile/skills-matrix.md#aws)
- Technology: [Kubernetes](../../technologies/kubernetes.md)

## Next Steps

1. Provide exact cost savings numbers
2. Clarify client name (or anonymize as CLIENT_A)
3. Provide exact dates
4. Add team size and breakdown
5. Describe key challenges and how addressed
6. Note any cost/performance/reliability metrics
```

---

## Skill 2: PSB-CV-Builder

### Purpose
Generate tailored resumes/CVs by matching job requirements against repository evidence.

### Technical Specification

#### Inputs
```typescript
{
  jobDescription: string;
  format?: "resume" | "cv" | "linkedin";
  maxLength?: number;  // in pages or lines
  targetLevel?: "junior" | "mid" | "senior" | "staff" | "principal";
  focusAreas?: string[];  // optional emphasis
}
```

#### Processing Steps

1. **Parse Job Description**
   - Extract required skills
   - Identify key technologies
   - Note experience level required
   - Extract must-haves vs nice-to-haves
   - Identify industry/domain

2. **Search Repository**
   - Search projects for matching technologies
   - Search skills for listed requirements
   - Search achievements for relevant outcomes
   - Search metadata for keyword matches

3. **Rank Relevance**
   - Score each project/achievement for match
   - Prioritize by recency and impact
   - Weight by strength of evidence
   - Consider scale alignment

4. **Extract Bullets**
   - Convert projects into achievement bullets
   - Include quantified metrics
   - Link back to source documentation
   - Ensure claims are verifiable

5. **Generate CV Structure**
   - Professional summary (tailored to role)
   - Skills section (matched to JD)
   - Experience/projects (highest relevance)
   - Achievements section (quantified)

6. **Quality Checks**
   - Verify no fabricated claims
   - Ensure all bullets have evidence
   - Check for tone/professionalism
   - Validate format requirements

7. **Generate Analysis**
   - Calculate match score
   - Identify gaps
   - Note weak areas
   - Provide recommendations

#### Output Format

```markdown
# CV: [Role Title] at [Company]

**Match Score**: 87/100
**Generated**: [Date]
**Sources**: All claims are evidence-backed (see citations)

---

## PROFESSIONAL SUMMARY

[Tailored 3-4 sentences highlighting most relevant experience]
Based on: [Job description keywords and your strongest projects]

---

## TECHNICAL SKILLS

### Expert (5+ years production)
- **Kubernetes** – Multi-cluster management, 150+ services scaled
  *Evidence: projects/kubernetes/microservices-migration.md*
  
- **Terraform** – Governance frameworks, 100+ AWS accounts
  *Evidence: projects/terraform/governance-framework.md*

- **AWS** – Multi-account architecture, cost optimization
  *Evidence: multiple projects in metadata*

### Advanced (2-3 years)
- CI/CD Platforms (ArgoCD, GitHub Actions)
- Infrastructure Automation

---

## PROFESSIONAL EXPERIENCE

### [Company/Title] – [Period]

- **Architected Kubernetes migration for 150+ microservices**, reducing deployment time from 2 hours to 15 minutes (92% improvement) and cutting infrastructure costs by 40% ($2.3M annually)
  *Evidence: projects/kubernetes/microservices-migration.md*

- **Led Terraform governance adoption across 15 teams**, standardizing infrastructure provisioning and reducing manual work by 80%
  *Evidence: projects/terraform/governance-framework.md; evidence/achievements/terraform-adoption.md*

- **Managed 100+ AWS accounts across multiple regions** with cost optimization initiatives that saved $2.3M annually
  *Evidence: projects/aws/multi-account-management.md*

---

## GAP ANALYSIS

### This CV Addresses

✓ All core requirements met or exceeded
✓ 87% match on listed technologies
✓ Leadership experience verified
✓ Scale experience documented
✓ Business impact quantified

### Gaps Identified

⚠ **Limited SRE/Observability**: Your documented experience is moderate. If this is critical to the role, consider highlighting [observability project] or discussing learning in interviews.

❌ **Service Mesh**: Not documented in your repository. If asked, be honest that this is a learning area.

### Recommendations

1. **In interviews**: Lead with Kubernetes migration story - strong technical + leadership demo
2. **Before applying**: Add any recent observability work to repository
3. **Optional**: Prepare honest answer for service mesh questions

---

## VERIFICATION

**Fabrication Risk**: NONE
- All claims are backed by documentation
- All metrics are sourced from verified projects
- No exaggeration detected
- All links are valid

**Confidence Levels**:
- High confidence (5+ documented evidence): 85% of claims
- Medium confidence (2-3 evidence points): 15% of claims
- No weak/unverified claims included

**Time to Interview**: Estimate 30-40% chance of phone screen based on match score.

---

## Sources & Evidence Links

[Detailed citation list with links to every claim]
```

#### Special Handling

**No Experience in Required Area**:
```
If job requires experience you don't have documented:

Option 1: Omit it and note in analysis
→ "This gap should be discussed in interviews. 
   You have 80% of required experience."

Option 2: Link to adjacent experience
→ "No direct Kafka experience documented, but your 
   distributed systems work with RabbitMQ shows related understanding."

Option 3: Note learning trajectory
→ "Not in production yet, but learning this area. 
   Frame as 'quick ramp' in interviews rather than false expertise."
```

**Exaggeration Detected**:
```
If claim seems inflated:

Before including:
→ Ask for verification
→ Include confidence level in output
→ Suggest alternative framing
→ Don't include if unsure

Example: "You claimed 'expert in Kubernetes' but 
repository shows 2 projects and 1 ADR. 
Recommend 'Advanced' classification instead."
```

### Usage Examples

#### Example 1: Senior Platform Engineer Role

**Input:**
```
Job Description: [Full job posting for "Senior Platform Engineer" at BigTech]
Format: resume
MaxLength: 1 page
```

**Output:**
```
CV: Senior Platform Engineer - BigTech

Match Score: 89/100
High likelihood of interview progression

[Complete CV with tailored bullets]

Gap: Service mesh not mentioned in your projects
Recommendation: Research their architecture, prepare learning-minded answer
```

#### Example 2: Staff Architect Role

**Input:**
```
Job Description: "Staff Architect - Cloud Infrastructure"
TargetLevel: staff
FocusAreas: ["Architecture", "Leadership", "Cost Optimization"]
```

**Output:**
```
CV: Staff Architect - Cloud Infrastructure

Match Score: 78/100
⚠ You're at edge of requirements. Would need to emphasize:
- Architectural leadership examples
- Complex system design decisions
- Cross-org influence/impact

Recommended positioning:
1. Lead with infrastructure transformation stories
2. Emphasize scale of systems managed
3. Highlight cost optimization achievements
4. Note team growth you've driven

Gap: Published architecture decisions (ADRs in repo exist but could be more)
Gap: Speaking/thought leadership not documented

Recommendation: Before interviews, add 1-2 complex ADRs and any talks/articles
```

---

## Implementation Notes

### Dependencies
- Repository must have populated metadata files
- Projects/achievements must have quantified metrics
- All claims must be in documentation
- No fabrication tolerance

### Performance Targets
- Onboard skill: < 1 minute per item
- CV builder: < 2 minutes per CV
- Both skills should provide human-reviewable output

### Integration Points
- `.github/copilot-instructions.md` - defines AI behavior rules
- `governance/confidentiality.md` - respects confidentiality levels
- `metadata/` - for searching and correlating
- Templates - for consistency checking

### Error Recovery
- If LLM confidence < 70%, ask for clarification
- If contradictions found, surface both interpretations
- If evidence missing, mark as TBD and move forward
- Never fabricate to complete a field

---

## Next Steps for Implementation

1. Create skill scaffolding in repository
2. Implement core LLM-based extraction logic
3. Build template-matching system
4. Test with sample data
5. Iterate on output quality
6. Deploy as Copilot extension

