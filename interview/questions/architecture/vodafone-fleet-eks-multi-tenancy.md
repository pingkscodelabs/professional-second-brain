# Interview Question: EKS Multi-Tenancy for a Fleet Platform

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How would you design EKS multi-tenancy for many enterprise teams? |
| Category | Architecture |
| Difficulty | HARD |
| Technology | Amazon EKS, Kubernetes RBAC, NetworkPolicy, IRSA, Helm, GitOps |
| Concepts Tested | Kubernetes platform architecture, isolation, shared vs dedicated clusters |

## The Question

**Interviewer asks:**

> Design a Kubernetes/EKS platform for many teams. When would you use shared clusters vs dedicated clusters, and how would you enforce isolation?

## Expected Strong Answer

### Short Answer

> I would use a tiered model: shared EKS clusters for standard workloads where namespace isolation is sufficient, and dedicated clusters for regulated, high-risk, high-scale, or noisy-neighbor workloads. Isolation comes from namespaces, RBAC, network policies, resource quotas, pod security, workload identity, and platform-managed add-ons.

### Strong Answer

> The key is to avoid treating all workloads the same. For standard internal services, shared clusters reduce cost and operational overhead. For workloads with strict compliance, high blast radius, unusual networking, or unpredictable resource consumption, dedicated clusters are safer. In shared clusters, every golden path creates a namespace, service account, IAM role, network policy, resource quota, limit range, ingress configuration, baseline dashboard, and alert set. Platform owns cluster lifecycle, add-ons, admission policies, and upgrades. Teams own workload manifests or Helm values, SLOs, and operational readiness.

### Deep Dive

Cover IRSA/workload identity, ingress isolation, DNS/cert management, policy admission, GitOps sync, HPA/Karpenter, cluster upgrade waves, backup strategy, and noisy-neighbor controls.

### Follow-up Questions

- How do you handle cluster upgrades?
- What if one tenant consumes all cluster resources?
- When is namespace isolation not enough?

### Common Mistake

Assuming namespace isolation alone is sufficient for all enterprise workloads.

## Your Real Experience

### Related Projects

- [Vodafone Fleet Platform Engineering](../../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

### Related ADRs

- [ADR-07: Managed EKS vs Self-Managed Kubernetes](../../../architecture/architecture-decisions/adr-vodafone-fleet-managed-eks-vs-self-managed-kubernetes.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
