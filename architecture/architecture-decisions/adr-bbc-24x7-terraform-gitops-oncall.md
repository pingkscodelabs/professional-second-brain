# ADR-01: Terraform GitOps vs. PagerDuty Web Console for Rota Management

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-01 |
| Title | Terraform GitOps vs. PagerDuty Web Console for Rota Management |
| Status | ACCEPTED |
| Date | 2026 |
| Decision Maker | Platform Engineer / Solution Architect (DevX & Tooling Lead) |
| Reviewers | SRE & Platform Engineering Leads, Security Architecture (InfoSec) |

## Context

### Problem Statement

Operating over 80 engineering squads on manually-configured PagerDuty schedules resulted in configuration drift, missing overrides, and untracked schedule edits.

### Background

PagerDuty schedules and escalation policies were configured directly via the web UI with no version control, creating compliance gaps and orphaned schedules across squads.

### Driving Requirements

- FR-03: PagerDuty configurations must be managed via code in GitHub, requiring Code Owner approvals for changes.
- NFR-04: Every change to on-call schedules, escalation policies, and runbooks must leave an immutable Git commit log.

### Constraints

- PagerDuty user licenses are constrained; coverage must balance full on-call rotas against license costs.
- Heterogeneous tech stack across ~80 engineering squads.

## Options Considered

### Option 1: Manual PagerDuty Web UI Administration

**Pros**:
- No new tooling to learn
- Fastest for one-off changes

**Cons**:
- No peer review, no audit trail
- Configuration drift and orphaned schedules

**Risk level**: HIGH

### Option 2: Custom Internal Python CLI Wrapping the PagerDuty API

**Pros**:
- Scriptable, faster than manual UI edits

**Cons**:
- No declarative state, no drift detection
- Requires bespoke tooling maintenance

**Risk level**: MEDIUM

### Option 3: Declarative Terraform Modules Managed in Git with GitHub Actions / Harness

**Pros**:
- Peer review via pull requests
- Automated linting, Code Owner enforcement
- S3 remote state tracking and rollbacks

**Cons**:
- Engineering teams must learn basic HCL syntax to update on-call rotas

**Risk level**: LOW

## Decision

**We will adopt Option 3 (Terraform GitOps) because it provides peer review, automated linting, Code Owner enforcement, S3 remote state tracking, and rollbacks.**

### Why This Option?

1. Provides an immutable Git commit log for every schedule/escalation change (NFR-04).
2. Enforces Code Owner approval on PagerDuty changes (FR-03).
3. Enables per-team state isolation and rollback.

## Trade-offs

| Aspect | Gained | Lost |
|--------|--------|------|
| Governance | Peer-reviewed, auditable changes | Some UI-level editing convenience |
| Onboarding | Standardized HCL templates reduce ramp-up | Teams must learn basic HCL syntax |

## Consequences

### Positive Consequences

- Zero infrastructure drift; all PagerDuty escalations, services, and schedules locked to declarative Git state.
- Standard shift overrides (e.g., swapping a night for sickness) can still be performed directly in the PagerDuty UI/Mobile App via the "Override" feature, combining day-to-day agility with structural governance.

### Negative Consequences

- Initial monolithic Terraform repository caused state lock contention (see [Terraform State Lock Deadlock Resolution](../../interview/star-stories/bbc-24x7-terraform-state-lock-resolution.md)), resolved by isolating state per team folder (`/teams/{squad-name}/terraform.tfstate`).

## Related

- [BBC 24/7 Operations & Incident Orchestration Platform](../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)
- [ADR-02: Dual Dispatch Architecture](adr-bbc-24x7-dual-dispatch-model.md)
- [Terraform State Lock Deadlock Resolution](../../interview/star-stories/bbc-24x7-terraform-state-lock-resolution.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
