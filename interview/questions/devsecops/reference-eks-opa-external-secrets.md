# Interview Question: OPA Gatekeeper and External Secrets on EKS

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How would you add policy enforcement and secrets management to an EKS platform? |
| Category | DevSecOps |
| Difficulty | HARD |
| Technology | OPA Gatekeeper, External Secrets Operator, EKS, Kubernetes |
| Concepts Tested | Kubernetes governance, guardrails vs gates, secrets delivery |

## The Question

**Interviewer asks:**

> How would you enforce Kubernetes policies and manage secrets safely in an EKS platform?

## Expected Strong Answer

### Short Answer

Use OPA Gatekeeper for Kubernetes admission policies and External Secrets Operator to sync secret values from an external secrets manager into Kubernetes without storing raw secrets in Git.

### Strong Answer

OPA Gatekeeper provides policy-as-code at admission time. You can enforce controls such as required labels, approved registries, no privileged pods, resource requirements, and namespace ownership. External Secrets Operator lets GitOps manifests contain secret references rather than secret values. The application gets a Kubernetes Secret synced from an approved external store, while access to that store is controlled by workload identity and IAM. In production, policies should usually start in warn/audit mode, then move to blocking once teams have migration time.

### Deep Dive

Discuss constraint templates, exception workflow, warn vs block rollout, secret-store IAM, rotation, audit logging, preventing secrets in Terraform state, and GitOps compatibility.

### Follow-up Questions

- Which policies should block immediately?
- How do you handle policy exceptions?
- How do you prevent secrets from entering Git or logs?
- What happens if the external secret store is unavailable?

### Common Mistake

Treating Kubernetes Secrets as a full enterprise secret management strategy without rotation, external source of truth, or access audit.

## Your Real Experience

### Related Projects

- [Reference EKS Platform](../../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)

### Evidence Level

**Experience type**: Public reference implementation analysis.  
**Confidence in answer**: HIGH for architectural discussion; not a personal delivery claim.

## Related Architecture & Decisions

- [ADR-04: OPA Gatekeeper Policy Enforcement](../../../architecture/architecture-decisions/adr-reference-eks-opa-gatekeeper-policy.md)
- [ADR-05: External Secrets Operator](../../../architecture/architecture-decisions/adr-reference-eks-external-secrets.md)
- [Source Reference](../../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
