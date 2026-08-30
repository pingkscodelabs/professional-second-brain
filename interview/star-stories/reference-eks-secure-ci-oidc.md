# STAR Story: Securing Terraform CI/CD with GitLab OIDC

## Story Metadata

| Field | Value |
|-------|-------|
| Story Title | Securing Terraform CI/CD with GitLab OIDC |
| Story Type | Technical Challenge / DevSecOps |
| Date | TBD |
| Key Skill | OIDC, Terraform CI/CD, AWS IAM least privilege |
| Industry/Client | Public reference implementation |

## Evidence Classification

**Status**: Reference interview scaffold based on public repository analysis. Do not present as personal implementation unless confirmed.

## The Story

### Situation

A Terraform pipeline needs AWS permissions to provision an EKS platform. Traditional CI/CD setups often store static AWS access keys, creating rotation and leakage risk.

### Task

Design or explain a safer CI/CD authentication model that allows Terraform to run from GitLab CI without long-lived credentials.

### Action

1. Use GitLab OIDC to issue a job-scoped token.
2. Exchange the token with AWS STS using `assume-role-with-web-identity`.
3. Scope the assumed role to the project, branch/environment, backend, and target infrastructure.
4. Run Terraform through separated `init`, `validate`, `plan`, and `apply` stages.
5. Add approval gates and audit evidence for production applies.

### Result

**Expected benefit**: Lower credential leakage risk and clearer auditability for Terraform execution.  
**Measured result**: TBD.

## What This Story Demonstrates

- CI/CD identity federation.
- Secretless infrastructure automation.
- Least-privilege and blast-radius thinking.
- Ability to explain DevSecOps trade-offs.

## Related Experience

- [Reference EKS Platform](../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)
- [ADR-01: GitLab OIDC vs Static AWS Credentials](../../architecture/architecture-decisions/adr-reference-eks-gitlab-oidc-vs-static-credentials.md)
- [Source Reference](../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
