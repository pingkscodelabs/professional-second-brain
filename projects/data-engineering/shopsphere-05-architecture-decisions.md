# 05 - Architecture Decisions: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study. ADRs are design decisions for the scenario, not real-world ShopSphere implementation records.

## Decision Summary

| ADR | Decision | Why | Link |
|-----|----------|-----|------|
| ADR-001 | AWS Glue Spark for batch processing | Serverless Spark for variable workload, 10-100 TB scale, PySpark transformations | [ADR](../../architecture/architecture-decisions/adr-shopsphere-batch-processing-glue-spark.md) |
| ADR-002 | Kinesis/MSK streaming decision model | Event durability, replay, lag monitoring, and event-time processing | [ADR](../../architecture/architecture-decisions/adr-shopsphere-streaming-msk-vs-kinesis.md) |
| ADR-003 | Apache Iceberg over Parquet | MERGE, time travel, schema evolution, reproducible reporting | [ADR](../../architecture/architecture-decisions/adr-shopsphere-storage-format-iceberg-parquet.md) |
| ADR-004 | Partition by business date + source-specific keys | Query pruning without creating too many small partitions | [ADR](../../architecture/architecture-decisions/adr-shopsphere-partition-strategy.md) |
| ADR-005 | Athena-first analytics, Redshift optional | Cost-efficient SQL over S3 first; warehouse only when concurrency requires | [ADR](../../architecture/architecture-decisions/adr-shopsphere-warehouse-athena-redshift.md) |
| ADR-006 | MWAA/Airflow for orchestration | Explicit dependencies, backfills, retries, SLAs, reconciliation gates | [ADR](../../architecture/architecture-decisions/adr-shopsphere-orchestration-airflow-step-functions.md) |
| ADR-007 | High-watermark + overlap, CDC-ready | Handles non-unique timestamps, clock skew, late updates, source limits | [ADR](../../architecture/architecture-decisions/adr-shopsphere-cdc-incremental-loading.md) |
| ADR-008 | Deterministic customer identity resolution | Avoids unsafe email-only matching, supports confidence/stewardship | [ADR](../../architecture/architecture-decisions/adr-shopsphere-customer-deduplication.md) |
| ADR-009 | Lake Formation for PII controls | Fine-grained table/column/row governance and auditable access | [ADR](../../architecture/architecture-decisions/adr-shopsphere-pii-protection-lake-formation.md) |
| ADR-010 | Replayable DR with checkpoints and immutable raw data | Meets RPO/RTO while preventing duplicate processing | [ADR](../../architecture/architecture-decisions/adr-shopsphere-disaster-recovery-replay.md) |

## Major Trade-Offs

| Decision Area | Option A | Option B | Chosen | Reason |
|---------------|----------|----------|--------|--------|
| Storage | Warehouse-first | Lakehouse-first | Lakehouse-first | Cheaper scalable storage and reproducible history |
| Processing | Always-on cluster | Serverless Glue Spark | Glue Spark | Fits variable workloads and cost target |
| Streaming | Ingestion time | Event time + watermark | Event time | Correct business-time attribution for late events |
| Updates | Append-only marts | Iceberg MERGE | Iceberg MERGE | Correct refunds/order updates without double counting |
| Customer matching | Email-only | Rules + confidence | Rules + confidence | Avoids false merges |
| FX rates | Current rate lookup | Historical versioned rates | Historical rates | Reproducible reporting |
| Bad data | Drop bad records | Quarantine with reason | Quarantine | Auditability and replay |
| Orchestration | Cron jobs | Airflow DAGs | Airflow | Explicit dependencies and retries |
| Warehouse | Redshift upfront | Athena first | Athena first | Cost-aware initial design |
| Access | IAM/S3 only | Lake Formation | Lake Formation | Fine-grained PII controls |

## Related Documents

- [04 - Architecture](shopsphere-04-architecture.md)
- [07 - Ingestion Design](shopsphere-07-ingestion-design.md)
- [09 - Data Quality](shopsphere-09-data-quality.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
