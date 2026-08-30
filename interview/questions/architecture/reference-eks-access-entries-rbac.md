# Interview Question: EKS Access Entries and RBAC Scoping

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How do EKS Access Entries help implement least-privilege Kubernetes API access? |
| Category | Architecture |
| Difficulty | HARD |
| Technology | AWS IAM, EKS Access Entries, STS AssumeRole, Kubernetes API |
| Concepts Tested | IAM/RBAC integration, least privilege, access testing |

## The Question

**Interviewer asks:**

> Explain how you would grant admin and developer access to an EKS cluster without giving users broad AWS permissions.

## Expected Strong Answer

### Short Answer

Use IAM roles as the access boundary. Users assume scoped IAM roles through STS, and those roles are registered as EKS Access Entry principals with cluster-wide or namespace-scoped Kubernetes API permissions.

### Strong Answer

The reference repo models two roles: `external-aws-k8s-admin` and `external-aws-k8s-developer`. External users do not need direct AWS permissions; they assume one of these roles, then use the temporary credentials with `kubectl`. EKS Access Entries attach the role to an EKS access policy. The admin role has cluster-wide view access, while the developer role is scoped to the `online-boutique` namespace. The README validates least privilege by showing allowed and forbidden `kubectl` commands.

### Deep Dive

Discuss EKS Access Entries vs `aws-auth`, cluster-scoped vs namespace-scoped resources, STS credential lifetime, Identity Center integration for production, and test matrices for allowed/denied operations.

### Follow-up Questions

- Why not give developers direct IAM permissions?
- What happens if the developer tries `kubectl get nodes`?
- How would you onboard more users later?
- How would this change with AWS IAM Identity Center?

### Common Mistake

Confusing AWS IAM permissions with Kubernetes API permissions; assuming an IAM role automatically grants full Kubernetes access.

## Your Real Experience

### Related Projects

- [Reference EKS Platform](../../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)

### Evidence Level

**Experience type**: Public reference implementation analysis.  
**Confidence in answer**: HIGH for architectural discussion; not a personal delivery claim.

## Related Architecture & Decisions

- [ADR-02: EKS Access Entries vs aws-auth ConfigMap](../../../architecture/architecture-decisions/adr-reference-eks-access-entries-vs-aws-auth-configmap.md)
- [Source Reference](../../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
