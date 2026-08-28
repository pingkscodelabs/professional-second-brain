/**
 * Template Manager
 * Provides Markdown templates for different information types
 */

class Templates {
  getProjectTemplate() {
    return `# {projectName}

## Project Metadata

| Field | Value |
|-------|-------|
| Project Name | {projectName} |
| Client | {client} |
| Time Period | {timePeriod} |
| Role | {role} |
| Team Size | {teamSize} |

## Project Overview

### Business Context

**Industry/Domain**: {category}  
**Problem Statement**: TBD  
**Business Goals**: TBD  
**Success Metrics**: {businessOutcome}  

### Technical Context

**Technology Stack**: {technologies}  
**Infrastructure Scale**: {scale}  
**Complexity Level**: TBD  
**Team Composition**: TBD  

## Your Responsibilities

- TBD
- TBD
- TBD

## Architecture & Design

### Key Technologies

{technologies}

### Challenges Encountered

{challenges}

## Business Outcomes

**Metrics**: {businessOutcome}  
**Impact**: TBD  

## Technical Outcomes

- TBD
- TBD

## Learning & Lessons

### What Worked Well

- TBD
- TBD

### What You'd Do Differently

- TBD
- TBD

## Interview Readiness

### Key Talking Points

- TBD
- TBD

### Common Follow-Up Questions

- TBD
- TBD

---

**Confidentiality**: CONFIDENTIAL  
**Last Updated**: ${new Date().toISOString().split('T')[0]}  
**Status**: Needs Review
`;
  }

  getAchievementTemplate() {
    return `# {title}

## Achievement Overview

| Field | Value |
|-------|-------|
| Achievement Title | {title} |
| Date | {date} |
| Context/Client | {context} |
| Recognition | TBD |

## What Was Accomplished

**Business Outcome**: {businessImpact}  
**Technical Outcome**: {technicalOutcome}  
**Scale/Impact**: {scale}  

## Problem Context

**Business Problem**: TBD  
**Technical Challenge**: TBD  
**Constraints/Limitations**: TBD  

## Actions Taken

### Approach

1. TBD
2. TBD
3. TBD

### Key Decisions

- TBD
- TBD

### Technologies Used

{technologies}

## Quantifiable Metrics

### Business Metrics

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| {businessImpact} | TBD | TBD | TBD |

### Scale

- Scale/Scope: {scale}
- Users/Systems Affected: TBD
- Revenue/Cost Impact: TBD

## Results & Lessons

### Outcome

**Short-term results**: {businessImpact}  
**Long-term impact**: TBD  
**Recognition received**: TBD  

### Lessons Learned

- Lesson 1: TBD
- Lesson 2: TBD

## STAR Story (for interviews)

**Situation**: {context} - TBD  
**Task**: TBD  
**Action**: TBD  
**Result**: {businessImpact}  

---

**Confidentiality**: CONFIDENTIAL  
**Last Updated**: ${new Date().toISOString().split('T')[0]}  
**Status**: Needs Review
`;
  }

  getSkillTemplate() {
    return `# {skillName}

## Skill Overview

| Field | Value |
|-------|-------|
| Skill Name | {skillName} |
| Category | {category} |
| Current Level | {level} |
| Years of Experience | {yearsOfExperience} |
| Last Used | {lastUsed} |

## Skill Definition

**What This Skill Encompasses**: TBD  
**Why It Matters**: TBD  
**Common Use Cases**: TBD  

## Experience Summary

### Production Experience

- Years in production: {yearsOfExperience}
- Scale of systems: {scale}
- Complexity level: TBD

### Expertise Areas

{expertiseAreas}

### Knowledge Gaps

- Gap 1: TBD
- Gap 2: TBD

## Project Evidence

### Projects Demonstrating This Skill

| Project | Role | Level | Link |
|---------|------|-------|------|
| TBD | TBD | TBD | TBD |

## Business Impact Evidence

### Business Outcomes Achieved

- Outcome 1: TBD
- Outcome 2: TBD

## Technical Depth

### Core Concepts Mastered

- Concept 1: TBD
- Concept 2: TBD

## Learning Journey

### How Acquired

- TBD

### Continued Learning

- Current focus: TBD
- Next steps: TBD

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}  
**Status**: Needs Review
`;
  }

  getClientTemplate() {
    return `# {clientName}

## Client Overview

| Field | Value |
|-------|-------|
| Client Name | {clientName} |
| Anonymized Name | {anonymizedName} |
| Industry | {industry} |
| Engagement Period | {engagementPeriod} |
| Engagement Type | TBD |

## Engagement Context

**Business Domain**: {industry}  
**Client Size/Scale**: TBD  
**Key Business Challenges**: TBD  
**Engagement Scope**: {engagementType}  

## Your Role & Responsibilities

**Your Title**: TBD  
**Key Responsibilities**: TBD  
**Team Size Managed**: TBD  

## Major Projects

### Project 1

**Name**: TBD  
**Scope**: TBD  
**Your Role**: TBD  
**Impact**: TBD  

### Project 2

**Name**: TBD  
**Scope**: TBD  
**Your Role**: TBD  
**Impact**: TBD  

## Business Outcomes

### Key Achievements

| Achievement | Impact | Evidence |
|-------------|--------|----------|
| TBD | TBD | TBD |

## Technical Outcomes

- TBD
- TBD

## Leadership & Mentorship

### Team Leadership

**Team Size**: TBD  
**Leadership Approach**: TBD  
**Key Contributions**: TBD  

### Mentorship

- TBD

## Lessons & Growth

### What You Learned

- Learning 1: TBD
- Learning 2: TBD

### Industry Insights

- Insight 1: TBD
- Insight 2: TBD

---

**Confidentiality Level**: CONFIDENTIAL  
**Last Updated**: ${new Date().toISOString().split('T')[0]}  
**Status**: Needs Review
`;
  }

  getADRTemplate() {
    return `# ADR {number}: {title}

## Status

**Status**: {status}  
**Date**: {date}  
**Decision Makers**: TBD  

## Context

### Problem Statement

{problemStatement}

### Constraints

- Constraint 1: TBD
- Constraint 2: TBD

### Requirements

- Requirement 1: TBD
- Requirement 2: TBD

## Decision

{decision}

## Rationale

### Why This Option

- Reason 1: TBD
- Reason 2: TBD

### Trade-offs

| Aspect | Gain | Loss |
|--------|------|------|
| Performance | TBD | TBD |
| Complexity | TBD | TBD |
| Cost | TBD | TBD |

## Consequences

### Positive

- Benefit 1: TBD
- Benefit 2: TBD

### Negative

- Risk 1: TBD
- Risk 2: TBD

## Implementation

### Timeline

- Phase 1: TBD
- Phase 2: TBD

### Implementation Details

TBD

## Security Implications

- Consideration 1: TBD
- Consideration 2: TBD

## Scalability & Performance

- Scalability: TBD
- Performance Impact: TBD

## Alternatives Considered

### Option 1: TBD

**Pros**: TBD  
**Cons**: TBD  

### Option 2: TBD

**Pros**: TBD  
**Cons**: TBD  

## Review & Approval

**Approved By**: TBD  
**Approval Date**: TBD  
**Next Review**: TBD  

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}
`;
  }
}

module.exports = Templates;
