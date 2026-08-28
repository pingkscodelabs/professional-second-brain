# Confidentiality Guidelines

This document outlines what information should and should not be included in the Professional Second Brain repository.

## Golden Rule

**Never store secrets, credentials, or confidential business information in this repository.**

This is a Git repository. Once committed, secrets become part of the Git history and are nearly impossible to fully remove.

## Prohibited Information

### 🚫 NEVER Store

- Passwords or pass phrases
- API keys, tokens, or credentials
- Private SSH keys or certificates
- Database connection strings with credentials
- OAuth tokens or bearer tokens
- AWS access keys or secret keys
- Private URLs or endpoints
- Internal IP addresses or infrastructure details
- Production configuration secrets
- Credit card or payment information
- Social security numbers
- Passport numbers or driver's license numbers
- Email addresses (personal data)
- Phone numbers (personal data)
- Financial account information
- Medical or health information
- Highly sensitive business strategies
- Confidential source code
- Proprietary algorithms or formulas
- Unreleased product information
- Private customer data
- Unredacted client names (for CONFIDENTIAL projects)
- Authentication mechanisms specific to production

## Permitted Information

### ✅ SAFE to Store

- Public information about technologies you've used
- General descriptions of projects (anonymised)
- Architecture patterns and principles
- Business outcomes and metrics (at a summary level)
- Learning and knowledge gained
- Public certifications and credentials
- Public speaking engagements or publications
- General technology comparisons and trade-offs
- Interview preparation and stories (anonymised)
- Career timeline and roles (without sensitive details)
- Skills and capabilities (without claiming specific access levels)

## Confidentiality Classification Levels

Every project and client document should have a `Confidentiality Level` field:

### 🟢 PUBLIC
- Safe to share with anyone
- Could be published on your blog or portfolio
- No sensitive information
- Examples: Open-source contributions, public speaking, published articles

### 🟡 INTERNAL
- Only for internal company/team use
- Not for public sharing
- May contain general company information
- No specific sensitive data
- Examples: Internal training materials, general company history

### 🔴 CONFIDENTIAL
- Contains sensitive business information
- Must anonymise client names (use CLIENT_A, CLIENT_B, etc.)
- Remove specific business strategies or plans
- Can share patterns and lessons learned
- Must review before sharing with anyone
- Examples: Client engagement details (anonymised), proprietary processes, internal strategy

### 🔒 SECRET
- Highly sensitive information
- Never share publicly
- Even anonymisation may not be sufficient
- Only store in this repository if absolutely necessary
- Consider storing elsewhere (private notes, encrypted storage)
- Examples: Unreleased strategies, confidential client information, proprietary source code

## Anonymisation Guidelines

When documenting client work, use consistent anonymised names:

```
CLIENT_A     → First major client
CLIENT_B     → Second major client
CLIENT_C     → Third major client
COMPANY_X    → Internal employer name (if discussing sensitive work)
PRODUCT_Y    → Specific product names
TECH_Z       → Specific proprietary technologies
```

### Anonymisation Checklist

When documenting client/confidential work:

- [ ] Replace real client name with CLIENT_A/B/C
- [ ] Remove specific company-identifying details
- [ ] Generalise industry if too specific
- [ ] Remove specific project codes or internal naming
- [ ] Generalise financial numbers if too specific
- [ ] Remove customer/end-user identifying information
- [ ] Remove specific internal tool names or URLs
- [ ] Describe patterns instead of specific implementations
- [ ] Focus on learning and outcomes, not proprietary methods

## Example: Before and After

### ❌ BEFORE (Too Specific - CONFIDENTIAL)

> At Goldman Sachs, I led the migration of their trading platform from EC2 to Kubernetes. We migrated 150 microservices handling $2.3B in daily trading volume across 8 data centers. The specific infrastructure was...

**Issues**:
- Real client name
- Highly specific financial details
- Specific volume numbers
- Proprietary architecture exposure

### ✅ AFTER (Anonymised - CONFIDENTIAL)

> At CLIENT_A, a major financial services firm, I led the migration of their trading platform from EC2 to Kubernetes. We migrated 150+ microservices across multiple data centers, improving resilience and reducing operational overhead. The pattern demonstrated...

**Improvements**:
- Client anonymised
- General description of scale
- Focus on technical approach
- Removes proprietary details

## For Each Document

### Add This Metadata

```markdown
## Confidentiality

**Confidentiality Level**: PUBLIC / INTERNAL / CONFIDENTIAL / SECRET  
**Client Anonymised**: Yes / No  
**Sensitive Details Removed**: Yes / No  
**Safe to Share**: Yes / No  
```

## Before Making Information Public

If you want to use this repository for a blog post, portfolio, or interview:

1. **Copy the content** to a new document
2. **Review for secrets** - double-check for any credentials or sensitive data
3. **Anonymise clients** - replace real names with CLIENT_A, etc.
4. **Generalise details** - make it about patterns, not specific implementations
5. **Check classification** - ensure it's PUBLIC or properly anonymised CONFIDENTIAL
6. **Get approval** - if client work, get permission to share

## Common Mistakes to Avoid

❌ **"I'll remember not to commit secrets"**  
→ It's easy to forget. Use pre-commit hooks instead. Consider a `.gitignore` for secrets files.

❌ **"The repository is private so it's safe"**  
→ Private repositories can be compromised. Assume the content will be exposed.

❌ **"I'll use CLIENT_A but keep all their specific details"**  
→ Someone could still identify them. Anonymise properly.

❌ **"This metric seems too specific so I won't include it"**  
→ Aggregated metrics are safer than specific ones.

❌ **"Everyone in tech uses AWS, so I can share specific infrastructure"**  
→ Combine infrastructure details with other details and they become identifying.

## Tools & Automation

### Pre-commit Hook

Consider using a pre-commit hook to scan for common patterns:

```bash
# .git/hooks/pre-commit
#!/bin/bash
# Scan for common credential patterns
grep -r "password\|secret\|key\|token" . && {
  echo "⚠️  Potential secret detected. Review before committing."
  exit 1
}
```

### .gitignore

Add sensitive files to `.gitignore`:

```
.env
.env.local
secrets/
private/
credentials/
*.key
*.pem
```

## If You Accidentally Commit Secrets

1. **Stop immediately** - don't push to remote
2. **Review the commit** - see what was exposed
3. **Rotate the secret** - change passwords, regenerate keys
4. **Remove from Git history** - use `git filter-branch` or `git filter-repo`
5. **Force push** (only if not yet pushed to shared remote)
6. **Notify relevant parties** - inform teams if credentials were exposed

## Questions?

When in doubt:
- **Can this be found by Googling?** → PUBLIC
- **Would I be uncomfortable if a competitor saw this?** → CONFIDENTIAL
- **Would I be uncomfortable if a client saw this?** → CONFIDENTIAL
- **Could this directly harm my employer or client?** → SECRET

---

**Status**: Active  
**Last Updated**: 2024  
**Review Frequency**: Quarterly  

Remember: This repository is your professional source of truth. Protecting confidentiality protects your career, your clients, and your employer.
