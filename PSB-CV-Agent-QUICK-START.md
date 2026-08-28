# PSB CV Agent - Quick Start Guide

## Getting Started in 5 Minutes

This guide will get you generating tailored CVs in minutes.

## Prerequisites

- Node.js 16+ installed
- npm or yarn
- psb-cv-builder-skill installed and running
- ~500MB disk space

## Installation

### 1. Copy Files

```bash
# Copy agent files to your PSB directory
cp psb-cv-agent.ts /path/to/psb/
cp psb-cv-agent-config.yaml /path/to/psb/
cp psb-cv-agent-package.json /path/to/psb/psb-cv-agent-package.json
```

### 2. Install Dependencies

```bash
cd /path/to/psb
npm install js-yaml pdfkit markdown-it
npm install --save-dev typescript ts-node @types/node
```

### 3. Verify Installation

```bash
npx tsc --version
node --version
```

## Quick Usage Examples

### Example 1: Generate a Single CV

```typescript
import PSBCVAgent from './psb-cv-agent';

const agent = new PSBCVAgent('./psb-cv-agent-config.yaml');

const request = {
  operation: 'generate',
  job_description: `
    We're looking for a Senior TypeScript Engineer with:
    - 5+ years experience with TypeScript/JavaScript
    - Strong system design skills
    - Experience with React and Node.js
    - Cloud architecture expertise (AWS/GCP)
    - Leadership experience mentoring junior developers
  `,
  format: 'pdf',
  template: 'resume',
  include_analytics: true
};

const response = await agent.execute(request);
console.log('CV Generated:', response.cv_details.filePath);
console.log('Match Score:', response.cv_details.matchScore);
```

**Output:**
```json
{
  "status": "success",
  "message": "CV successfully generated and saved to ...",
  "operation_result": {
    "generated_count": 1,
    "success_count": 1,
    "failed_count": 0,
    "files_created": ["./generated-cvs/2024-01-15/CV-1705315200000.pdf"]
  },
  "cv_details": {
    "id": "cv-1705315200000-abc123",
    "matchScore": 85,
    "technologyCoverage": 95,
    "pageCount": 1,
    "bulletCount": 12,
    "skills": ["TypeScript", "JavaScript", "React", "Node.js", "AWS"]
  }
}
```

### Example 2: Generate Multiple CVs (Batch)

```typescript
const batchRequest = {
  operation: 'generate_batch',
  job_descriptions: [
    'Senior Engineer at TechCorp: 5+ years TypeScript...',
    'Lead Developer at StartupXYZ: Full stack role...',
    'Architect at EnterpriseInc: System design focus...'
  ],
  format: 'markdown',
  include_analytics: true
};

const batchResponse = await agent.execute(batchRequest);
console.log(`Generated ${batchResponse.operation_result.success_count} CVs`);
```

### Example 3: Get Improvement Suggestions

```typescript
const suggestionRequest = {
  operation: 'suggest_improvements',
  job_description: 'Senior TypeScript Engineer required...'
};

const suggestions = await agent.execute(suggestionRequest);
suggestions.suggestions.forEach(suggestion => {
  console.log(`[${suggestion.impact}] ${suggestion.section}:`);
  console.log(`  → ${suggestion.suggestion}`);
});
```

**Output:**
```
[high] Skills:
  → Add or emphasize Cloud Architecture in your skills section
[high] Experience:
  → Add metrics showing performance improvements led
[medium] Summary:
  → Highlight leadership experience more prominently
```

### Example 4: Track Application Status

```typescript
const trackingRequest = {
  operation: 'track'
};

const trackingResponse = await agent.execute(trackingRequest);
trackingResponse.operation_result.forEach(app => {
  console.log(`${app.positionTitle} at ${app.companyName}: ${app.applicationStatus}`);
});
```

### Example 5: Analyze Performance

```typescript
const analysisRequest = {
  operation: 'analyze',
  include_analytics: true
};

const analytics = await agent.execute(analysisRequest);
console.log('CV Generation Analytics:');
console.log(`- Total CVs: ${analytics.analytics.totalGenerated}`);
console.log(`- Avg Match Score: ${analytics.analytics.avgMatchScore}%`);
console.log(`- Success Rate: ${analytics.analytics.successRate}%`);
console.log(`- Top Technologies: ${analytics.analytics.topTechnologies.join(', ')}`);
```

## Common Workflows

### Workflow 1: Apply for a Single Position

1. Get job description from job posting
2. Generate tailored CV
3. Review match score
4. Export to PDF
5. Submit application
6. Track application status

```typescript
// Step 1: Generate
const response = await agent.execute({
  operation: 'generate',
  job_description: jobText,
  format: 'pdf'
});

// Step 2: Check score
if (response.cv_details.matchScore >= 70) {
  console.log('Ready to apply!');
  // Step 3-5: Apply and track
}
```

### Workflow 2: Bulk Application Campaign

1. Collect 50+ job descriptions
2. Generate batch CVs
3. Track submission batch
4. Monitor response rates
5. Analyze performance

```typescript
// Step 1-2: Generate batch
const batchResponse = await agent.execute({
  operation: 'generate_batch',
  job_descriptions: jobsList,
  format: 'pdf'
});

// Step 3: Track batch
const tracking = await agent.execute({ operation: 'track' });

// Step 5: Analyze
const analytics = await agent.execute({ operation: 'analyze' });
```

