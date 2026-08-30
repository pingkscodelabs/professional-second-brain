# ADR-07: Managed EKS vs Self-Managed Kubernetes

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-07 |
| Title | Managed EKS vs Self-Managed Kubernetes |
| Status | PROPOSED |
| Date | 2026-08-30 |
| Decision Maker | Platform Engineering Architect (reference architecture) |
| Reviewers | Platform, SRE, Security, Application Teams |

## Context

The platform needs a standard Kubernetes runtime for containerized services where Kubernetes is appropriate, with consistent governance across a cluster fleet.

## Problem

Self-managed Kubernetes gives maximum control but adds heavy operational burden. Managed Kubernetes reduces control-plane responsibility but still requires platform engineering for cluster add-ons, security, upgrades, and multi-tenancy.

## Options Considered

### Option 1: Self-Managed Kubernetes on EC2

**Pros**:
- Maximum control over control plane

**Cons**:
- High operational burden, upgrades, patching, HA responsibility

### Option 2: Amazon EKS

**Pros**:
- Managed control plane
- AWS IAM integration and ecosystem fit
- Reduced operational burden

**Cons**:
- AWS-specific service constraints and cost model
- Still requires add-on and workload governance

### Option 3: Avoid Kubernetes for Most Services

**Pros**:
- Simpler operational model for some workloads

**Cons**:
- Less suitable for complex container orchestration and platform standardization needs

## Decision

Use Amazon EKS as the managed Kubernetes platform where Kubernetes is the right runtime, with a tiered shared/dedicated cluster model.

## Why

EKS reduces control-plane operations while allowing the platform team to standardize add-ons, security, workload identity, ingress, observability, and multi-tenancy.

## Trade-offs

| Gained | Lost |
|--------|------|
| Reduced control-plane burden | Less control than self-managed Kubernetes |
| AWS-native identity/network integration | Need to manage EKS version lifecycle and add-ons |

## Consequences

- Not every workload should be forced onto EKS.
- Platform must define shared vs dedicated cluster criteria.
- Upgrade strategy and add-on lifecycle are platform responsibilities.

## Future Reconsideration Conditions

Reconsider if workload needs move away from Kubernetes, if managed service constraints block critical requirements, or if multi-cloud runtime portability becomes mandatory.

## Related

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

---

**Status**: Proposed  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
