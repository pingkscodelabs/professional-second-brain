# Data Quality Guidelines

This document defines standards for ensuring professional information is accurate, evidence-backed, and reliable.

## Core Principles

### 1. Evidence-First

Every professional claim should be traceable back to evidence:

- **Documentation**: Project records, achievement files
- **Metrics**: Numbers, quantified outcomes
- **Verification**: Can it be verified?
- **Currency**: Is it still current?

### 2. Accuracy

- Information must be factually correct
- Avoid exaggeration or minimization
- Be specific, not generic
- Cite sources

### 3. Completeness

- Important information shouldn't be missing
- Use TBD for missing pieces
- Don't leave ambiguities
- Connect related content with links

## Classification Accuracy

### Skill Levels

When assigning skill classifications, use this framework:

| Level | Definition | Evidence |
|-------|-----------|----------|
| **EXPERT** | Deep production knowledge, can architect/teach | Multiple projects, 5+ years, mentored others |
| **ADVANCED** | Significant hands-on experience, can lead | 2+ production projects, complex solutions |
| **INTERMEDIATE** | Solid working knowledge, can implement independently | 1+ production project, solved problems |
| **BEGINNER** | Foundation-level understanding, needs guidance | Course completion, small projects, learning |
| **LEARNING** | Currently actively studying | Enrolled in course, deliberate practice |
| **EXPOSURE** | Limited exposure, observation only | Conference talk, read about it, attended workshop |
| **ASPIRATION** | Future goal, not yet pursued | Listed as learning goal |

**Rules**:
- Never upgrade based on assumptions
- Require evidence for every level
- Be conservative in classification
- Update with new evidence only

### Experience Classification

When describing years of experience:

- **Years of production experience**: Actual time actively using skill in production
- **Not counted**:
  - Learning/training time
  - Hobby projects
  - Exposure at conferences
  - Reading/study without application
  - 1-2 small projects

### Scale Accuracy

When stating scale, be precise:

| Term | Meaning | Example |
|------|---------|---------|
| Single | One of something | One microservice, one team |
| Multiple | 2-10 of something | 5-10 microservices, 2-3 teams |
| Many | 10-100+ of something | 50+ microservices, 10+ teams |
| Massive | 100+ or enterprise scale | 500+ accounts, 100+ teams |

## Handling Missing Information

### TBD (To Be Determined)

Use `TBD` when information is missing but important:

```markdown
**Business Impact**: TBD
[Note: Need to gather this from project sponsor]
```

### INSUFFICIENT_EVIDENCE

Use when you're not confident in the information:

```markdown
**Years of production experience**: INSUFFICIENT_EVIDENCE
[Note: Need to verify exact timeline]
```

### Don't Guess

- ❌ Guessing at metrics
- ❌ Assuming experience levels
- ❌ Inferring skills from job titles
- ❌ Making up numbers

## Project Documentation Standards

### Required Fields

Every project must have:

- [ ] Project name
- [ ] Time period (start/end date)
- [ ] Your role
- [ ] Business problem (brief)
- [ ] Key technologies
- [ ] Outcome (what was delivered)

### Recommended Fields

- [ ] Team size
- [ ] Business impact (with metrics)
- [ ] Technical impact
- [ ] Scale (systems, users, data)
- [ ] Challenges and how addressed
- [ ] Lessons learned
- [ ] Confidentiality level
- [ ] Related skills
- [ ] Interview readiness

### Optional Fields

- [ ] Architecture diagrams
- [ ] Detailed implementation details
- [ ] Technologies not highlighted
- [ ] Team composition

## Achievement Documentation Standards

### Metrics Requirements

Achievements should include:

| Type | Example | Why |
|------|---------|-----|
| Quantitative | "Reduced response time from 500ms to 50ms (90% improvement)" | Specific, measurable |
| Comparative | "Reduced from industry average of X to Y" | Shows competitive edge |
| Scale-based | "Implemented across 100+ AWS accounts" | Shows scope |
| Efficiency | "Reduced manual work by 80%, freeing 2 FTE for strategic work" | Shows business impact |
| Timeline | "Delivered 3 weeks ahead of schedule" | Shows execution |

