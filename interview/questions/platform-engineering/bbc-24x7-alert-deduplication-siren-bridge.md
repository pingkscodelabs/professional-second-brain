# Interview Question: Alert Deduplication Across Multiple Monitoring Tools

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How does the solution handle alert deduplication across multiple monitoring tools? |
| Category | Platform-Engineering |
| Difficulty | MEDIUM |
| Technology | AWS Lambda, Datadog, CloudWatch, Prometheus, Alerta, PagerDuty |
| Concepts Tested | Event correlation, deduplication design, alert fatigue mitigation |

## The Question

**Interviewer asks:**

> How does the solution handle alert deduplication across multiple monitoring tools?

## What This Question Tests

### Concepts Being Evaluated

- Event fingerprinting and correlation across heterogeneous telemetry sources (deep)
- Sliding-window deduplication design (moderate)
- Trade-offs between alert volume reduction and missed-signal risk (moderate)

### Expected Knowledge Areas

- Middleware/event-bridge design patterns
- Time-windowed deduplication strategies
- Multi-tool observability integration

## Expected Strong Answer

### Strong Answer Example

> Datadog, CloudWatch, and Prometheus send alert payloads to the AWS Siren Bridge middleware. Siren Bridge extracts key fingerprint fields — `environment`, `service_id`, `component`, `alert_name` — and calculates an MD5 hash from them. If an alert with the same hash exists within a 15-minute sliding window, Siren increments an event counter in Alerta rather than triggering a new PagerDuty incident. This prevents alert storms from a single underlying fault while still surfacing frequency/recurrence to Central Operations via Alerta.

This answer demonstrates:
- Deep understanding of fingerprint-based deduplication
- Practical experience integrating multiple monitoring sources into one pipeline
- Awareness of the trade-off between suppression and losing distinct signal

### Key Points in Strong Answer

- Deduplication happens before PagerDuty dispatch, not after (why: dispatch is the expensive/noisy step)
- Fingerprint fields must be stable across tools despite different native payload formats
- A sliding window (not a fixed bucket) avoids arbitrary reset boundaries

## Your Real Experience

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Experience Level

**Your actual experience**: ADVANCED  
**Confidence in answer**: HIGH

### Relevant Achievements

- [MTTA/MTTR & Alert Noise Reduction](../../../evidence/achievements/bbc-24x7-mttr-alert-noise-reduction.md)

## Related Architecture & Decisions

### Related ADRs

- [ADR-02: Dual Dispatch Architecture](../../../architecture/architecture-decisions/adr-bbc-24x7-dual-dispatch-model.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
