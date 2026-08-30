# STAR Story: Vodafone Fleet Platform Adoption Leadership

## Story Metadata

| Field | Value |
|-------|-------|
| Story Title | Driving Adoption of a Fleet Platform Across Enterprise Engineering Teams |
| Story Type | Leadership / Platform Product Management |
| Date | TBD |
| Key Skill | Platform adoption, stakeholder alignment, developer experience |
| Industry/Client | Vodafone |

## Evidence Classification

**Status**: Hypothetical/reference interview story. Do not present as measured real Vodafone experience until evidence is supplied.

## The Story

### Situation

Vodafone-scale engineering teams needed standard infrastructure, CI/CD, Kubernetes, IAM, observability, and cost controls, but many requests flowed through platform tickets and team-specific patterns.

### Task

As a Platform Engineering Architect, I needed to define an adoption approach that made the platform useful enough for teams to choose it, while satisfying security, operations, and governance stakeholders.

### Action

**Step 1**: I would start with developer research to identify the most painful workflows, such as provisioning environments, creating EKS services, and setting up compliant CI/CD.

**Step 2**: I would launch two or three golden paths rather than a broad portal, using early adopters and champions to validate the developer journey.

**Step 3**: I would treat adoption as a product metric, measuring usage, ticket deflection, satisfaction, failed provisioning, and policy exceptions.

**Key decisions made**:

1. Start with high-friction workflows instead of building a generic portal.
2. Use champions and feedback loops to reduce resistance.
3. Preserve escape hatches for advanced teams with clear standards.

### Result

**Expected benefit**: Higher platform adoption because the platform solves real team pain, not only governance requirements.  
**Measured result**: TBD.

## What This Story Demonstrates

- Platform product thinking.
- Stakeholder alignment.
- Adoption strategy beyond documentation.
- Principal-level understanding that platforms must earn usage.

## Related Experience

### Related Projects

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

### Related Architecture Decisions

- [ADR-05: Centralized vs Federated Platform](../../architecture/architecture-decisions/adr-vodafone-fleet-centralized-vs-federated-platform.md)
- [ADR-06: Self-Service vs Ticket-Based Provisioning](../../architecture/architecture-decisions/adr-vodafone-fleet-self-service-vs-ticket-provisioning.md)

---

**Status**: Draft  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
