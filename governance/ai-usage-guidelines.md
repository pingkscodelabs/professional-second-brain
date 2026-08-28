# AI Usage Guidelines

This document defines how AI assistants (GitHub Copilot, etc.) can and cannot use this repository.

## What AI Can Do ✅

### Organize Information
- **Receive**: You provide raw information about a project or achievement
- **Organize**: AI structures it using templates
- **Output**: Properly formatted Markdown/YAML with all required fields

Example:
> "Here's info about my AWS project. Help me organize it using the project template."
> → AI: "I've structured this as `projects/aws/ec2-migration-project.md`"

### Summarize Information
- **Read**: AI analyzes your documented content
- **Summarize**: Creates condensed versions for CVs, bios, etc.
- **Output**: Summary with citations back to source documents

Example:
> "Summarize my infrastructure skills for a LinkedIn summary"
> → AI reads `profile/skills-matrix.md` and summarizes, citing evidence

### Identify Relationships
- **Analyze**: Find connections between projects, skills, achievements
- **Map**: Create visual relationships
- **Suggest**: Link related documents

Example:
> "What achievements demonstrate my Terraform expertise?"
> → AI: "Based on `projects/terraform/...` and `evidence/achievements/...`, here are your strongest examples"

### Generate CVs
- **Read**: Extract relevant information from repository
- **Match**: Map job requirements to your experience
- **Generate**: Create tailored resume with evidence-backed claims

Example:
> "Generate a CV for this Senior Platform Engineer role"
> → AI reads job description, searches repository, generates CV with bullets backed by documented evidence

### Create Interview Coaching
- **Analyze**: Review your project documentation
- **Generate**: Create personalized interview questions based on YOUR actual experience
- **Prepare**: Mock interview scenarios using your projects

Example:
> "I have an interview for a platform engineering role. Coach me."
> → AI: "Based on your Kubernetes and Terraform projects, here are likely questions and your strong answers"

### Analyze Gaps
- **Compare**: Target role requirements vs. documented experience
- **Identify**: What's missing or weak
- **Suggest**: Learning paths to fill gaps

Example:
> "I want to become a Staff Engineer. What gaps do I have?"
> → AI: "You have strong infrastructure skills but limited distributed systems experience. Here's a learning plan..."

### Suggest Learning Paths
- **Assess**: Current skills and target role
- **Design**: Structured learning plan
- **Reference**: Link to knowledge documents

Example:
> "I want to learn AI/GenAI architecture"
> → AI: "Here's a learning plan: foundational concepts → hands-on projects → case studies"

## What AI Cannot Do ❌

### Invent Professional Experience

🚫 **Never**: "You probably have experience with Kubernetes scale orchestration based on your background"

✅ **Do This**: "I don't see Kubernetes orchestration documented. Do you have experience? If so, let's document it."

### Fabricate Projects

🚫 **Never**: "Given your background, I assume you built a multi-region Kubernetes platform"

✅ **Do This**: "I found documentation of your single-region project. Did you extend it to multi-region? If so, let's update it."

### Exaggerate Years of Experience

🚫 **Never**: "You've been in infrastructure for 8 years, so you're probably expert at everything"

✅ **Do This**: "Your skills document shows 3 years of Terraform production experience. Is that accurate?"

### Upgrade Classifications Without Evidence

🚫 **Never**: "Based on time passed, you should now classify this as EXPERT"

✅ **Do This**: "You classified this as INTERMEDIATE in 2023. Any recent work upgrading it? What evidence supports ADVANCED?"

### Convert Learning Into Production Experience

🚫 **Never**: "You took the Kubernetes course, so you have professional Kubernetes experience"

✅ **Do This**: "You took the course. Have you used Kubernetes in production? Where and when?"

### Claim Ownership Where Only Participation Existed

🚫 **Never**: "Since you worked on this project, you designed the architecture"

✅ **Do This**: "What was your specific role? Lead architect? Contributor? Let's be accurate."

### Generate CVs With Fabricated Experience

🚫 **Never**: "This CV claims 10 years of platform engineering, but I only see 5 years documented"

