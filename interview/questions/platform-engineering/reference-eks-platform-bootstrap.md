# Interview Question: Terraform-Managed EKS Platform Bootstrap

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How would you bootstrap an EKS platform with Terraform? |
| Category | Platform-Engineering |
| Difficulty | HARD |
| Technology | Terraform, AWS EKS, VPC, IAM, Helm provider, Kubernetes provider |
| Concepts Tested | Platform bootstrap sequencing, module boundaries, cloud foundation design |

## The Question

**Interviewer asks:**

> Walk me through how you would provision an EKS platform with Terraform and bootstrap the required platform add-ons.

## Expected Strong Answer

### Short Answer

Define Terraform modules for IAM, EKS, GitOps, and platform add-ons. Provision the VPC/subnets/NAT and EKS cluster first, configure Kubernetes/Helm providers against the cluster endpoint, then bootstrap ArgoCD and add-ons such as Gatekeeper, External Secrets, and Istio.

### Strong Answer

The reference repo composes `modules/iam`, `modules/eks`, `modules/argocd`, and `modules/istio` from root `main.tf`. Terraform creates IAM roles first, then EKS uses those role ARNs to configure access entries. The Kubernetes and Helm providers authenticate to EKS using `aws eks get-token`, which allows Terraform to install Kubernetes/Helm resources after the cluster is available. ArgoCD then becomes the GitOps controller for workloads from the GitOps repository.

### Deep Dive

Discuss provider dependency ordering, remote state, node group sizing, VPC design, private/public subnet placement, access entries, add-on lifecycle, and production hardening gaps.

### Follow-up Questions

- How do you sequence Helm providers after EKS creation?
- What belongs in Terraform vs ArgoCD?
- How would you handle EKS upgrades?
- What are the risks of bootstrapping too much through Terraform?

### Common Mistake

Putting all workload deployment responsibility into Terraform instead of using Terraform for platform bootstrap and GitOps for ongoing application reconciliation.

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
