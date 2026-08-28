# PSB Curator Agent - README

## 🎯 Overview

**PSB Curator Agent** is an autonomous, production-ready agent that continuously organizes and curates Professional Second Brain (PSB) content. It uses intelligent analysis to organize files, map relationships, enhance metadata, identify trends, and provide recommendations.

### Key Capabilities

✅ **Intelligent Content Organization** - Automatically categorizes files based on content analysis
✅ **Relationship Mapping** - Identifies connections between skills, projects, and experiences  
✅ **Metadata Enhancement** - Automatically improves and completes YAML frontmatter
✅ **Trend Analysis** - Identifies emerging skills and technology patterns
✅ **Smart Recommendations** - Suggests portfolio improvements and content additions
✅ **Scalable** - Handles 100+ items efficiently with adjustable analysis depth
✅ **Integrates with PSB Analyzer** - Leverages powerful analytics for curation
✅ **Preserves Integrity** - Maintains content safety while organizing

## 📊 What It Does

### 1. Organize Content
- Analyzes file content and metadata
- Suggests optimal categorization
- Provides confidence scores
- Identifies reorganization opportunities

### 2. Map Relationships
- Detects skill-to-project connections
- Finds technology usage patterns
- Identifies orphaned items
- Maps connected clusters

### 3. Enhance Metadata
- Adds missing required fields
- Infers categories from content
- Extracts and organizes tags
- Fixes metadata inconsistencies

### 4. Identify Trends
- Finds emerging skills
- Tracks technology evolution
- Identifies skill combinations
- Discovers experience patterns

### 5. Recommend Improvements
- Suggests content gaps to fill
- Identifies structure optimizations
- Recommends metadata additions
- Prioritizes by impact and effort

## 🏗️ Architecture

```
Input (Operation + Scope)
        ↓
   [Curator Agent]
        ↓
    ┌───┴───────────────┬─────────┬──────────┬─────────┐
    ↓                   ↓         ↓          ↓         ↓
[Organization]  [Relationships] [Metadata] [Trends] [Recommend]
    ↓                   ↓         ↓          ↓         ↓
    └───┬───────────────┴─────────┴──────────┴─────────┘
        ↓
   [PSB Analyzer]
        ↓
   [Results Output]
```

### Core Components

| Component | Purpose |
|-----------|---------|
| **PSBCuratorAgent** | Main orchestrator |
| **ContentOrganizationEngine** | File categorization |
| **RelationshipDetectionEngine** | Connection analysis |
| **MetadataEnhancementEngine** | Metadata improvement |
| **TrendAnalysisEngine** | Trend identification |
| **RecommendationEngine** | Suggestion generation |

## 🚀 Quick Start

### 1. Installation

```bash
# Copy files to your PSB repository
cp psb-curator-*.ts psb-curator-*.md ./
```

### 2. Configuration

Create `psb-curator-config.yaml`:

```yaml
curator:
  enabled: true
  default_depth: detailed
  auto_apply: false

categories:
  projects:
    path: projects
    keywords: [project, implemented]
  skills:
    path: skills
    keywords: [skill, expertise]
```

### 3. Run

```typescript
import { runCurator } from './psb-curator-agent';

const result = await runCurator('.', {
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});

console.log(result);
```

## 📋 Usage Examples

### Organize Content
```typescript
await runCurator('.', {
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});
```

### Map Relationships
```typescript
await runCurator('.', {
  operation: 'map_relationships',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: true
});
```

### Enhance Metadata
```typescript
await runCurator('.', {
  operation: 'enhance_metadata',
  scope: 'directory',
  target_path: 'projects',
  depth: 'comprehensive',
  auto_apply: true
});
```

### Identify Trends
```typescript
await runCurator('.', {
  operation: 'identify_trends',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: false
});
```

### Get Recommendations
```typescript
await runCurator('.', {
  operation: 'recommend',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: false
});
```

## 📊 Output Specification

### Result Object
```typescript
{
  operation: string,
  status: 'success' | 'partial' | 'failed',
  
  curation_metrics: {
    items_processed: number,
    reorganizations: number,
    new_links_created: number,
    metadata_enhancements: number,
    trends_identified: number,
    execution_time_ms: number,
    success_rate: number
  },
  
  organization_changes: [...],
  relationship_map: {...},
  metadata_improvements: {...},
  trend_analysis: {...},
  recommendations: [...],
  
  applied_changes: {
    files_moved: string[],
    files_modified: string[],
    links_created: string[]
  },
  
  warnings: string[],
  errors: string[],
  timestamp: string
}
```

## 🔧 Configuration

### Basic Config
```yaml
curator:
  enabled: true
  default_depth: detailed
  auto_apply: false
  min_confidence: 75
  preserve_existing: true
```

### Advanced Config
```yaml
categories:
  experience:
    path: experience
    keywords: [role, position, company]
    fileTypes: [.md, .yaml]
    auto_organize: true

metadata_schema:
  title: { type: string, required: true }
  category: { type: string, required: true }
  tags: { type: array }

skill_hierarchy:
  languages: [Python, JavaScript, TypeScript]
  frameworks: [React, Vue, Angular]

technology_clusters:
  frontend: [React, Vue, CSS]
  backend: [Node.js, Python, Java]

trend_keywords:
  - emerging
  - ai
  - machine-learning
```

## ⚙️ Operations

### Operation Types

| Operation | Purpose | Scope | Depth |
|-----------|---------|-------|-------|
| `organize` | Categorize files | All | Any |
| `map_relationships` | Find connections | All | Any |
| `enhance_metadata` | Improve metadata | All | Any |
| `identify_trends` | Analyze patterns | All | Detailed+ |
| `recommend` | Suggest improvements | All | Any |

