# Achievement: PagerDuty License Cost Optimization (BBC 24/7 Operations Platform)

## Achievement Overview

| Field | Value |
|-------|-------|
| Achievement Title | PagerDuty License Reclamation & Business-Hours/Kill-Switch Cost Avoidance |
| Context/Client | BBC (British Broadcasting Corporation) |
| Recognition | Internal |

## Achievement Description

### What Was Accomplished

**Business Outcome**: Reduced recurring PagerDuty licensing spend and avoided unnecessary out-of-hours on-call costs for non-audience-facing services.  
**Technical Outcome**: Automated inactivity sweeps reclaimed unused PagerDuty seats; tiered access model moved stakeholders to free read-only seats or Alerta views.

### Problem Context

**Business Problem**: PagerDuty licenses are constrained and carry recurring per-user costs; coverage needed to balance full on-call rotas against license spend.

## Actions Taken

### Approach

1. Automated reclamation of inactive PagerDuty licenses for engineers off rota for > 60 days.
2. Introduced a tiered access model: full licenses restricted to active on-call responders; stakeholders use free read-only seats or Alerta views.
3. Implemented "Kill Switches" for non-audience-facing tools (e.g., Owned Media), replacing paid 24/7 rotas with graceful degradation and business-hours support.

### Technologies Used

- PagerDuty (license/seat management)
- Alerta (read-only stakeholder visibility)

## Quantifiable Metrics

### Business Metrics

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Unutilized PagerDuty licenses | Baseline | Reclaimed | -22% |

### Scale

- Scope: Non-audience-facing services (e.g., Owned Media) moved from 24/7 paid rotas to business-hours + kill-switch model.

## Results & Lessons

### Outcome

Reclaimed 22% of unutilized PagerDuty user licenses via automated inactivity sweeps and read-only tier migrations, while avoiding out-of-hours rota costs for non-critical services.

### What Was Learned

1. Not every service needs full 24/7 paid on-call coverage; graceful degradation is a valid, lower-cost alternative for non-audience-facing tooling.

## Evidence & Documentation

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

## Interview & CV Application

### CV Bullet Points

1. "Reclaimed 22% of unused PagerDuty licenses via automated inactivity sweeps and a tiered read-only access model, while introducing kill-switch/business-hours support to avoid unnecessary 24/7 on-call costs for non-critical services."

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidence Level**: HIGH (source: engagement case study, quantified metrics provided)
