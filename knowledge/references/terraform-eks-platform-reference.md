# Reference: terraform-eks-platform

## Reference Metadata

| Field | Value |
|-------|-------|
| Source | GitHub public repository |
| Repository | `ranjitha-su/terraform-eks-platform` |
| URL | https://github.com/ranjitha-su/terraform-eks-platform |
| Classification | PUBLIC_REFERENCE |
| Usage | Platform Engineering interview study, use-case extraction, reference architecture analysis |
| Evidence Type | Public repository README and public file pages |

## Evidence Rules

- This repository is a public reference implementation, not proof of personal production experience.
- Do not claim personal implementation, ownership, or business impact unless separate evidence is provided.
- Use labels such as `Reference Implementation`, `Lab Project`, `Adapted Architecture`, or `Learning Evidence`.
- Treat metrics and outcomes as `TBD`, `Expected benefit`, or `Illustrative target` unless independently evidenced.

## What The Repo Does

The repository provisions an AWS EKS platform using Terraform and bootstraps platform capabilities for GitOps, policy enforcement, and secrets management. The public README describes it as a production-grade EKS platform on AWS with GitOps delivery via ArgoCD, policy enforcement via OPA Gatekeeper, and secrets management via External Secrets Operator, automated through Terraform and CI/CD.

## Tech Stack

| Area | Technology |
|------|------------|
| CI/CD | GitLab CI |
| Container Registry | Docker Hub |
| GitOps | ArgoCD |
| Kubernetes Manifests | Kustomize |
| Cluster | AWS EKS |
| Infrastructure as Code | Terraform |
| Providers | AWS, Kubernetes, Helm |

## Related Repositories

| Repository | Purpose |
|------------|---------|
| `spring-petclinic-app` | Application source code and CI pipeline |
| `spring-petclinic-gitops` | Kubernetes manifests and GitOps pipeline |
| `terraform-eks-platform` | EKS cluster and ArgoCD bootstrap through Terraform |

## Provisioned Components

| Component | Detail |
|-----------|--------|
| VPC | `10.0.0.0/16`, `us-west-2` |
| Subnets | 2 public + 2 private, spread across availability zones |
| NAT Gateway | Single NAT Gateway attached to public subnet |
| EKS Cluster | EKS via `terraform-aws-modules/eks`; README mentions v1.27 while `main.tf` showed `cluster_version = "1.31"` in public page content |
| Managed Node Group | min 1 / desired 2 / max 5 nodes |
| IAM Roles | `external-aws-k8s-admin`, `external-aws-k8s-developer` |
| EKS Access Entries | Cluster-wide view for admin role; namespace-scoped view for developer role |
| Kubernetes Namespace | `online-boutique` |

## Module Structure

Public module folders observed:

- `modules/iam`
- `modules/eks`
- `modules/argocd`
- `modules/istio`

Root `main.tf` references AWS, Kubernetes, and Helm providers, then composes the IAM, EKS, ArgoCD, and Istio modules.

## CI/CD Flow

The public `.gitlab-ci.yml` uses:

- Terraform image (`hashicorp/terraform:1.14` shown in public page content)
- GitLab OIDC token (`GITLAB_OIDC_TOKEN`) with audience `https://gitlab.com`
- `aws sts assume-role-with-web-identity`
- Pipeline stages:
  - `init`
  - `validate`
  - `plan`
  - `apply`
  - `deploy_argocd_app`
  - `destroy`

The pipeline assumes an AWS role through OIDC rather than storing static AWS access keys in GitLab CI/CD variables.

## Access Model

External IAM users have no direct AWS permissions. They assume IAM roles, and those roles are registered as EKS Access Entry principals that grant scoped Kubernetes API access.

```text
IAM User -> sts:AssumeRole -> IAM Role -> EKS Access Entry -> Kubernetes API
```

| IAM User | Assumed Role | EKS Policy | Scope |
|----------|--------------|------------|-------|
| `aws-k8s-admin` | `external-aws-k8s-admin` | `AmazonEKSViewPolicy` | Cluster-wide |
| `aws-k8s-developer` | `external-aws-k8s-developer` | `AmazonEKSViewPolicy` | Namespace (`online-boutique`) |

## Testing Approach

The README documents RBAC validation scenarios:

### Admin Role

| Command | Expected Result |
|---------|-----------------|
| `kubectl get pods -A` | Pass — lists pods from all namespaces |
| `kubectl delete pod <pod-name> -n <namespace>` | Forbidden — view policy does not grant delete |
| `kubectl create namespace test-ns` | Forbidden — view policy does not grant create |

### Developer Role

| Command | Expected Result |
|---------|-----------------|
| `kubectl get pods -n online-boutique` | Pass — namespace-scoped access |
| `kubectl get pods -A` | Forbidden — no cluster-wide access |
| `kubectl get pods -n kube-system` | Forbidden — outside allowed namespace |
| `kubectl get nodes` | Forbidden — nodes are cluster-scoped resources |

## Interview-Relevant Patterns

- OIDC-based Terraform execution without static cloud credentials.
- EKS access entries for IAM-to-Kubernetes API access governance.
- Terraform module composition for EKS platform bootstrap.
- ArgoCD bootstrap as part of infrastructure provisioning.
- OPA Gatekeeper for Kubernetes policy enforcement.
- External Secrets Operator for secrets delivery to workloads.
- Single NAT Gateway as a cost/availability trade-off.
- Three-repo DevSecOps model separating app code, GitOps manifests, and platform infrastructure.

## Related Artifacts

- [Reference EKS Platform Project](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [Use Case Catalog](../../projects/case-studies/terraform-eks-platform-use-case-catalog.md)
- [Whiteboard: Reference EKS Platform](../../interview/system-design/reference-eks-platform-gitops-whiteboard.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
