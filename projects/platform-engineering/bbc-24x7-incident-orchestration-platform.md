# BBC 24/7 Operations & Incident Orchestration Platform

## 1. Metadata & Confidentiality

| Field | Value |
|-------|-------|
| Case Study Title | Enterprise 24/7 Operations & Incident Orchestration Platform |
| Client / Organisation | British Broadcasting Corporation (BBC) |
| Anonymised Name (if required) | N/A |
| Industry | Public Service Broadcasting, Digital Media & Streaming Services |
| Business Unit | Product & Technology / Design & Engineering / DevX & Tooling Engineering |
| Engagement Period | TBD |
| My Role | Platform Engineer / Solution Architect (DevX & Tooling Lead) |
| Key Stakeholders | Duty Operations Managers (DOM), 24/7 Central Operations, Security Architecture (InfoSec), Capability Product Teams, SRE & Platform Engineering Leads, FinOps |

**Confidentiality Level**: INTERNAL  
**Client Anonymised**: No  
**Sensitive Details Removed**: Yes  
**Safe to Share**: Yes (internal use)

## 2. Executive Summary

Design, implementation, and operationalization of the BBC 24/7 Operations & Incident Orchestration Platform. Operating at global scale — rendering over 1 billion weekly requests across audience-facing presentation layers (WebCore, iPlayer, Account/Identity IDv5) and continuous live broadcast infrastructure — the BBC required an enterprise-grade, automated, and policy-governed out-of-hours support and incident response framework. The solution unifies service readiness pipelines (PIPELINE, SERVICE, SECARC, RBREVIEW, MON), telemetry normalization via the AWS Siren Bridge and Alerta (Tickmon) aggregation engine, and GitOps-driven PagerDuty Infrastructure-as-Code (IaC) powered by Terraform, GitHub Actions, and Harness. A dual-tier dispatch model (Model A: Central Ops Triage vs. Model B: Direct Automated Routing) eliminates alert fatigue, enforces mandatory operational documentation prior to production go-live, and establishes automated auditability across hundreds of engineering squads.

## 3. Business Context, Problem, Goals, Constraints

### Business Context

**Industry/Domain**: Public service broadcasting and digital streaming.  
**Business Unit**: Product & Technology / Design & Engineering / DevX & Tooling Engineering.

### Problem Statement

Prior to standardization, engineering teams independently managed out-of-hours support and monitoring configurations. This fragmented approach introduced severe operational risks:

- **Ungoverned Production Onboarding**: Applications entered production without verified runbooks or active Service Catalogue registrations, leaving 24/7 Operations incapable of triaging incidents out-of-hours.
- **Alert Noise & Notification Fatigue**: Monitoring tools (Datadog, CloudWatch, Zenoss) dispatched un-deduplicated email/SMS notifications directly to engineers, resulting in missed critical outages and high operational burnout.
- **Configuration Drift in On-Call Rotas**: PagerDuty schedules and escalation policies were manually configured via the UI, creating compliance gaps, orphaned schedules, and lack of version control.
- **Isolated Service Metadata**: Ownership and dependency records were siloed across legacy platforms and static docs, hindering real-time impact analysis during Major (M1) and Priority 1 (P1) outages.

### Goals & Success Criteria

| ID | Goal | Success Criteria |
|----|------|-------------------|
| G-01 | Strict Go-Live Guardrails | Enforce 100% compliance on runbook verification (RBREVIEW) and service cataloguing (SERVICE) prior to granting out-of-hours 24/7 support |
| G-02 | GitOps On-Call Governance | Transition 100% of PagerDuty schedules, services, and escalation policies to declarative Terraform code managed via Git pull requests |
| G-03 | Telemetry Normalization | Establish a single pane of glass (Alerta/Zenoss) that deduplicates and correlates raw monitoring events from Datadog, CloudWatch, and Prometheus |
| G-04 | Mean Time to Acknowledge / Resolve | Reduce MTTA for critical incidents to < 5 minutes and MTTR by 40% through actionable, pre-approved runbooks |
| G-05 | Single Source of Truth | Automate metadata synchronization between BBC Treasury and Jira Service Management (JSM) Assets |

### Current State / As-Is

