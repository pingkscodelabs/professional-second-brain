# Interview Question: OIDC and Least Privilege for Platform Automation

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How would you avoid long-lived credentials in enterprise platform automation? |
| Category | DevSecOps |
| Difficulty | HARD |
| Technology | GitHub Actions, AWS OIDC, IAM, Kubernetes workload identity |
| Concepts Tested | Identity federation, blast-radius control, CI/CD security |

## The Question

**Interviewer asks:**

> How would you design CI/CD and workload identity so the platform does not rely on long-lived cloud credentials?

## Expected Strong Answer

### Short Answer

> I would use OIDC federation for CI/CD and workload identity for applications, with IAM roles scoped by repository, workflow, branch/environment, account, and capability. No static AWS keys should be stored in GitHub or application repos.

### Strong Answer

> GitHub Actions should exchange an OIDC token for a short-lived AWS role scoped to the exact repo/workflow/environment. The IAM trust policy should avoid broad wildcards and should enforce conditions such as repository, branch, environment, and audience. Workloads running on EKS should use service-account-based workload identity, with each workload role limited to only the resources it needs. Secrets should live in AWS Secrets Manager or an approved enterprise vault, accessed through those short-lived identities. Break-glass access should be separate, time-bound, logged, and reviewed.

### Deep Dive

Discuss trust policies, permission boundaries, separation of duties, fork PR security, environment approvals, audit logs, secret scanning, and prevention of secrets in Terraform state/logs.

### Follow-up Questions

- What happens if the GitHub runner is compromised?
- How do you scope OIDC roles safely?
- How do you handle emergency access?

### Common Mistake

Replacing long-lived keys with OIDC but leaving the assumed role overly broad, which preserves a large blast radius.

## Your Real Experience

### Related Projects

- [Vodafone Fleet Platform Engineering](../../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

### Related ADRs

- [ADR-08: OIDC vs Static Credentials](../../../architecture/architecture-decisions/adr-vodafone-fleet-oidc-vs-static-credentials.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