### Weak Metrics

- ❌ "Improved performance" (no numbers)
- ❌ "Enhanced reliability" (no specific improvement)
- ❌ "Better than before" (vague)
- ❌ "Saved money" (how much?)

### Strong Metrics

- ✅ "Reduced mean time to recovery (MTTR) from 4 hours to 15 minutes (94% improvement)"
- ✅ "Implemented cost optimization initiative saving $2.3M annually"
- ✅ "Deployed to 150+ AWS accounts, standardizing infrastructure across 15 teams"

## Confidence Levels

Mark the confidence in your information:

```markdown
**Confidence Level**: HIGH / MEDIUM / LOW

[HIGH] - Verified with documentation or recent experience
[MEDIUM] - Recalled from memory, may need verification
[LOW] - Uncertain, needs fact-checking
```

## Handling Conflicting Information

If you have conflicting information:

1. **Document both versions**:
   ```markdown
   **Timeline Conflict**:
   - Project team records: 2019-2021
   - My memory: 2018-2021
   - Source: Need to check original project board
   ```

2. **Note the conflict** in the document
3. **Investigate** to find the truth
4. **Update** with accurate information
5. **Reference** the source of the corrected information

## Handling Outdated Information

Clearly mark outdated information:

```markdown
**Status**: OUTDATED (Last used 2020, likely superseded by newer approaches)
**Still Relevant For**: Interview preparation, showing legacy system experience
**Current Approach**: [Link to newer technique]
```

## Linking Standards

### Required Links

- Link to related projects
- Link to related achievements
- Link to supporting evidence
- Link to related skills

### Link Format

Use relative Markdown links:

```markdown
[AWS Platform Engineering](../../projects/aws/platform-engineering.md)
[Cost Optimization Achievement](../../evidence/achievements/cost-savings.md)
[Infrastructure as Code Skill](../../profile/skills-matrix.md)
```

### Broken Link Prevention

- Use meaningful file names (don't rename without updating links)
- Check links when moving files
- Periodically verify links still work
- Use a link checker tool

## Review Checklist

Before considering information "ready":

- [ ] All claims have supporting evidence
- [ ] Metrics are specific and quantified
- [ ] Classifications are accurate and conservative
- [ ] Missing information marked as TBD
- [ ] Dates are correct
- [ ] Numbers are verified
- [ ] Links are all functional
- [ ] Confidentiality reviewed
- [ ] Tone is professional and honest
- [ ] Someone else could understand it

## Update Frequency

| Content Type | Review Frequency | Update Trigger |
|--------------|-----------------|-----------------|
| Current role/skills | Quarterly | End of quarter |
| Completed projects | As completed | When project ends |
| Achievements | As achieved | Immediately when earned |
| Learning goals | Quarterly | Progress update |
| Certifications | As earned | Immediately |
| Outdated skills | Annually | Technology change |

## Maintaining Accuracy Over Time

### Monthly: Quick Check
- Update current role activities
- Add new projects or achievements
- Note certification progress

### Quarterly: Full Review
- Review all current information
- Update outdated items
- Verify links
- Check metrics for accuracy

### Annually: Deep Review
- Review entire repository
- Check all classifications
- Verify all evidence links
- Consolidate outdated information
- Plan updates for next year

## Red Flags

If you notice these, investigate:

- ⚠️ Vague descriptions ("very good at X")
- ⚠️ No supporting evidence
- ⚠️ Years of experience that don't match projects
- ⚠️ Skills listed but no examples
- ⚠️ Metrics without context
- ⚠️ Achievements with no timeline
- ⚠️ Links that point to empty files
- ⚠️ Classified skills with no production use

## Tools for Quality Assurance

### Markdown Linting
Use a markdown linter to check formatting consistency

### Link Validation
Tools like `markdown-link-check` can verify all links work

### Spell Checking
Use spell-check to catch typos

### Manual Review
Regular manual review catches semantic issues that tools miss

---

**Status**: Active  
**Last Updated**: 2024  
**Review Frequency**: Annually  

Remember: Your Professional Second Brain is only valuable if it's accurate and current.
