# PSB CV Builder - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Installation

1. **Install dependencies**
   ```bash
   npm install js-yaml
   ```

2. **Compile TypeScript** (if needed)
   ```bash
   npx tsc psb-*.ts --outDir dist/
   ```

### Usage Example

```typescript
import { PSBCVBuilder } from './psb-cv-builder-main';

const builder = new PSBCVBuilder();

const input = {
  jobDescription: `
    Senior Platform Engineer - CloudCorp
    
    Must Have:
    - 5+ years Kubernetes production experience
    - Terraform and AWS expertise
    - Team leadership experience
    
    Nice to Have:
    - Cost optimization experience
    - Multi-cloud architecture
  `,
  format: 'resume',
  maxLength: 1,
  targetLevel: 'senior',
  focusAreas: ['Cloud Architecture', 'Cost Optimization']
};

const output = await builder.generate(input);

console.log('Generated CV:');
console.log(output.formattedCV);
console.log(`\nMatch Score: ${output.analysis.matchScore}/100`);
console.log(`Strong Areas: ${output.analysis.strongAreas.join(', ')}`);
console.log(`Gaps: ${output.analysis.gapAreas.join(', ')}`);
```

## 📁 File Structure

```
PSB CV Builder Implementation
├── Core Modules
│   ├── psb-job-parser.ts          (Job description parsing)
│   ├── psb-repo-searcher.ts       (Repository metadata search)
│   ├── psb-ranker-formatter.ts    (Experience ranking & formatting)
│   ├── psb-match-analyzer.ts      (Match analysis)
│   └── psb-cv-builder-main.ts     (Orchestration)
├── Configuration
│   ├── psb-cv-builder-extension.json  (Copilot manifest)
│   └── psb-cv-builder-package.json    (NPM configuration)
├── Documentation
│   ├── PSB-CV-Builder-Documentation.md
│   └── PSB-CV-Builder-IMPLEMENTATION-SUMMARY.md
└── Testing
    └── test-scenarios.ts          (4 test scenarios)
```

## ⚙️ Configuration

### Job Description Input

The skill accepts a job description and extracts:
- Required skills and technologies
- Experience level (junior/mid/senior/staff/principal)
- Team size and scale requirements
- Focus areas (architecture, cost optimization, etc.)
- Industry context

### Output Formats

1. **Resume** (1 page, ATS-friendly)
   ```
   - Professional summary
   - Key skills
   - Top 3-5 experiences
   - No references or extras
   ```

2. **CV** (2+ pages, detailed)
   ```
   - Extended professional summary
   - Full skills with evidence
   - Complete experience section
   - Gap analysis
   - Recommendations
   ```

3. **LinkedIn** (Profile-friendly)
   ```
   - Professional summary
   - Skills list
   - Recent experiences (1-2 bullets each)
   - No extensive formatting
   ```

## 🎯 Key Capabilities

### 1. Intelligent Parsing
- Extracts requirements from natural language
- Identifies must-haves vs. nice-to-haves
- Classifies experience level
- Captures focus areas

### 2. Smart Search
- Searches projects.yml, skills.yml, technologies.yml
- Matches requirements against documented evidence
- Ranks results by relevance
- Returns quantified achievements

### 3. Relevance Ranking
- Multi-factor scoring algorithm
- Considers:
  - Technology match (40%)
  - Skill alignment (30%)
  - Focus areas (20%)
  - Recency (10%)

### 4. Professional CV Generation
- Tailored professional summary
- Skill levels with evidence
- Achievement bullets with metrics
- All claims sourced to documentation

### 5. Match Analysis
- Match score (0-100)
- Strong areas identification
- Gap area analysis
- Fabrication risk detection
- Actionable recommendations

## 📊 Example Output

