# Interview Question: Design a Fleet Platform for Enterprise Engineering Teams

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How would you design a fleet platform for enterprise engineering teams? |
| Category | Platform-Engineering |
| Difficulty | HARD |
| Technology | AWS, EKS, Terraform, Terragrunt, GitHub Actions, OIDC, Developer Portal |
| Concepts Tested | Platform architecture, control plane vs workload plane, developer self-service, governance |

## The Question

**Interviewer asks:**

> Design a fleet platform that standardizes infrastructure, CI/CD, Kubernetes, security controls, observability, and developer self-service across many enterprise teams.

## What This Question Tests

### Concepts Being Evaluated

- Enterprise platform architecture (deep)
- Developer experience and golden paths (deep)
- Governance without bottlenecks (deep)
- Migration and adoption strategy (moderate)

## Expected Strong Answer

### Short Answer

> I would design a federated platform: the platform team owns the control plane, reusable modules, workflows, policies, and golden paths, while application teams own services within guardrails. The platform would provide self-service through a developer portal, GitHub workflows, Terraform/Terragrunt, EKS standards, OIDC-based identity, policy-as-code, observability baselines, and FinOps controls.

### Strong Answer

> I would start from the operating model, not the tooling. The goal is to remove repetitive platform tickets while preserving security and auditability. The target architecture has a control plane made of a developer portal, service catalog, platform APIs, GitHub Enterprise, reusable GitHub Actions workflows, Terraform/Terragrunt modules, policy-as-code, and observability/FinOps baselines. The workload plane remains owned by application teams: service code, runtime configuration, runbooks, SLOs, and release decisions. Developers choose golden paths such as "new EKS service" or "managed database", provide service metadata, and the platform creates repo scaffolding, pipeline, infrastructure PR, IAM roles, dashboards, tags, and runbook templates. Risky changes require approval; low-risk standard changes can be automated.

### Deep Dive

Discuss account strategy, state isolation, OIDC trust boundaries, EKS multi-tenancy, CI/CD evidence, policy-as-code, migration phases, adoption, and metrics.

### Follow-up Questions

- How do you stop the platform becoming another bottleneck?
- What should application teams still own?
- How do you migrate legacy Terraform?
- How do you measure adoption and ROI?

### Common Mistake

Describing a tool stack without explaining operating model, ownership, adoption, and business value.

## Your Real Experience

### Related Projects

- [Vodafone Fleet Platform Engineering](../../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

### Experience Level

**Your actual experience**: Hypothetical/reference architecture until evidence is supplied.  
**Confidence in answer**: MEDIUM/HIGH for architectural discussion.

---

**Status**: Complete  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
