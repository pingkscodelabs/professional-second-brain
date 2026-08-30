# ADR-02: Terragrunt Live Structure for Environment Composition

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-02 |
| Title | Terragrunt Live Structure for Environment Composition |
| Status | PROPOSED |
| Date | 2026-08-30 |
| Decision Maker | Platform Engineering Architect (reference architecture) |
| Reviewers | Cloud Platform, Application Engineering, FinOps |

## Context

The platform must compose reusable Terraform modules across many accounts, environments, teams, and capability domains without duplicating backend/provider configuration everywhere.

## Problem

Raw Terraform alone can lead to repeated configuration across live stacks. A monolithic state layout creates lock contention and blast-radius risk, while too many bespoke repos create governance overhead.

## Options Considered

### Option 1: Raw Terraform Only

**Pros**:
- Fewer tools
- Easier onboarding for teams already familiar with Terraform

**Cons**:
- More repeated backend/provider/environment configuration
- Harder to enforce consistent live layout at scale

### Option 2: Terragrunt Live Structure

**Pros**:
- Reduces repeated live configuration
- Encourages account/environment hierarchy
- Supports isolated state per stack

**Cons**:
- Adds another tool and learning curve
- Requires guardrails to avoid hidden complexity

### Option 3: Custom Composition Generator

**Pros**:
- Can encode organization-specific conventions

**Cons**:
- Higher maintenance burden
- Risk of proprietary abstraction becoming another bottleneck

## Decision

Use Terragrunt for live environment composition and state isolation, with plain Terraform modules as the reusable building blocks.

## Why

Terragrunt solves repeated live-stack composition without turning the platform into a fully custom provisioning engine. It supports the fleet need for isolated state, shared inputs, and predictable account/environment layout.

## Trade-offs

| Gained | Lost |
|--------|------|
| Reduced repetition and consistent live hierarchy | Additional tool to teach and support |
| State isolation by account/environment/capability | More operational standards needed |

## Consequences

- Platform must document live structure patterns and anti-patterns.
- Module changes need controlled version rollout across live environments.

## Future Reconsideration Conditions

Reconsider if live stack complexity remains low enough for raw Terraform, or if the organization moves to a Kubernetes-native control plane such as Crossplane.

## Related

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

---

**Status**: Proposed  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
