# Interview Question: ArgoCD GitOps Bootstrap on EKS

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How would you bootstrap ArgoCD into an EKS platform and separate platform from application delivery? |
| Category | Kubernetes |
| Difficulty | MEDIUM |
| Technology | ArgoCD, Terraform, Helm, Kustomize, EKS |
| Concepts Tested | GitOps bootstrap, repo separation, platform vs workload ownership |

## The Question

**Interviewer asks:**

> How would you use ArgoCD in an EKS platform, and what should Terraform own versus ArgoCD own?

## Expected Strong Answer

### Short Answer

Terraform should bootstrap the cluster and install ArgoCD, while ArgoCD should continuously reconcile application and workload manifests from GitOps repositories.

### Strong Answer

In the reference model, the platform repo provisions EKS and includes a module for ArgoCD. That makes ArgoCD part of the platform bootstrap. After ArgoCD is installed, application delivery should move to GitOps repositories containing Kubernetes manifests or Kustomize overlays. This gives a clean separation: Terraform owns cloud and platform foundations; ArgoCD owns Kubernetes desired state for applications. It also creates a strong audit trail because app changes are pull requests into the GitOps repo, not ad hoc `kubectl apply` commands.

### Deep Dive

Discuss bootstrap ordering, ArgoCD app-of-apps, repo credentials, namespace ownership, drift detection, sync policies, rollback, and promotion between environments.

### Follow-up Questions

- What is the risk of managing too many Kubernetes resources in Terraform?
- How do you bootstrap ArgoCD itself safely?
- How do you handle secrets in GitOps manifests?
- How do you roll back a bad ArgoCD sync?

### Common Mistake

Using Terraform as the long-term application deployment engine instead of limiting Terraform to cluster/platform bootstrap.

## Your Real Experience

### Related Projects

- [Reference EKS Platform](../../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)

### Evidence Level

**Experience type**: Public reference implementation analysis.  
**Confidence in answer**: HIGH for architectural discussion; not a personal delivery claim.

## Related Architecture & Decisions

- [ADR-03: ArgoCD Bootstrap vs Manual Deployment](../../../architecture/architecture-decisions/adr-reference-eks-argocd-bootstrap-vs-manual-deploy.md)
- [Source Reference](../../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
