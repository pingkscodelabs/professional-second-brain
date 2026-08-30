# Interview Question: Terraform/Terragrunt State Strategy for a Fleet Platform

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How would you design Terraform/Terragrunt state management for an enterprise fleet platform? |
| Category | DevOps |
| Difficulty | HARD |
| Technology | Terraform, Terragrunt, AWS S3, DynamoDB, GitHub Actions |
| Concepts Tested | IaC state isolation, blast radius, module versioning, drift detection |

## The Question

**Interviewer asks:**

> How would you structure Terraform/Terragrunt for many accounts, environments, teams, and services without creating state lock and blast-radius problems?

## Expected Strong Answer

### Short Answer

> I would keep reusable Terraform modules separate from Terragrunt live configuration, isolate state by account/environment/capability, encrypt state, enable locking/versioning, and run PR-based plan/apply workflows with policy checks.

### Strong Answer

> The structure should separate reusable modules from live stacks. Modules define patterns like account baseline, EKS cluster, namespace, workload IAM role, database, observability baseline, and FinOps guardrails. Live configuration composes those modules per account and environment using Terragrunt. State should not be monolithic; it should be isolated by account, environment, and capability so a lock or failure in one service does not block the whole estate. Every PR should run format, lint, validate, scan, policy checks, and `plan`, with the plan posted for review. Applies should use OIDC-assumed roles scoped to the specific stack.

### Deep Dive

Cover backend encryption, DynamoDB locking, provider pinning, module semantic versioning, scheduled drift detection, import-and-reconcile for legacy infrastructure, and module upgrade waves.

### Follow-up Questions

- How do you recover from state corruption?
- How do you migrate manually-created resources into state?
- How do you prevent teams pinning old modules forever?

### Common Mistake

Using one shared state file for too many teams or environments, creating global locks and unnecessary blast radius.

## Your Real Experience

### Related Projects

- [Vodafone Fleet Platform Engineering](../../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

### Related ADRs

- [ADR-01: Terraform vs CloudFormation](../../../architecture/architecture-decisions/adr-vodafone-fleet-terraform-vs-cloudformation.md)
- [ADR-02: Terragrunt Live Structure](../../../architecture/architecture-decisions/adr-vodafone-fleet-terragrunt-live-structure.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
