# Interview Question: Troubleshooting a PagerDuty Alert With No Jira OPS Ticket Created

## Question Metadata

| Field | Value |
|-------|-------|
| Question | A PagerDuty alert is firing, but no Jira OPS ticket is created — how do you troubleshoot it? |
| Category | DevOps |
| Difficulty | MEDIUM |
| Technology | AWS API Gateway, CloudWatch, Jira Service Management, AWS Secrets Manager |
| Concepts Tested | Systematic incident-pipeline troubleshooting, layered diagnosis |

## The Question

**Interviewer asks:**

> A PagerDuty alert is firing, but no corresponding Jira `OPS` ticket is created. How would you troubleshoot this?

## What This Question Tests

### Concepts Being Evaluated

- Systematic, layered troubleshooting rather than guessing (deep)
- Familiarity with the full alert-to-ticket pipeline (deep)

### Expected Knowledge Areas

- AWS API Gateway/CloudWatch log inspection
- Service ID / Service Catalogue matching
- OAuth/credential expiry as a silent failure mode

## Expected Strong Answer

### Answer Structure

**Main Answer** (in order):
1. Check AWS Siren Bridge API Gateway logs in CloudWatch for 4xx/5xx HTTP errors during webhook ingestion.
2. Verify the incoming alert payload contains a valid `service_id` matching a registered `SERVICE` ticket — if the service was never onboarded through the readiness pipeline, there is nothing to link the ticket to.
3. Inspect the Jira Service Management webhook endpoint state and verify Atlassian OAuth credentials stored in AWS Secrets Manager have not expired (watch for the `EVENTS-56` alarm, which specifically flags Secrets Manager access/expiry issues).

### Strong Answer Example

> I'd work top-down through the pipeline. First, check the Siren Bridge API Gateway logs in CloudWatch for 4xx/5xx errors on webhook ingestion — that tells me if the event even made it into our system. Next, I'd verify the alert payload's `service_id` actually matches a registered `SERVICE` catalogue entry; if the service was never through the readiness pipeline, there's no valid mapping to create a ticket against. Finally, I'd check whether the Jira Service Management OAuth credentials in Secrets Manager have expired — that's a known failure mode we specifically alarm on via `EVENTS-56`.

This answer demonstrates:
- A clear, ordered diagnostic path from ingestion → data validity → downstream auth
- Familiarity with the specific alarms/tooling in place, not generic troubleshooting advice

## Your Real Experience

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Experience Level

**Your actual experience**: ADVANCED  
**Confidence in answer**: HIGH

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
