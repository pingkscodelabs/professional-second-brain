# ADR-01: GitLab OIDC vs Static AWS Credentials

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-01 |
| Title | GitLab OIDC vs Static AWS Credentials for Terraform CI/CD |
| Status | ACCEPTED IN REFERENCE IMPLEMENTATION |
| Date | 2026-08-30 |
| Decision Maker | Reference repository author |
| Reviewers | N/A |

## Context

The reference EKS platform runs Terraform from GitLab CI and needs AWS credentials to provision infrastructure.

## Problem

Static AWS access keys in CI/CD systems create secret leakage and rotation risk. A platform pipeline needs secure AWS access without embedding long-lived credentials.

## Options Considered

### Option 1: Static AWS Access Keys in GitLab CI/CD Variables

**Pros**:
- Simple to set up.
- Common legacy pattern.

**Cons**:
- Long-lived secret exposure risk.
- Rotation burden.
- Higher blast radius if leaked.

### Option 2: GitLab OIDC + AWS STS AssumeRoleWithWebIdentity

**Pros**:
- Short-lived credentials.
- No static AWS keys in CI/CD.
- Trust can be scoped to project/ref/audience conditions.

**Cons**:
- Requires IAM OIDC trust policy design.
- Misconfigured trust policies can still create broad access.

## Decision

Use GitLab OIDC and AWS STS `assume-role-with-web-identity` for CI/CD AWS authentication.

## Why

The public `.gitlab-ci.yml` shows a `GITLAB_OIDC_TOKEN` exchanged for short-lived AWS credentials using `aws sts assume-role-with-web-identity`, aligning with DevSecOps principles and avoiding static cloud credentials.

## Trade-offs

| Gained | Lost |
|--------|------|
| Reduced long-lived credential risk | Simplicity of static keys |
| Better audit and session scoping | Need for OIDC/IAM trust policy governance |

## Consequences

- IAM trust policy must be tightly scoped.
- Pipeline permissions must follow least privilege.
- Production usage should define approval and environment boundaries.

## Future Reconsideration Conditions

Reconsider if GitLab CI is replaced or if the organization standardizes on another workload identity platform.

## Related

- [Reference EKS Platform Project](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [Source Reference](../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
