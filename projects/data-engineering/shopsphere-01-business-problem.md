# 01 - Business Problem: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.  
**Role framing**: Lead Data Engineer architecture scenario.  
**Do not claim**: Real ShopSphere employment, delivery, or measured outcomes.

## Company Context

ShopSphere is a global e-commerce company operating across Europe, the UK, and North America. The scenario processes:

| Metric | Volume |
|--------|--------|
| Orders | 8-12 million/month |
| Customer activity events | 40-60 million/day |
| Active customers | 5 million |
| Products | 500,000+ |
| Markets | 20+ countries |
| Currencies | EUR, GBP, USD, CAD, CHF, SEK, NOK, DKK |

## Current Problem

Business-critical data is spread across multiple operational systems: PostgreSQL order database, MySQL customer database, product REST API, exchange-rate API, and streaming web events. Reporting is difficult because each source has different update behavior, latency, identity quality, schema stability, and failure modes.

## Why It Matters

| Area | Impact |
|------|--------|
| Reporting | Leadership cannot rely on one consistent revenue/customer/product view |
| Finance | Historical revenue can change when orders are refunded days later |
| Customer analytics | Duplicate customer records make lifetime value and churn metrics unreliable |
| Product analytics | Product API rate limits, deletes, and partial responses create incomplete product dimensions |
| Operations | Near-real-time dashboards need event-time correctness and late-event handling |
| Audit | Re-running old reports must reproduce historical currency conversion and revenue logic |
| Security | PII must be encrypted, restricted, masked, and auditable |

## Target Business Outcomes

All benefits are expected/illustrative for the interview scenario:

- Centralized data lakehouse for orders, customers, products, events, FX rates, and curated marts.
- Reproducible historical reporting using versioned data and historical exchange rates.
- Customer 360 with deterministic identity resolution and survivorship rules.
- Idempotent ingestion and transformations that avoid double counting after retries or replays.
- Data quality framework that fails critical pipelines, quarantines bad records, warns on anomalies, and records audit evidence.
- Cost-aware AWS architecture that fits an initial EUR 8,000/month target while scaling toward 100 TB.

## Related Documents

- [02 - Requirements](shopsphere-02-requirements.md)
- [04 - Architecture](shopsphere-04-architecture.md)
- [17 - Interview Questions](shopsphere-17-interview-questions.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
