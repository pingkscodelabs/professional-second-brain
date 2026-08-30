# ADR-08: OIDC vs Static Credentials for Platform Automation

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-08 |
| Title | OIDC vs Static Credentials for Platform Automation |
| Status | PROPOSED |
| Date | 2026-08-30 |
| Decision Maker | Platform Engineering Architect (reference architecture) |
| Reviewers | Security, Platform, IAM, SRE |

## Context

GitHub Actions and platform automation need access to AWS, Kubernetes, and supporting services. Credentials must be auditable, short-lived, and scoped to the requested operation.

## Problem

Static credentials stored in CI/CD systems create high-impact secret leakage risk. OIDC federation reduces persistent secret exposure but requires careful trust policy design and environment scoping.

## Options Considered

### Option 1: Static Cloud Access Keys in CI/CD

**Pros**:
- Simple to configure initially

**Cons**:
- Long-lived credential leakage risk
- Harder rotation and weaker blast-radius control

### Option 2: OIDC Federation

**Pros**:
- Short-lived credentials
- No static AWS keys in GitHub
- Trust can be scoped by repository, branch, workflow, and environment

**Cons**:
- Requires correct IAM trust policy and guardrails

### Option 3: Central Deployment User / Shared Role

**Pros**:
- Simple mental model

**Cons**:
- Broad blast radius and weak accountability

## Decision

Use OIDC federation for platform automation, with least-privilege IAM roles scoped by repository, workflow, branch/environment, account, and capability.

## Why

OIDC removes long-lived cloud keys from CI/CD and supports fine-grained trust boundaries for fleet-level automation.

## Trade-offs

| Gained | Lost |
|--------|------|
| Reduced secret leakage risk | More complex trust-policy design |
| Better auditability and blast-radius control | Need for IAM/OIDC expertise |

## Consequences

- All workflows need explicit role assumptions and permissions.
- Break-glass flows must be separate, time-bound, and audited.
- Policy must prevent wildcard trust relationships.

## Future Reconsideration Conditions

Reconsider only if a more secure enterprise workload identity model replaces OIDC or if CI/CD execution moves to a different trusted control plane.

## Related

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

---

**Status**: Proposed  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
