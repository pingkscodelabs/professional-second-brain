# STAR Story: Vodafone Fleet Reliability Improvement

## Story Metadata

| Field | Value |
|-------|-------|
| Story Title | Improving Reliability Through Standard SLOs, Observability, and Golden Paths |
| Story Type | Technical Challenge / Reliability |
| Date | TBD |
| Key Skill | SRE, observability, service ownership, platform standards |
| Industry/Client | Vodafone |

## Evidence Classification

**Status**: Hypothetical/reference interview story. Do not present as measured real Vodafone experience until evidence is supplied.

## The Story

### Situation

Application teams had inconsistent dashboards, alerts, runbooks, and reliability expectations. Some services had clear operational ownership while others lacked SLOs, alert tuning, or rollback paths.

### Task

I needed to design reliability into the platform so new services inherited operational readiness by default instead of treating observability as a post-launch task.

### Action

**Step 1**: I would define service tiers with expected SLOs, support model, RTO/RPO guidance, and observability baseline.

**Step 2**: I would embed dashboards, alert templates, runbook templates, ownership metadata, and escalation references into each golden path.

**Step 3**: I would integrate deployment verification, rollback, and incident review feedback into the CI/CD workflow.

**Key decisions made**:

1. Generate baseline observability automatically rather than asking each team to reinvent it.
2. Tie alerts to SLOs and runbooks to avoid raw alert noise.
3. Use service tiers so reliability investment matches business criticality.

### Result

**Expected benefit**: More consistent service readiness, faster diagnosis, fewer unactionable alerts, and clearer ownership during incidents.  
**Measured result**: TBD.

## What This Story Demonstrates

- Reliability-by-design.
- SLO-based thinking.
- Operational readiness built into platform workflows.
- Ability to connect reliability controls to developer experience.

## Related Experience

### Related Projects

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

---

**Status**: Draft  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
