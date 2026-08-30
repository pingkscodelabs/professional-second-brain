# ADR-06: Single NAT Gateway vs High-Availability NAT

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-06 |
| Title | Single NAT Gateway vs High-Availability NAT for EKS Private Subnets |
| Status | ACCEPTED IN REFERENCE IMPLEMENTATION |
| Date | 2026-08-30 |
| Decision Maker | Reference repository author |
| Reviewers | N/A |

## Context

The reference platform provisions two public and two private subnets across availability zones, with a single NAT Gateway attached to a public subnet.

## Problem

Private subnets need outbound internet access for package pulls, image pulls, API calls, and updates. A NAT Gateway per AZ improves availability but costs more. A single NAT Gateway is cheaper but creates an availability dependency.

## Options Considered

### Option 1: Single NAT Gateway

**Pros**:
- Lower cost.
- Simpler for a lab/reference implementation.

**Cons**:
- Single-AZ dependency for private subnet egress.
- Less resilient for production critical workloads.

### Option 2: NAT Gateway Per AZ

**Pros**:
- Better availability and AZ-local routing.
- Reduces cross-AZ dependency for egress.

**Cons**:
- Higher cost.
- Slightly more operational complexity.

### Option 3: No NAT / Private Endpoints Only

**Pros**:
- Stronger egress control.
- Lower exposure to public internet paths.

**Cons**:
- Requires more endpoint planning and may not support all required external dependencies.

## Decision

Use a single NAT Gateway in the reference implementation.

## Why

For a learning/reference implementation, cost and simplicity are acceptable priorities. For production, this decision should be revisited against workload criticality and availability requirements.

## Trade-offs

| Gained | Lost |
|--------|------|
| Lower cost | NAT egress availability resilience |
| Simpler network design | Production-grade multi-AZ egress pattern |

## Consequences

- Document as a FinOps vs reliability trade-off.
- Do not present the single NAT pattern as universally production-ready.

## Future Reconsideration Conditions

Use per-AZ NAT or private endpoint patterns for production workloads with higher availability or compliance requirements.

## Related

- [Reference EKS Platform Project](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [Source Reference](../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
