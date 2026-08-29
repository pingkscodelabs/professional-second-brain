# Client: BBC (British Broadcasting Corporation)

## Client Overview

| Field | Value |
|-------|-------|
| Client Name | BBC (British Broadcasting Corporation) |
| Industry | Public Service Broadcasting, Digital Media & Streaming Services |
| Region | United Kingdom |
| Company Size | Enterprise (hundreds of engineering squads) |
| Engagement Period | TBD |

## Engagement Context

### Business Context

**Industry Focus**: Public service broadcasting and digital streaming (WebCore, iPlayer, Account/Identity IDv5) plus continuous live broadcast infrastructure.  
**Business Problems**: Fragmented, ungoverned out-of-hours support and monitoring configuration across engineering teams, causing missed outages, alert fatigue, and configuration drift.  
**Technology Maturity**: Heterogeneous stack (AWS Lambda, ECS, EC2, CloudFormation, Terraform) alongside legacy on-premise broadcast control systems (MCR/CCM); multi-account AWS estate (`webcore-sre-prod`, `webcore-sre-dev`, `webcore-automation-test`).

### Your Role

**Title/Position**: Platform Engineer / Solution Architect (DevX & Tooling Lead)  
**Key Stakeholders**: Duty Operations Managers (DOM), 24/7 Central Operations, Security Architecture (InfoSec), Capability Product Teams, SRE & Platform Engineering Leads, FinOps.

## Major Projects

### Project 1: BBC 24/7 Operations & Incident Orchestration Platform

- **Outcome**: MTTA reduced 86% (18min → 2.5min), MTTR reduced 42% (74min → 43min), non-actionable alerts reduced 68%, 100% of production services covered by verified runbooks before out-of-hours support.
- **Link**: [Project documentation](../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

## Business Outcomes

### Operational Impact

- Zero unhandled out-of-hours outages across flagship platforms during major live events.
- Complete audit trail of all on-call schedule modifications, satisfying InfoSec and regulatory standards.

## Technical Outcomes

### Infrastructure Improvements

- GitOps-managed PagerDuty on-call rotas (Terraform, GitHub Actions, Harness) replacing manual UI configuration.
- AWS Siren Bridge telemetry deduplication layer unifying Datadog, CloudWatch, and Prometheus alert sources.

## Evidence & Impact

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Related Achievements

- [MTTA/MTTR & Alert Noise Reduction](../evidence/achievements/bbc-24x7-mttr-alert-noise-reduction.md)
- [PagerDuty License Cost Optimization](../evidence/achievements/bbc-24x7-pagerduty-license-optimization.md)

### STAR Stories

- [Terraform State Lock Deadlock Resolution](../interview/star-stories/bbc-24x7-terraform-state-lock-resolution.md)
- [GitOps On-Call Governance Adoption](../interview/star-stories/bbc-24x7-gitops-oncall-governance-leadership.md)

### Interview Questions

- [Alert Deduplication via Siren Bridge](../interview/questions/platform-engineering/bbc-24x7-alert-deduplication-siren-bridge.md)
- [PagerDuty Escalation Fallback](../interview/questions/platform-engineering/bbc-24x7-pagerduty-escalation-fallback.md)
- [Alerta vs. PagerDuty Dual Tooling](../interview/questions/architecture/bbc-24x7-alerta-vs-pagerduty-dual-tooling.md)
- [OIDC Compromised Runner Blast Radius](../interview/questions/devsecops/bbc-24x7-oidc-compromised-runner-blast-radius.md)
- [Production Readiness Onboarding](../interview/questions/platform-engineering/bbc-24x7-production-readiness-onboarding.md)
- [Troubleshooting Missing OPS Ticket](../interview/questions/devops/bbc-24x7-troubleshooting-missing-ops-ticket.md)
- [GitOps Governance Objection Handling](../interview/questions/leadership/bbc-24x7-gitops-governance-objection-handling.md)

## Confidentiality

**Confidentiality Level**: INTERNAL  
**Client Anonymised**: No  
**Sensitive Details Removed**: Yes (internal identifiers such as JIRA project keys and internal URLs kept generic where not essential)  
**Proprietary Information Excluded**: Yes  

---

**Status**: In Progress  
**Last Updated**: 2026-08-29  
**Review Date**: TBD  
