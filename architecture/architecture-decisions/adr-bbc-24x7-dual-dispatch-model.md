# ADR-02: Dual Dispatch Architecture (Model A vs. Model B)

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-02 |
| Title | Dual Dispatch Architecture (Model A: Central Ops Triage vs. Model B: Direct Automated Routing) |
| Status | ACCEPTED |
| Date | 2026 |
| Decision Maker | Platform Engineer / Solution Architect (DevX & Tooling Lead) |
| Reviewers | Duty Operations Managers (DOM), 24/7 Central Operations |

## Context

### Problem Statement

Paging 3rd-line engineers directly for non-critical or false-positive alarms causes alert fatigue and burnout, while routing all major outages through manual central triage delays Mean Time to Resolve (MTTR).

### Driving Requirements

- G-04: Reduce MTTA for critical incidents to < 5 minutes and MTTR by 40% through actionable, pre-approved runbooks.

### Constraints

- Presentation-layer systems (e.g., WebCore) render ~1 billion weekly requests; failures immediately impact millions of live viewers and cannot tolerate triage delay.

## Options Considered

### Option 1: 100% Central Ops Manual Dispatch for All Alerts

**Pros**:
- Protects engineers from non-actionable noise

**Cons**:
- Adds human triage delay to tier-1, audience-impacting outages

**Risk level**: MEDIUM

### Option 2: 100% Direct Automated Paging to Engineering Rotas for All Alerts

**Pros**:
- No triage delay for any alert

**Cons**:
- Alert fatigue and burnout from non-actionable/false-positive alarms

**Risk level**: HIGH

### Option 3: Tiered Hybrid Model (Model A: Central Ops Triage; Model B: Automated Critical Routing)

**Pros**:
- Central Ops absorbs non-actionable noise for lower-tier services (Model A)
- Tier-1 audience-impacting systems bypass human delay via direct automated routing (Model B)

**Cons**:
- Requires clear criticality tiering and runbook coverage to route correctly

**Risk level**: LOW

## Decision

**We will adopt Option 3 (Tiered Hybrid Model) because it protects engineers from non-actionable noise during off-hours while bypassing human delay for tier-1 audience-impacting systems.**

### Why This Option?

1. Model A (Central Ops Triage): Central Operations and Duty Operations Managers triage using approved runbooks, protecting engineers from non-actionable noise.
2. Model B (Direct Automated Routing): Bypasses human delay for tier-1 audience-impacting systems (e.g., live streaming auth), routing directly to the on-call rota.

## Trade-offs

| Aspect | Gained | Lost |
|--------|--------|------|
| Alert fatigue | Reduced burnout from non-actionable alerts routed through Central Ops | Slight added hop for lower-tier services |
| MTTR (tier-1) | Direct routing avoids triage delay for critical outages | Requires accurate service tiering to route correctly |

## Consequences

### Positive Consequences

- MTTA reduced from 18 minutes to 2.5 minutes; MTTR reduced from 74 to 43 minutes (42% improvement) — see [MTTA/MTTR & Alert Noise Reduction](../../evidence/achievements/bbc-24x7-mttr-alert-noise-reduction.md).
- Non-actionable alert volume reduced by ~68% (from ~1,200/week to ~380/week) via Alerta/Siren Bridge deduplication ahead of dispatch routing.

### Negative Consequences

- Requires mandatory `RBREVIEW` runbook sign-off before a service is eligible for out-of-hours support, adding a 3-to-5 day go-live gate.

## Related

- [BBC 24/7 Operations & Incident Orchestration Platform](../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)
- [ADR-01: Terraform GitOps vs. PagerDuty Web Console](adr-bbc-24x7-terraform-gitops-oncall.md)
- [MTTA/MTTR & Alert Noise Reduction](../../evidence/achievements/bbc-24x7-mttr-alert-noise-reduction.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
