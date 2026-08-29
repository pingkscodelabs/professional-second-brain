# Achievement: MTTA/MTTR & Alert Noise Reduction (BBC 24/7 Operations Platform)

## Achievement Overview

| Field | Value |
|-------|-------|
| Achievement Title | MTTA/MTTR Reduction & Alert Noise Suppression via Siren Bridge and Dual Dispatch |
| Context/Client | BBC (British Broadcasting Corporation) |
| Recognition | Internal |

## Achievement Description

### What Was Accomplished

**Business Outcome**: Zero unhandled out-of-hours outages across flagship platforms during major live events, with faster incident acknowledgement and resolution.  
**Technical Outcome**: Alert deduplication and correlation (AWS Siren Bridge, Alerta) combined with a tiered dispatch model (Model A/B) reduced both non-actionable alert volume and time-to-resolve.  
**Scale/Impact**: Applied across presentation-layer platforms serving ~1 billion weekly requests (WebCore, iPlayer, Account/Identity IDv5).

### Problem Context

**Business Problem**: Monitoring tools (Datadog, CloudWatch, Zenoss) dispatched un-deduplicated notifications directly to engineers, causing missed critical outages and high operational burnout.  
**Technical Challenge**: No unified deduplication/correlation layer existed across Datadog, CloudWatch, Zenoss, and Prometheus.

## Actions Taken

### Approach

1. Deployed AWS Siren Bridge as stateless Lambda middleware to aggregate, deduplicate, and correlate raw monitoring events.
2. Routed normalized events to Alerta (Tickmon) for 24/7 Central Operations visualization.
3. Implemented the dual dispatch model (Model A: Central Ops triage; Model B: direct automated routing) per [ADR-02](../../architecture/architecture-decisions/adr-bbc-24x7-dual-dispatch-model.md).

### Technologies Used

- AWS Lambda, API Gateway, SQS (dead-letter queues with exponential backoff)
- Alerta (Tickmon)
- PagerDuty Events V2 API

## Quantifiable Metrics

### Technical Metrics

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| MTTA (Mean Time to Acknowledge) | 18 minutes | 2.5 minutes | -86% |
| MTTR (Mean Time to Resolve) | 74 minutes | 43 minutes | -42% |
| Non-actionable alert volume | ~1,200/week | ~380/week | -68% |
| Unverified services in production | ~35% | 0% (blocked by RBREVIEW) | -100% |

## Results & Lessons

### Outcome

Alert delivery latency SLO of >99% of alerts delivered to PagerDuty in <10 seconds was met, and rota coverage reached 100% time coverage with zero schedule gaps across active production services.

### What Was Learned

1. Runbooks must give explicit, step-by-step diagnostic and mitigation actions for non-expert 24/7 operations engineers, not abstract architecture notes.
2. Deduplication must happen before dispatch, not after, to meaningfully reduce alert fatigue.

## Evidence & Documentation

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Architecture Decisions

- [ADR-02: Dual Dispatch Architecture](../../architecture/architecture-decisions/adr-bbc-24x7-dual-dispatch-model.md)

## Interview & CV Application

### CV Bullet Points

1. "Reduced MTTA by 86% (18min → 2.5min) and MTTR by 42% (74min → 43min) for a BBC platform serving ~1B weekly requests, by designing an AWS Lambda-based telemetry deduplication layer and tiered incident dispatch model."
2. "Cut non-actionable PagerDuty alert volume by 68% through automated deduplication and correlation ahead of PagerDuty/Alerta routing."

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidence Level**: HIGH (source: engagement case study, quantified metrics provided)
