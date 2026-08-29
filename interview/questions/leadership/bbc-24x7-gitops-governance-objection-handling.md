# Interview Question: Handling the Objection That Terraform-Managed PagerDuty Slows Down Shift Swaps

## Question Metadata

| Field | Value |
|-------|-------|
| Question | "Managing PagerDuty via Terraform code slows down shift swaps and holiday overrides." How do you respond? |
| Category | Leadership |
| Difficulty | MEDIUM |
| Technology | Terraform GitOps, PagerDuty |
| Concepts Tested | Stakeholder objection handling, balancing governance with day-to-day agility |

## The Question

**Interviewer/stakeholder objects:**

> "Managing PagerDuty via Terraform code slows down shift swaps and holiday overrides."

## What This Question Tests

### Concepts Being Evaluated

- Ability to distinguish baseline configuration governance from operational-day agility (deep)
- Stakeholder objection handling without being defensive (moderate)

### Expected Knowledge Areas

- Which changes actually require a Terraform PR vs. which don't
- The PagerDuty "Override" feature

## Expected Strong Answer

### Strong Answer Example

> Standard shift overrides — like swapping a night for sickness — don't require any code change at all. Engineers can still perform those directly in the PagerDuty UI or mobile app using the "Override" feature, same as before. Terraform GitOps is only used to manage the baseline: schedules, escalation rules, and service integrations. So we get day-to-day agility for the changes people make constantly, and structural governance (peer review, audit trail) for the changes that actually carry risk if done wrong.

This answer demonstrates:
- Precise scoping of what GitOps governs vs. what remains fast-path
- Empathy for the objection while still defending the design

### Key Points in Strong Answer

- Name the specific escape hatch (PagerDuty "Override" feature) rather than a vague reassurance
- Reframe the trade-off: governance targets structural risk, not daily operational friction

## Your Real Experience

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Experience Level

**Your actual experience**: ADVANCED  
**Confidence in answer**: HIGH

### Relevant Achievements

- [GitOps On-Call Governance Adoption](../../star-stories/bbc-24x7-gitops-oncall-governance-leadership.md)

## Related Architecture & Decisions

### Related ADRs

- [ADR-01: Terraform GitOps vs. PagerDuty Web Console](../../../architecture/architecture-decisions/adr-bbc-24x7-terraform-gitops-oncall.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
