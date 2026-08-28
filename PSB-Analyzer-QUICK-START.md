# PSB-Analyzer Quick Start Guide

Get up and running with PSB-Analyzer in minutes.

## Installation

### 1. Copy Files to Repository

```bash
# Copy analyzer files to .github/extensions/psb-analyzer/
cp psb-analyzer*.ts .github/extensions/psb-analyzer/
cp psb-*-analyzer.ts .github/extensions/psb-analyzer/
cp psb-analyzer-extension.json .github/extensions/psb-analyzer/
```

### 2. Load Extension in Copilot

```bash
# Reload extensions
extensions_reload
```

### 3. Verify Installation

```bash
# List loaded extensions
extensions_manage operation:list
```

Expected output should show `psb-analyzer` in the list of active extensions.

---

## 5-Minute Tutorial

### Step 1: Generate Career Overview

```typescript
import PSBAnalyzer from 'psb-analyzer';

// Generate comprehensive analysis
const analysis = await PSBAnalyzer.analyzeCareerOverview();

console.log('Career Narrative:', analysis.careerNarrative);
console.log('Total Experience:', analysis.statistics.totalYearsExperience, 'years');
console.log('Key Insights:');
analysis.insights.forEach(insight => {
  console.log(`- ${insight.finding}`);
});
```

### Step 2: Analyze Timeline

```typescript
// Build timeline visualization
const timeline = await PSBAnalyzer.analyzeTimeline({
  visualize: true
});

console.log(timeline.visualizations.timeline);
```

### Step 3: Review Skills

```typescript
// Get skill matrix
const skills = await PSBAnalyzer.analyzeSkills({
  clusterSkills: true
});

console.log('Top Skills:');
skills.visualizations.skillMatrix?.slice(0, 5).forEach(skill => {
  console.log(`- ${skill.skill} (Depth: ${skill.depth}/5)`);
});
```

### Step 4: Identify Gaps

```typescript
// Find gaps for target role
const gaps = await PSBAnalyzer.analyzeGaps({
  targetRole: 'Staff Engineer',
  includeLearningPaths: true
});

console.log('Critical Gaps:');
gaps.insights.forEach(insight => {
  if (insight.confidence === 'high') {
    console.log(`- ${insight.finding}`);
    console.log(`  Recommendation: ${insight.actionableRecommendation}`);
  }
});
```

### Step 5: Find Differentiators

```typescript
// Identify unique strengths
const diff = await PSBAnalyzer.identifyDifferentiators({
  focusOnRarity: true
});

console.log('Unique Strengths:');
diff.insights.forEach(insight => {
  console.log(`- ${insight.category}: ${insight.finding}`);
});
```

---

## Common Tasks

### Full Career Analysis

```typescript
const fullAnalysis = await PSBAnalyzer.analyzeCareerOverview({
  includeSections: [
    'timeline',
    'statistics', 
    'insights',
    'recommendations',
    'narrative'
  ],
  focusArea: 'growth'
});

// Access results
console.log(fullAnalysis.careerNarrative);
console.log(JSON.stringify(fullAnalysis.statistics, null, 2));
fullAnalysis.insights.forEach(i => console.log(i.finding));
fullAnalysis.recommendations.forEach(r => console.log(r));
```

### Analyze Recent Years

```typescript
const recent = await PSBAnalyzer.analyzeCareerOverview({
  timeRange: {
    startDate: '2022-01-01',
    endDate: '2024-12-31'
  }
});

console.log('Recent Career Highlights:');
recent.insights.forEach(i => console.log(`- ${i.finding}`));
```

### Focus on Impact

```typescript
const impactAnalysis = await PSBAnalyzer.analyzeAchievements({
  extractMetrics: true,
  categorizeImpact: true,
  timeRange: 'all'
});

console.log('Top Achievements by Impact:');
impactAnalysis.insights.forEach(i => {
  if (i.confidence === 'high') {
    console.log(`${i.category}: ${i.finding}`);
  }
});
```

### Technology Evolution

```typescript
const techAnalysis = await PSBAnalyzer.analyzeTechnologies({
  groupByCategory: true,
  showTimeline: true,
  identifyTrends: true
});

console.log('Technology Clusters:');
techAnalysis.visualizations.technologyClusters?.forEach(cluster => {
  console.log(`${cluster}`);
});
```

### Project Pattern Analysis

```typescript
const projectAnalysis = await PSBAnalyzer.analyzeProjects({
  identifyPatterns: true,
  categorizeByType: true,
  duration: 'last-5-years'
});

console.log('Project Patterns:');
projectAnalysis.insights.slice(0, 5).forEach(i => {
  console.log(`- ${i.finding}`);
});
```

---

## Output Formats

### Insight Structure

Each insight follows this structure:

```typescript
{
  category: string;           // Category name
  finding: string;            // Main finding
  evidencePoints: string[];   // Supporting evidence
  confidence: 'high' | 'medium' | 'low';
  actionableRecommendation: string;
  sourceFiles?: string[];     // Optional source files
}
```

### Statistics Structure