```markdown
# RESUME

Match Score: 87/100

## PROFESSIONAL SUMMARY
Experienced infrastructure leader specializing in Kubernetes and cloud 
architecture. Designed and deployed Kubernetes infrastructure for 150+ 
microservices. Seeking Senior Platform Engineer role to drive continued 
infrastructure modernization and cost optimization.

## TECHNICAL SKILLS
**Expert** (5+ years production)
- Kubernetes
- Terraform
- AWS

**Advanced** (2-3 years)
- ArgoCD
- Cost Optimization

## PROFESSIONAL EXPERIENCE

### Staff Platform Engineer – CLIENT_A (2021-2023)
- Architected Kubernetes migration for 150+ microservices, reducing 
  deployment time from 2 hours to 15 minutes (92% improvement)
  [Source: projects/kubernetes/microservices-migration.md]
- Led Terraform governance framework adoption across 15 teams, 
  standardizing infrastructure provisioning
  [Source: projects/terraform/governance-framework.md]

## MATCH ANALYSIS

**Match Score**: 87/100

**Strong Areas**:
- ✓ All core requirements met
- ✓ 90% technology stack match
- ✓ Leadership experience verified
- ✓ Scale experience documented

**Gaps**:
- ⚠ Limited SRE/observability depth

**Recommendations**:
1. Lead with Kubernetes migration story in interviews
2. Prepare for observability questions
3. Highlight cost optimization achievements
```

## 🧪 Testing

### Test Scenarios Included

1. **Senior Platform Engineer** → Expected 85-95 match
2. **Staff Architect** → Expected 70-85 match
3. **DevOps Engineer** → Expected 60-75 match
4. **SRE with Service Mesh** → Expected 50-65 match

### Running Tests

```bash
npm run test:scenarios
```

## 🔍 Understanding Match Scores

| Score | Interpretation | Action |
|-------|----------------|--------|
| 85-100 | Strong match | Apply immediately |
| 70-84 | Good match | Address gaps in interview |
| 60-69 | Moderate match | Prepare learning narratives |
| <60 | Significant gaps | Consider upskilling first |

## ⚠️ Important Notes

### No Fabrication Guarantee
- **All skills must have documented evidence**
- **All CV bullets must reference source files**
- **Unverified claims are flagged**
- **Confidence levels assigned per claim**

### Source Citations
Every claim in the generated CV links back to documentation:
- Projects → projects.yml
- Skills → skills.yml or projects evidence
- Achievements → evidence/ documentation

### Honest Gap Reporting
- Missing technologies clearly identified
- Experience level gaps noted
- Specific recommendations for improvement
- Never claims expertise without evidence

## 📚 Additional Resources

- **Full Documentation**: PSB-CV-Builder-Documentation.md
- **Implementation Summary**: PSB-CV-Builder-IMPLEMENTATION-SUMMARY.md
- **Test Scenarios**: test-scenarios.ts
- **Code Comments**: Throughout psb-*.ts files

## 🐛 Troubleshooting

### No projects found
**Issue**: CV shows "no experience" matching the job
**Solution**: Verify projects.yml is populated with your projects

### Missing evidence links
**Issue**: Skills show no source documentation
**Solution**: Add documentation_link field to projects.yml entries

### Low match score
**Issue**: Match score seems too low despite relevant experience
**Solution**: Ensure all projects have full details (technologies, business_impact, etc.)

### Unverified claims flagged
**Issue**: Fabrication risk detected
**Solution**: Add evidence links or remove claims without documentation

## 🤝 Integration with PSB

The CV Builder works with other PSB skills:

1. **PSB-Onboard**: Document new projects/skills
2. **PSB-Quality-Checker**: Validate CV output
3. **PSB-Analyzer**: Identify skill gaps to address
4. **PSB-Interview-Coach**: Prepare for interviews

## 📞 Support

For issues or questions:
1. Check PSB-CV-Builder-Documentation.md
2. Review test-scenarios.ts for examples
3. Examine source code comments
4. Validate metadata YAML files
5. Ensure Node.js ≥ 16.0.0

---

**Version**: 1.0.0  
**Status**: Ready for Use  
**Last Updated**: August 2026
