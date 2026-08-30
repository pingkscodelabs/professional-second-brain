# ADR-01: Terraform vs CloudFormation for Fleet Infrastructure

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-01 |
| Title | Terraform vs CloudFormation for Fleet Infrastructure |
| Status | PROPOSED |
| Date | 2026-08-30 |
| Decision Maker | Platform Engineering Architect (reference architecture) |
| Reviewers | Security, Cloud Platform, Application Engineering, FinOps |

## Context

Vodafone-scale platform engineering requires repeatable infrastructure provisioning across many accounts, environments, teams, and runtime patterns. The platform needs reusable modules, reviewable plans, state isolation, policy checks, and integration with GitHub-based workflows.

## Problem

CloudFormation is AWS-native but less portable across non-AWS ecosystem tooling. Terraform provides a broad provider ecosystem, stronger multi-tool module reuse, and a common enterprise IaC skill set, but introduces state management responsibility.

## Options Considered

### Option 1: AWS CloudFormation

**Pros**:
- Native AWS service integration
- No external state backend to manage

**Cons**:
- Less flexible for multi-provider workflows
- Weaker fit for unified GitHub/Terragrunt/module ecosystem

### Option 2: Terraform

**Pros**:
- Mature module ecosystem
- Works across AWS, GitHub, Kubernetes, PagerDuty, and SaaS providers
- Strong plan/review workflow for pull requests

**Cons**:
- Requires careful state management, locking, provider pinning, and lifecycle governance

### Option 3: Pulumi

**Pros**:
- Uses general-purpose languages
- Good fit for teams that prefer software engineering patterns

**Cons**:
- Higher language/runtime variance
- Less standardized for HCL-based platform teams

## Decision

Use Terraform as the primary fleet IaC engine, with Terragrunt for live environment composition where it reduces repetition.

## Why

Terraform best supports the platform's need for reusable modules, PR-based plan review, policy-as-code integration, and cross-provider automation spanning AWS, GitHub, Kubernetes, observability, and security tools.

## Trade-offs

| Gained | Lost |
|--------|------|
| Cross-provider ecosystem and reusable modules | Simplicity of AWS-native CloudFormation state handling |
| Consistent PR plan/apply workflow | Need for backend, locking, state recovery, and provider governance |

## Consequences

- Platform must define state isolation, backend encryption, locking, module versioning, and provider upgrade standards.
- Teams need Terraform/Terragrunt education and paved-road templates.

## Future Reconsideration Conditions

Reconsider if AWS-native controls become mandatory for all workloads, if Terraform state governance becomes too costly, or if Crossplane/Pulumi becomes the organization's preferred platform control-plane model.

## Related

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

---

**Status**: Proposed  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
