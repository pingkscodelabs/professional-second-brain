# Interview Question: GitLab CI Terraform Pipeline for EKS Platform

## Question Metadata

| Field | Value |
|-------|-------|
| Question | How would you design a safe Terraform pipeline for provisioning an EKS platform? |
| Category | DevOps |
| Difficulty | MEDIUM |
| Technology | GitLab CI, Terraform, AWS, EKS |
| Concepts Tested | Pipeline stages, plan/apply separation, automation safety |

## The Question

**Interviewer asks:**

> What stages would you include in a Terraform CI/CD pipeline for an EKS platform, and how would you make it safe?

## Expected Strong Answer

### Short Answer

Use clear stages: `init`, `validate`, `plan`, approval-controlled `apply`, optional ArgoCD application deploy, and `destroy` only for controlled teardown. Store plan artifacts, use OIDC for credentials, and restrict production applies.

### Strong Answer

The reference `.gitlab-ci.yml` defines `init`, `validate`, `plan`, `apply`, `deploy_argocd_app`, and `destroy`. A strong production version would keep `plan` reviewable as an artifact, require approval before `apply`, scope OIDC-assumed credentials to the target stack, and isolate destructive actions behind manual controls. The pipeline should also add formatting, linting, security scans, policy checks, and backend state protection before apply.

### Deep Dive

Discuss plan artifact integrity, environment gates, protected branches, manual approvals, `destroy` restrictions, state backend access, drift detection, and audit evidence.

### Follow-up Questions

- Should `destroy` exist in production pipelines?
- How do you avoid applying a stale plan?
- What checks should block vs warn?
- How do you promote changes between environments?

### Common Mistake

Treating `terraform apply` as a simple automation step without approval, plan review, state safeguards, or environment separation.

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
