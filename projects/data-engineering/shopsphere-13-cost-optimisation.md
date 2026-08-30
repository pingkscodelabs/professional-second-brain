# 13 - Cost Optimisation: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## Budget Constraint

Initial target budget: EUR 8,000/month. This is a scenario constraint, not a measured platform cost.

## Cost Strategy

| Cost Area | Strategy |
|-----------|----------|
| Storage | S3 lifecycle policies, Parquet compression, Iceberg compaction, raw retention 13 months, logs 90 days |
| Compute | Serverless Glue jobs scheduled/on-demand, right-sized DPUs, autoscaling streaming consumers |
| Query | Athena partition pruning, columnar formats, curated gold tables, query limits/workgroups |
| Streaming | Choose Kinesis for AWS-native simplicity unless Kafka/MSK already exists; tune retention and shards/brokers |
| Transfer | Keep processing in-region, use VPC endpoints where useful, avoid unnecessary cross-region copies |
| Warehouse | Defer Redshift until BI concurrency/latency justifies cost |
| Observability | Log sampling/retention controls, metric cardinality discipline |

## Storage Retention

| Data | Retention | Mechanism |
|------|-----------|-----------|
| Raw events | 13 months | S3 lifecycle expiration/transition |
| Curated analytical data | 7 years | S3 lifecycle to lower-cost tiers where compatible |
| Application/debug logs | 90 days | CloudWatch/S3 lifecycle |
| Iceberg snapshots | Policy-based expiry | Keep enough history for audit/replay, expire old snapshots |

## Cost Governance

- Mandatory tags: `owner`, `domain`, `environment`, `cost_center`, `data_classification`.
- Athena workgroups with per-query scanned data limits.
- Daily cost anomaly alerts by service and tag.
- Compact small files to reduce query overhead.
- Partition tables by access pattern, not every high-cardinality field.
- Use spot/flexible capacity only where recovery semantics are acceptable.

## Interview Trade-Off

If budget is cut by 50%, defer Redshift, use Athena-only BI where possible, reduce non-critical streaming enrichment, tighten retention/snapshot policies, run batch jobs less frequently for non-SLA marts, and prioritize revenue/customer 360 over lower-value analytics.

## Related Documents

- [04 - Architecture](shopsphere-04-architecture.md)
- [12 - Disaster Recovery](shopsphere-12-disaster-recovery.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
