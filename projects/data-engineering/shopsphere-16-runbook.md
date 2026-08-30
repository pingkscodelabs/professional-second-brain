# 16 - Runbook: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## Common Incident: Pipeline Failure

1. Check Airflow/MWAA DAG run and failed task.
2. Open CloudWatch logs for the task run ID.
3. Identify source, table/topic, input range, and checkpoint.
4. Confirm whether partial writes reached silver/gold.
5. If writes are idempotent MERGE operations, rerun failed task from checkpoint.
6. If publication gate failed, do not publish gold mart until reconciliation passes.
7. Record resolution in incident log.

## Common Incident: Freshness Breach

1. Identify dataset and SLA breached.
2. Check latest processed watermark and source availability.
3. For streaming, inspect lag by topic/partition or shard.
4. For batch, inspect last successful extraction window.
5. Scale/retry consumers or rerun task as appropriate.
6. Notify affected dashboard owners if SLA impact is user-visible.

## Common Incident: Data Quality Spike

1. Open DQ dashboard by rule/source/date.
2. Sample quarantine records and reason codes.
3. Determine whether issue is source defect, schema change, or transformation bug.
4. If critical finance/customer data is affected, block publication.
5. Create source-system ticket or transformation fix.
6. Replay quarantined records after correction.

## Common Incident: Product API 429/500

1. Check API ingestion retry/backoff logs.
2. Verify current cursor/page checkpoint.
3. Confirm whether partial response was detected.
4. Resume from last successful page cursor after cooldown.
5. Validate product SCD2 changes and reconciliation counts.

## Common Incident: Finance Reconciliation Failure

1. Compare source/target counts and sums by order date/status/currency.
2. Isolate difference into missing orders, refunds, cancellations, FX rates, quarantines, or cutoff timing.
3. Produce exception table with order IDs and reasons.
4. Fix root cause or document accepted timing difference.
5. Republish only after finance/data owner approval.

## Common Incident: FX Restatement

1. Confirm corrected FX dataset and approval.
2. Create restatement run ID.
3. Reprocess affected period in isolated staging tables.
4. Compare old vs new revenue outputs.
5. Publish corrected gold partitions and preserve audit record.

## Operational Checklist

- Check pipeline health dashboard daily.
- Review quarantines by source and severity.
- Review freshness SLA breaches.
- Review cost anomaly and Athena query scan trends.
- Review access audit for raw PII.
- Expire old Iceberg snapshots and compact small files per policy.

## Related Documents

- [11 - Observability](shopsphere-11-observability.md)
- [12 - Disaster Recovery](shopsphere-12-disaster-recovery.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