### Analysis Depth

- **surface**: Quick (seconds) - basic insights
- **detailed**: Standard (5-10s) - thorough analysis  
- **comprehensive**: Deep (10-30s) - maximum insights

## 🎯 Success Criteria

✅ Organizes content intelligently
✅ Maps relationships accurately  
✅ Enhances metadata consistently
✅ Identifies skill clusters correctly
✅ Creates meaningful cross-references
✅ Identifies emerging trends
✅ Provides actionable recommendations
✅ Scales to 100+ items
✅ Integrates with analyzer skill
✅ Maintains content integrity

## 📦 File Structure

```
psb-curator-agent.ts          # Main agent orchestrator
psb-curator-implementation.ts # Core algorithms
psb-curator-extension.json    # Extension configuration
psb-curator-package.json      # NPM package config
PSB-Curator-IMPLEMENTATION.md # Full implementation guide
PSB-Curator-QUICK-START.md   # Quick start guide
PSB-Curator-README.md         # This file
PSB-Curator-DEPLOYMENT.md     # Deployment guide
PSB-Curator-API-REFERENCE.md  # API reference
PSB-Curator-TEST-SCENARIOS.md # Test scenarios
```

## 🔌 Integration Points

### With PSB Analyzer
```typescript
import { PSBAnalyzer } from './psb-analyzer';
import { PSBCuratorAgent } from './psb-curator-agent';

// Use analyzer insights with curator
```

### With GitHub
- Commit organized changes
- Create issues with recommendations
- Link to related repositories

### With CI/CD
- Run curator on PR branches
- Comment with suggestions
- Block on critical issues

## 📈 Performance Characteristics

| Metric | Value |
|--------|-------|
| Items per operation | 100+ |
| Average execution time | 5-30s |
| Relationship analysis | O(n²) |
| Memory usage | Moderate |
| Disk usage | Minimal |

## 🛠️ Troubleshooting

### Files not organizing?
- Check configuration has categories
- Verify files match keywords
- Lower min_confidence threshold
- Run with comprehensive depth

### Metadata not enhancing?
- Verify YAML frontmatter format
- Check schema definition
- Ensure write permissions
- Check auto_apply enabled

### Performance issues?
- Use surface depth
- Target specific directories
- Add filters
- Run during off-peak

## 📚 Documentation

- **Quick Start**: `PSB-Curator-QUICK-START.md` - Get started in 5 minutes
- **Implementation**: `PSB-Curator-IMPLEMENTATION.md` - Full technical guide
- **API Reference**: `PSB-Curator-API-REFERENCE.md` - Complete API docs
- **Test Scenarios**: `PSB-Curator-TEST-SCENARIOS.md` - Testing guide
- **Deployment**: `PSB-Curator-DEPLOYMENT.md` - Production deployment

## 🚀 Deployment Checklist

See `PSB-Curator-DEPLOYMENT.md` for complete deployment guide.

**Quick checklist:**
- [ ] Copy all files to repository
- [ ] Install dependencies
- [ ] Create configuration file
- [ ] Run initial analysis
- [ ] Review recommendations
- [ ] Apply manual changes
- [ ] Enable auto_apply gradually
- [ ] Monitor results
- [ ] Adjust configuration
- [ ] Document learnings

## 💡 Best Practices

1. **Start Conservative** - Use auto_apply: false initially
2. **Preserve Data** - Keep version control and backups
3. **Iterate Gradually** - Small changes often better than large ones
4. **Regular Review** - Check recommendations regularly
5. **Update Config** - Keep configuration current
6. **Document Changes** - Track why changes were made

## 🎓 Common Workflows

### Initial Organization
```
1. Run organize (auto_apply: false)
2. Review suggestions
3. Apply high-confidence changes manually
4. Run enhance_metadata
5. Review and apply changes
6. Run identify_trends
7. Review results
```

### Ongoing Maintenance
```
1. Run curator weekly
2. Review recommendations
3. Apply improvements
4. Monitor trends
5. Update configuration
6. Document learnings
```

### After Major Changes
```
1. Run full curation (comprehensive depth)
2. Review all results
3. Apply high-priority items
4. Monitor side effects
5. Iterate if needed
```

## 🤝 Contributing

Contributions welcome! Please:
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Submit pull requests

## 📄 License

MIT - See LICENSE file

## 🔗 Related Projects

- PSB Analyzer - Career analytics engine
- PSB CV Builder - Resume generation
- PSB Interview Coach - Interview preparation
- PSB Quality Checker - Content quality assurance

## ❓ FAQ

**Q: Is it safe to use auto_apply?**
A: Start with auto_apply: false, review changes, then gradually enable for trusted operations.

**Q: What if I don't like the suggestions?**
A: All suggestions include confidence scores. You can adjust min_confidence threshold or disable specific operations.

**Q: How often should I run it?**
A: Weekly for active development, monthly for maintenance, as-needed for major changes.

**Q: Does it modify my content?**
A: Only if auto_apply: true. With false, it just provides suggestions.

**Q: Can I customize the rules?**
A: Yes! Edit psb-curator-config.yaml to customize categories, keywords, metadata schema, etc.

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: See included .md files
- **Examples**: Check implementation guide

---

**Ready to organize your Professional Second Brain?** 

Start with the [Quick Start Guide](./PSB-Curator-QUICK-START.md) and see [Deployment Guide](./PSB-Curator-DEPLOYMENT.md) for production setup.
