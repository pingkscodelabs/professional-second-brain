# Interview Question: Ensuring 24/7 Out-of-Hours Support Before a Service Launch

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How do we ensure our squad's service gets 24/7 out-of-hours support before our launch date? |
| Category | Platform-Engineering |
| Difficulty | EASY |
| Technology | Jira workflow (PIPELINE, SERVICE, SECARC, RBREVIEW, MON) |
| Concepts Tested | Production readiness gating, client/stakeholder communication |

## The Question

**Interviewer asks (as a client/stakeholder):**

> How do we ensure our squad's service gets 24/7 out-of-hours support before our launch date?

## What This Question Tests

### Concepts Being Evaluated

- Ability to explain a governance process clearly to a non-platform-engineering audience (moderate)
- Understanding of the end-to-end readiness gate sequence (moderate)

### Expected Knowledge Areas

- The PIPELINE → SERVICE → SECARC → RBREVIEW/MON workflow
- Lead-time planning for go-live readiness

## Expected Strong Answer

### Strong Answer Example

> You need to initiate a Jira `PIPELINE` ticket at least two weeks prior to go-live. This automatically generates the `SERVICE` catalogue ticket, a `SECARC` security check, and `RBREVIEW`/`MON` tickets. Once your runbook is reviewed and approved by 24/7 Operations via `RBREVIEW`, your service is cleared for out-of-hours coverage. Building in a two-week lead time gives Central Operations enough runway to review non-trivial runbooks (FR-01) without becoming a launch blocker at the last minute.

This answer demonstrates:
- Clear, client-facing communication of an internal governance process
- Awareness that the gate exists to protect 24/7 Ops, not to add bureaucracy for its own sake

### Key Points in Strong Answer

- Name the concrete first action (raise a `PIPELINE` ticket) and the lead time (two weeks)
- Explain *why* the gate exists (RBREVIEW protects operations from unsupportable systems out-of-hours)

## Your Real Experience

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Experience Level

**Your actual experience**: ADVANCED  
**Confidence in answer**: HIGH

## Related Architecture & Decisions

### Design Patterns

- Production Readiness Gate (PIPELINE → SERVICE → SECARC → RBREVIEW + MON)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
