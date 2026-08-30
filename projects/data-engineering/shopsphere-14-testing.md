# 14 - Testing: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## Testing Strategy

Testing must prove correctness, idempotency, data quality, replay safety, and analytical usefulness.

## Unit Tests

| Area | Tests |
|------|-------|
| Revenue calculation | Gross, refunds, cancellations, net revenue, AOV |
| Currency conversion | Historical rate lookup, missing rate failure, corrected FX restatement |
| Deduplication | Exact duplicate ignore, conflicting duplicate quarantine |
| Customer matching | Case-insensitive email, phone/name/country rules, false-merge prevention |
| Transformation logic | Type casting, SCD2 product changes, timestamp parsing |

## Data Tests

| Test | Target |
|------|--------|
| Null checks | Required IDs, timestamps, currency, amounts |
| Uniqueness | `event_id`, current `order_id`, SCD current row constraints |
| Referential integrity | Order/customer/product/FX relationships |
| Accepted values | Currency, event type, order status |
| Freshness | Dataset SLA checks |
| Reconciliation | Source/target counts and sums |

## Integration Tests

- PostgreSQL extraction to raw order landing.
- MySQL customer extraction to raw landing.
- Product API retry/rate-limit ingestion to product raw/silver.
- Stream event ingestion to raw/silver with event-time watermark.
- Silver to gold transformation and publication gate.

## End-to-End Test

```text
Raw order + customer + product + FX + events
  -> validated silver tables
  -> revenue calculation
  -> Customer 360
  -> mart_daily_revenue
  -> analytical query result
```

## Mandatory Scenario Tests

| Scenario | Expected Test Assertion |
|----------|-------------------------|
| Duplicate order arrives 3 times | One business order in `fact_orders` |
| Late event at 10:00 arrives 10:27 | Counted in 10:00 business window |
| Completed order later refunded | Revenue partition corrected and reconciled |
| Pipeline fails at 70% | Retry/resume does not duplicate processed records |
| New optional field appears | Pipeline continues and warns/logs schema evolution |
| Required field renamed | Contract fails; no silent NULL production |
| Duplicate customers | Identity graph creates candidate/golden mapping by deterministic rules |
| Product API HTTP 429 | Backoff/retry resumes from checkpoint without duplicate products |
| 10,000 invalid timestamps | Quarantine and alert; fail only if threshold policy says so |
| Source outage | Resume from watermark plus overlap after recovery |
| FX reprocessing | January revenue recalculated using corrected FX version |
| Backfill | Five-year load runs alongside incremental without gaps/duplicates |
| Reconciliation failure | Missing 150 orders are listed/explained in exception table |
| Streaming spike | Lag rises but no event loss; consumers drain backlog |

## Related Documents

- [09 - Data Quality](shopsphere-09-data-quality.md)
- [15 - CI/CD](shopsphere-15-cicd.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
