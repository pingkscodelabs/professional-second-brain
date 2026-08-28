# PSB Curator Agent - Quick Start Guide

## 30-Second Overview

The **PSB Curator Agent** is an autonomous agent that intelligently organizes your Professional Second Brain repository by:
- 📁 Organizing content into optimal categories
- 🔗 Mapping relationships between items
- 📝 Enhancing metadata automatically
- 🔮 Identifying emerging trends
- 💡 Recommending improvements

## Prerequisites

- Node.js 14+
- PSB Analyzer skill (already installed)
- Repository with YAML frontmatter

## Installation

### Option 1: Direct Installation

```bash
# Clone or copy the files to your PSB repository
cp psb-curator-agent.ts your-psb-repo/
cp psb-curator-implementation.ts your-psb-repo/
cp psb-curator-extension.json your-psb-repo/
cp psb-curator-package.json your-psb-repo/package.json
```

### Option 2: NPM Installation (Future)

```bash
npm install @psb/curator-agent
```

## 5-Minute Setup

### Step 1: Create Configuration File

Create `psb-curator-config.yaml` in your repository root:

```yaml
curator:
  enabled: true
  default_depth: detailed
  auto_apply: false
  min_confidence: 75

categories:
  projects:
    path: projects
    keywords: [project, implemented, built]
    auto_organize: true
  skills:
    path: skills
    keywords: [skill, expertise, proficiency]
    auto_organize: true
  experience:
    path: experience
    keywords: [role, position, company]
    auto_organize: true

metadata_schema:
  title:
    type: string
    required: true
  description:
    type: string
  category:
    type: string
    required: true
  tags:
    type: array
```

### Step 2: Import and Run

```typescript
import { runCurator } from './psb-curator-agent';

// Simple organization
const result = await runCurator('.', {
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});

console.log('Curation complete!');
console.log(`Processed: ${result.curation_metrics.items_processed} items`);
```

### Step 3: Review and Apply

```typescript
// Review suggestions
result.organization_changes.forEach(change => {
  console.log(`Move: ${change.item}`);
  console.log(`  From: ${change.current_location}`);
  console.log(`  To: ${change.suggested_location}`);
  console.log(`  Confidence: ${change.confidence}%`);
});

// Apply changes if confident
if (confirm('Apply changes?')) {
  await applyChanges(result);
}
```

## Common Operations

### Organize Content

```typescript
const result = await runCurator('.', {
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});
```

**Output:**
- Suggested file relocations
- Confidence scores
- Reorganization reasons

### Map Relationships

```typescript
const result = await runCurator('.', {
  operation: 'map_relationships',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: true
});
```

**Output:**
- Connection map (skill-to-project, etc.)
- Orphaned items
- Connected clusters

### Enhance Metadata

```typescript
const result = await runCurator('.', {
  operation: 'enhance_metadata',
  scope: 'directory',
  target_path: 'projects',
  depth: 'comprehensive',
  auto_apply: true
});
```

**Output:**
- Enhanced YAML frontmatter
- Added missing fields
- Fixed inconsistencies

### Identify Trends

```typescript
const result = await runCurator('.', {
  operation: 'identify_trends',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: false
});
```

**Output:**
- Emerging skills
- Technology evolution
- Skill combinations
- Experience clusters

### Get Recommendations

```typescript
const result = await runCurator('.', {
  operation: 'recommend',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: false
});
```

**Output:**
- Content gap recommendations
- Metadata improvements
- Structure optimizations
- Priority/effort estimates

## Output Formats

### JSON Export

```typescript
curator.exportResults(result, 'curation-results.json');
```

**Contains:**
- All metrics
- All changes
- All recommendations
- Complete analysis

### Markdown Report

```typescript
curator.exportRecommendationsAsMarkdown(result, 'recommendations.md');
```

**Contains:**
- Formatted recommendations
- Priority sorting
- Implementation steps
- Related items

## Key Concepts

### Confidence Scoring

All suggestions include confidence (0-100):
- **90-100%**: High confidence, safe to apply
- **70-89%**: Good confidence, review before applying
- **50-69%**: Moderate confidence, manual review recommended
- **<50%**: Low confidence, requires decision

