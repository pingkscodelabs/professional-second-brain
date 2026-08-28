# Knowledge Management Guidelines

This document explains how to organize, maintain, and evolve the Professional Second Brain repository.

## Organizational Principles

### 1. Clear Structure

The repository is organized around your professional identity:

- **profile/**: Who you are (summary, skills, timeline)
- **experience/**: Where you've worked (companies, roles, achievements)
- **projects/**: What you've built (organized by technology)
- **clients/**: Who you've worked with (anonymised)
- **architecture/**: How you think (patterns, decisions, designs)
- **business/**: What impact you've driven (outcomes, ROI, use cases)
- **evidence/**: Proof (metrics, testimonials, achievements)
- **knowledge/**: What you know (technical knowledge, learning)
- **interview/**: How to talk about it (questions, stories, prep)

### 2. Naming Conventions

All files use:
- **lowercase**
- **kebab-case** (not camelCase or snake_case)
- **Descriptive names** (not generic names)

✅ Examples:
- `terraform-governance-framework.md`
- `kubernetes-scaling-strategies.md`
- `principal-engineer-interview-prep.md`
- `aws-platform-engineering.md`

❌ Don't Use:
- `stuff.md`
- `myproject.md`
- `newFile.md`
- `projectA.md`

### 3. Single Responsibility

Each file has one clear purpose:

- One project per file
- One achievement per file
- One decision per file
- One STAR story per file

Don't create catch-all files mixing multiple topics.

## Content Organization

### By Project Type

Projects are organized by primary technology:

```
projects/
├── aws/                    # AWS projects
├── terraform/              # Infrastructure-as-Code
├── kubernetes/             # Container orchestration
├── platform-engineering/   # Platform/internal developer platform
├── devops/                 # DevOps-specific projects
├── data-engineering/       # Data pipeline/warehouse
├── ai/                     # AI/ML projects
├── genai/                  # Generative AI projects
└── other/                  # Technologies not in categories above
```

If a project uses multiple technologies, put it in the **primary one**. Link to related technologies from the document.

### By Skill Category

Skills are organized in `profile/skills-matrix.md` and linked to:
- Projects demonstrating the skill
- Achievements using the skill
- Interview questions about the skill
- Certifications related to the skill

### By Evidence Type

Evidence is organized by impact:

```
evidence/
├── achievements/           # Accomplishments with metrics
├── metrics/               # Quantified outcomes
├── business-impact/       # Revenue, cost, efficiency impact
├── technical-impact/      # Performance, scale, reliability impact
├── leadership-impact/     # Team growth, mentorship
└── testimonials/          # References, feedback
```

## Creating New Content

### 1. Choose the Right Template

Every new document should start from a template:

| Document Type | Template | Location |
|---------------|----------|----------|
| Project | `projects/project-template.md` | `projects/category/name.md` |
| Client | `clients/client-template.md` | `clients/client-name/` |
| Skill | `profile/skill-template.md` | `profile/skills-matrix.md` or separate file |
| Achievement | `evidence/achievement-template.md` | `evidence/achievements/name.md` |
| ADR | `architecture/architecture-decisions/adr-template.md` | `architecture/architecture-decisions/adr-###.md` |
| Interview Q | `interview/questions/question-template.md` | `interview/questions/category/question.md` |
| STAR Story | `interview/star-stories/star-template.md` | `interview/star-stories/name.md` |

### 2. Fill in Required Fields

Templates have required, recommended, and optional fields.

- **Required**: Don't leave blank (use TBD if missing)
- **Recommended**: Include whenever possible
- **Optional**: Include if relevant

### 3. Add Links

When creating a new document, link it from:
- Related projects
- Related skills
- Related achievements
- Metadata YAML files

Example adding a project:

```markdown
# File: projects/aws/ec2-migration.md
- **Related Skills**: [AWS](../profile/skills-matrix.md), [Infrastructure as Code](../profile/skills-matrix.md)
- **Related Achievement**: [Migration Completion](../evidence/achievements/ec2-migration-success.md)
```

And then add the reverse link:

```markdown
# File: evidence/achievements/ec2-migration-success.md
- **Related Project**: [EC2 Migration](../../projects/aws/ec2-migration.md)
- **Related Skills**: [AWS](../../profile/skills-matrix.md)
```

## Linking Strategy

### Link Types

**Forward links** (strong):
From project → to achievement (project is the source)

**Backward links** (supporting):
From achievement → to project (achievement references project)

**Cross-cutting links** (connecting):
Between related content (skill → project, technology → knowledge)

### Link Format

Use relative Markdown links:

```markdown
[Link text](../../path/to/file.md)
```

Example from `projects/aws/ec2-migration.md`:
```markdown
- [AWS Skill](../../profile/skills-matrix.md)
- [Migration Success Achievement](../../evidence/achievements/ec2-migration-success.md)
- [Architecture Decision on EC2 vs Container](../../architecture/architecture-decisions/adr-001.md)
```

### Building the Knowledge Graph

Over time, these links create a connected knowledge graph:

```
Project X
  ├── Links to → Skills Used
  ├── Links to → Achievements Enabled
  ├── Links to → Technology Knowledge
  ├── Links to → Architecture Decisions
  └── Links to → Interview Stories

Achievement Y
  ├── Links to → Project That Generated It
  ├── Links to → Business Impact
  └── Links to → Related Skills

Skill Z
  ├── Links to → Projects Demonstrating It
  ├── Links to → Certifications Proving It
  ├── Links to → Interview Questions About It
  └── Links to → Knowledge Resources
```

## Updating Information

### Information Lifecycle

1. **Capture**: Add raw information
2. **Structure**: Format using templates
3. **Validate**: Verify evidence and accuracy
4. **Link**: Connect to related content
5. **Enrich**: Add metrics and examples
6. **Review**: Confidentiality and quality check
7. **Publish**: Make available for use
8. **Reuse**: In CVs, interviews, career planning
9. **Update**: Keep current and accurate

### What to Update

**Immediately**:
- New projects completed
- New achievements earned
- Certifications gained
- Promotions or role changes

**Quarterly**:
- Current project progress
- Evolving skills
- Learning updates
- Career goals

**Annually**:
- Full review of all content
- Archive outdated information
- Update classifications if needed
- Consolidate and clean up

### How to Update

1. **Create new version** don't delete old
2. **Note the change** with date
3. **Archive old content** if no longer valid
4. **Update links** to point to new version
5. **Update metadata** (YAML files)

Example:
```markdown
# Skills: AWS (Updated 2024)

**Previous version**: [AWS 2023](./aws-2023.md)
**Last Updated**: 2024-01-15
**Changes**: 
- Added Bedrock experience
- Upgraded EC2 knowledge from ADVANCED to EXPERT
```

## Metadata Files

Keep YAML files in `metadata/` synchronized:

- `skills.yml`: List of all skills with levels
- `projects.yml`: List of all projects
- `technologies.yml`: List of technologies used
- `clients.yml`: List of clients (anonymised)
- `experience.yml`: Career timeline

These files enable:
- Searching and filtering
- Generating reports
- Finding gaps
- Tracking progress

Example entry in `metadata/skills.yml`:
```yaml
skills:
  - name: "Terraform"
    category: "Infrastructure"
    level: "EXPERT"
    years: 5
    projects:
      - "projects/terraform/terraform-governance.md"
      - "projects/terraform/multi-region-deployment.md"
    evidence:
      - "evidence/achievements/infrastructure-standardisation.md"
```

## Handling Duplicates

If you create duplicate or overlapping content:

1. **Keep the more detailed** version
2. **Delete the other**
3. **Redirect with a note** if helpful (e.g., "See [Main Document](link.md)")
4. **Consolidate related content** under one heading

## Archiving Old Content

When content becomes outdated:

1. **Mark as archived**: Add `[ARCHIVED]` to filename
2. **Note why**: Add explanation at top
3. **Reference current version**: Link to what replaced it
4. **Keep for history**: Don't permanently delete

Example:
```markdown
# [ARCHIVED] EC2-Based Microservices Platform

This project is archived. The architecture evolved into:
→ [Kubernetes-Based Platform](../../projects/kubernetes/platform-v2.md)

Original project ran 2019-2021. See this document for historical context.
```

## Repository Health Checks

### Monthly
- [ ] Add new achievements/projects
- [ ] Update current roles and activities
- [ ] Check for broken links (use a tool)

### Quarterly
- [ ] Review all YAML metadata for accuracy
- [ ] Update outdated information
- [ ] Verify all links work
- [ ] Consolidate duplicates

### Annually
- [ ] Deep review of entire repository
- [ ] Archive old content
- [ ] Update skill classifications
- [ ] Plan next year's focus areas
- [ ] Archive previous year's backup

---

**Status**: Active  
**Last Updated**: 2024  
**Review Frequency**: Quarterly  

Remember: A well-organized knowledge base is exponentially more valuable than a messy one.