```
[ Datadog / CloudWatch / Zenoss ] ──> Raw Email / Webhook Alerts ──> [ Disparate Slack Channels / Engineer Phones ]
                                                                              │
                                                                              ▼ (Manual, Uncoordinated Response)
[ Unverified Runbooks / Confluence ] ───────────────────────────────> [ Extended Outage & High MTTR ]
```

- **Monitoring**: Fragmented across Datadog, AWS CloudWatch, Zenoss, Prometheus, and CheckMK with no unified deduplication layer.
- **Escalation**: Ad-hoc PagerDuty schedules maintained manually via console; uncoordinated email alerts sent to Slack (`dev-owned-media-alarms`).
- **Governance**: Runbooks lacked standard structure and were rarely reviewed by central operations before launch.
- **Service Catalogue**: Manual Treasury records with no automated link to operational Jira tickets (OPS).

### Challenges & Constraints

- **High Request Scale**: Systems like WebCore render ~1 billion weekly requests; presentation layer failures immediately impact millions of live viewers.
- **Licensing Limitations**: PagerDuty user licenses are constrained; coverage must balance full on-call rotas against license costs.
- **Heterogeneous Tech Stack**: Support needed across AWS Lambda, ECS, EC2, CloudFormation, Terraform, and legacy on-premise broadcast control systems (MCR/CCM).
- **Multi-Account AWS Governance**: Systems span separate AWS accounts (`webcore-sre-prod`, `webcore-sre-dev`, `webcore-automation-test`) requiring strict OIDC-based identity controls.

## 4. Requirements

### Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | System must enforce mandatory review (RBREVIEW) of runbooks by 24/7 Operations before enabling out-of-hours callouts |
| FR-02 | Telemetry layer must aggregate, deduplicate, and correlate alerts before notifying PagerDuty or Alerta |
| FR-03 | PagerDuty configurations must be managed via code in GitHub, requiring Code Owner approvals for changes |
| FR-04 | Treasury service metadata must automatically synchronize to JSM Assets schema using `treasury:{treasuryId}` keys |
| FR-05 | PagerDuty alerts must automatically reference and display the corresponding Jira OPS ticket ID |

### Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | (Availability) Alerting and escalation pipeline must maintain 99.99% uptime independent of regional cloud outages |
| NFR-02 | (Latency) End-to-end alert ingestion (metric threshold breach to PagerDuty notification) must execute in < 15 seconds |
| NFR-03 | (Security) Zero long-lived IAM keys in GitHub repositories; authentication must use AWS OIDC role assumption |
| NFR-04 | (Auditability) Every change to on-call schedules, escalation policies, and runbooks must leave an immutable Git commit log |

### Assumptions & Dependencies

**Assumptions**:
- Engineering teams maintain active Code Owner files in their respective team directories within the central infrastructure repository.

**Dependencies**:
- Atlassian Jira Cloud & JSM Assets (Service Catalogue single source of truth)
- AWS Siren Bridge (middleware transforming CloudWatch/Datadog metrics to BBC event formats)
- PagerDuty Enterprise API & BBC Enterprise Single Sign-On (SSO)
- GitHub Actions & Harness Sandbox/Prod environments for CI/CD pipeline execution

## 5. Proposed Solution & Architecture

### Solution Overview

The solution establishes a closed-loop Production Readiness and Incident Orchestration Engine that gates production go-live on runbook and service-catalogue verification, normalizes telemetry through an AWS-native middleware layer, and dispatches incidents through a GitOps-managed PagerDuty layer with tiered routing.

### Architecture Diagram

```
+---------------------------------------+
|      Production Readiness Gate        |
|  PIPELINE -> SERVICE -> SECARC ->     |
|           RBREVIEW + MON              |
+-------------------+-------------------+
                     |
                     v
+-----------------------+       +---------------------------------------+       +-----------------------+
|  Observability Stack  |       |       AWS Siren Bridge Middleware     |       |   Central Dashboards  |
| Datadog / CloudWatch  | ----> |  - Aggregation    - Deduplication    | ----> |   Alerta / Tickmon    |
| Prometheus / CheckMK  |       |  - Correlation    - Suppression      |       |  (24/7 Central Ops)   |
+-----------------------+       +-------------------+-------------------+       +-----------+-----------+
                                                     |                                       v
                                                     v                                 
                                +---------------------------------------+       +-----------------------+
                                |      PagerDuty Orchestration Engine   |       |  Model A: Central Ops |
                                |  (Managed via GitOps / Terraform /    | <---> |  Model B: Direct Rota |
                                |   Harness & GitHub CI/CD)             |       +-----------+-----------+
                                +-------------------+-------------------+                   |
                                                     |                                       v
                                                     v                           
                                +-----------------------+                                 +---------------------------------------+
                                |   Jira Incident Hub   |                                 |       JSM Assets Synchronization      | <---> | (OPS Tickets, PIRs,
                                |  Problem Review Board)|                                 |    (Treasury -> JSM Assets API)       |
                                +-----------------------+                                 +---------------------------------------+
```

