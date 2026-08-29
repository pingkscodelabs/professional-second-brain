# Interview Question: Protecting Configuration State if a GitHub Actions Runner is Compromised

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How is configuration state protected if a GitHub Actions runner is compromised? |
| Category | DevSecOps |
| Difficulty | HARD |
| Technology | GitHub Actions, AWS OIDC, IAM, Terraform, S3 |
| Concepts Tested | Zero long-lived credentials, blast-radius limitation, least-privilege IAM scoping |

## The Question

**Interviewer asks:**

> How is configuration state protected if a GitHub Actions runner is compromised?

## What This Question Tests

### Concepts Being Evaluated

- OIDC federated authentication vs. static credentials (deep)
- Least-privilege IAM scoping per-team (deep)
- Blast-radius thinking in CI/CD security design (deep)

### Expected Knowledge Areas

- OIDC token exchange mechanics (short-lived, job-scoped)
- IAM policy scoping to specific S3 prefixes/API resources

## Expected Strong Answer

### Strong Answer Example

> GitHub Actions runners do not possess permanent AWS credentials. They authenticate to AWS using OIDC tokens that are short-lived for the duration of the job step, satisfying NFR-03 (zero long-lived IAM keys in GitHub repositories). IAM policies further restrict the runner's permissions strictly to the team's specific S3 state path (e.g., `s3://bbc-pagerduty-tf-state/teams/devx-tooling/*`) and PagerDuty API scope, so even a compromised runner in one team's pipeline cannot read or modify another team's Terraform state or PagerDuty resources. This directly reflects the per-team state partitioning decision in ADR-01.

This answer demonstrates:
- Deep understanding of OIDC vs. static-key trust models
- Correctly links a security control (IAM scoping) to a prior architecture decision (state partitioning)

### Key Points in Strong Answer

- OIDC eliminates the "leaked long-lived secret" attack class entirely
- IAM scoping enforces blast-radius limits even if the OIDC exchange itself is abused within a job

## Your Real Experience

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Experience Level

**Your actual experience**: ADVANCED  
**Confidence in answer**: HIGH

## Related Architecture & Decisions

### Related ADRs

- [ADR-01: Terraform GitOps vs. PagerDuty Web Console](../../../architecture/architecture-decisions/adr-bbc-24x7-terraform-gitops-oncall.md)

### Related STAR Stories

- [Terraform State Lock Deadlock Resolution](../../star-stories/bbc-24x7-terraform-state-lock-resolution.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
