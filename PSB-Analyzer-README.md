# PSB-Analyzer Skill Documentation

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Core Analyzers](#core-analyzers)
5. [Usage Guide](#usage-guide)
6. [Data Model](#data-model)
7. [API Reference](#api-reference)
8. [Examples](#examples)
9. [Performance](#performance)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The PSB-Analyzer is a comprehensive analytics engine for the Professional Second Brain repository. It transforms raw career documentation into actionable insights by analyzing timelines, skills, technologies, projects, and achievements.

### Purpose

The analyzer enables professionals to:
- Understand their career narrative and progression
- Identify strengths and differentiators
- Discover skill gaps and learning opportunities
- Track technology adoption and evolution
- Quantify achievement impact
- Make informed career decisions

### Key Benefits

- **Data-Driven Insights**: Extracts actionable intelligence from documented experience
- **Career Intelligence**: Provides comprehensive understanding of career trajectory
- **Skills Assessment**: Identifies depth, breadth, and market value of capabilities
- **Growth Recommendations**: Suggests development paths based on data
- **Competitive Positioning**: Finds unique differentiators in career profile
- **Timeline Visualization**: Presents career history in clear, visual format

---

## Features

### 1. Career Timeline Analysis
- **Chronological Mapping**: Build complete timeline of roles and transitions
- **Gap Detection**: Identify employment gaps and analyze implications
- **Transition Analysis**: Understand career moves (promotion, lateral, pivot)
- **Tenure Pattern**: Detect job-hopping vs loyalty patterns
- **Visualization**: ASCII timeline representation

### 2. Skills Analysis
- **Skill Matrix**: Comprehensive inventory of skills with depth levels
- **Clustering**: Group related skills by domain
- **Evolution Tracking**: Monitor skill development over time
- **Breadth vs Depth**: Analyze profile (specialist, generalist, T-shaped, Pi-shaped)
- **Market Value Assessment**: Evaluate demand for skills
- **Gap Identification**: Find missing skills for target roles

### 3. Technology Stack Analysis
- **Technology Inventory**: Complete list of technologies used
- **Adoption Timeline**: When technologies were learned and used
- **Clustering**: Group by category (cloud, languages, frameworks, etc.)
- **Trend Analysis**: Identify emerging and declining technologies
- **Synergy Detection**: Find powerful technology combinations
- **Market Relevance**: Assess current market demand

### 4. Project Pattern Analysis
- **Pattern Recognition**: Identify common project types
- **Scale Analysis**: Understand project scope evolution
- **Type Categorization**: Classify projects (infrastructure, development, consulting)
- **Impact Assessment**: Extract metrics and outcomes
- **Technology Mapping**: Associate projects with technologies

### 5. Achievement Analytics
- **Metric Extraction**: Pull quantifiable outcomes from achievements
- **Impact Categorization**: Classify by type (cost, performance, team, product)
- **Time Analysis**: Track achievement frequency over time
- **Pattern Recognition**: Identify achievement themes
- **Evidence Collection**: Map achievements to projects and roles

### 6. Career Trajectory Analysis
- **Progression Tracking**: Monitor level, scope, and responsibility evolution
- **Theme Identification**: Discover career focus areas and patterns
- **Growth Benchmarking**: Compare against industry trajectories
- **Future Projections**: Model likely career progression
- **Risk Assessment**: Identify potential career plateaus

### 7. Skill Gap Analysis
- **Target Role Analysis**: Compare current skills to target position
- **Industry Trend Mapping**: Align with emerging technologies
- **Priority Ranking**: Prioritize gaps by impact
- **Learning Paths**: Suggest development strategies
- **Time Estimation**: Estimate mastery timeframes

### 8. Differentiator Identification
- **Uniqueness Analysis**: Find rare skill combinations
- **Niche Recognition**: Identify professional specialties
- **Competitive Advantages**: Highlight market-value differentiators
- **Positioning Suggestions**: Recommend how to communicate strengths
- **Rarity Assessment**: Quantify how uncommon the profile is

---

## Architecture

### Component Structure

```
psb-analyzer/
├── psb-analyzer-extension.json      # Extension manifest
├── psb-analyzer.ts                  # Main analyzer class
├── psb-timeline-analyzer.ts         # Timeline analysis
├── psb-skills-analyzer.ts           # Skills analysis
├── psb-technologies-analyzer.ts     # Technology analysis
├── psb-projects-analyzer.ts         # Project analysis
├── psb-achievements-analyzer.ts     # Achievement analysis
├── psb-trajectory-analyzer.ts       # Trajectory analysis
├── psb-gaps-analyzer.ts             # Gap analysis
├── psb-differentiators-analyzer.ts  # Differentiator analysis
└── tests/
    ├── timeline.test.ts
    ├── skills.test.ts
    ├── technologies.test.ts
    ├── projects.test.ts
    ├── achievements.test.ts
    └── integration.test.ts
```

### Data Flow

```
Repository Files
    ↓
Extract Data (experiences, projects, achievements, skills)
    ↓
Parse & Normalize
    ↓
Individual Analyzers
    ├─→ Timeline Analyzer
    ├─→ Skills Analyzer
    ├─→ Technologies Analyzer
    ├─→ Projects Analyzer
    └─→ Achievements Analyzer
    ↓
Insight Generation
    ↓
Output Formatting
    ↓
Analysis Report
```

### Type Hierarchy

```
AnalysisOutput (root)
├── analysisType
├── insights: Insight[]
│   ├── category
│   ├── finding
│   ├── evidencePoints
│   ├── confidence
│   └── actionableRecommendation
├── statistics
├── visualizations
├── careerNarrative
└── recommendations
```

---

## Core Analyzers

### TimelineAnalyzer

Analyzes career chronology and employment patterns.

**Key Methods:**
- `buildTimeline()` - Create chronological event list
- `detectGaps()` - Find employment gaps
- `analyzeTransitions()` - Analyze role changes
- `analyzeTenurePattern()` - Detect stability patterns
- `generateTimelineVisualization()` - Create ASCII timeline

**Output Example:**
```
Career Timeline (2015 - 2024)
===========================================================

1. Software Engineer @ TechCorp
   Jan 2015 - Dec 2017 (2.92yr)
   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓

2. Senior Engineer @ CloudSys
   Jan 2018 - Jun 2021 (3.42yr)
   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

### SkillsAnalyzer

Analyzes skill inventory, depth, and evolution.

**Key Methods:**
- `buildSkillMatrix()` - Create comprehensive skill inventory
- `clusterSkills()` - Group related skills
- `analyzeSkillEvolution()` - Track skill development
- `analyzeBreadthVsDepth()` - Profile analysis
- `identifySkillGaps()` - Find missing skills

**Output Example:**
```
Skill Matrix (Top 10)
Kubernetes (Depth: 5, Expert)
  Evidence: 12 projects, 5 roles
AWS (Depth: 5, Expert)
  Evidence: 8 projects, 3 roles
Terraform (Depth: 4, Advanced)
  Evidence: 6 projects, 2 roles
```

### TechnologiesAnalyzer

Analyzes technology adoption and specialization.

**Key Methods:**
- `buildTechnologyInventory()` - Complete technology list
- `clusterByCategory()` - Group technologies
- `analyzeAdoptionTimeline()` - Track adoption patterns
- `identifyTrends()` - Find trending technologies
- `assessMarketValue()` - Evaluate technology demand

**Output Example:**
```
Technology Clusters
Cloud Platforms (Expert)
  AWS, Azure, GCP

Containerization (Expert)
  Kubernetes, Docker

Programming Languages (Advanced)
  Python, Go, TypeScript
```

### ProjectsAnalyzer

Analyzes project patterns and characteristics.

**Key Methods:**
- `identifyPatterns()` - Find common patterns
- `categorizeByType()` - Classify projects
- `analyzeScale()` - Understand scope evolution
- `extractMetrics()` - Pull achievement metrics
- `mapTechnologies()` - Associate technologies

### AchievementsAnalyzer

Extracts and analyzes measurable outcomes.

**Key Methods:**
- `extractMetrics()` - Find quantifiable results
- `categorizeByImpact()` - Classify impact type
- `analyzeFrequency()` - Track over time
- `identifyPatterns()` - Find achievement themes
- `assessImpactValue()` - Quantify significance

### TrajectoryAnalyzer

Analyzes career progression patterns.

**Key Methods:**
- `analyzeProgression()` - Track level/scope change
- `identifyThemes()` - Find career focus areas
- `projectFuture()` - Model progression
- `benchmarkIndustry()` - Compare to standards
- `assessRisks()` - Identify plateaus

### GapsAnalyzer

Identifies skill gaps and opportunities.

**Key Methods:**
- `analyzeTargetRole()` - Compare to target
- `assessIndustryTrends()` - Align with market
- `prioritizeGaps()` - Rank by impact
- `generateLearningPaths()` - Suggest development
- `estimateMastery()` - Estimate timeframes

### DifferentiatorAnalyzer

Identifies unique strengths and advantages.

**Key Methods:**
- `findRareCombinations()` - Find unique skill sets
- `identifyNiches()` - Recognize specialties
- `assessCompetitiveAdvantage()` - Evaluate strengths
- `positioningRecommendations()` - Suggest communication
- `quantifyUniqueness()` - Measure rarity

---

## Usage Guide

### Basic Analysis

```typescript
import PSBAnalyzer from './psb-analyzer';

// Generate comprehensive overview
const analysis = await PSBAnalyzer.analyzeCareerOverview({
  includeSections: ['timeline', 'statistics', 'insights'],
  focusArea: 'growth'
});

console.log(analysis.careerNarrative);
console.log(analysis.insights);
```

### Timeline Analysis

```typescript
import TimelineAnalyzer from './psb-timeline-analyzer';

// Analyze career timeline
const timeline = TimelineAnalyzer.buildTimeline(experiences);
const gaps = TimelineAnalyzer.detectGaps(experiences);
const transitions = TimelineAnalyzer.analyzeTransitions(experiences);

console.log(TimelineAnalyzer.generateTimelineVisualization(experiences));
```

### Skills Analysis

```typescript
import SkillsAnalyzer from './psb-skills-analyzer';

// Analyze skills
const skillMatrix = SkillsAnalyzer.buildSkillMatrix(experiences, projects);
const clusters = SkillsAnalyzer.clusterSkills(skillMatrix);
const breadthDepth = SkillsAnalyzer.analyzeBreadthVsDepth(skillMatrix);

console.log(`Profile: ${breadthDepth.profile}`);
console.log(`Breadth: ${breadthDepth.breadth}, Depth: ${breadthDepth.depth}`);
```

### Filtered Analysis

```typescript
// Analyze specific time period
const analysis = await PSBAnalyzer.analyzeCareerOverview({
  timeRange: {
    startDate: '2020-01-01',
    endDate: '2024-12-31'
  },
  focusArea: 'impact'
});
```

### Targeted Analysis

```typescript
// Analyze for specific role
const gaps = await PSBAnalyzer.analyzeGaps({
  targetRole: 'Staff Engineer',
  targetIndustry: 'Cloud Infrastructure',
  includeLearningPaths: true
});
```

---

## Data Model

### Experience Entity

```typescript
interface Experience {
  title: string;
  company: string;
  startDate: string;        // ISO 8601
  endDate?: string;         // ISO 8601
  description: string;
  technologies: string[];
  skills: string[];
  achievements: string[];
  confidentiality?: string;
}
```

### Project Entity

```typescript
interface Project {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  technologies: string[];
  impact: string;
  metrics?: string[];
  category: string;
}
```

### Achievement Entity

```typescript
interface Achievement {
  title: string;
  description: string;
  date: string;
  metrics: string[];
  impact: string;
  category: string;
}
```

### Skill Entity

```typescript
interface Skill {
  name: string;
  category: string;
  depth: 1 | 2 | 3 | 4 | 5;
  proficiency: string;
  yearsOfExperience: number;
  evidence: string[];
}
```

---

## API Reference

### PSBAnalyzer

Main analyzer class with static methods.

#### analyzeCareerOverview()

Generate comprehensive career analysis.

```typescript
static async analyzeCareerOverview(options?: {
  includeSections?: string[];
  timeRange?: TimeRange;
  focusArea?: 'growth' | 'impact' | 'breadth' | 'specialization';
}): Promise<AnalysisOutput>
```

**Parameters:**
- `includeSections`: Which sections to analyze (timeline, statistics, insights, etc.)
- `timeRange`: Optional date range filter
- `focusArea`: Specific area to emphasize in insights

**Returns:** Complete analysis with insights, statistics, and recommendations

#### analyzeTimeline()

Build chronological view.

```typescript
static async analyzeTimeline(options?: {
  granularity?: 'years' | 'quarters' | 'months';
  includeGaps?: boolean;
  visualize?: boolean;
}): Promise<AnalysisOutput>
```

#### analyzeSkills()

Analyze skill depth and breadth.

```typescript
static async analyzeSkills(options?: {
  categoryFilter?: string;
  includeEvolution?: boolean;
  depthAnalysis?: boolean;
  clusterSkills?: boolean;
}): Promise<AnalysisOutput>
```

#### analyzeTechnologies()

Analyze technology stack.

```typescript
static async analyzeTechnologies(options?: {
  groupByCategory?: boolean;
  showTimeline?: boolean;
  identifyTrends?: boolean;
  depthThreshold?: number;
}): Promise<AnalysisOutput>
```

#### analyzeProjects()

Analyze project patterns.

```typescript
static async analyzeProjects(options?: {
  identifyPatterns?: boolean;
  categorizeByType?: boolean;
  analyzeScale?: boolean;
  duration?: 'all' | 'last-year' | 'last-3-years' | 'last-5-years';
}): Promise<AnalysisOutput>
```

#### analyzeAchievements()

Extract achievement metrics.

```typescript
static async analyzeAchievements(options?: {
  extractMetrics?: boolean;
  categorizeImpact?: boolean;
  identifyPatterns?: boolean;
  timeRange?: 'all' | 'last-year' | 'last-3-years' | 'last-5-years';
}): Promise<AnalysisOutput>
```

#### analyzeTrajectory()

Analyze career progression.

```typescript
static async analyzeTrajectory(options?: {
  includeProgression?: boolean;
  identifyThemes?: boolean;
  projections?: boolean;
  compareBenchmarks?: boolean;
}): Promise<AnalysisOutput>
```

#### analyzeGaps()

Identify skill gaps.

```typescript
static async analyzeGaps(options?: {
  targetRole?: string;
  targetIndustry?: string;
  trendAnalysis?: boolean;
  prioritizeByImpact?: boolean;
  includeLearningPaths?: boolean;
}): Promise<AnalysisOutput>
```

#### identifyDifferentiators()

Find unique strengths.

```typescript
static async identifyDifferentiators(options?: {
  compareToRole?: string;
  focusOnRarity?: boolean;
  identifyNiches?: boolean;
  analyzeUniqueness?: boolean;
}): Promise<AnalysisOutput>
```

---

## Examples

### Example 1: Career Overview Analysis

```typescript
const overview = await PSBAnalyzer.analyzeCareerOverview();

// Output structure:
{
  analysisType: 'overview',
  insights: [
    {
      category: 'Career Length',
      finding: '10+ years of experience in cloud infrastructure',
      evidencePoints: ['5 roles at leading tech companies', '15+ projects'],
      confidence: 'high',
      actionableRecommendation: 'Strong candidate for architect roles'
    }
  ],
  statistics: {
    totalYearsExperience: 10.5,
    totalProjects: 15,
    technologyCount: 32,
    skillCount: 45,
    careerGrowthTrajectory: 'ascending'
  },
  careerNarrative: 'Started as Junior Engineer... grew to technical leadership...',
  recommendations: [...]
}
```

### Example 2: Timeline with Visualization

```typescript
const timeline = await PSBAnalyzer.analyzeTimeline({
  granularity: 'years',
  visualize: true
});

// Includes ASCII visualization:
// Career Timeline (2015 - 2024)
// ===========================================================
// 1. Software Engineer @ Company A
//    2015-2017 (2.92yr)
//    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

### Example 3: Skills Analysis with Clustering

```typescript
const skills = await PSBAnalyzer.analyzeSkills({
  clusterSkills: true,
  includeEvolution: true
});

// Returns:
// Skill Clusters:
// - Cloud Platforms (Expert): AWS, Azure, GCP
// - Container/Orchestration (Expert): Kubernetes, Docker
// - Programming (Advanced): Python, Go, TypeScript
// - Databases (Advanced): PostgreSQL, MongoDB, Redis
```

### Example 4: Gap Analysis for Target Role

```typescript
const gaps = await PSBAnalyzer.analyzeGaps({
  targetRole: 'VP Engineering',
  targetIndustry: 'FinTech',
  includeLearningPaths: true
});

// Returns critical gaps and learning paths:
// Gap 1: Strategic Financial Systems
//   Current: None
//   Target: Advanced
//   Learning Path: [Basic Finance, FinTech Systems, Strategy]
```

### Example 5: Differentiator Analysis

```typescript
const diff = await PSBAnalyzer.identifyDifferentiators({
  compareToRole: 'Staff Engineer',
  focusOnRarity: true
});

// Highlights unique combinations:
// Rare Combination: Kubernetes + Terraform + Go
//   Rarity: Uncommon
//   Market Value: High
//   Competitive Advantage: Infrastructure automation specialist
```

---

## Performance

### Scalability

- **Handles 100+ projects**: Processes large datasets efficiently
- **1000+ skills**: Complete skill inventory management
- **50+ years experience**: Full career timeline analysis
- **10,000+ achievements**: Metric extraction from large datasets

### Performance Characteristics

- Timeline analysis: O(n log n) for n experiences
- Skills clustering: O(m²) for m skills (optimized)
- Technology categorization: O(n) for n projects
- Insight generation: O(n + m) for n skills, m projects

### Optimization Tips

1. Filter by time range for faster analysis
2. Exclude non-relevant categories
3. Cache analyzer results between runs
4. Use confidence thresholds to limit insights

---

## Troubleshooting

### Issue: Low Confidence Scores

**Problem**: Insights showing "low" confidence

**Solutions:**
- Ensure repository data is complete
- Add more evidence/projects for skills
- Provide more detailed project descriptions
- Include quantifiable metrics

### Issue: Missing Skills in Analysis

**Problem**: Skills not appearing in skill matrix

**Solutions:**
- Check data format matches expected schema
- Ensure skills are documented in experiences/projects
- Verify no typos or alternate spellings
- Run with `depthAnalysis: true` to debug

### Issue: Incorrect Timeline Gaps

**Problem**: Timeline showing false gaps

**Solutions:**
- Verify date formats (ISO 8601: YYYY-MM-DD)
- Check for overlapping roles (consultancy + full-time)
- Ensure `endDate` is populated for all roles

### Issue: Performance Issues

**Problem**: Analysis takes too long

**Solutions:**
- Reduce time range for filtering
- Exclude non-critical sections
- Reduce granularity (use years instead of months)
- Check repository for corrupt data entries

### Issue: Unexpected Categorizations

**Problem**: Skills/technologies categorized incorrectly

**Solutions:**
- Review categorization logic for edge cases
- Provide explicit category hints
- Use more specific skill names
- Report issues for custom categorization

---

## Best Practices

1. **Regular Updates**: Keep career documentation current for accurate analysis
2. **Detailed Metrics**: Include quantifiable outcomes in achievements
3. **Technology Tagging**: Explicitly tag technologies used
4. **Date Consistency**: Use ISO 8601 format for all dates
5. **Skill Documentation**: Document skills in both experiences and skill files
6. **Evidence Collection**: Maintain detailed evidence for skill depth assessment
7. **Category Consistency**: Use consistent naming for companies, roles, technologies

---

## Next Steps

- Review [Quick Start Guide](PSB-Analyzer-QUICK-START.md) for setup
- See [Implementation Guide](PSB-Analyzer-IMPLEMENTATION.md) for details
- Check [Deployment Checklist](PSB-Analyzer-DEPLOYMENT-CHECKLIST.md) before deployment

