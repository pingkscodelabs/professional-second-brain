# 02 - Requirements: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study. Requirements come from the user-supplied scenario.

## Business Datasets

| Dataset | Purpose | Freshness SLA |
|---------|---------|---------------|
| Raw order data | Operational order replication | < 15 minutes |
| Customer activity | Near-real-time behavioral analytics | < 5 minutes |
| Customer 360 | Unified customer analytics | < 1 hour |
| Daily revenue | Finance and revenue reporting | Ready by 06:00 UTC |
| Executive dashboard | Leadership metrics | < 30 minutes |
| Historical reports | Audit/reproducibility | Reproducible |

## Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | Ingest PostgreSQL orders, order items, payments, shipments, and refunds incrementally |
| FR-02 | Ingest MySQL customers incrementally and resolve duplicate customer identities |
| FR-03 | Ingest products from REST API with rate-limit handling, retry, partial-response detection, and delete handling |
| FR-04 | Ingest streaming customer activity events with duplicate, out-of-order, and 30-minute late-arrival handling |
| FR-05 | Store historical exchange rates and use business-date rates for EUR reporting |
| FR-06 | Provide Customer 360, order analytics, product analytics, revenue analytics, and time-series analytics |
| FR-07 | Support historical five-year backfill without overloading production databases |
| FR-08 | Implement source-to-target reconciliation for record counts, transaction amounts, refunds, and orders |
| FR-09 | Quarantine bad records with reason codes and replay status |
| FR-10 | Support reproducible reprocessing, including recalculating January revenue with corrected FX data |

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Support 10 TB initial data and scale to at least 100 TB without redesign |
| NFR-02 | RPO <= 1 hour and RTO <= 4 hours |
| NFR-03 | Data pipelines must be idempotent across retries and replays |
| NFR-04 | No expensive full-table hourly extraction from production databases |
| NFR-05 | Raw data must be encrypted and PII access restricted/audited |
| NFR-06 | Storage, compute, transfer, query, and streaming costs must respect an initial EUR 8,000/month budget target |
| NFR-07 | Pipeline dependencies must be explicit; failed upstream dependencies must not silently produce bad downstream data |
| NFR-08 | All infrastructure must be deployable through Terraform and Git-based CI/CD |

## Data Quality Rules

| Rule | Action |
|------|--------|
| `order_id` must not be NULL | FAIL PIPELINE for order fact loads |
| `customer_id` must be valid | QUARANTINE record; fail downstream Customer 360 if threshold breached |
| `order_id` unique in business context | IGNORE exact duplicate; QUARANTINE conflicting duplicate |
| Transaction amount >= 0 | QUARANTINE invalid record |
| Currency exists in supported reference | QUARANTINE record; FAIL revenue mart if missing FX rate |
| `event_id` unique | IGNORE exact duplicate; QUARANTINE conflict |
| `event_timestamp` valid | QUARANTINE invalid event |
| `product_id` exists where required | WARN for optional browsing events; QUARANTINE for purchase/order lines |
| Refund amount <= refundable amount | FAIL affected order/revenue pipeline |
| Daily revenue reconciles with source totals | FAIL publication if outside tolerance |

## Definition of Done

- Historical data loaded.
- Incremental ingestion implemented.
- Streaming ingestion implemented.
- Batch transformations implemented.
- Data lake and analytical model implemented.
- Customer 360 and revenue calculation implemented.
- Multi-currency conversion implemented with historical rates.
- Deduplication, late-arriving data, schema evolution, data quality, quarantine, replay, and backfill implemented.
- PII, reconciliation, monitoring, alerting, security, DR, cost optimization, CI/CD, Terraform, automated tests, and documentation completed.

## Related Documents

- [03 - Assumptions](shopsphere-03-assumptions.md)
- [09 - Data Quality](shopsphere-09-data-quality.md)
- [14 - Testing](shopsphere-14-testing.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