```typescript
{
  totalYearsExperience: number;
  totalProjects: number;
  technologyCount: number;
  skillCount: number;
  averageProjectDuration: number;
  careerGrowthTrajectory: 'ascending' | 'stable' | 'varied';
}
```

### Complete Output

```typescript
{
  analysisType: string;  // Type of analysis performed
  insights: Insight[];   // Array of insights
  statistics: object;    // Career statistics
  visualizations: {
    timeline?: string;
    technologyClusters?: string[];
    skillMatrix?: SkillEntry[];
    careerTrajectory?: string;
    projectDistribution?: string;
  };
  careerNarrative: string;      // Summary narrative
  recommendations: string[];    // Recommendations
  generatedAt: string;          // ISO timestamp
}
```

---

## Data Requirements

PSB-Analyzer works with existing PSB data structure:

### Required Files

- `experience/*.md` - Career roles and positions
- `projects/*.md` - Project documentation
- `achievements/*.md` - Documented accomplishments

### Recommended Data Fields

In experience files:
```yaml
---
title: Role Title
company: Company Name
startDate: 2020-01-01
endDate: 2022-12-31
technologies: [Kubernetes, AWS, Terraform]
skills: [Infrastructure, Leadership, Architecture]
---
```

In project files:
```yaml
---
name: Project Name
startDate: 2020-06-01
endDate: 2020-12-31
technologies: [Python, AWS]
impact: 40% cost reduction
metrics: [100M API calls, 99.9% uptime]
---
```

---

## Troubleshooting

### Extension Not Loading

```bash
# Check extension status
extensions_manage operation:inspect name:psb-analyzer

# View logs
tail -f .extension-logs/psb-analyzer.log

# Reload manually
extensions_reload
```

### Empty Analysis Results

**Problem**: Analyzer returns no insights

**Solutions**:
1. Verify repository has experience/project data
2. Check data format (YAML metadata + Markdown content)
3. Ensure dates are ISO 8601 format (YYYY-MM-DD)
4. Run with specific filters to diagnose

```typescript
// Debug: analyze just timeline
const timeline = await PSBAnalyzer.analyzeTimeline();
console.log('Timeline entries:', timeline.analysisMetadata?.dataPoints);
```

### Low Confidence Insights

**Problem**: All insights show "low" confidence

**Solutions**:
1. Add more detailed descriptions
2. Include quantifiable metrics
3. Document technologies explicitly
4. Provide more project examples

### Performance Issues

**Problem**: Analysis is slow

**Solutions**:
1. Use time range filters:
```typescript
const filtered = await PSBAnalyzer.analyzeCareerOverview({
  timeRange: {
    startDate: '2020-01-01'
  }
});
```

2. Reduce scope:
```typescript
const focusedAnalysis = await PSBAnalyzer.analyzeSkills({
  categoryFilter: 'Infrastructure'
});
```

---

## Next Steps

1. **Review Full Documentation**: Read [PSB-Analyzer-README.md](PSB-Analyzer-README.md)
2. **Check Implementation Details**: See [PSB-Analyzer-IMPLEMENTATION.md](PSB-Analyzer-IMPLEMENTATION.md)
3. **Deployment Checklist**: Use [PSB-Analyzer-DEPLOYMENT-CHECKLIST.md](PSB-Analyzer-DEPLOYMENT-CHECKLIST.md)
4. **Run Examples**: Test with provided examples
5. **Customize Output**: Adapt analysis to your needs

---

## Tips & Tricks

### Combine Multiple Analyses

```typescript
// Comprehensive view
const [overview, skills, techs, gaps] = await Promise.all([
  PSBAnalyzer.analyzeCareerOverview(),
  PSBAnalyzer.analyzeSkills({ clusterSkills: true }),
  PSBAnalyzer.analyzeTechnologies(),
  PSBAnalyzer.analyzeGaps({ targetRole: 'Staff Engineer' })
]);
```

### Export to JSON

```typescript
const analysis = await PSBAnalyzer.analyzeCareerOverview();
const json = JSON.stringify(analysis, null, 2);
fs.writeFileSync('analysis.json', json);
```

### Focus on High Confidence

```typescript
const analysis = await PSBAnalyzer.analyzeCareerOverview();
const highConfidence = analysis.insights.filter(i => i.confidence === 'high');
console.log('High Confidence Insights:', highConfidence);
```

### Time-Bound Analysis

```typescript
// Last 3 years
const recent = await PSBAnalyzer.analyzeAchievements({
  timeRange: 'last-3-years'
});

// Specific range
const period = await PSBAnalyzer.analyzeCareerOverview({
  timeRange: {
    startDate: '2020-01-01',
    endDate: '2020-12-31'
  }
});
```

---

## Support

- **Documentation**: See [PSB-Analyzer-README.md](PSB-Analyzer-README.md)
- **Issues**: Check [Troubleshooting](#troubleshooting)
- **Examples**: Review [Examples](PSB-Analyzer-README.md#examples)
- **Implementation**: Read [Implementation Details](PSB-Analyzer-IMPLEMENTATION.md)

