# STAR Story: Resolving Terraform State Lock Deadlocks Across BBC Engineering Squads

## Story Metadata

| Field | Value |
|-------|-------|
| Story Title | Resolving Terraform State Lock Deadlocks in a Monolithic PagerDuty GitOps Repository |
| Story Type | Technical Challenge / Failure Recovery |
| Key Skill | Terraform state design, GitOps architecture, incident diagnosis |
| Industry/Client | BBC |

## The Story

### Situation

**Context**: BBC had migrated PagerDuty on-call schedules, escalation policies, and service integrations to a centralized, monolithic Terraform state file managed via GitOps, covering roughly 80 engineering squads.

**What was happening**: Multiple engineers submitting pull requests simultaneously began hitting S3 Terraform state lock errors (`ConditionalCheckFailedException`), because all team schedules resided in a single, shared state file. This also meant a `terraform plan` could take over 10 minutes, and a syntax error in one team's configuration could block deployments for unrelated teams.

### Task

**Your responsibility**: As the Platform Engineer / Solution Architect leading the DevX & Tooling GitOps rollout, I needed to eliminate state contention and blast-radius risk without disrupting the teams that had already onboarded onto the new Terraform-managed rota system.

**The challenge**: Re-architect the state boundaries without breaking existing PagerDuty resources or forcing a risky full re-import across all squads at once.

### Action

**Step 1**: Diagnosed the root cause as a single monolithic Terraform state file shared across all team folders, causing both lock contention and a wide blast radius for unrelated changes.

**Step 2**: Re-architected the repository into a modular GitOps structure where each team owns an isolated directory with its own state key (`s3://bbc-pagerduty-tf-state/teams/{squad-name}/terraform.tfstate`).

**Step 3**: Used `terraform import` per team to attach existing live PagerDuty resources to their new isolated state, verifying `terraform plan` showed zero diffs before cutting over, then locked UI editing permissions once migrated.

**Key decisions made**:

1. Partition state per team/environment rather than centralize it.
   - Why: Eliminates global state locks and limits blast radius of infrastructure updates.
   - Trade-offs considered: A centralized repository was simpler initially but did not scale past a handful of teams.

**Technologies/Tools used**:

- Terraform (state partitioning, `terraform import`)
- AWS S3 (remote state), Harness / GitHub Actions (CI/CD)

### Result

**Outcomes achieved**:

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| State lock contention | Frequent `ConditionalCheckFailedException` errors during concurrent PRs | Eliminated | Isolated per-team state |
| Blast radius | One team's syntax error blocked all teams | Contained to the affected team | Modular state boundaries |

**Business impact**: Enabled safe, concurrent GitOps adoption across ~80 engineering squads without deployment contention, directly supporting the enterprise rollout described in [BBC 24/7 Operations & Incident Orchestration Platform](../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md).

## What This Story Demonstrates

### Primary Skills Demonstrated

- Root-cause diagnosis of infrastructure-as-code scaling failures
- Terraform state architecture and zero-downtime migration technique (import & reconcile)

## Related Experience

### Related Projects

- [BBC 24/7 Operations & Incident Orchestration Platform](../../projects/platform-engineering/bbc-24x7-incident-orchestration-platform.md)

### Related Architecture Decisions

- [ADR-01: Terraform GitOps vs. PagerDuty Web Console](../../architecture/architecture-decisions/adr-bbc-24x7-terraform-gitops-oncall.md)

---

**Status**: Complete  
**Last Updated**: 2026-08-29  
**Confidentiality Level**: INTERNAL
