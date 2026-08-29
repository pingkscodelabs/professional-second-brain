# Interview Question: Why Use Both Alerta and PagerDuty Instead of PagerDuty Alone?

## Question Metadata

| Field | Value |
|-------|-------|
| Question | Why use both Alerta and PagerDuty instead of relying solely on PagerDuty? |
| Category | Architecture |
| Difficulty | MEDIUM |
| Technology | Alerta (Tickmon), PagerDuty |
| Concepts Tested | Tool selection rationale, cost-aware architecture, separation of concerns |

## The Question

**Interviewer asks:**

> Why use both Alerta and PagerDuty instead of relying solely on PagerDuty?

## What This Question Tests

### Concepts Being Evaluated

- Separation of concerns between dispatch tooling and visibility tooling (deep)
- License/cost-aware architecture decisions (moderate)
- Ability to justify a two-tool design instead of over-simplifying to one tool

### Expected Knowledge Areas

- PagerDuty's role as a paid, per-user incident dispatch tool
- Multi-tenant dashboarding for shared operational visibility

## Expected Strong Answer

### Strong Answer Example

> PagerDuty is optimized for incident dispatch and escalation to specific individuals, whereas Alerta (Tickmon) provides a continuous, multi-tenant visual dashboard for 24/7 Central Operations. Using Alerta as a telemetry buffer prevents high-volume background noise from consuming PagerDuty API rate limits and paid user licenses, allowing Central Ops to triage non-critical issues visually without paging engineers unnecessarily. This maps directly onto our dual dispatch model: Alerta serves Model A (Central Ops triage), while PagerDuty serves Model B (direct automated routing) for tier-1 audience-impacting systems.

This answer demonstrates:
- Deep understanding of why architecture sometimes intentionally uses two overlapping-looking tools
- Business acumen: license cost avoidance is a first-class design driver, not an afterthought

### Key Points in Strong Answer

- Cost is a legitimate architectural constraint (PagerDuty seats are licensed per user)
- Visibility and dispatch are different concerns and can scale independently

## Your Real Experience

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Experience Level

**Your actual experience**: ADVANCED  
**Confidence in answer**: HIGH

### Relevant Achievements

- [PagerDuty License Cost Optimization](../../../evidence/achievements/bbc-24x7-pagerduty-license-optimization.md)

## Related Architecture & Decisions

### Related ADRs

- [ADR-02: Dual Dispatch Architecture](../../../architecture/architecture-decisions/adr-bbc-24x7-dual-dispatch-model.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