### Architecture Component Breakdown

| Component | Responsibility |
|-----------|-----------------|
| Production Readiness Pipeline (PIPELINE) | Jira workflow linking SERVICE registration, SECARC security review, RBREVIEW runbook verification, and MON monitoring setup |
| Telemetry Ingestion Layer (AWS Siren Bridge) | AWS-native middleware receiving raw metric events via webhooks, standardizing payloads into JSON schemas, deduplicating, and routing downstream |
| Visualization & Triage Engine (Alerta / Tickmon) | Displays real-time operational status to 24/7 Central Operations and Duty Operations Managers |
| Incident Dispatch (PagerDuty IaC) | Declarative PagerDuty resource management using Terraform modules, structured by team folders, deployed via GitHub Actions and Harness pipelines |
| Asset Synchronization Engine | Serverless AWS Lambda/CodeBuild pipeline listening to Treasury Git merges and invoking the Atlassian Assets JSON Import API to maintain JSM Assets records |

### Technology Selection

| Component | Technology Chosen | Alternatives Evaluated | Selection Rationale |
|-----------|--------------------|--------------------------|-----------------------|
| IaC Orchestration | Terraform + Harness / GitHub Actions | AWS CloudFormation, Pulumi | Native PagerDuty provider maturity, multi-cloud flexibility, reusable module ecosystem |
| Telemetry Ingestion | AWS Siren Bridge + Alerta | Raw Datadog → PagerDuty webhooks | Custom deduplication rules, centralized cross-platform correlation, single pane of glass for 24/7 Ops |
| Service Catalogue | BBC Treasury + JSM Assets | ServiceNow, Backstage | Integrated natively into Jira workflow (OPS tickets), enabling instant incident context |
| CI/CD Execution | Harness Sandbox/Prod + GitHub Actions | AWS CodePipeline / CodeBuild | Modern pipeline scorecards, policy-as-code (Rego), enterprise RBAC, and pipeline standardization |

### Detailed Design

**PagerDuty HCL Module Structure** — each team maintains a directory under `teams/` in the infrastructure repository:

```hcl
# teams/devx-tooling/pagerduty.tf
module "devx_pagerduty_service" {
  source = "../../modules/pagerduty-service"

  service_name        = "DevX-CodeArtifact-Sync"
  service_description = "Managed package distribution & CodeArtifact sync pipeline"
  escalation_policy_id = pvd_escalation_policy.devx_ep.id
  alert_creation       = "create_incidents"

  incident_urgency_rule {
    type    = "use_support_hours"
    during_support_hours {
      type    = "constant"
      urgency = "high"
    }
    outside_support_hours {
      type    = "constant"
      urgency = "low"
    }
  }
}

resource "pvd_escalation_policy" "devx_ep" {
  name      = "DevX Support Escalation Policy"
  num_loops = 2

  rule {
    escalation_delay_in_minutes = 15
    target {
      type = "schedule_reference"
      id   = pvd_schedule.devx_primary_schedule.id
    }
  }

  rule {
    escalation_delay_in_minutes = 30
    target {
      type = "schedule_reference"
      id   = pvd_schedule.devx_secondary_schedule.id
    }
  }
}
```

**JSM Assets Synchronization Payload** — the Treasury-to-Assets synchronization formats metadata into JSON payloads using the Atlassian Assets JSON Import API:

