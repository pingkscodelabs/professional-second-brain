# STAR Story: Vodafone Fleet Terraform Governance

## Story Metadata

| Field | Value |
|-------|-------|
| Story Title | Standardizing Terraform Governance for a Fleet Platform |
| Story Type | Technical Challenge / Governance |
| Date | TBD |
| Key Skill | Terraform, Terragrunt, IaC governance, state isolation |
| Industry/Client | Vodafone |

## Evidence Classification

**Status**: Hypothetical/reference interview story. Do not present as measured real Vodafone experience until evidence is supplied.

## The Story

### Situation

Multiple teams had duplicated Terraform patterns, inconsistent backends, unclear ownership, and environment drift across cloud accounts and Kubernetes clusters.

### Task

I needed to design a Terraform/Terragrunt governance model that enabled reusable modules and safe autonomy without centralizing every infrastructure change in one team.

### Action

**Step 1**: I would define a module registry with versioned modules for account baselines, EKS clusters, namespaces, IAM workload roles, managed databases, observability, and cost guardrails.

**Step 2**: I would implement a Terragrunt live structure by account/environment/capability with isolated remote state, encrypted backends, and locking.

**Step 3**: I would enforce PR validation with formatting, linting, IaC scanning, policy-as-code, plan comments, CODEOWNERS, and risk-based approval gates.

**Key decisions made**:

1. Use Terraform for reusable modules and Terragrunt for live composition.
2. Isolate state to reduce lock contention and blast radius.
3. Version modules and roll upgrades in waves instead of editing every team stack manually.

### Result

**Expected benefit**: Reduced drift, safer infrastructure changes, clearer ownership, and more predictable module upgrades.  
**Measured result**: TBD.

## What This Story Demonstrates

- Infrastructure-as-code maturity.
- Governance automation.
- State/blast-radius thinking.
- Practical trade-offs between central standards and team autonomy.

## Related Experience

### Related Projects

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

### Related Architecture Decisions

- [ADR-01: Terraform vs CloudFormation](../../architecture/architecture-decisions/adr-vodafone-fleet-terraform-vs-cloudformation.md)
- [ADR-02: Terragrunt Live Structure](../../architecture/architecture-decisions/adr-vodafone-fleet-terragrunt-live-structure.md)
- [ADR-03: GitOps vs Direct Deployment](../../architecture/architecture-decisions/adr-vodafone-fleet-gitops-vs-direct-deployment.md)

---

**Status**: Draft  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
