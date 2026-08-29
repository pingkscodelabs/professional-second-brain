# Interview Question: PagerDuty Escalation When On-Call Fails to Acknowledge

## Question Metadata

| Field | Value |
|-------|-------|
| Question | What happens if an on-call engineer fails to acknowledge a PagerDuty callout? |
| Category | Platform-Engineering |
| Difficulty | EASY |
| Technology | PagerDuty escalation policies |
| Concepts Tested | Escalation policy design, incident dispatch reliability |

## The Question

**Interviewer asks:**

> What happens if an on-call engineer fails to acknowledge a PagerDuty callout?

## What This Question Tests

### Concepts Being Evaluated

- Multi-level escalation policy design (moderate)
- Understanding of failure-mode handling in incident dispatch (moderate)

### Expected Knowledge Areas

- PagerDuty escalation policy configuration
- Organizational escalation chains (engineer → secondary → team lead → duty manager)

## Expected Strong Answer

### Strong Answer Example

> PagerDuty escalation policies define multi-level fallback targets. If the primary on-call engineer does not acknowledge within 15 minutes, PagerDuty automatically triggers a phone call to the secondary on-call engineer. If that's also unacknowledged after another 15 minutes, it escalates further to the Engineering Team Lead and the Duty Operations Manager (DOM). This is defined declaratively in Terraform as a `pvd_escalation_policy` resource with `escalation_delay_in_minutes` and ordered `rule` blocks referencing schedule references, so the fallback chain is version-controlled per team.

This answer demonstrates:
- Practical experience with PagerDuty escalation configuration
- Awareness of both the tooling behavior and the underlying GitOps management model

### Key Points in Strong Answer

- Escalation delay values (15 min) are tuned against the NFR-02 latency target and G-04 MTTA goal
- Escalation chain terminates at a human decision-maker (DOM), not silently

## Your Real Experience

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Experience Level

**Your actual experience**: ADVANCED  
**Confidence in answer**: HIGH

## Related Architecture & Decisions

### Related ADRs

- [ADR-01: Terraform GitOps vs. PagerDuty Web Console](../../../architecture/architecture-decisions/adr-bbc-24x7-terraform-gitops-oncall.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
