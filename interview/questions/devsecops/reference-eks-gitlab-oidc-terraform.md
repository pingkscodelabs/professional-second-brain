# Interview Question: GitLab OIDC for Terraform on AWS

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How would you run Terraform from GitLab CI without static AWS credentials? |
| Category | DevSecOps |
| Difficulty | HARD |
| Technology | GitLab CI, AWS STS, OIDC, Terraform |
| Concepts Tested | CI/CD identity federation, least privilege, secretless automation |

## The Question

**Interviewer asks:**

> How would you design Terraform CI/CD so GitLab can provision AWS infrastructure without storing long-lived AWS access keys?

## Expected Strong Answer

### Short Answer

Use GitLab OIDC to exchange a job-scoped OIDC token for short-lived AWS credentials through `sts:AssumeRoleWithWebIdentity`, then run Terraform with a role scoped to the project, branch/environment, and target resources.

### Strong Answer

In the reference repo, `.gitlab-ci.yml` requests a `GITLAB_OIDC_TOKEN` and calls `aws sts assume-role-with-web-identity` to assume the deployment role. That means no static AWS access keys need to be stored in GitLab CI/CD variables. The important production detail is scoping: the IAM trust policy should restrict audience, project, branch/ref, and environment, while the role permissions should only cover the Terraform backend and target infrastructure for that stack. The pipeline should separate `init`, `validate`, `plan`, and `apply`, and production `apply` should require approval.

### Deep Dive

Discuss OIDC trust policy conditions, branch/environment scoping, Terraform backend access, state locking, plan artifact handling, approval gates, and audit logs.

### Follow-up Questions

- What happens if a runner is compromised?
- What should the IAM trust policy restrict?
- How do you handle production approvals?
- Where should Terraform state permissions be scoped?

### Common Mistake

Replacing static keys with OIDC but giving the assumed role broad admin access.

## Your Real Experience

### Related Projects

- [Reference EKS Platform](../../../projects/platform-engineering/reference-terraform-eks-platform-gitops.md)

### Evidence Level

**Experience type**: Public reference implementation analysis.  
**Confidence in answer**: HIGH for architectural discussion; not a personal delivery claim.

## Related Architecture & Decisions

- [ADR-01: GitLab OIDC vs Static AWS Credentials](../../../architecture/architecture-decisions/adr-reference-eks-gitlab-oidc-vs-static-credentials.md)
- [Source Reference](../../../knowledge/references/terraform-eks-platform-reference.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