### Analysis Depth

- **Surface**: Quick analysis (seconds), basic insights
- **Detailed**: Standard analysis (5-10 seconds), thorough insights
- **Comprehensive**: Deep analysis (10-30 seconds), maximum insights

### Operation Scope

- **file**: Single file
- **directory**: Folder and contents
- **category**: All items in a category
- **repository**: Entire repository

## Typical Workflow

### Day 1: Analysis

```typescript
// Analyze current state without changes
const result = await runCurator('.', {
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});

// Review all suggestions
// Take notes on what to change
```

### Day 2-3: Manual Application

```typescript
// Apply high-confidence changes manually
// Start with organization
// Then metadata enhancement
// Verify results

// If happy with changes, proceed to automation
```

### Day 4+: Automation

```typescript
// Once confident, enable auto_apply
await runCurator('.', {
  operation: 'organize',
  depth: 'detailed',
  auto_apply: true
});

// Schedule regular runs
// Monitor recommendations
// Adjust configuration as needed
```

## Configuration Examples

### Conservative (Manual Review Required)

```yaml
curator:
  min_confidence: 85
  auto_apply: false
  default_depth: surface
```

### Balanced (Recommended)

```yaml
curator:
  min_confidence: 75
  auto_apply: false
  default_depth: detailed
```

### Aggressive (High Automation)

```yaml
curator:
  min_confidence: 60
  auto_apply: true
  default_depth: comprehensive
```

## Troubleshooting

### Files not organizing?

```typescript
// Check configuration has categories defined
// Verify files match category keywords
// Lower min_confidence threshold
// Run with comprehensive depth
```

### Metadata not enhancing?

```typescript
// Check YAML frontmatter format
// Verify schema_definition is correct
// Ensure write permissions
// Check auto_apply is enabled
```

### Performance slow?

```typescript
// Use surface depth instead of comprehensive
// Target specific directory instead of repository
// Add filters to reduce item count
// Run during off-peak hours
```

## Next Steps

1. ✅ Copy files to repository
2. ✅ Create configuration
3. ✅ Run first organization analysis
4. ✅ Review recommendations
5. ✅ Apply high-confidence changes
6. ✅ Enhance metadata
7. ✅ Review trends
8. ✅ Enable auto operations

## Resources

- **Full Documentation**: See `PSB-Curator-IMPLEMENTATION.md`
- **API Reference**: See `PSB-Curator-API-REFERENCE.md`
- **Examples**: See `PSB-Curator-EXAMPLES.md`
- **Deployment Guide**: See `PSB-Curator-DEPLOYMENT.md`

## Quick Commands

```bash
# Compile TypeScript
npm run compile

# Run tests
npm run test

# Watch for changes
npm run watch

# Generate documentation
npm run docs
```

## Tips & Tricks

### Batch Operations

```typescript
// Process multiple operations in sequence
const organizeResult = await runCurator('.', { operation: 'organize', ... });
const metadataResult = await runCurator('.', { operation: 'enhance_metadata', ... });
const trendResult = await runCurator('.', { operation: 'identify_trends', ... });
```

### Filtered Operations

```typescript
// Target specific categories
await runCurator('.', {
  scope: 'category',
  target_path: 'projects',
  ...
});

// Filter by file type
await runCurator('.', {
  filters: { fileType: '.md' },
  ...
});
```

### Result Analysis

```typescript
// Filter high-priority recommendations
const highPriority = result.recommendations
  .filter(r => r.priority === 'high');

// Sort by effort
const byEffort = highPriority
  .sort((a, b) => {
    const order = { low: 0, medium: 1, high: 2 };
    return order[a.estimated_effort] - order[b.estimated_effort];
  });
```

## Support & Feedback

- Found an issue? Report it on GitHub
- Have suggestions? Open a discussion
- Need help? Check the full documentation

---

**Ready to organize your Professional Second Brain?** 🚀

Start with:
```typescript
const result = await runCurator('.', {
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});
```
