# STAR Story: Handling Stakeholder Resistance to Platform Guardrails

## Story Metadata

| Field | Value |
|-------|-------|
| Story Title | Handling Resistance to Platform Guardrails and Self-Service Standards |
| Story Type | Conflict Resolution / Leadership |
| Date | TBD |
| Key Skill | Stakeholder management, governance, developer experience |
| Industry/Client | Vodafone |

## Evidence Classification

**Status**: Hypothetical/reference interview story. Do not present as measured real Vodafone experience until evidence is supplied.

## The Story

### Situation

Some application teams viewed platform guardrails as a loss of autonomy, especially when they already had their own Terraform modules, CI/CD workflows, or Kubernetes deployment practices.

### Task

I needed to win adoption without forcing a brittle top-down mandate, while still protecting the enterprise from security, reliability, and cost risk.

### Action

**Step 1**: I would separate non-negotiable controls from flexible implementation details. Encryption, identity, tags, and auditability are mandatory; implementation details can vary where risk is low.

**Step 2**: I would use data from developer research and support tickets to show where platform standards remove pain rather than add bureaucracy.

**Step 3**: I would create an exception path with owner, risk, expiry, and review date, so valid edge cases do not become shadow platforms.

**Key decisions made**:

1. Explain guardrails in business-risk language, not only technical policy language.
2. Allow escape hatches with accountability.
3. Measure adoption and friction continuously.

### Result

**Expected benefit**: Reduced resistance because teams understand which controls are fixed, which are flexible, and how exceptions are handled.  
**Measured result**: TBD.

## What This Story Demonstrates

- Senior stakeholder communication.
- Governance without excessive bureaucracy.
- Ability to balance developer freedom and enterprise controls.

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