```json
{
  "objects": [
    {
      "externalId": "treasury:ts-devx-codeartifact-01",
      "name": "DevX CodeArtifact Synchronization Service",
      "objectTypeId": "201",
      "attributes": [
        { "objectTypeAttributeId": "1001", "objectAttributeValues": [{ "value": "DevX & Tooling Engineering" }] },
        { "objectTypeAttributeId": "1002", "objectAttributeValues": [{ "value": "Production" }] },
        { "objectTypeAttributeId": "1003", "objectAttributeValues": [{ "value": "Tier-2" }] },
        { "objectTypeAttributeId": "1004", "objectAttributeValues": [{ "value": "https://bbc.atlassian.net/wiki/spaces/dg/pages/769755951" }] }
      ]
    }
  ]
}
```

## 6. ADR References & Trade-offs

### Architecture Decisions

| ID | Title | Status | Link |
|----|-------|--------|------|
| ADR-01 | Terraform GitOps vs. PagerDuty Web Console for Rota Management | ACCEPTED | [ADR-01](../../architecture/architecture-decisions/adr-bbc-24x7-terraform-gitops-oncall.md) |
| ADR-02 | Dual Dispatch Architecture (Model A vs. Model B) | ACCEPTED | [ADR-02](../../architecture/architecture-decisions/adr-bbc-24x7-dual-dispatch-model.md) |

### Design Trade-offs

| Trade-off | Rationale |
|-----------|-----------|
| Go-Live Velocity vs. Governance Rigor | Requiring mandatory `RBREVIEW` runbook sign-off adds a 3-to-5 day gate prior to go-live, preventing 24/7 Operations from receiving unsupportable systems out-of-hours and reducing prolonged MTTR |
| Full 24/7 Rotas vs. Graceful Service Degradation | Business-hours support + kill switches for non-audience-facing services instead of full 24/7 engineering rotas saves PagerDuty licensing and on-call compensation costs while downstream platforms (e.g., iPlayer) degrade gracefully |

### Failed Approaches

- **Centralized Monolithic PagerDuty Terraform Repository**: Tried to simplify initial pipeline setup and code reusability. Failed due to blown-out `terraform plan` execution times (>10 min) and high blast radius, where a syntax error in one team's config blocked deployments for another team. Corrected by shifting to a modular GitOps structure where each team owns an isolated directory and independent state file executed via Harness (see [Terraform State Lock Deadlock Resolution](../../interview/star-stories/bbc-24x7-terraform-state-lock-resolution.md)).

## 7. Security, Reliability, Scalability, Observability, FinOps

### Security Design

- **OIDC Federated Authentication**: GitHub Actions and Harness execute Terraform deployments assuming short-lived AWS IAM roles via OpenID Connect (OIDC). Zero static AWS access keys are stored in repositories.
- **Secrets Management**: Sensitive integration keys (PagerDuty API tokens, Atlassian Personal Access Tokens) are stored in AWS Secrets Manager, with CloudWatch alarms (`EVENTS-56`) triggering Slack alerts whenever secrets are accessed.
- **Access Control & RBAC**: PagerDuty SSO is bound to BBC Enterprise Login. Repository changes require PR reviews enforced by GitHub Code Owners.
- **Data Protection**: All remote Terraform state files stored in S3 are encrypted at rest using AWS KMS (`aws:kms`) with S3 bucket key logging and object versioning enabled.

### Scalability & Reliability

- **Stateless Event Processing**: AWS Siren Bridge operates as stateless AWS Lambda functions behind Amazon API Gateway, scaling horizontally during major high-traffic incidents (e.g., breaking news or major sporting events).
- **State Partitioning**: Terraform state files are partitioned per team and environment (`s3://bbc-pagerduty-tf-state/teams/devx-tooling/terraform.tfstate`), eliminating global state locks and limiting blast radius.
- **Fallback Mechanisms**: In the event of downstream PagerDuty API throttling, Siren Bridge queues events in Amazon SQS dead-letter queues (DLQ) with exponential backoff retries.

### Networking

- **Ingress Edge**: Public webhooks from Datadog and external SaaS monitors enter via AWS WAF and API Gateway with IP rate limiting and signature validation.
- **Private VPC Endpoint Routing**: Internal microservices (e.g., WebCore Lambda inside AWS VPCs) dispatch monitoring metrics through private VPC Interface Endpoints (`com.amazonaws.region.monitoring`) to prevent telemetry traffic from traversing the public internet.

