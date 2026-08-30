# STAR Story: Bootstrapping an EKS Platform with ArgoCD GitOps

## Story Metadata

| Field | Value |
|-------|-------|
| Story Title | Bootstrapping an EKS Platform with ArgoCD GitOps |
| Story Type | Technical Challenge / Platform Engineering |
| Date | TBD |
| Key Skill | EKS platform bootstrap, ArgoCD, Terraform, GitOps separation |
| Industry/Client | Public reference implementation |

## Evidence Classification

**Status**: Reference interview scaffold based on public repository analysis. Do not present as personal implementation unless confirmed.

## The Story

### Situation

A Kubernetes platform needs a repeatable way to install the cluster and then manage application workloads through GitOps instead of manual `kubectl` commands.

### Task

Design or explain a bootstrap sequence that uses Terraform for platform foundations and ArgoCD for ongoing application reconciliation.

### Action

1. Provision cloud/network/EKS/IAM resources with Terraform.
2. Configure Kubernetes and Helm providers against the EKS cluster.
3. Install ArgoCD as a platform add-on.
4. Connect ArgoCD to a GitOps repository containing application manifests/Kustomize overlays.
5. Keep Terraform focused on platform bootstrap while ArgoCD reconciles workloads.

### Result

**Expected benefit**: Clear separation between platform infrastructure and application delivery, with stronger auditability and less cluster drift.  
**Measured result**: TBD.

## What This Story Demonstrates

- Platform bootstrap sequencing.
- GitOps operating model.
- Terraform vs ArgoCD ownership boundaries.
- Enterprise deployment traceability.

## Related Experience

- [Reference EKS Platform](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [ADR-03: ArgoCD Bootstrap vs Manual Deployment](../../architecture/architecture-decisions/adr-reference-eks-argocd-bootstrap-vs-manual-deploy.md)
- [Source Reference](../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
