# ADR-03: ArgoCD Bootstrap vs Manual Deployment

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-03 |
| Title | ArgoCD Bootstrap vs Manual Application Deployment |
| Status | ACCEPTED IN REFERENCE IMPLEMENTATION |
| Date | 2026-08-30 |
| Decision Maker | Reference repository author |
| Reviewers | N/A |

## Context

The EKS platform is part of a three-repo DevSecOps flow: application source, GitOps manifests, and platform infrastructure.

## Problem

Manual Kubernetes deployment makes cluster state difficult to audit and reproduce. A GitOps controller can reconcile desired state from a Git repository, but must itself be bootstrapped into the cluster.

## Options Considered

### Option 1: Manual kubectl/Helm Deployment

**Pros**:
- Fast for demos and one-off testing.

**Cons**:
- Weak auditability.
- Easy to drift from Git.
- Harder to standardize across clusters.

### Option 2: ArgoCD Bootstrapped by Terraform

**Pros**:
- Reproducible GitOps controller installation.
- Clear separation between platform bootstrap and application manifests.
- Supports app-of-apps / GitOps workflows.

**Cons**:
- Terraform must authenticate to Kubernetes/Helm provider after cluster creation.
- Bootstrap dependencies must be sequenced carefully.

## Decision

Bootstrap ArgoCD through the platform Terraform flow.

## Why

The repository includes a `modules/argocd` module and a pipeline stage for `deploy_argocd_app`, making GitOps a first-class platform capability rather than a manual post-install step.

## Trade-offs

| Gained | Lost |
|--------|------|
| Reproducible GitOps bootstrap | More Terraform/Kubernetes provider dependency sequencing |
| Clear platform/app delivery split | Initial bootstrap complexity |

## Consequences

- ArgoCD installation health and app sync state should be part of platform validation.
- Application repos and GitOps repos need clear ownership boundaries.

## Future Reconsideration Conditions

Reconsider if another GitOps controller becomes the enterprise standard or if deployment flow moves away from Kubernetes GitOps.

## Related

- [Reference EKS Platform Project](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [Source Reference](../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