### Observability

- **Platform Metrics**: Datadog dashboards track event processing latency, Siren Bridge Lambda error rates, SQS DLQ depth, and PagerDuty API response codes.
- **SLOs**: Alert Delivery Latency — >99% of alerts delivered to PagerDuty in <10 seconds; Rota Coverage — 100% time coverage with zero schedule gaps across active production services.
- **Audit Alarms**: Alarms on unauthorized IAM role assumptions or AWS Secrets Manager access attempts notify Slack (`#devx-sec-alarms`) and Jira OPS.

### Disaster Recovery

- **RTO**: < 15 minutes for complete PagerDuty state reconstruction.
- **RPO**: 0 minutes (all configuration exists in Git).
- **DR Execution**: If a PagerDuty region or S3 state bucket is corrupted, re-run the Harness deployment pipeline from the main Git branch; Terraform reconciles remote state and re-creates missing schedules, escalation policies, and service integrations automatically. Secondary communication channels (`#operations` Slack and phone trees) act as manual fallback.

### Cost / FinOps

- **Seat Recovery & Optimization**: Automated reclamation of inactive PagerDuty licenses for engineers off rota for > 60 days; tiered access model restricts full licenses to active on-call responders, with stakeholders using free read-only seats or Alerta views; "Kill Switches" for non-audience-facing tools replace 24/7 paid rotas with graceful degradation and business-hours support. See [PagerDuty License Cost Optimization](../../evidence/achievements/bbc-24x7-pagerduty-license-optimization.md).

## 8. Delivery Model

### Implementation Approach / Phases

| Phase | Scope |
|-------|-------|
| Phase 1 (Foundation & Standardization) | Defined HCL modules for PagerDuty, set up GitHub OIDC integration, established the Jira PIPELINE/RBREVIEW readiness workflow |
| Phase 2 (Telemetry & Siren Bridge) | Deployed AWS Siren Bridge Lambda middleware, integrated Datadog/CloudWatch streams, configured Alerta dashboards for Central Ops |
| Phase 3 (Pilot Squad Onboarding) | Onboarded flagship capability squads (WebCore, Account Squad 9) to GitOps PagerDuty management and tested Model A / Model B routing |
| Phase 4 (Enterprise Migration & Harness Integration) | Migrated PagerDuty pipelines to Harness sandbox/prod (`DEXT-379`), automated Treasury-to-Assets synchronization (`DEXT-356`), enforced global readiness gates |

### Migration Strategy

Migrating live, legacy PagerDuty services to Terraform IaC without dropping critical alerts required a zero-downtime Import & Reconcile approach:

```
[ Existing PagerDuty Resource ]
                │
                ▼
[ terraform import pvd_service.name <SERVICE_ID> ]
                │
                ▼
[ Generate Matching HCL Module Definition ]
                │
                ▼
[ Run terraform plan -> Verify 0 Changes / Diffs ]
                │
                ▼
[ Commit to Git & Lock UI Editing Permissions ]
```

### Rollout Strategy

- **Phased Squad Wave Rollout**: Grouped squads by criticality (Tier 1 core presentation → Tier 2 capabilities → Tier 3 internal tooling).
- **Dark Launch & Parallel Run**: New Siren Bridge alert routing ran in parallel with legacy email alerts for 2 weeks per squad to validate alert delivery accuracy.
- **Freeze Windows**: Freeze on-call schedule updates during major broadcasting events (e.g., General Elections, World Cup) unless approved by the Duty Operations Manager.

### Testing Strategy

- **Unit & Lint Testing**: `tflint` and `tfsec` static analysis checks executed on every Git pull request.
- **Dry-Run Validation**: Dry-run tests (`DEXT-360`) executed using dedicated test repositories to validate GitHub App integrations, workflow triggers, and secrets handling.
- **Simulated Chaos & Game Day Drills**: Periodic synthetic alarm injections (e.g., triggering a simulated P1 database latency breach in non-prod) to test PagerDuty escalation timeouts, Siren Bridge routing, and engineer callout workflows.

### Operational Model

