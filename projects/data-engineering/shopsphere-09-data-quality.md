# 09 - Data Quality: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## Data Quality Framework

Data quality runs at four points:

1. Ingestion validation: schema, required fields, parseability.
2. Silver validation: types, uniqueness, referential integrity, accepted values.
3. Gold validation: business rules, revenue logic, reconciliation.
4. Publication gate: freshness, completeness, quality thresholds.

## Rule Matrix

| Rule | Severity | Action | Why |
|------|----------|--------|-----|
| `order_id` is NULL | Critical | FAIL PIPELINE | Cannot produce order facts without business key |
| Duplicate order with identical payload | Low | IGNORE + count | Idempotency; no business change |
| Duplicate order with conflicting payload | High | QUARANTINE RECORD | Avoid ambiguous current state |
| Missing event `customer_id` | Medium | QUARANTINE RECORD | Must not disappear silently |
| Invalid amount (`NULL`, negative, non-numeric) | High | QUARANTINE RECORD | Prevent incorrect revenue |
| Invalid currency | High | QUARANTINE RECORD; fail revenue if no valid FX | Prevent wrong EUR reporting |
| Invalid event timestamp | Medium | QUARANTINE RECORD | Event-time windows must be correct |
| Future event timestamp beyond tolerance | Medium | QUARANTINE RECORD | Likely producer clock/schema issue |
| Missing required schema field | Critical | FAIL PIPELINE | Detect breaking schema change |
| New optional schema field | Low | WARN | Safe additive evolution |
| Refund > refundable amount | Critical | FAIL affected order/revenue pipeline | Prevent impossible finance result |
| Daily revenue mismatch beyond tolerance | Critical | FAIL PUBLICATION | Finance/audit trust requirement |

## Quarantine Design

Quarantine tables include:

- `quarantine_id`
- `source_system`
- `source_table_or_topic`
- `record_key`
- `payload_raw`
- `failure_rule_id`
- `failure_reason`
- `ingestion_timestamp`
- `run_id`
- `replay_status`
- `owner`

## Reconciliation

Minimum reconciliation outputs:

| Check | Grain |
|-------|-------|
| Source record count vs target record count | source/table/business_date |
| Source transaction amount vs target amount | currency/date/status |
| Source refunds vs target refunds | refund_date/order_date |
| Source orders vs target orders | order_status/date/country |
| Quarantine count | rule/source/date |

When finance reports August revenue EUR 125,400,321 and platform reports EUR 124,981,221, the platform must explain the EUR 419,100 difference by order IDs, statuses, refunds, FX version, excluded quarantines, or timing cutoffs.

## Tricky Scenario Coverage

- Duplicate order: MERGE by `order_id`; one business order remains.
- Bad timestamps: quarantine individual events; alert if threshold breached.
- Reconciliation failure: publish exception table listing missing/different records.
- Missing FX: fail revenue publication, not default to current rate.

## Related Documents

- [08 - Transformation Design](shopsphere-08-transformation-design.md)
- [11 - Observability](shopsphere-11-observability.md)
- [14 - Testing](shopsphere-14-testing.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
