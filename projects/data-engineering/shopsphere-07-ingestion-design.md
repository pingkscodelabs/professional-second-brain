# 07 - Ingestion Design: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## Source-to-Target Mapping

| Source | Method | Landing Target | Key Controls |
|--------|--------|----------------|--------------|
| PostgreSQL orders | Incremental JDBC extraction / CDC-ready | `raw/orders/source=postgres/table=orders/` | High-watermark + overlap, chunking, no full scans hourly |
| PostgreSQL payments/refunds/shipments | Incremental extraction | Raw table-specific prefixes | Idempotent batch ID and source row checksum |
| MySQL customers | Incremental extraction | `raw/customers/source=mysql/` | Identity resolution downstream |
| Product REST API | Paginated API pull | `raw/products/source=api/` | Rate-limit backoff, page cursor checkpoint, partial-response detection |
| Customer activity stream | Kafka/MSK or Kinesis consumer | `raw/events/source=stream/` | Event-time processing, dedupe by `event_id`, 30-minute watermark |
| FX API | Scheduled API pull | `raw/fx/source=api/` | Historical rate versioning, fail on missing rate |

## Incremental Loading Strategy

Use high-watermark plus overlap window for RDBMS sources:

```sql
WHERE updated_at >= :last_successful_high_watermark - INTERVAL '3 days'
  AND updated_at < :current_extraction_cutoff
ORDER BY updated_at, primary_key
```

Why this works:

- Timestamps are not unique, so order by timestamp plus primary key.
- Records can arrive late or be updated days later, so overlap catches late changes.
- Clocks may differ, so use extraction cutoff and audit timestamps.
- Idempotent MERGE prevents duplicate rows after overlap reprocessing.

## Historical Backfill

1. Create backfill run ID.
2. Extract by primary-key/date chunks outside peak hours or from read replicas.
3. Write immutable raw files with source min/max keys and checksums.
4. Transform into isolated backfill staging tables.
5. Reconcile source vs target counts/sums by chunk.
6. Promote to silver/gold only after reconciliation passes.
7. Run incremental ingestion in parallel from a fixed overlap watermark to avoid gaps.

## Streaming Strategy

- Use event time, not ingestion time, for business windows.
- Accept events up to 30 minutes late through watermarking.
- Deduplicate by `event_id` with state TTL at least greater than late-arrival window.
- Quarantine missing `event_id`, invalid timestamps, invalid event types, or malformed JSON.
- Monitor consumer lag and scale consumers during spikes.
- Use durable retention so data can be replayed after outages.

## Product API Strategy

- Respect 100 requests/minute and 1,000 records/request.
- Use token bucket throttling and exponential backoff for HTTP 429/500/timeouts.
- Persist page cursor, request parameters, response checksum, and run ID.
- Detect partial responses by validating expected page size/count metadata where available.
- Upsert products into SCD2 `dim_product`; represent deletes with `is_active = false` and `valid_to`.

## Delete Handling

| Source | Delete Strategy |
|--------|-----------------|
| Orders | No reliable delete timestamp; use status/refund/cancel records, soft delete where present, and reconciliation exceptions for missing records |
| Customers | Soft-delete flag if available; otherwise maintain active/inactive through source snapshots or explicit events if later provided |
| Products | API delete detection marks `dim_product.is_active = false`; keep history for reporting |
| Events | Events are immutable; invalid events quarantined, exact duplicates ignored |

## Related Documents

- [08 - Transformation Design](shopsphere-08-transformation-design.md)
- [12 - Disaster Recovery](shopsphere-12-disaster-recovery.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