```
+---------------------------------------+
|          Production Alert             |
+-------------------+-------------------+
                     |
                     v
+---------------------------------------+
|      Alerta / Siren Deduplication     |
+-------------------+-------------------+
                     |
      +---------------+---------------+
      |                               |
      v                               v
[ Model A: Central Ops ]        [ Model B: Direct ]
Central Ops Triage via          Direct PagerDuty Call
Approved Runbook                to 3rd-Line Rota
      |                               |
      +---------------+---------------+
                     |
                     v
+---------------------------------------+
|        Jira OPS Ticket Logged         |
|    (Acknowledge / Mitigate Issue)     |
+-------------------+-------------------+
                     |
                     v
+---------------------------------------+
|   Post Incident Review (PIR / PRB)    |
+---------------------------------------+
```

### CI/CD & Automation

Harness and GitHub Actions deliver PagerDuty IaC continuously:

```yaml
# .github/workflows/pagerduty-pipeline.yml
name: PagerDuty IaC Pipeline

on:
  pull_request:
    paths:
      - 'teams/**'
  push:
    branches:
      - main
    paths:
      - 'teams/**'

jobs:
  terraform-plan:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - name: Terraform Init & Plan
        run: |
          terraform init
          terraform plan -no-color -out=tfplan
      - name: Post PR Comment
        uses: actions/github-script@v7
        with:
          script: |
            // Posts formatted terraform plan directly into PR for Code Owner review

  terraform-apply:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - name: Terraform Apply
        run: |
          terraform init
          terraform apply -auto-approve
```

Policy-as-Code checks (Rego in Harness, `DEXT-380`) evaluate scorecards on pipeline execution to verify that observability and runbook metadata exist prior to deployment.

### Problems Encountered

1. **Problem**: Schedule Contention & State Lock Deadlocks
   - Symptom: Multiple engineers submitting PRs simultaneously resulted in S3 Terraform state lock errors (`ConditionalCheckFailedException`)
   - Root cause: All team schedules resided in a single, monolithic Terraform state file
   - Resolution: Re-architected state boundaries by isolating each team folder into its own S3 key space (`/teams/{squad-name}/terraform.tfstate`) — see [full story](../../interview/star-stories/bbc-24x7-terraform-state-lock-resolution.md)

2. **Problem**: PagerDuty High Email Volume & Alert Fatigue
   - Symptom: Services like Owned Media generated hundreds of un-deduplicated PagerDuty email notifications in Slack (`dev-owned-media-alarms`)
   - Root cause: Raw CloudWatch metrics bypassing the Siren Bridge deduplication layer
   - Resolution: Re-routed monitoring hooks through Siren Bridge, suppressed non-actionable alarms, and introduced a business-hours support model with an emergency "Kill Switch" for non-critical services

## 9. Outcomes & KPIs (Before/After)

### Business Impact

- **Audience Experience Protection**: Zero unhandled out-of-hours outages across flagship platforms during major live events.
- **Operational Risk Reduction**: 100% of production services covered by verified, pre-approved runbooks before receiving out-of-hours support.
- **Governance Compliance**: Complete audit trail of all on-call schedule modifications, satisfying internal InfoSec and regulatory standards.

### Technical Impact

- **MTTR Reduction**: Mean Time To Resolve reduced by 42% across Tier-1 digital services due to pre-tested runbooks and automated PagerDuty routing.
- **Alert Noise Reduction**: Alarm deduplication via Siren Bridge reduced non-actionable operational alerts by 68%.
- **Zero Infrastructure Drift**: All PagerDuty escalations, services, and schedules locked to declarative Git state.

### Automation & Productivity Impact

- **On-Call Schedule Provisioning**: Reduced from 3 days (manual tickets) to < 10 minutes (PR merge via Harness/GitHub Actions).
- **Automated Asset Sync**: Automated 100% of Treasury service metadata updates to JSM Assets, saving estimated hundreds of manual maintenance hours annually across squads.

### Cost Impact

- **PagerDuty License Savings**: Reclaimed 22% of unutilized PagerDuty user licenses via automated inactivity sweeps and read-only tier migrations.
- **Operational Cost Avoidance**: Adopted business-hours + kill-switch models for non-critical services, avoiding unnecessary out-of-hours on-call rota costs.

### Security / Compliance Impact

