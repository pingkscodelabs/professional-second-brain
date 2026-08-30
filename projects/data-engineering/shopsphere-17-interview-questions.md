# 17 - Interview Questions: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study. Use these to practice Senior/Lead Data Engineer interviews.

## Architecture

### Q1: Why choose a lakehouse on S3 instead of only Redshift?

**Short answer**: S3 lakehouse gives low-cost scalable storage for 10-100 TB, immutable raw retention, replay, and Iceberg time travel. Redshift is optional when BI concurrency/performance justifies the cost.

**Deep answer**: The problem needs reproducibility, reprocessing, backfill, and idempotent updates. Iceberg on S3 supports MERGE, snapshot rollback, partition evolution, and schema evolution while keeping storage costs lower. Athena can query curated gold tables directly. Redshift can be added later for high-concurrency dashboards.

### Q2: How does the platform scale from 10 TB to 100 TB?

Use S3 object storage, columnar Parquet, Iceberg metadata/compaction, partition pruning, serverless Spark jobs, workload-specific compute scaling, and curated marts to avoid scanning raw data for dashboards.

## Data Engineering

### Q3: How do you guarantee idempotency?

Use immutable raw files, run IDs, deterministic input windows, MERGE by business keys, event dedupe by `event_id`, order dedupe by `order_id` and latest `updated_at`, and partition-level publication gates.

### Q4: How do you handle late-arriving events?

Use event time with a 30-minute watermark. Events arriving at 10:27 with event time 10:00 are counted in the 10:00 business window. Late-but-valid events update affected windows; too-late events enter correction/replay workflow.

### Q5: How do you perform incremental extraction if timestamps are not unique?

Use high-watermark plus overlap window, order by `updated_at` plus primary key, extract with a stable cutoff, and MERGE into silver tables. The overlap catches late updates and clock skew while idempotent MERGE prevents duplicates.

### Q6: How do you handle deletes?

Use source-specific strategies: soft deletes where present, status/refund/cancel facts for orders, `is_active=false` for deleted products, and reconciliation exceptions where no reliable delete timestamp exists.

### Q7: How do you handle schema evolution?

Allow additive optional fields into bronze, promote them after contract review, warn for optional removals, and fail/quarantine breaking changes such as `customer_id` renamed to `customerId`.

## Reliability

### Q8: What happens if a pipeline fails halfway?

The pipeline resumes from checkpoints or safely reruns the affected chunk. MERGE/UPSERT and run IDs prevent duplicate facts. Gold publication is blocked until reconciliation and DQ gates pass.

### Q9: How do you replay data?

Choose replay scope, create replay run ID, read immutable raw/bronze or bounded source data, reprocess into staging, run DQ/reconciliation, then promote affected partitions.

### Q10: What if PostgreSQL is unavailable for 3 hours?

Raise freshness/source outage alert, keep last successful watermark, resume with overlap when source returns, and reconcile the missed window before publication.

## Data Quality

### Q11: What happens when 10,000 records fail validation?

Quarantine individual records with reason codes and samples. Continue only if threshold policy allows; alert and fail publication if the error affects critical metrics or breaches thresholds.

### Q12: How do you reconcile revenue differences?

Compare source/target counts and sums by date/status/currency/refund category, list missing/different order IDs, include quarantined records and FX version differences, then explain or correct the variance.

## Security

### Q13: How do you protect PII?

Encrypt raw data, restrict raw PII with Lake Formation fine-grained controls, expose masked gold views, audit access through CloudTrail, and store secrets in Secrets Manager.

### Q14: Who can access raw data?

Only approved data platform engineers or controlled break-glass roles. Analysts use curated/masked views unless access is explicitly approved and audited.

## Performance

### Q15: How would you optimize a slow Spark job?

Check input size, partition pruning, skew, shuffle volume, file sizes, join strategy, broadcast joins, predicate pushdown, caching only when useful, and output file compaction.

### Q16: How would you reduce Athena query cost?

Use Parquet, compression, partition pruning, curated gold tables, projection, workgroup limits, avoid SELECT *, compact small files, and monitor scanned bytes.

## Business

### Q17: What business problem does this platform solve?

It creates a reliable, governed, reproducible analytics platform for revenue, customer, product, and operational decisions across fragmented source systems.

### Q18: What would you do differently if budget was cut by 50%?

Defer Redshift, prioritize Athena/S3/Glue, tighten retention, reduce non-critical refresh frequency, optimize partitions/compaction, and focus first on revenue and Customer 360.

## Dedicated Question Files

- [Idempotency and Late Data](../../interview/questions/data-engineering/shopsphere-idempotency-late-data.md)
- [Incremental Loading and CDC](../../interview/questions/data-engineering/shopsphere-incremental-loading-cdc.md)
- [Customer 360 Identity Resolution](../../interview/questions/data-engineering/shopsphere-customer-360-identity-resolution.md)
- [Revenue Reconciliation](../../interview/questions/data-engineering/shopsphere-revenue-reconciliation.md)
- [Schema Evolution](../../interview/questions/data-engineering/shopsphere-schema-evolution.md)
- [Data Quality and Quarantine](../../interview/questions/data-engineering/shopsphere-data-quality-quarantine.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
