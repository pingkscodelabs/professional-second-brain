# STAR Story: Designing Least-Privilege EKS Access with Access Entries

## Story Metadata

| Field | Value |
|-------|-------|
| Story Title | Designing Least-Privilege EKS Access with Access Entries |
| Story Type | Technical Challenge / Security Governance |
| Date | TBD |
| Key Skill | AWS IAM, EKS Access Entries, Kubernetes RBAC validation |
| Industry/Client | Public reference implementation |

## Evidence Classification

**Status**: Reference interview scaffold based on public repository analysis. Do not present as personal implementation unless confirmed.

## The Story

### Situation

Kubernetes platform access often becomes over-permissive because teams map broad IAM roles or users directly into cluster admin paths.

### Task

Design or explain a model where external users have no direct AWS permissions but can obtain scoped Kubernetes API access.

### Action

1. Create IAM roles for admin and developer personas.
2. Allow users to assume only their relevant role.
3. Register those roles as EKS Access Entry principals.
4. Attach cluster-wide view access to admin and namespace-scoped view access to developer.
5. Validate access with both allowed and forbidden `kubectl` commands.

### Result

**Expected benefit**: Clearer separation between AWS IAM identity, temporary credentials, and Kubernetes API authorization.  
**Measured result**: TBD.

## What This Story Demonstrates

- IAM/RBAC bridge design.
- Least-privilege test thinking.
- Understanding of cluster-scoped vs namespaced Kubernetes access.

## Related Experience

- [Reference EKS Platform](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [ADR-02: EKS Access Entries vs aws-auth ConfigMap](../../architecture/architecture-decisions/adr-reference-eks-access-entries-vs-aws-auth-configmap.md)
- [Source Reference](../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
