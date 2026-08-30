# 10 - Security: ShopSphere Analytics Platform

## Evidence Boundary

**Type**: Fictional interview case study.

## Security Principles

- Encrypt all data at rest and in transit.
- Restrict raw PII access by default.
- Use least privilege for jobs, analysts, services, and CI/CD.
- Store secrets in AWS Secrets Manager; never in code, Docker images, or committed Terraform variables.
- Use auditable access paths through IAM, Lake Formation, CloudTrail, and CloudWatch.

## PII Classification

Sensitive fields:

- `email`
- `phone`
- `first_name`
- `last_name`
- `address`

## Access Model

| Persona | Raw/Bronze | Silver | Gold | Notes |
|---------|------------|--------|------|-------|
| Data platform engineer | Controlled break-glass/admin access | Yes | Yes | Audited and least-privilege |
| Data analyst | No raw PII | Masked/controlled views | Yes | Lake Formation grants |
| Finance analyst | No raw PII | Revenue-relevant controlled data | Revenue marts | No customer raw PII by default |
| Data scientist | Approved feature datasets | Controlled access | Feature marts | PII minimized/pseudonymized |
| Auditor | Read-only audit/reconciliation views | Limited | Limited | Time-bound access |

## AWS Security Architecture

| Control | Design |
|---------|--------|
| Encryption at rest | S3 SSE-KMS, Glue/Athena/Redshift encryption, encrypted logs |
| Encryption in transit | TLS for JDBC/API/streaming/S3/Athena access |
| Fine-grained authorization | Lake Formation table/column/row/cell access controls |
| Secrets | AWS Secrets Manager with rotation policy and audit |
| IAM | Job-specific roles, least privilege, no wildcard admin roles |
| Network | Private subnets, VPC endpoints for S3/Glue/Secrets where practical |
| Audit | CloudTrail for data/access events; CloudWatch alarms for suspicious access |
| Masking | Gold views expose masked email/phone unless approved |

## PII Handling

- Raw PII remains in restricted bronze/silver tables only as required.
- Gold analytical views should use masked fields or surrogate customer IDs.
- Customer 360 stores golden customer ID and controlled attributes with masking.
- Data exports require approval and expiry.
- Access reviews run on a scheduled cadence.

## Credential Controls

No credentials in:

- Source code.
- Configuration files committed to Git.
- Docker images.
- Terraform variable files committed to Git.
- Pipeline logs.

## Related Documents

- [11 - Observability](shopsphere-11-observability.md)
- [15 - CI/CD](shopsphere-15-cicd.md)
- [ADR: PII Protection](../../architecture/architecture-decisions/adr-shopsphere-pii-protection-lake-formation.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-30
