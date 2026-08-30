# 03 - Assumptions: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study. Assumptions below fill gaps in the supplied scenario and must be revisited in a real engagement.

## Business Assumptions

| ID | Assumption | Risk If Wrong |
|----|------------|---------------|
| A-01 | Daily finance reporting uses UTC business date unless country-specific reporting calendars are defined | Revenue cutoffs may not match finance systems |
| A-02 | EUR is the executive reporting currency | Incorrect if regional executives require local-currency marts |
| A-03 | Finance accepts explainable reconciliation tolerances during migration, but final published daily revenue must reconcile | Platform adoption blocked if tolerance policy is unclear |
| A-04 | Customer identity resolution can produce confidence levels and steward review queues | False merges could corrupt Customer 360 |

## Technical Assumptions

| ID | Assumption | Design Response |
|----|------------|-----------------|
| A-05 | PostgreSQL and MySQL expose `created_at` and `updated_at`, but no guaranteed CDC stream is currently available | Use high-watermark + overlap windows first; design CDC evolution path |
| A-06 | Production databases cannot tolerate full-table hourly scans | Use chunked initial load, incremental queries, replicas/read replicas where available |
| A-07 | Streaming platform can retain events long enough for outage recovery and replay | Configure retention and consumer offsets to meet RPO/RTO |
| A-08 | Product REST API supports pagination with max 1,000 records/request | Implement page checkpointing and idempotent upsert |
| A-09 | Product deletes may be detected via API response, missing record scans, or tombstone endpoint if available | Model `is_active`, `valid_to`, and delete detection rules |
| A-10 | Exchange-rate API provides daily rates by currency | Persist rate source, business date, load timestamp, and version |

## Architecture Assumptions

- AWS is preferred, but unnecessary services should be avoided.
- Initial cost target is EUR 8,000/month, so serverless/pay-per-use services are preferred where they meet requirements.
- Lakehouse tables use Apache Iceberg over Parquet to support MERGE, schema evolution, partition evolution, and time travel.
- Athena is the first query engine; Redshift is deferred unless concurrency/latency requirements justify warehouse cost.
- Amazon MWAA/Airflow is chosen for complex DAGs/backfills; Step Functions is a simpler alternative for narrow workflows.

## Open Questions For A Real Client

1. Is the streaming platform already Kafka/MSK, Kinesis, or another vendor?
2. Is there a read replica for PostgreSQL/MySQL extraction?
3. What is the finance system of record for reconciliation?
4. What legal retention varies by country?
5. Which users need raw PII, and under what approval process?
6. What BI tool concurrency and dashboard latency are required?
7. Are FX corrections expected, and who approves restatements?

## Related Documents

- [04 - Architecture](shopsphere-04-architecture.md)
- [07 - Ingestion Design](shopsphere-07-ingestion-design.md)
- [13 - Cost Optimisation](shopsphere-13-cost-optimisation.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
