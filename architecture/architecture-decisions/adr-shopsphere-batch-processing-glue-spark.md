# ADR-001: Batch Processing with AWS Glue Spark

## Status
Accepted for fictional interview case study.

## Problem
ShopSphere needs scalable batch transformations for 10 TB initial data, 2 TB/month growth, historical backfills, Customer 360, revenue marts, and reconciliation.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| AWS Glue Spark | Serverless Spark, scales per job, integrates with S3/Glue Catalog/Lake Formation | Requires Spark tuning and job startup overhead |
| EMR | More control and advanced Spark operations | More cluster management and cost governance |
| Lambda-only ETL | Simple for small tasks | Not suitable for 10-100 TB transformations |

## Decision
Use AWS Glue Spark/PySpark for primary batch processing.

## Why
It supports large-scale ETL without always-on clusters and aligns with the cost requirement by paying for jobs when they run.

## Trade-offs
- Gain: scalable serverless transformations and reduced infrastructure management.
- Lose: less low-level control than EMR and need to manage Spark job performance.

## Operational Impact
Jobs are orchestrated through Airflow, monitored in CloudWatch, and retried by task/run ID.

## Cost Impact
Serverless job execution avoids 24/7 clusters; DPU sizing, job duration, and compaction must be controlled.

## Security Impact
Glue jobs use IAM roles, KMS-encrypted data, Secrets Manager for credentials, and Lake Formation governed access.

## Future Reconsideration Conditions
Move to EMR or another engine if workloads require deeper Spark control, persistent clusters, or lower-latency processing.

## Related
- [ShopSphere Architecture Decisions](../../projects/data-engineering/shopsphere-05-architecture-decisions.md)