- **Secret Access Elimination**: Removed long-lived AWS credentials from GitHub using OIDC IAM role federations.
- **Automated Secret Auditing**: Real-time Slack and Jira alerts (`EVENTS-56`) for any AWS Secrets Manager access event.
- **Full Change Auditability**: Every shift swap, schedule adjustment, and escalation override is traceable to a specific Git PR author and approver.

### Metrics & KPIs

| Metric | Before Solution | After Solution | Target / Improvement |
|--------|-----------------|------------------|-------------------------|
| MTTA (Mean Time to Ack) | 18 minutes | 2.5 minutes | < 5 mins (-86%) |
| MTTR (Mean Time to Resolve) | 74 minutes | 43 minutes | < 45 mins (-42%) |
| Unverified Services in Prod | ~35% | 0% (Blocked by RBREVIEW) | 0% |
| Manual Rota Config Time | 2-3 days | < 10 minutes | < 15 mins |
| Non-Actionable Alert Volume | High (~1,200/wk) | Low (~380/wk) | -68% reduction |

### Before vs After

```
BEFORE:
[ Raw Alarms ] ──> [ Direct Email Flood ] ──> [ PagerDuty UI (Manual Editing) ]
                                                          │
                                                          ▼ (Outdated Runbooks)
                                            [ Delayed Triage & Extended MTTR ]

AFTER:
[ Raw Alarms ] ──> [ Siren Bridge & Alerta ] ──> [ Terraform / GitOps (Harness Pipeline) ]
                                                          │
                                                          ▼ (Mandatory RBREVIEW Runbooks)
                                    [ Rapid Triage, Model A/B Dispatch & Fast MTTR ]
```

## 10. Interview & Review Q&A

### Technical Q&A

**Q1**: How does the solution handle alert deduplication across multiple monitoring tools?  
**Answer**: Datadog, CloudWatch, and Prometheus send alert payloads to the AWS Siren Bridge. Siren Bridge extracts key fingerprint fields (`environment`, `service_id`, `component`, `alert_name`) and calculates an MD5 hash. If an alert with the same hash exists within a 15-minute sliding window, Siren increments an event counter in Alerta rather than triggering a new PagerDuty incident, preventing alert storms.

**Q2**: What happens if an on-call engineer fails to acknowledge a PagerDuty callout?  
**Answer**: PagerDuty escalation policies define multi-level fallback targets. If the primary on-call engineer does not acknowledge within 15 minutes, PagerDuty automatically triggers a phone call to the secondary on-call engineer. If unacknowledged after another 15 minutes, it escalates to the Engineering Team Lead and Duty Operations Manager (DOM).

### Architecture Review Questions

**Q1**: Why use both Alerta and PagerDuty instead of relying solely on PagerDuty?  
**Answer**: PagerDuty is optimized for incident dispatch and escalation to specific individuals, whereas Alerta (Tickmon) provides a continuous, multi-tenant visual dashboard for 24/7 Central Operations. Using Alerta as a telemetry buffer prevents high-volume background noise from consuming PagerDuty API rate limits and paid user licenses, allowing Central Ops to triage non-critical issues visually without paging engineers unnecessarily.

**Q2**: How is configuration state protected if a GitHub Actions runner is compromised?  
**Answer**: GitHub Actions runners do not possess permanent AWS credentials. They authenticate to AWS using OIDC tokens short-lived for the duration of the job step. IAM policies restrict the runner's permissions strictly to the team's specific S3 state path and PagerDuty API scope, limiting blast radius.

### Client Questions

**Q1**: How do we ensure our squad's service gets 24/7 out-of-hours support before our launch date?  
**Answer**: You must initiate a Jira `PIPELINE` ticket at least two weeks prior to go-live. This automatically generates the `SERVICE` catalogue ticket, `SECARC` security check, and `RBREVIEW`/`MON` tickets. Once your runbook is reviewed and approved by 24/7 Operations via `RBREVIEW`, your service is cleared for out-of-hours coverage.

### Objections & Responses

**Objection**: "Managing PagerDuty via Terraform code slows down shift swaps and holiday overrides."  
**Response**: Standard shift overrides (e.g., swapping a night for sickness) do not require code changes and can still be performed directly in the PagerDuty UI/Mobile App via the "Override" feature. Terraform GitOps is used to manage baseline schedules, escalation rules, and service integrations, combining day-to-day agility with structural governance.

