# ADR-03: GitOps vs Direct Deployment for Fleet Changes

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-03 |
| Title | GitOps vs Direct Deployment for Fleet Changes |
| Status | PROPOSED |
| Date | 2026-08-30 |
| Decision Maker | Platform Engineering Architect (reference architecture) |
| Reviewers | Platform, Security, SRE, Application Teams |

## Context

The platform needs a clear audit trail for infrastructure, Kubernetes, and pipeline changes while allowing teams to move quickly through standardized workflows.

## Problem

Direct changes through consoles or local credentials create drift and weak auditability. Pure automation without pull-request review can hide risk. A GitOps model adds review and traceability but can feel slower if day-to-day changes are not designed well.

## Options Considered

### Option 1: Direct Console / CLI Deployment

**Pros**:
- Fast for individual operators
- Low process overhead

**Cons**:
- Drift, weak auditability, inconsistent approvals

### Option 2: CI/CD Direct Apply From Main Branch

**Pros**:
- Automated and repeatable

**Cons**:
- Limited pre-merge review for risky changes

### Option 3: GitOps Pull Request Workflow

**Pros**:
- Reviewable changes, plan evidence, CODEOWNERS, audit trail
- Works well with policy checks and approval gates

**Cons**:
- Requires good templates and fast feedback to avoid slowing teams

## Decision

Use GitOps pull-request workflows for platform and infrastructure changes, with risk-based approval and automated apply after required checks pass.

## Why

GitOps provides the right balance of autonomy, auditability, and control for fleet-level infrastructure and Kubernetes platform changes.

## Trade-offs

| Gained | Lost |
|--------|------|
| Traceability, drift control, peer review | Some immediacy of direct console changes |
| Policy-as-code integration | Need to optimize PR feedback loops |

## Consequences

- Emergency break-glass flow must exist for incidents.
- PR templates and plan comments must be understandable to non-platform reviewers.

## Future Reconsideration Conditions

Reconsider if workflow latency blocks critical delivery, or if a higher-level platform API provides equivalent auditability and policy enforcement.

## Related

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

---

**Status**: Proposed  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
