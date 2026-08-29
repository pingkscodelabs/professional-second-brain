# Case Study Template

Use this template for long-form solution case studies (enterprise platforms, major migrations, multi-phase programs). Copy this file and customize per engagement. Keep one fact in one file: extract major decisions to ADRs, quantified outcomes to achievements, and interview scenarios to STAR stories — link them here rather than duplicating them.

## 1. Metadata & Confidentiality

| Field | Value |
|-------|-------|
| Case Study Title | |
| Client / Organisation | |
| Anonymised Name (if required) | |
| Industry | |
| Business Unit | |
| Engagement Period | YYYY-MM to YYYY-MM |
| My Role | |
| Key Stakeholders | |

**Confidentiality Level**: PUBLIC / INTERNAL / CONFIDENTIAL / SECRET  
**Client Anonymised**: Yes / No  
**Sensitive Details Removed**: Yes / No  
**Safe to Share**: Yes / No  

## 2. Executive Summary

[2-4 sentences: scale, business need, solution approach, headline outcome.]

## 3. Business Context, Problem, Goals, Constraints

### Business Context

**Industry/Domain**:  
**Business Unit**:  

### Problem Statement

[What was broken or missing before this solution, and what risk did it create?]

### Goals & Success Criteria

| ID | Goal | Success Criteria |
|----|------|-------------------|
| G-01 | | |

### Current State / As-Is

[Narrative or diagram of the prior state.]

### Challenges & Constraints

- Constraint 1
- Constraint 2

## 4. Requirements

### Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | |

### Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | |

### Assumptions & Dependencies

- Assumption 1
- Dependency 1

## 5. Proposed Solution & Architecture

### Solution Overview

[Narrative description of the end-to-end solution.]

### Architecture Diagram

[Link to diagram or ASCII art]

### Architecture Component Breakdown

| Component | Responsibility |
|-----------|-----------------|
| | |

### Technology Selection

| Component | Technology Chosen | Alternatives Evaluated | Selection Rationale |
|-----------|--------------------|--------------------------|-----------------------|
| | | | |

### Detailed Design

[Key configuration, code, or payload examples.]

## 6. ADR References & Trade-offs

### Architecture Decisions

| ID | Title | Status | Link |
|----|-------|--------|------|
| ADR-01 | | | [ADR link](../../architecture/architecture-decisions/adr-xxx.md) |

### Design Trade-offs

| Trade-off | Rationale |
|-----------|-----------|
| | |

### Failed Approaches

- [Approach]: [Why tried] / [Why failed] / [Correction]

## 7. Security, Reliability, Scalability, Observability, FinOps

### Security Design

- Authentication/Authorization: 
- Secrets management: 
- Data protection: 

### Scalability & Reliability

- Stateless/state partitioning approach: 
- Fallback mechanisms: 

### Networking

- Ingress/egress considerations: 

### Observability

- Platform metrics: 
- SLOs: 
- Audit alarms: 

### Disaster Recovery

- RTO: 
- RPO: 
- DR execution steps: 

### Cost / FinOps

- Optimization strategies: 

## 8. Delivery Model

### Implementation Approach / Phases

| Phase | Scope |
|-------|-------|
| Phase 1 | |

### Migration Strategy

[Approach to migrating legacy state without disruption.]

### Rollout Strategy

- Sequencing/wave approach: 
- Parallel run / dark launch: 
- Freeze windows: 

### Testing Strategy

- Unit/lint/static analysis: 
- Dry-run validation: 
- Chaos/game-day drills: 

### Operational Model

[Narrative or diagram of steady-state operations.]

### Problems Encountered

1. **Problem**: 
   - Symptom: 
   - Root cause: 
   - Resolution: 

## 9. Outcomes & KPIs (Before/After)

### Business Impact

- 

### Technical Impact

- 

### Automation & Productivity Impact

- 

### Cost Impact

- 

### Security / Compliance Impact

- 

### Metrics & KPIs

| Metric | Before | After | Target / Improvement |
|--------|--------|-------|------------------------|
| | | | |

### Before vs After

[Narrative or diagram contrast.]

## 10. Interview & Review Q&A

### Technical Q&A

**Q1**: 
**Answer**: 

### Architecture Review Questions

**Q1**: 
**Answer**: 

### Client Questions

**Q1**: 
**Answer**: 

### Objections & Responses

**Objection**: 
**Response**: 

### Troubleshooting Scenarios

**Scenario**: 
**Steps**: 

## 11. Reusable Patterns & Roadmap

### Reusable Patterns

- Pattern 1: 

### Future Improvements

- 

### Roadmap

| Phase | Item |
|-------|------|
| Current | |
| Target | |
| Future | |

### Lessons Learned

1. 

## 12. Evidence & Cross-Links

### Related Client File

- [Client](../../clients/client-name.md)

### Related ADRs

- [ADR-01](../../architecture/architecture-decisions/adr-xxx.md)

### Related Achievements

- [Achievement 1](../../evidence/achievements/achievement-1.md)

### Related STAR Stories

- [Story 1](../../interview/star-stories/story-1.md)

### Related Skills / Technologies

- [Skills matrix](../../metadata/skills.yml)
- [Technologies](../../metadata/technologies.yml)

## Change Log

| Date | Change |
|------|--------|
| YYYY-MM-DD | Initial creation |

---

**Status**: Complete / In Progress / TBD  
**Last Updated**: YYYY-MM-DD  
**Review Date**: YYYY-MM-DD  