### Troubleshooting Scenarios

**Scenario**: PagerDuty alert is firing, but no Jira `OPS` ticket is created.  
**Steps**:
1. Check AWS Siren Bridge API Gateway logs in CloudWatch for 4xx/5xx HTTP errors during webhook ingestion.
2. Verify that the incoming alert payload contains a valid `service_id` matching a registered `SERVICE` ticket.
3. Inspect the Jira Service Management webhook endpoint state and verify that Atlassian OAuth credentials stored in AWS Secrets Manager have not expired (`EVENTS-56` alarm).

## 11. Reusable Patterns & Roadmap

### Reusable Patterns

- **Pattern 1 (GitOps On-Call Rota Module)**: Standardized Terraform HCL module structure for team onboarding, published to internal DevX registry.
- **Pattern 2 (Treasury → JSM Assets Sync Pattern)**: Serverless event-driven architecture using JSON Import API and `treasury:{id}` external keys for two-system metadata reconciliation.
- **Pattern 3 (Model A/B Dispatch Routing)**: Operational decision matrix for decoupling central triage from high-priority direct automated paging.

### Future Improvements

- **Automated Runbook Execution (AIOps)**: Integrate PagerDuty Process Automation (Rundeck) to execute automated self-healing scripts (e.g., clearing caches, restarting stuck ECS tasks) upon alert breach before paging engineers.
- **AI-Assisted Incident Summarization**: Utilize Rovo / AI agents to automatically generate initial incident summaries on Jira `OPS` tickets by aggregating recent Slack threads, CloudWatch log streams, and GitHub deployment diffs.

### Roadmap

| Phase | Item |
|-------|------|
| Current (Q3 2026) | Complete Harness Sandbox-to-Prod Pipeline Migration (`DEXT-409`); Complete Treasury → JSM Assets Sync Rollout (`DEXT-356`) |
| Target (Q4 2026) | Expand Policy-as-Code Scorecards (Rego) across all pipelines (`DEXT-380`); Roll out Apache DevLake operational dashboards for engineering visibility (`DEXT-304`) |
| Future (H1 2027) | Implement automated self-healing remediation via PagerDuty Event Orchestration |

### Lessons Learned

1. **Runbooks Must Be Written for Non-Experts**: 24/7 Operations engineers handle hundreds of products; runbooks must give explicit step-by-step diagnostic and mitigation actions rather than abstract architecture notes.
2. **Automate Metadata Early**: Manually typing service dependencies into incident tickets leads to errors during high-stress outages. Automating Treasury → JSM Assets synchronization ensured instant context during P1 calls.
3. **Policy-as-Code is Essential for Pipeline Adoption**: Using Harness scorecards (Rego) allowed warning-only modes before hard-blocking deployments, driving smooth developer adoption.

## 12. Evidence & Cross-Links

### Related Client File

- [BBC](../../clients/bbc.md)

### Related ADRs

- [ADR-01: Terraform GitOps vs. PagerDuty Web Console](../../architecture/architecture-decisions/adr-bbc-24x7-terraform-gitops-oncall.md)
- [ADR-02: Dual Dispatch Architecture](../../architecture/architecture-decisions/adr-bbc-24x7-dual-dispatch-model.md)

### Related Achievements

- [MTTA/MTTR & Alert Noise Reduction](../../evidence/achievements/bbc-24x7-mttr-alert-noise-reduction.md)
- [PagerDuty License Cost Optimization](../../evidence/achievements/bbc-24x7-pagerduty-license-optimization.md)

### Related STAR Stories

- [Terraform State Lock Deadlock Resolution](../../interview/star-stories/bbc-24x7-terraform-state-lock-resolution.md)
- [GitOps On-Call Governance Adoption](../../interview/star-stories/bbc-24x7-gitops-oncall-governance-leadership.md)

### Related Skills / Technologies

- [Skills matrix](../../metadata/skills.yml)
- [Technologies](../../metadata/technologies.yml)

## Change Log

| Date | Change |
|------|--------|
| 2026-08-29 | Initial creation from BBC solution case study & technical knowledge pack |

---

**Status**: In Progress  
**Last Updated**: 2026-08-29  
**Review Date**: TBD  
