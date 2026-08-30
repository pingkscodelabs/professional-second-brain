# 06 - Data Model: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## Modeling Approach

Use a lakehouse dimensional model on S3/Iceberg. Raw source records remain immutable; silver tables are conformed and deduplicated; gold marts are optimized for business queries.

## Core Tables

| Table | Layer | Grain | Key Design |
|-------|-------|-------|------------|
| `raw_orders` | Bronze | Source row/version | Immutable order payload + ingestion metadata |
| `raw_customer_events` | Bronze | Event payload | Preserve original event and schema version |
| `silver_orders_current` | Silver | One row per order current state | MERGE by `order_id`, latest `updated_at`, deterministic tie-breaker |
| `silver_order_status_history` | Silver | One row per order status transition | Supports order lifecycle analysis |
| `silver_customer_activity_events` | Silver | One row per event_id | Event-time based, deduped, validated |
| `dim_customer` | Gold | One row per golden customer | Survivorship rules and confidence |
| `dim_customer_source_identity` | Gold | One row per source customer ID mapping | Maps duplicate source records to golden IDs |
| `dim_product` | Gold | SCD2 product version | Product changes/deletes via `valid_from`, `valid_to`, `is_current`, `is_active` |
| `dim_exchange_rate` | Gold | Currency + business date + rate version | Historical reproducible FX conversion |
| `fact_orders` | Gold | One row per business order | Order status, amount, currency, converted EUR fields |
| `fact_refunds` | Gold | One row per refund | Refund amount, order link, refundable validation |
| `fact_customer_activity_events` | Gold | One row per valid activity event | Product funnel and last activity metrics |
| `mart_daily_revenue` | Gold | Date + country + currency/category | Gross, net, refunds, cancellations, AOV |
| `mart_customer_360` | Gold | One row per golden customer | Orders, revenue, refunds, last order/activity, lifetime value |
| `mart_product_conversion` | Gold | Product + date/window | Views, add-to-cart, purchase, conversion rate |

## Customer Identity Resolution

Do not match customers by email alone. Use deterministic normalized rules with confidence:

| Rule | Match Inputs | Confidence | Action |
|------|--------------|------------|--------|
| R1 | Same normalized email + same phone | High | Auto-merge |
| R2 | Same normalized email + same country + similar name | Medium | Merge if no conflict; steward review if conflict |
| R3 | Same phone + same country + similar name | Medium | Steward review |
| R4 | Same email only | Low | Do not auto-merge; candidate link only |
| R5 | Conflicting strong identifiers | Negative | Do not merge |

## SCD Strategy

| Entity | SCD Type | Reason |
|--------|----------|--------|
| Customer profile | Type 1 for corrected typos; Type 2 for material country/consent/status changes if required | Balance analytical simplicity and audit needs |
| Product | Type 2 | Product category/name/price changes affect historical product analytics |
| Exchange rates | Append/versioned facts | Reproducible reports and FX restatement support |
| Orders | Current fact + status history | Current reporting plus lifecycle analysis |

## Analytical Query Support

- Top customers by lifetime revenue: `mart_customer_360`.
- Revenue by country/month: `mart_daily_revenue` + `dim_country/date`.
- Churn indicators: `mart_customer_360.last_activity_date` and `last_order_date`.
- Product conversion: `mart_product_conversion` built from event funnel facts.
- Revenue by EUR: `fact_orders` joined to versioned FX rates.
- Refund percentage by category: `fact_refunds` + `dim_product`.
- AOV by country: `mart_daily_revenue`.
- Recently purchased but inactive: `mart_customer_360` + events.
- Hourly purchase volume: `fact_customer_activity_events` by event hour.
- Abnormal order drops: anomaly checks over `mart_daily_revenue`/order counts.

## Related Documents

- [08 - Transformation Design](shopsphere-08-transformation-design.md)
- [09 - Data Quality](shopsphere-09-data-quality.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
