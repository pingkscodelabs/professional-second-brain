# ADR-06: Self-Service vs Ticket-Based Provisioning

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-06 |
| Title | Self-Service vs Ticket-Based Provisioning |
| Status | PROPOSED |
| Date | 2026-08-30 |
| Decision Maker | Platform Engineering Architect (reference architecture) |
| Reviewers | Platform, Developer Experience, Security, Application Teams |

## Context

Developers need standard infrastructure, repositories, pipelines, and runtime configuration without waiting for repetitive platform tickets.

## Problem

Ticket-based provisioning is controllable but slow and hard to scale. Unrestricted self-service is fast but unsafe. The platform needs autonomy with governance.

## Options Considered

### Option 1: Continue Ticket-Based Provisioning

**Pros**:
- Human review for every request
- Familiar process

**Cons**:
- Slow, repetitive, and hard to scale
- Platform team becomes bottleneck

### Option 2: Unrestricted Self-Service

**Pros**:
- Maximum speed for developers

**Cons**:
- Security, cost, and reliability risk

### Option 3: Controlled Self-Service Golden Paths

**Pros**:
- Fast path for approved patterns
- Automated policy validation and risk-based approval

**Cons**:
- Requires product investment in UX, templates, and governance

## Decision

Use controlled self-service golden paths with automated guardrails and escalation for high-risk requests.

## Why

It improves developer experience while preserving enterprise control over security, cost, compliance, and reliability.

## Trade-offs

| Gained | Lost |
|--------|------|
| Reduced repetitive tickets | Upfront platform product investment |
| Better developer autonomy | Need for careful policy design |

## Consequences

- Platform must define golden-path contracts, inputs, outputs, ownership, and support model.
- Exception processes must exist for valid non-standard needs.

## Future Reconsideration Conditions

Reconsider if golden paths fail adoption, if request volume does not justify automation, or if policy controls create more friction than manual review.

## Related

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

---

**Status**: Proposed  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
