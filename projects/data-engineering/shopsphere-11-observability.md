# 11 - Observability: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## Monitoring Strategy

Observability must cover pipelines, data, infrastructure, cost, and user-facing freshness.

## Pipeline Health Metrics

| Metric | Description |
|--------|-------------|
| `pipeline_status` | Success/failure/skipped/running |
| `execution_duration_seconds` | Runtime by pipeline/task |
| `records_read` | Source records read |
| `records_written` | Target records written |
| `records_failed` | Failed validation/transformation count |
| `records_quarantined` | Bad records sent to quarantine |
| `retry_count` | Retry attempts per task/source |
| `watermark_lag_minutes` | Difference between current time and processed watermark |

## Data Freshness

Example calculation:

```text
latest_event_received = 10:31 UTC
current_time = 10:40 UTC
freshness_lag = 9 minutes
```

Freshness metrics are tracked per dataset and compared to SLA:

| Dataset | SLA |
|---------|-----|
| Raw order data | < 15 minutes |
| Customer activity | < 5 minutes |
| Customer 360 | < 1 hour |
| Daily revenue | Ready by 06:00 UTC |
| Executive dashboard | < 30 minutes |

## Data Quality Metrics

- Duplicate count and duplicate rate.
- Null count by required field.
- Invalid record count by rule.
- Schema violation count.
- Quarantine volume by source/rule/date.
- Reconciliation difference amount/count.
- Late-arriving events count and age distribution.

## Infrastructure Metrics

- Glue job DPU usage, runtime, failed stages.
- Spark shuffle spill, skew warnings, executor failures.
- Stream processing lag and throughput.
- S3 storage growth by zone/table.
- Athena query scanned bytes and failures.
- Cost anomaly by service/tag.

## Alerting Strategy

| Alert | Trigger | Payload Must Include |
|-------|---------|----------------------|
| Pipeline failure | Task/DAG failed | DAG, task, run ID, source, error, log link, owner |
| SLA breach | Runtime/freshness exceeds SLA | Dataset, SLA, current lag, last success, owner |
| Record-count drop/spike | Deviation from baseline | Source, expected range, actual count, date/window |
| Duplicate rate high | Threshold exceeded | Source, duplicate %, sample keys |
| Schema change | Contract mismatch | Source, expected schema, observed schema, breaking/additive |
| DQ failure | Critical rule failed | Rule ID, affected table, count, sample keys |
| Streaming lag | Consumer lag threshold | Topic/stream, partition/shard, lag, age |
| Storage anomaly | Growth above threshold | Bucket/table/partition, growth %, cost impact |
| Cost anomaly | Daily spend deviates | Service, tag, estimate, owner |

## Related Documents

- [09 - Data Quality](shopsphere-09-data-quality.md)
- [16 - Runbook](shopsphere-16-runbook.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
