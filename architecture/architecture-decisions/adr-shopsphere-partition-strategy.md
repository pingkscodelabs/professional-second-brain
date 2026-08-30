# ADR-004: Partition Strategy

## Status
Accepted for fictional interview case study.

## Problem
The platform must support daily/hourly analytics, late events, revenue restatements, and Athena query cost control without excessive small partitions.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Ingestion-date partitions only | Simple operationally | Wrong for business-time reporting and late events |
| Business-date partitions | Correct reporting and query pruning | Requires late-arrival correction handling |
| High-cardinality partitions (customer/product) | Some query speedups | Partition explosion and small files |

## Decision
Partition large fact tables primarily by business event/order date, with source/event type bucketing or clustering where useful. Keep ingestion date as audit metadata, not business grain.

## Why
Reports and SLAs are business-time based, and late events must land in the correct business window.

## Trade-offs
- Gain: correct reporting and Athena pruning.
- Lose: late data requires updates to prior partitions.

## Operational Impact
Use Iceberg partition evolution and compaction. Reprocess affected partitions when late/corrected data arrives.

## Cost Impact
Good partition pruning lowers Athena scanned bytes; avoid over-partitioning.

## Security Impact
Partitioning must not expose PII values in S3 paths.

## Future Reconsideration Conditions
Adjust if query patterns show different dominant access paths or partition skew.

## Related
- [ShopSphere Transformation Design](../../projects/data-engineering/shopsphere-08-transformation-design.md)
