# ADR-003: Apache Iceberg over Parquet for Lakehouse Tables

## Status
Accepted for fictional interview case study.

## Problem
The platform must handle updates, deletes/soft deletes, late corrections, FX restatements, schema evolution, reproducible reports, and idempotent retries.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Plain Parquet files | Low cost and widely supported | Harder ACID updates, time travel, and schema evolution |
| Apache Iceberg over Parquet | ACID MERGE, snapshots, time travel, schema/partition evolution | More table metadata and compaction discipline |
| Redshift-only tables | Strong BI performance | Higher always-on cost and weaker raw replay/lake history fit |

## Decision
Use Apache Iceberg tables stored as Parquet on S3.

## Why
Iceberg supports MERGE/UPSERT and time travel, which are essential for updated orders, refunds, replay, and historical reproducibility.

## Trade-offs
- Gain: ACID semantics and reproducible snapshots.
- Lose: need table maintenance, metadata cleanup, and compaction.

## Operational Impact
Run compaction, snapshot expiry, and metadata monitoring.

## Cost Impact
Columnar compression and S3 storage reduce cost; compaction prevents expensive small-file queries.

## Security Impact
Tables remain governed through Lake Formation and KMS-encrypted S3 locations.

## Future Reconsideration Conditions
Reconsider if chosen query engines lack Iceberg support or warehouse-only performance becomes mandatory.

## Related
- [ShopSphere Data Model](../../projects/data-engineering/shopsphere-06-data-model.md)
