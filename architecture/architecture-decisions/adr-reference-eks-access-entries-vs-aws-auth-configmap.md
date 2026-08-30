# ADR-02: EKS Access Entries vs aws-auth ConfigMap

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-02 |
| Title | EKS Access Entries vs aws-auth ConfigMap for Kubernetes API Access |
| Status | ACCEPTED IN REFERENCE IMPLEMENTATION |
| Date | 2026-08-30 |
| Decision Maker | Reference repository author |
| Reviewers | N/A |

## Context

The platform needs to grant Kubernetes API access to external IAM principals without giving those principals direct AWS permissions.

## Problem

Legacy EKS access often relied on the `aws-auth` ConfigMap, which can be operationally fragile and harder to govern. The platform needs an auditable AWS-side mechanism for cluster access mapping.

## Options Considered

### Option 1: `aws-auth` ConfigMap

**Pros**:
- Familiar legacy EKS pattern.
- Works across many existing clusters.

**Cons**:
- Kubernetes-side mapping can be harder to govern from AWS/IAM workflows.
- ConfigMap mistakes can lock out users or overgrant access.

### Option 2: EKS Access Entries

**Pros**:
- AWS-managed cluster access model.
- Clear mapping from IAM principal to EKS access policy.
- Works well with Terraform and IAM role governance.

**Cons**:
- Requires newer EKS access model knowledge.
- Some organizations may still have legacy `aws-auth` migration work.

## Decision

Use EKS Access Entries for admin and developer role access.

## Why

The reference implementation registers `external-aws-k8s-admin` and `external-aws-k8s-developer` roles as EKS Access Entry principals, with cluster-wide view for admin and namespace-scoped view for developer.

## Trade-offs

| Gained | Lost |
|--------|------|
| AWS-managed access governance | Familiarity of legacy `aws-auth` workflows |
| Easier Terraform-controlled access entries | Need to understand EKS access policies |

## Consequences

- Access testing should validate both allowed and denied actions.
- Production implementations should usually integrate with IAM Identity Center / SSO rather than long-lived IAM users.

## Future Reconsideration Conditions

Reconsider only for clusters that must remain on legacy access patterns or if organizational tooling standardizes elsewhere.

## Related

- [Reference EKS Platform Project](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [Source Reference](../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
