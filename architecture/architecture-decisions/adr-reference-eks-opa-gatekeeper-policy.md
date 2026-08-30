# ADR-04: OPA Gatekeeper for Kubernetes Policy Enforcement

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-04 |
| Title | OPA Gatekeeper for Kubernetes Policy Enforcement |
| Status | REFERENCE PATTERN |
| Date | 2026-08-30 |
| Decision Maker | Reference repository analysis |
| Reviewers | N/A |

## Context

The public repository README describes policy enforcement via OPA Gatekeeper as part of the EKS platform.

## Problem

Kubernetes governance cannot rely only on documentation. Teams need automated admission controls for security and operational standards such as labels, privileged pods, approved registries, and namespace rules.

## Options Considered

### Option 1: Manual Review

**Pros**:
- Flexible and simple for small teams.

**Cons**:
- Does not scale.
- Inconsistent enforcement.

### Option 2: OPA Gatekeeper

**Pros**:
- Kubernetes-native admission policy enforcement.
- Uses constraint templates and constraints.
- Good for enterprise guardrails.

**Cons**:
- Rego/constraint authoring requires skill.
- Blocking policies can disrupt teams if rolled out too quickly.

### Option 3: Kyverno

**Pros**:
- Kubernetes-native YAML-based policy language.
- Often easier for Kubernetes teams to read.

**Cons**:
- Different ecosystem and policy style than OPA.

## Decision

Use OPA Gatekeeper as the referenced policy enforcement pattern.

## Why

Gatekeeper provides an admission-control layer that can enforce platform guardrails automatically rather than relying on manual review.

## Trade-offs

| Gained | Lost |
|--------|------|
| Automated governance | Policy authoring and rollout complexity |
| Prevents non-compliant resources at admission time | Risk of blocking teams if policies are too strict initially |

## Consequences

- Policies should start in audit/warn mode before blocking critical workloads.
- Exception workflow must include owner, expiry, and risk acceptance.

## Future Reconsideration Conditions

Reconsider if Kyverno or cloud-native policy tooling becomes the enterprise standard.

## Related

- [Reference EKS Platform Project](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [Source Reference](../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
