# INTERNAL_USE_CASE_PATTERN

1. Repository structure
2. Documentation structure
3. Standard use-case template
4. Mandatory sections
5. Optional sections
6. Architecture conventions
7. Technology-selection conventions
8. Security conventions
9. Operational conventions
10. Business-impact conventions
11. Interview-preparation conventions
12. Naming conventions
13. Quality standards
14. Common patterns
15. Common anti-patterns

## Repository structure

- `projects/` contains project case studies and templates.
- `architecture/architecture-decisions/` contains ADR templates and decisions.
- `interview/questions/` and `interview/star-stories/` contain interview prep artifacts.
- `evidence/achievements/` contains quantified outcomes.
- `governance/` contains repository-wide conventions.

## Documentation structure

The dominant pattern is:

- template first
- metadata table
- business context
- requirements
- architecture
- decisions and trade-offs
- security/reliability/observability/FinOps
- delivery model
- outcomes and interview readiness
- evidence links

## Standard use-case template

Use the `projects/case-studies/case-study-template.md` structure as the canonical enterprise case-study format.

## Mandatory sections

- Metadata & confidentiality
- Executive summary
- Problem statement
- Goals and success criteria
- Requirements
- Solution and architecture
- ADR references and trade-offs
- Security, reliability, scalability, observability, FinOps
- Delivery model
- Outcomes and KPIs
- Interview Q&A
- Reusable patterns and roadmap
- Evidence and cross-links

## Optional sections

- Failed approaches
- Migration strategy
- Problems encountered
- Future improvements
- Lessons learned
- Post-decision review

## Architecture conventions

- Use component breakdown tables.
- Include diagrams or ASCII flows.
- Keep one decision per ADR.
- Link architecture, project, achievement, and STAR artifacts.

## Technology-selection conventions

- Document alternatives explicitly.
- State rationale and trade-offs.
- Avoid technology shopping lists.
- Choose only what solves an actual requirement.

## Security conventions

- Always include authentication, authorization, encryption, secrets, and audit.
- For AI use cases, include prompt injection, leakage, poisoning, and abuse controls.
- Use confidentiality labels and anonymization when needed.

## Operational conventions

- Include monitoring, SLOs, runbooks, DR, rollback, and support model.
- Treat reliability and observability as first-class sections.

## Business-impact conventions

- Document before/after state.
- Include quantified metrics when available.
- Label invented or target values as illustrative.

## Interview-preparation conventions

- Use STAR stories.
- Keep answers specific and defensible.
- Provide technical, architectural, and behavioral questions.
- Link back to evidence and ADRs.

## Naming conventions

- Use kebab-case for files.
- Use descriptive prefixes for numbered documents.
- Keep titles stable and short.

## Quality standards

- No fabrication.
- No unsupported metrics.
- No vague claims without evidence.
- Keep one fact in one file.

## Common patterns

- Case-study template plus linked ADRs, achievements, and STAR stories.
- Problem → requirements → architecture → delivery → outcome.
- Decision rationale separated from outcomes.

## Common anti-patterns

- Copying public repository wording.
- Mixing hypothetical and historical claims.
- Omitting trade-offs.
- Overusing generic technology lists.
