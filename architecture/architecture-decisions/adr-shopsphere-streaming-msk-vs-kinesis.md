# ADR-002: Streaming Technology - MSK/Kafka vs Kinesis

## Status
Accepted decision model for fictional interview case study.

## Problem
Customer activity events average 500 events/sec, peak 5,000 events/sec, may spike higher, and can arrive duplicated, out of order, and 30 minutes late.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Amazon MSK/Kafka | Strong replay, partitioning, ecosystem, consumer offset control | More operational/cost overhead than Kinesis |
| Kinesis Data Streams | AWS-native, simpler operations, serverless/on-demand options | Less portable Kafka ecosystem; shard/throughput design needed |
| Direct Lambda ingestion | Simple | Weak fit for high-volume replayable event processing |

## Decision
Use MSK/Kafka if the enterprise already has Kafka; otherwise use Kinesis Data Streams for a simpler AWS-native build.

## Why
The key requirement is durable event-time processing with replay, lag monitoring, deduplication, and 30-minute late arrival support.

## Trade-offs
- MSK: more operational flexibility, more cost/ops responsibility.
- Kinesis: simpler AWS integration, less Kafka-native portability.

## Operational Impact
Consumers checkpoint offsets/shards, monitor lag, and autoscale during spikes.

## Cost Impact
Kinesis on-demand can control initial cost; MSK must be sized and monitored to avoid idle broker cost.

## Security Impact
Use IAM/SASL/TLS as appropriate, private networking, encrypted streams, and least-privilege consumers.

## Future Reconsideration Conditions
Standardize on one option after confirming existing enterprise streaming platform and operational maturity.

## Related
- [ShopSphere Ingestion Design](../../projects/data-engineering/shopsphere-07-ingestion-design.md)
