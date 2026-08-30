# ADR-05: Centralized vs Federated Platform Operating Model

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-05 |
| Title | Centralized vs Federated Platform Operating Model |
| Status | PROPOSED |
| Date | 2026-08-30 |
| Decision Maker | Platform Engineering Architect (reference architecture) |
| Reviewers | Engineering Leadership, Platform, Application Teams, Operations |

## Context

A large enterprise platform must support many teams without turning the central platform team into the owner of every application decision.

## Problem

A fully centralized model can become a bottleneck. A fully decentralized model produces drift, inconsistent security, duplicated tooling, and weak cost governance.

## Options Considered

### Option 1: Fully Centralized Platform Ownership

**Pros**:
- Strong standard control
- Clear ownership for shared infrastructure

**Cons**:
- Bottlenecks and slower team delivery
- Platform team owns too much application-specific context

### Option 2: Fully Decentralized Team Ownership

**Pros**:
- Maximum local autonomy
- Teams can optimize for their own context

**Cons**:
- Drift, duplicated work, inconsistent governance

### Option 3: Federated Platform Model

**Pros**:
- Central paved roads and standards
- Application teams own service-specific decisions within guardrails

**Cons**:
- Requires clear contracts, documentation, and exception process

## Decision

Adopt a federated platform model: platform owns shared capabilities and guardrails; teams own workloads and service-level operation.

## Why

Federation scales better because it avoids both extremes: central bottleneck and uncontrolled decentralization.

## Trade-offs

| Gained | Lost |
|--------|------|
| Team autonomy within standards | Simplicity of one central owner |
| Scalable operating model | Need for stronger contracts and ownership boundaries |

## Consequences

- Platform APIs, golden paths, and support boundaries must be documented.
- Teams need clear accountability for service SLOs, runbooks, and cost ownership.

## Future Reconsideration Conditions

Reconsider if teams lack maturity to operate services safely, or if regulatory constraints require stronger central control for certain workloads.

## Related

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

---

**Status**: Proposed  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
