# 12 - Disaster Recovery: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## DR Objectives

| Objective | Target |
|-----------|--------|
| RPO | <= 1 hour |
| RTO | <= 4 hours |

## Recovery Principles

- Raw data is immutable and retained long enough to replay.
- Transformations are idempotent and can be rerun without double counting.
- Checkpoints/watermarks define committed source progress.
- Gold tables are reproducible from raw/silver plus versioned reference data.
- Backfills and reprocessing runs are isolated before promotion.

## Failure Scenarios

| Failure | Detection | Impact | Recovery | Duplicate Prevention |
|---------|-----------|--------|----------|----------------------|
| Data-processing job fails | Airflow/CloudWatch failure alert | Delayed dataset | Retry from task checkpoint | MERGE by business key/run ID |
| Pipeline fails after 7M/10M records | Task failure + checkpoint | Partial batch | Resume from committed chunk or rerun full chunk | Idempotent writes and batch IDs |
| Data file corrupted | Checksum/read failure | Affected partition unavailable | Restore from S3 version/replica or re-extract | Promote only after reconciliation |
| PostgreSQL unavailable 3 hours | Source connectivity alert | Order freshness SLA breach | Resume from last watermark + overlap when source returns | Overlap + MERGE |
| Streaming spike 20,000 eps | Lag/throughput alert | Increased freshness lag | Autoscale consumers, drain backlog | Event ID dedupe |
| Kafka/MSK unavailable | Consumer/source alert | Event ingestion delayed | Replay from retained offsets when restored | Offset checkpoint + event ID dedupe |
| FX correction needed | Finance request/change event | Historical revenue restatement | Reprocess affected period with versioned FX | Isolated restatement run |
| Gold table bad publish | Reconciliation failure/user report | Wrong dashboard risk | Roll back to previous Iceberg snapshot | Snapshot/time-travel rollback |

## Replay Strategy

1. Identify replay scope: source, table/topic, date/window, reason.
2. Freeze current publication if business risk is high.
3. Create replay run ID.
4. Read immutable raw/bronze or source system with bounded criteria.
5. Reprocess into staging/silver/gold using idempotent MERGE.
6. Run reconciliation and DQ gates.
7. Promote affected partitions or rollback.
8. Record replay audit metadata.

## Backfill Strategy

- Historical five-year load runs as throttled chunks independent of incremental loads.
- Backfill writes are marked with `backfill_run_id`.
- Incremental ingestion continues with overlap windows.
- Promotion occurs only after source/target reconciliation passes.

## RPO/RTO Design

| Component | Design |
|-----------|--------|
| S3 | Versioning and lifecycle policies; optional cross-region replication for higher criticality |
| Iceberg | Snapshot history supports rollback/time travel |
| Streaming | Retention configured beyond recovery window |
| Airflow/MWAA | DAG definitions in Git; environment recoverable through Terraform |
| Glue jobs | Code in Git and deployable through CI/CD |
| Metadata | Glue Catalog/Lake Formation configured through IaC where possible |

## Related Documents

- [07 - Ingestion Design](shopsphere-07-ingestion-design.md)
- [08 - Transformation Design](shopsphere-08-transformation-design.md)
- [16 - Runbook](shopsphere-16-runbook.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
