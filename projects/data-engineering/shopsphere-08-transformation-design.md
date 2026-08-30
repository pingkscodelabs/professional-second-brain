# 08 - Transformation Design: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## Transformation Pattern

Use layered transformations:

1. Bronze to Silver: parse, validate, type cast, deduplicate, standardize schema, quarantine invalid records.
2. Silver to Gold: business logic, SCD handling, FX conversion, revenue calculation, Customer 360, marts.
3. Gold publication: reconciliation gate, quality checks, then publish views/tables for Athena/BI.

## Idempotency Strategy

- Every ingestion and transformation run has a `run_id` and deterministic input range.
- Silver/gold writes use Iceberg MERGE/UPSERT by business keys.
- Exact duplicate files/events are detected through source identifiers and payload checksum.
- Re-running a failed run does not append duplicate facts; it re-computes or merges the same business keys.
- Published marts are partition-overwrite or MERGE operations for affected business dates only.

## Revenue Calculation

```text
Net Revenue = Gross Revenue - Refunds - Cancelled Orders
```

Rules:

- Use order business date for order creation metrics.
- Use refund/cancel event effective date for correction and restatement logic.
- Maintain revenue adjustment facts so August revenue can be corrected when an August 1 order is refunded on August 5.
- Recompute affected revenue partitions when order status/refund changes.
- Join to `dim_exchange_rate` by transaction currency, business date, source, and approved rate version.
- Missing FX rates fail revenue publication; never silently use current rates.

## Customer 360 Build

Inputs:

- `dim_customer` and `dim_customer_source_identity`.
- `fact_orders`, `fact_refunds`, `fact_customer_activity_events`.

Outputs:

| Field | Logic |
|-------|-------|
| `customer_id` | Golden customer ID |
| `name/email/country` | Survivorship-selected attributes with masking in analyst views |
| `registration_date` | Earliest linked customer `created_at` |
| `total_orders` | Count completed/non-cancelled business orders |
| `total_revenue` | Sum gross EUR revenue |
| `total_refunds` | Sum refund EUR amount |
| `last_order_date` | Max order business date |
| `last_activity_date` | Max valid event timestamp |
| `lifetime_value` | Net revenue or approved LTV definition |

## Product Conversion

Build funnel metrics from event-time windows:

```text
product_view -> add_to_cart -> checkout_started -> purchase_completed
```

Deduplicate by `event_id`; group by product, customer/session, and event-time window. Late events within 30 minutes update the correct window; later events route to late-arrival correction workflow.

## Schema Evolution Strategy

| Change | Handling |
|--------|----------|
| Additive optional field | Accept in raw/bronze; add to silver after contract update |
| Removed optional field | Warn; populate NULL if downstream contract allows |
| Required field renamed | Fail schema contract or quarantine; do not silently create NULLs |
| Type change | Quarantine invalid records; schema review required |
| New event type | Warn and land raw; promote after mapping decision |

## Related Documents

- [06 - Data Model](shopsphere-06-data-model.md)
- [09 - Data Quality](shopsphere-09-data-quality.md)
- [12 - Disaster Recovery](shopsphere-12-disaster-recovery.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
