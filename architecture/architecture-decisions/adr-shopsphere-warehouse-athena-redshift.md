# ADR-005: Athena First, Redshift Optional

## Status
Accepted for fictional interview case study.

## Problem
ShopSphere needs analytics over 10-100 TB while keeping initial platform cost near EUR 8,000/month.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Athena over S3/Iceberg | Serverless, pay-per-query, direct lakehouse access | Requires query-cost discipline and may not fit high BI concurrency |
| Redshift upfront | Strong BI performance/concurrency | Higher baseline cost and more warehouse management |
| Both from day one | Flexibility | More complexity and cost |

## Decision
Use Athena first for lakehouse SQL; introduce Redshift only when measured BI concurrency/performance requires it.

## Why
The initial requirement emphasizes cost efficiency and scalability. Athena supports SQL over S3 without always-on warehouse cost.

## Trade-offs
- Gain: lower initial cost and direct S3 analytics.
- Lose: less predictable dashboard latency under high concurrency.

## Operational Impact
Use Athena workgroups, query limits, curated marts, and scanned-byte monitoring.

## Cost Impact
Pay-per-query model is cost-effective if partitions/Parquet/gold marts are designed well.

## Security Impact
Athena access is governed through IAM/Lake Formation and audited.

## Future Reconsideration Conditions
Adopt Redshift if dashboard concurrency, semantic-layer performance, or workload isolation demands it.

## Related
- [ShopSphere Cost Optimisation](../../projects/data-engineering/shopsphere-13-cost-optimisation.md)