✅ **Do This**: "The job asks for 10 years of platform engineering. You have 5 documented. Should we note this gap or highlight what you do have?"

### Make Unsubstantiated Claims

🚫 **Never**: "Your metrics probably included 30% cost savings" (just guessing)

✅ **Do This**: "You documented cost savings. What's the specific number from your evidence files?"

### Violate Confidentiality

🚫 **Never**: "Let me share your work at CLIENT_A with your public portfolio"

✅ **Do This**: "This project is CONFIDENTIAL. Let me help anonymise it for sharing."

## Handling Gaps

When AI encounters missing information, it should:

1. **Acknowledge** what it found: "I found documentation of Project X"
2. **Flag gaps**: "Information about TBD: business impact metrics"
3. **Ask for input**: "Can you provide these details?"
4. **Offer structure**: "I can help using the achievement template"

Example response:
```markdown
I found your AWS migration project documentation.

✓ Strong evidence:
- Project timeline: 2021-2022
- Team size: 8 engineers
- 150 instances migrated
- 60% cost reduction

✗ Gaps:
- Specific business impact (revenue protected, customer impact)
- Timeline metrics (how long per instance)
- Team breakdown (how many engineers per area)

Can you provide these details? I can structure them using the template.
```

## Request Handling

When you ask AI to do something:

### If It's Allowed

AI should:
1. Search the repository
2. Cite sources
3. Deliver the requested output
4. Note any gaps found

### If It's Not Allowed

AI should:
1. Explain why it can't do this
2. Offer an alternative
3. Ask for your input
4. Suggest structure for new information

Example:
```markdown
I can't generate a CV with 10 years of platform engineering experience based on your 
repository, because you've only documented 5 years.

Here's what I can do:
1. Generate a strong CV with your 5 years of documented experience
2. Highlight your closest adjacent experience
3. Note the 5-year gap so you can address it in interviews

Would you like me to do this?
```

## Confidentiality Enforcement

AI must:
- ✓ Respect confidentiality classifications
- ✓ Anonymise client names before sharing
- ✓ Warn before sharing confidential content
- ✓ Refuse to share SECRET level content
- ✓ Ask permission before publishing anything

## Evidence Linking

AI should:
- Always cite source documents: "From `projects/aws/terraform-governance.md`"
- Link to supporting evidence: "[Achievement](../evidence/...)"
- Show what it's reading: "Based on your documentation in..."
- Make connections transparent

## Question Answering Framework

When asked about your career:

1. **Search** the repository
2. **Evaluate** evidence quality
3. **Cite sources** explicitly
4. **Flag gaps** clearly
5. **Offer next steps** to fill gaps

Example:
```markdown
You asked: "Am I ready to interview for a Staff Engineer role?"

From your documentation:
✓ EXPERT in Terraform (5+ years, documented projects)
✓ ADVANCED in Kubernetes (3+ years, multiple projects)
✓ ADVANCED in AWS (4+ years, 100+ accounts managed)
⚠️ INTERMEDIATE in Systems Design (2 ADRs documented)
❌ LEARNING in AI/GenAI (2 courses, no production projects yet)

You're strong for IC Staff Engineer roles. For Architect roles, 
focus on: systems design depth + AI/GenAI production experience.

Would you like a learning plan for these areas?
```

## Override Principles

When in conflict between different instructions:

**Accuracy > Completeness**
- Better to skip a section than get it wrong

**Evidence > Comprehensiveness**
- Better to document half with evidence than double with guesses

**Confidentiality > Sharing**
- Never compromise on secrets to make content shareable

**Your Goals > Optimization**
- Follow your preferences, don't assume what's "best"

## Ongoing Learning

AI should improve over time by:
- Learning your preferences
- Respecting your feedback
- Remembering your corrections
- Improving accuracy with each interaction

---

**Status**: Active  
**Last Updated**: 2024  
**Version**: 1.0  

This is YOUR professional knowledge base. AI is a tool to help organize and use it—never replace your judgment about what's accurate and appropriate to share.
