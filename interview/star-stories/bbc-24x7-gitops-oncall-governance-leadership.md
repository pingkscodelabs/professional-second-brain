# STAR Story: Driving GitOps On-Call Governance Adoption Across ~80 BBC Engineering Squads

## Story Metadata

| Field | Value |
|-------|-------|
| Story Title | Leading GitOps On-Call Governance Adoption Across BBC Engineering Squads |
| Story Type | Leadership / Innovation |
| Key Skill | Cross-team platform adoption, GitOps governance, stakeholder alignment |
| Industry/Client | BBC |

## The Story

### Situation

**Context**: BBC engineering teams independently managed out-of-hours support and PagerDuty configuration via the web console, with no version control, mandatory runbook review, or service cataloguing. This created ungoverned production onboarding, alert noise, and configuration drift across roughly 80 engineering squads.

**What was happening**: Production applications were entering service without verified runbooks or Service Catalogue registrations, leaving 24/7 Central Operations unable to triage incidents out-of-hours.

### Task

**Your responsibility**: As Platform Engineer / Solution Architect (DevX & Tooling Lead), I was responsible for designing and rolling out a GitOps-governed on-call model (Terraform + GitHub Actions + Harness) and a mandatory production-readiness gate (PIPELINE, SERVICE, SECARC, RBREVIEW, MON) across all engineering squads, without stalling their release velocity.

### Action

**Step 1**: Designed standardized Terraform HCL modules for PagerDuty services, escalation policies, and schedules, published to the internal DevX registry, so squads could onboard with minimal HCL knowledge (see [ADR-01](../../architecture/architecture-decisions/adr-bbc-24x7-terraform-gitops-oncall.md)).

**Step 2**: Partnered with Duty Operations Managers and Security Architecture (InfoSec) to define the mandatory `RBREVIEW`/`SERVICE` readiness gate, balancing governance rigor against go-live velocity (a 3-to-5 day review gate).

**Step 3**: Rolled out in phased squad waves — Tier 1 core presentation, then Tier 2 capabilities, then Tier 3 internal tooling — with a two-week dark-launch/parallel run per squad to validate alert delivery accuracy against the legacy email-alert path, and freeze windows during major broadcast events.

**Key decisions made**:

1. Wave-based rollout by service criticality rather than a big-bang migration.
   - Why: Limited blast radius and allowed validation against legacy alerting before cutover.
2. Policy-as-code (Rego) scorecards in Harness run in warning-only mode before hard-blocking deployments.
   - Why: Drove smoother developer adoption than an immediate hard gate.

**Leadership/Collaboration**:

- Coordinated across Duty Operations Managers, 24/7 Central Operations, Security Architecture, and dozens of capability product teams to agree the readiness workflow and rollout sequencing.

### Result

**Outcomes achieved**:

- 100% of production services covered by verified, pre-approved runbooks before receiving out-of-hours support (0% unverified services in production, down from ~35%).
- Complete audit trail of all on-call schedule modifications, satisfying InfoSec and regulatory standards.
- On-call schedule provisioning time reduced from ~3 days (manual tickets) to under 10 minutes (PR merge via Harness/GitHub Actions).

**Business impact**: Zero unhandled out-of-hours outages across flagship platforms during major live events, achieved without a big-bang cutover that would have risked release velocity.

## What This Story Demonstrates

### Primary Skills Demonstrated

- Leading multi-stakeholder platform adoption across a large, decentralized engineering organization
- Balancing governance rigor against delivery velocity via phased rollout and warning-only policy gates

## Related Experience

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Related Architecture Decisions

- [ADR-01: Terraform GitOps vs. PagerDuty Web Console](../../architecture/architecture-decisions/adr-bbc-24x7-terraform-gitops-oncall.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
