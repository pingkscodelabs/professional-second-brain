# Use Case Catalog: Terraform EKS Platform Reference Implementation

## Catalog Metadata

| Field | Value |
|-------|-------|
| Source Repo | https://github.com/ranjitha-su/terraform-eks-platform |
| Classification | PUBLIC_REFERENCE / Reference Implementation |
| Purpose | Platform Engineering interview use-case generation |
| Evidence Boundary | Repo facts are public-reference facts; outcomes are expected/illustrative only |

## Ranked Use Cases

| Rank | Use Case | Business Problem | Platform Capability | Technologies | Complexity | Target Interview Level | Why Valuable | Potential ADRs | Expected Business Impact |
|------|----------|------------------|---------------------|--------------|------------|------------------------|--------------|----------------|--------------------------|
| 1 | Secure Terraform execution with GitLab OIDC into AWS | Static cloud credentials in CI/CD increase breach impact and rotation overhead | Short-lived CI/CD identity federation | GitLab CI, OIDC, AWS STS, Terraform | HARD | Lead / Principal / DevSecOps Architect | Shows modern cloud identity, CI security, and least-privilege delivery | OIDC vs static credentials; CI approval model | Expected reduction in credential leakage risk |
| 2 | EKS platform bootstrap with Terraform modules | Manual EKS setup creates inconsistency and slow environment creation | Repeatable cluster/platform provisioning | Terraform, AWS EKS, VPC, Helm provider | HARD | Senior / Lead Platform Engineer | Demonstrates platform bootstrap and module composition | EKS module vs custom resources; managed node groups | Expected faster repeatable platform provisioning |
| 3 | Least-privilege Kubernetes access via EKS Access Entries | Cluster access is often over-permissive or manually mapped | IAM-to-Kubernetes API access governance | IAM roles, STS AssumeRole, EKS Access Entries | HARD | Lead / Principal | Strong IAM/RBAC bridge story for enterprise access | EKS Access Entries vs aws-auth ConfigMap | Expected stronger access control and auditability |
| 4 | ArgoCD bootstrap for application GitOps | Direct deploys reduce traceability and drift control | GitOps delivery bootstrap | ArgoCD, Helm, Kustomize, GitLab CI | MEDIUM/HARD | Senior / Lead | Connects infrastructure platform to app delivery workflow | GitOps vs manual deploy | Expected better deployment traceability |
| 5 | OPA Gatekeeper policy enforcement | Kubernetes standards are hard to enforce through documentation alone | Admission control and policy-as-code | OPA Gatekeeper, Kubernetes | HARD | Lead / Architect | Shows governance automation and guardrail design | Gatekeeper vs other policy engines; warn vs block | Expected improved security consistency |
| 6 | External Secrets Operator for runtime secrets | Secrets in Git or manifests create security risk | Runtime secret synchronization | External Secrets Operator, AWS Secrets Manager pattern | MEDIUM/HARD | Senior / DevSecOps | Demonstrates secure secrets delivery for Kubernetes | External Secrets vs native Kubernetes Secrets | Expected lower risk of secret exposure |
| 7 | Istio ingress/service mesh platform layer | Advanced traffic management can become inconsistent across teams | Service mesh/ingress platform capability | Istio, Helm, Kubernetes | HARD | Lead / Architect | Good trade-off story: power vs operational complexity | Istio vs ALB-only ingress; mesh adoption criteria | Expected standard traffic/security controls where justified |
| 8 | S3 remote backend and Terraform state governance | Local/unmanaged state causes drift and recovery problems | Shared remote backend with versioning | S3 backend, Terraform state versioning | MEDIUM | Senior / DevOps | Classic IaC operations topic with real failure modes | Backend strategy; state recovery | Expected safer Terraform collaboration |
| 9 | Multi-AZ VPC with single NAT Gateway trade-off | Network foundations must balance cost and resilience | EKS network baseline | VPC, public/private subnets, NAT Gateway | MEDIUM | Senior / Architect | FinOps vs availability discussion | Single NAT vs per-AZ NAT | Expected lower cost with known availability trade-off |
| 10 | Three-repo DevSecOps release model | App, manifests, and platform concerns become tangled in one repo | Separation of responsibilities | App repo, GitOps repo, platform repo, Docker Hub, ArgoCD | MEDIUM | Senior / Lead | Shows clean ownership between app, platform, and deployment state | Repo separation vs monorepo | Expected clearer ownership and audit trail |

## Best First Use Cases For Interviews

1. **GitLab OIDC secure Terraform execution** — strongest DevSecOps story.
2. **EKS Access Entries and RBAC** — strongest IAM/Kubernetes governance story.
3. **EKS + ArgoCD platform bootstrap** — strongest platform engineering architecture story.
4. **OPA Gatekeeper + External Secrets** — strongest secure-by-default platform controls story.
5. **Single NAT Gateway trade-off** — concise FinOps/reliability trade-off story.

## Evidence-Safe Interview Framing

> I studied and decomposed a public Terraform-based EKS platform reference implementation, then converted it into reusable Platform Engineering interview patterns: secure CI/CD through GitLab OIDC, EKS access governance, ArgoCD bootstrap, OPA Gatekeeper policy enforcement, External Secrets, and Terraform state governance.

## Related Artifacts

- [Reference Source Note](../../knowledge/references/terraform-eks-platform-reference.md)
- [Reference Project Experience](../platform-engineering/reference-terraform-eks-platform-gitops.md)
- [Whiteboard Scenario](../../interview/system-design/reference-eks-platform-gitops-whiteboard.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
