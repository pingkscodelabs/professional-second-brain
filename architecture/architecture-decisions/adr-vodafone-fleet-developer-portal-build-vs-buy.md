# ADR-04: Developer Portal Build vs Buy

## ADR Header

| Field | Value |
|-------|-------|
| ADR Number | ADR-04 |
| Title | Developer Portal Build vs Buy |
| Status | PROPOSED |
| Date | 2026-08-30 |
| Decision Maker | Platform Engineering Architect (reference architecture) |
| Reviewers | Developer Experience, Platform, Security, Engineering Leadership |

## Context

A self-service fleet platform needs a front door where developers discover golden paths, request infrastructure, view ownership metadata, and access documentation.

## Problem

Building a custom portal gives maximum fit but creates product and maintenance cost. Buying/adopting an existing portal accelerates time-to-value but may require adapting workflows to product constraints.

## Options Considered

### Option 1: Build Custom Portal

**Pros**:
- Tailored UX and internal integrations

**Cons**:
- High build/maintenance cost
- Risk of platform team becoming a product engineering team without capacity

### Option 2: Adopt Open-Source Portal (e.g., Backstage)

**Pros**:
- Mature service catalog ecosystem
- Extensible plugin model

**Cons**:
- Requires operational ownership and customization

### Option 3: Buy SaaS Portal (e.g., Port/Humanitec-style product)

**Pros**:
- Faster rollout and managed features

**Cons**:
- Vendor dependency, licensing cost, integration constraints

## Decision

Adopt a mature developer portal product or open-source portal first, then extend only where workflows require it.

## Why

The platform's first priority is self-service adoption and golden-path usability, not building portal plumbing. Build only differentiating workflows.

## Trade-offs

| Gained | Lost |
|--------|------|
| Faster time-to-value | Less total UX control |
| Existing catalog/scaffolding ecosystem | Product/vendor constraints |

## Consequences

- Portal ownership, plugin lifecycle, access control, and data model governance must be explicit.
- Avoid over-customization that makes upgrades difficult.

## Future Reconsideration Conditions

Reconsider custom build if product constraints block critical platform workflows or if total licensing cost exceeds custom-build TCO.

## Related

- [Vodafone Fleet Platform Engineering](../../projects/platform-engineering/vodafone-fleet-platform-engineering.md)

---

**Status**: Proposed  
**Last Updated**: 2026-08-30  
**Confidentiality Level**: INTERNAL
