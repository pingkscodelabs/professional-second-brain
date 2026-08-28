# Contribution Guidelines

This document explains how to add and maintain information in the Professional Second Brain repository.

## Before You Start

### Review These First

1. **Read `.github/copilot-instructions.md`** - Understand AI guidelines
2. **Review `governance/confidentiality.md`** - Ensure no secrets
3. **Check `governance/data-quality.md`** - Know accuracy standards
4. **See `governance/knowledge-management.md`** - Learn organization

### Decide What to Add

- Is this professional information? (If not, keep it elsewhere)
- Is it evidence-backed? (If not, can it be?)
- Is it confidential? (If yes, anonymise it)
- Where does it belong? (Check folder structure)

## Adding Information

### Step 1: Find or Create Template

```bash
# Browse existing templates:
- projects/project-template.md
- clients/client-template.md
- profile/skill-template.md
- evidence/achievement-template.md
- architecture/architecture-decisions/adr-template.md
- interview/questions/question-template.md
- interview/star-stories/star-template.md
```

### Step 2: Copy Template

```bash
# Example: Creating a new project
cp projects/project-template.md projects/aws/my-new-project.md

# Then edit my-new-project.md with your information
```

### Step 3: Fill Required Fields

Every template has required fields marked clearly. Don't skip them.

If information is missing: use `TBD` or `INSUFFICIENT_EVIDENCE`

### Step 4: Add Evidence

Link to:
- Related projects
- Related achievements
- Related skills
- Related architecture decisions
- Supporting documentation

### Step 5: Review Confidentiality

- Mark confidentiality level
- Anonymise client names if needed
- Remove sensitive details
- Verify it's safe to commit

### Step 6: Check Quality

Before committing:

- [ ] Required fields filled
- [ ] Metrics are specific (not vague)
- [ ] All links are correct
- [ ] No secrets or credentials
- [ ] Client information anonymised
- [ ] Spelling and grammar correct
- [ ] Consistent formatting

### Step 7: Commit

```bash
git add your-file.md
git commit -m "Add: [category] - [brief description]"
```

Example commits:
```
Add: project - AWS platform engineering migration
Add: achievement - Cost optimization initiative metrics
Add: skill - Kubernetes advanced training
Add: interview - Platform engineering mock interview questions
```

## Updating Existing Information

### Minor Changes

- Fix typos
- Update current status
- Add new links
- Add recent achievements

```bash
git commit -m "Update: [file] - [what changed]"
```

### Major Changes

- Complete rewrite
- Significant new evidence
- Classification upgrades
- Major milestones

1. Create new version or major section
2. Note the change with date
3. Keep old content for history (don't delete)
4. Update all links

```bash
git commit -m "Refactor: [file] - [major changes summary]"
```

## Linking Content

### When Creating New Content

Always add these links:

**From the new document:**
```markdown
### Related Documents
- [Related Project](../../projects/category/project.md)
- [Related Skill](../../profile/skills-matrix.md)
- [Related Achievement](../../evidence/achievements/achievement.md)
```

**Add reverse links in related documents:**

In related project file, add:
```markdown
### Related Content
- [Your New Achievement](../../evidence/achievements/new-achievement.md)
```

### Link Format

- Use relative paths: `../../path/to/file.md`
- Use descriptive text: `[AWS Expertise](link.md)` not `[click here](link.md)`
- Test links work: Click them or use a link checker

## Naming Files

### Directories

Use lowercase kebab-case:
```
projects/aws/
projects/kubernetes/
technologies/data-engineering/
interview/questions/platform-engineering/
```

### Files

Use lowercase kebab-case with `.md` extension:
```
terraform-governance-framework.md
kubernetes-scaling-strategies.md
principal-engineer-interview-prep.md
```

Not:
```
TerraformGovernance.md
kubernetes scaling.md
Principal Engineer Interview.md
```

## Adding to Metadata

After creating a new document, add an entry to relevant YAML file:

### If Adding a Project

Edit `metadata/projects.yml`:
```yaml
- name: "My New Project"
  client: "CLIENT_A"
  period: "2023-2024"
  technologies: ["AWS", "Terraform"]
  documentation_link: "projects/aws/my-new-project.md"
```

### If Adding a Skill

Edit `metadata/skills.yml`:
```yaml
- name: "Kubernetes"
  category: "Container Orchestration"
  level: "ADVANCED"
  years: 3
  projects:
    - "projects/kubernetes/project-1.md"
  evidence:
    - "evidence/achievements/achievement-1.md"
```

## Directory Organization

### Creating New Directories

If you need a new category:

1. **Get approval** - discuss in a comment if radical restructuring
2. **Follow pattern** - use same structure as existing categories
3. **Update README** - update folder structure in README.md
4. **Update .gitkeep** if needed - create `.gitkeep` file for empty directories

## Special Cases

### Confidential Content

1. Mark level: `Confidentiality Level: CONFIDENTIAL`
2. Anonymise clients: Use `CLIENT_A`, `CLIENT_B`, etc.
3. Review before sharing: Always anonymise before showing others

### Archiving Content

1. Rename to `[ARCHIVED] - original-name.md`
2. Add note at top: "This content is archived as of [date]"
3. Link to replacement if it exists
4. Keep for historical reference

### Updating Classifications

Only upgrade skill/experience classifications with evidence:

```markdown
**Previous Level**: INTERMEDIATE (2023)
**Current Level**: ADVANCED (2024)

**Evidence**:
- [2 production projects in 2024](../../projects/kubernetes/...)
- [Mentored 3 engineers](../../evidence/achievements/...)
- [Presented at internal conference](../../evidence/achievements/...)
```

## Review Process

### Self-Review Checklist

- [ ] Follows template structure
- [ ] All required fields completed
- [ ] Evidence-backed claims
- [ ] Proper links added
- [ ] No typos or formatting issues
- [ ] Confidentiality reviewed
- [ ] No secrets committed
- [ ] Metadata updated

### Getting Feedback

For major additions:
1. Create a draft
2. Ask for review from trusted mentor
3. Incorporate feedback
4. Finalize and commit

## Commit Message Format

### Format

```
<Type>: <Category> - <Description>
```

### Types

- `Add`: New document/content
- `Update`: Changes to existing content
- `Refactor`: Significant reorganization
- `Fix`: Typos, broken links
- `Archive`: Archiving old content
- `Metadata`: YAML metadata changes

### Examples

```
Add: project - AWS platform engineering implementation
Update: skill - Terraform expertise level classification
Refactor: interview - reorganized mock interview questions
Fix: achievement - corrected metrics and linked projects
Archive: knowledge - deprecated technology documentation
Metadata: added new projects to metadata index
```

## Avoiding Common Mistakes

### ❌ Don't

- Leave required fields empty
- Add vague descriptions ("very good at X")
- Make up metrics
- Forget to add links
- Commit with secrets
- Overwrite without backup
- Use generic filenames
- Mix topics in one file

### ✅ Do

- Use templates
- Be specific with numbers
- Back up claims with evidence
- Link liberally to related content
- Review for secrets before commit
- Keep old versions for history
- Use descriptive filenames
- One topic per file

## Help & Questions

### If You're Unsure

1. Check existing similar documents for examples
2. Review templates carefully
3. Re-read relevant governance documents
4. Ask for guidance in commit message if needed

### If You Find Issues

- Typos/errors in templates: Fix them
- Unclear guidelines: Improve this document
- Missing template types: Suggest new template

---

**Status**: Active  
**Last Updated**: 2024  

Welcome to your Professional Second Brain! Adding and maintaining high-quality information here will pay dividends throughout your career.