### Workflow 3: Optimize CV for Specific Role

1. Get target role descriptions
2. Generate suggestions
3. Apply improvements
4. Generate new CV
5. Compare match scores

```typescript
// Step 1-2: Get suggestions
const suggestions = await agent.execute({
  operation: 'suggest_improvements',
  job_description: targetRole
});

// Step 4: Generate after improvements
const optimized = await agent.execute({
  operation: 'generate',
  job_description: targetRole
});

console.log('Before:', previousScore);
console.log('After:', optimized.cv_details.matchScore);
```

## Configuration Adjustments

### Adjust Output Format

Supported formats: `pdf`, `markdown`, `text`, `json`

```typescript
// Generate as Markdown
const mdRequest = {
  operation: 'generate',
  job_description: jobText,
  format: 'markdown'
};

// Generate as JSON
const jsonRequest = {
  operation: 'generate',
  job_description: jobText,
  format: 'json'
};
```

### Change Template Type

Supported templates: `resume`, `cv`, `linkedin`

```typescript
// One-page resume (ATS-optimized)
const resumeRequest = {
  operation: 'generate',
  job_description: jobText,
  template: 'resume',
  format: 'pdf'
};

// Full CV (2-3 pages, comprehensive)
const cvRequest = {
  operation: 'generate',
  job_description: jobText,
  template: 'cv',
  format: 'pdf'
};

// LinkedIn profile format
const linkedinRequest = {
  operation: 'generate',
  job_description: jobText,
  template: 'linkedin',
  format: 'markdown'
};
```

### Customize Storage Location

```typescript
const request = {
  operation: 'generate',
  job_description: jobText,
  output_path: '/custom/path/my-cv.pdf'
};
```

## Generated Files Location

By default, CVs are stored in:

```
./generated-cvs/
├── 2024-01-15/          # Date-based organization
│   ├── CV-1705315200000.pdf
│   ├── CV-1705315260000.md
│   └── CV-1705315320000.txt
├── 2024-01-14/
│   └── ...
└── 2024-01-13/
    └── ...
```

Access most recent CV:

```bash
ls -lrt ./generated-cvs/*/ | tail -1
```

## Analytics Dashboard

View generated analytics:

```bash
cat ./cv-analytics/analytics.json | jq '.'
```

Sample analytics output:

```json
{
  "totalGenerated": 25,
  "avgMatchScore": 78.4,
  "successRate": 100,
  "formatDistribution": {
    "pdf": 15,
    "markdown": 7,
    "text": 3,
    "json": 0
  },
  "topTechnologies": [
    "TypeScript",
    "React",
    "Node.js",
    "AWS",
    "Docker"
  ],
  "performanceByRole": {
    "senior-engineer": 82,
    "architect": 76,
    "lead-developer": 79
  }
}
```

## Troubleshooting

### Error: "psb-cv-builder-skill not found"

**Solution**: Ensure CV Builder Skill is installed and running

```bash
# Check if service is running
curl http://localhost:3000/health

# Install if needed
npm install psb-cv-builder-skill
```

### Error: "Directory does not exist"

**Solution**: Create storage directories

```bash
mkdir -p generated-cvs cv-history cv-analytics logs
```

### Error: "Timeout exceeded"

**Solution**: Increase timeout in config

```yaml
cvBuilder:
  timeout: 60000  # Increase to 60 seconds
```

### Generated CVs have low match score

**Solution**: Check job description quality and focus areas

```typescript
// Debug: Log extracted focus areas
const jobDesc = 'Your job description...';
const areas = agent.extractFocusAreas(jobDesc);
console.log('Focus areas:', areas);
```

## Next Steps

1. **Review API Details**: See [API-REFERENCE.md](PSB-CV-Agent-API-REFERENCE.md)
2. **Deployment**: Follow [Deployment Guide](PSB-CV-Agent-DEPLOYMENT-GUIDE.md)
3. **Test Scenarios**: Run [Test Scenarios](PSB-CV-Agent-TEST-SCENARIOS.md)
4. **Implementation**: Deep dive in [Implementation Guide](PSB-CV-Agent-IMPLEMENTATION-GUIDE.md)

## Common Questions

**Q: How do I batch process 1000 jobs?**
A: Split into smaller batches (100-200 CVs) and stagger processing:
```typescript
for (let i = 0; i < jobs.length; i += 100) {
  const batch = jobs.slice(i, i + 100);
  await agent.execute({
    operation: 'generate_batch',
    job_descriptions: batch
  });
}
```

**Q: Can I resume interrupted batch?**
A: Check cv-history directory for checkpoint files and resume from last successful CV.

**Q: How long to generate 100 CVs?**
A: ~1-2 minutes depending on job descriptions complexity and system resources.

**Q: Can I use custom CV content?**
A: Yes, the agent uses psb-cv-builder-skill which can be extended with custom content.

## Tips & Tricks

1. **Pre-process job descriptions**: Remove formatting and standardize before batch
2. **Monitor memory**: For large batches, monitor `node` process memory
3. **Cache results**: Enable caching in config for repeated similar jobs
4. **Version comparisons**: Compare match scores across CV versions
5. **Export analytics**: Use JSON export for external analysis

---

**Ready to generate your first CV? Start with Example 1 above!**

For detailed information, refer to [PSB-CV-Agent-README.md](PSB-CV-Agent-README.md)
