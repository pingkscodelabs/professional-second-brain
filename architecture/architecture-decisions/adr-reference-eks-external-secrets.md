# ADR-05: External Secrets Operator for Runtime Secrets

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-05 |
| Title | External Secrets Operator for Runtime Secrets |
| Status | REFERENCE PATTERN |
| Date | 2026-08-30 |
| Decision Maker | Reference repository analysis |
| Reviewers | N/A |

## Context

The public repository README describes secrets management via External Secrets Operator as part of the EKS platform.

## Problem

Kubernetes native Secrets are not sufficient as a complete enterprise secrets strategy when raw secret values are committed to Git, embedded in manifests, or stored unmanaged in Terraform state.

## Options Considered

### Option 1: Kubernetes Native Secrets Only

**Pros**:
- Built into Kubernetes.
- Easy for applications to consume.

**Cons**:
- Requires careful encryption and access control.
- Does not solve external secret lifecycle/rotation by itself.
- Risk of secret values entering Git manifests.

### Option 2: External Secrets Operator

**Pros**:
- Syncs secrets from an external secrets manager.
- Keeps raw secret values out of GitOps manifests.
- Supports platform-controlled access patterns.

**Cons**:
- Adds controller dependency.
- Requires secret-store IAM and lifecycle governance.

## Decision

Use External Secrets Operator as the reference pattern for runtime secret delivery.

## Why

It aligns GitOps with secret hygiene: Git stores desired references, while secret values remain in an approved external store.

## Trade-offs

| Gained | Lost |
|--------|------|
| Secrets kept out of Git manifests | Additional controller and IAM configuration |
| Central lifecycle and audit potential | Dependency on external secret store availability |

## Consequences

- Secret rotation, audit, and workload identity must be designed explicitly.
- Terraform should avoid outputting or storing raw secrets in state where possible.

## Future Reconsideration Conditions

Reconsider if the enterprise standardizes on another secrets integration or if workloads move away from Kubernetes.

## Related

- [Reference EKS Platform Project](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [Source Reference](../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
