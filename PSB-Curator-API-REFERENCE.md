# PSB Curator Agent - API Reference

## Table of Contents
- [Types & Interfaces](#types--interfaces)
- [PSBCuratorAgent Class](#psbcuratoragent-class)
- [Engine Classes](#engine-classes)
- [Utility Functions](#utility-functions)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Types & Interfaces

### CurationOperation
```typescript
type CurationOperation = 
  | 'organize' 
  | 'map_relationships' 
  | 'enhance_metadata' 
  | 'identify_trends' 
  | 'recommend';
```

### CurationScope
```typescript
type CurationScope = 'file' | 'directory' | 'category' | 'repository';
```

### AnalysisDepth
```typescript
type AnalysisDepth = 'surface' | 'detailed' | 'comprehensive';
```

### CurationInput

**Definition:**
```typescript
interface CurationInput {
  operation: CurationOperation;
  scope: CurationScope;
  target_path?: string;
  depth: AnalysisDepth;
  auto_apply: boolean;
  filters?: {
    category?: string;
    fileType?: string;
    dateRange?: { start: string; end: string };
    tagsInclude?: string[];
    tagsExclude?: string[];
  };
  options?: {
    includeOrphaned?: boolean;
    includeArchived?: boolean;
    crossRepositoryLinks?: boolean;
    preserveExisting?: boolean;
  };
}
```

**Properties:**
- `operation` (required): Type of curation operation
- `scope` (required): Scope of operation (file, directory, category, repository)
- `target_path` (optional): Path to target for directory/category scopes
- `depth` (required): Analysis depth (surface, detailed, comprehensive)
- `auto_apply` (required): Whether to automatically apply changes
- `filters` (optional): Filtering criteria
- `options` (optional): Operation-specific options

### CurationResult

**Definition:**
```typescript
interface CurationResult {
  operation: CurationOperation;
  status: 'success' | 'partial' | 'failed';
  curation_metrics: CurationMetrics;
  organization_changes: OrganizationChange[];
  relationship_map: RelationshipMap;
  metadata_improvements: MetadataImprovements;
  trend_analysis: TrendAnalysis;
  recommendations: Recommendation[];
  applied_changes: {
    files_moved: string[];
    files_modified: string[];
    links_created: string[];
  };
  warnings: string[];
  errors: string[];
  timestamp: string;
}
```

### CurationMetrics

**Definition:**
```typescript
interface CurationMetrics {
  items_processed: number;
  reorganizations: number;
  new_links_created: number;
  metadata_enhancements: number;
  trends_identified: number;
  execution_time_ms: number;
  success_rate: number; // 0-100
}
```

### OrganizationChange

**Definition:**
```typescript
interface OrganizationChange {
  item: string;
  current_location: string;
  suggested_location: string;
  reason: string;
  confidence: number; // 0-100
  affectedRelations?: string[];
}
```

### RelationshipConnection

**Definition:**
```typescript
interface RelationshipConnection {
  from: string;
  to: string;
  type: 'skill_to_project' | 'project_to_achievement' | 'skill_to_skill' | 
        'technology_to_project' | 'role_to_project';
  strength: 'strong' | 'moderate' | 'weak';
  evidence: string[];
}
```

### Recommendation

**Definition:**
```typescript
interface Recommendation {
  category: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  estimated_effort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
  reasoning: string;
  implementation_steps?: string[];
  related_items?: string[];
}
```

---

## PSBCuratorAgent Class

### Constructor

```typescript
constructor(config: CuratorConfig)
```

**Parameters:**
- `config`: Curator configuration object

**Throws:**
- `Error`: If configuration is invalid

**Example:**
```typescript
const config: CuratorConfig = {
  repository_root: '.',
  categories: { ... },
  metadata_schema: { ... },
  organization_rules: [],
  skill_hierarchy: {},
  technology_clusters: {},
  trend_keywords: [],
  link_patterns: []
};

const agent = new PSBCuratorAgent(config);
```

### Main Methods

#### curate()

```typescript
async curate(input: CurationInput): Promise<CurationResult>
```

**Description:** Execute a curation operation

**Parameters:**
- `input`: Curation input specification

**Returns:** Complete curation result

**Throws:** 
- `Error`: On operation failure

**Example:**
```typescript
const result = await agent.curate({
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});

console.log(`Processed ${result.curation_metrics.items_processed} items`);
```

#### exportResults()

```typescript
exportResults(result: CurationResult, outputPath: string): void
```

**Description:** Export results to JSON file

**Parameters:**
- `result`: Curation result
- `outputPath`: Output file path

**Example:**
```typescript
agent.exportResults(result, 'curation-results.json');
```

#### exportRecommendationsAsMarkdown()

```typescript
exportRecommendationsAsMarkdown(result: CurationResult, outputPath: string): void
```

**Description:** Export recommendations as formatted Markdown

**Parameters:**
- `result`: Curation result
- `outputPath`: Output file path

**Example:**
```typescript
agent.exportRecommendationsAsMarkdown(result, 'recommendations.md');
```

---

## Engine Classes

### ContentOrganizationEngine

#### categorizeContent()

```typescript
static async categorizeContent(
  filePath: string,
  knownCategories: Record<string, any>
): Promise<{
  suggestedCategory: string;
  confidence: number;
  reasoning: string[];
  alternativeCategories?: Array<{ category: string; confidence: number }>;
}>
```

**Description:** Categorize a single file

**Parameters:**
- `filePath`: Path to file
- `knownCategories`: Known category definitions

**Returns:** Categorization with confidence

**Example:**
```typescript
const result = await ContentOrganizationEngine.categorizeContent(
  'projects/my-project.md',
  config.categories
);

console.log(`Suggested: ${result.suggestedCategory} (${result.confidence}%)`);
```

#### suggestStructureOptimizations()

```typescript
static async suggestStructureOptimizations(
  files: string[]
): Promise<Array<{
  current_structure: string;
  suggested_structure: string;
  benefits: string[];
  effort: string;
}>>
```

**Description:** Suggest structure improvements

**Parameters:**
- `files`: List of file paths

**Returns:** Optimization suggestions

**Example:**
```typescript
const optimizations = await ContentOrganizationEngine
  .suggestStructureOptimizations(allFiles);

optimizations.forEach(opt => {
  console.log(`${opt.current_structure} → ${opt.suggested_structure}`);
});
```

### RelationshipDetectionEngine

#### detectRelationships()

```typescript
static async detectRelationships(
  items: Map<string, any>,
  depth: 'surface' | 'detailed' | 'comprehensive'
): Promise<Array<{
  from: string;
  to: string;
  type: string;
  strength: 'strong' | 'moderate' | 'weak';
  evidence: string[];
}>>
```

**Description:** Detect relationships between items

**Parameters:**
- `items`: Map of items (path → data)
- `depth`: Analysis depth

**Returns:** List of relationships found

**Example:**
```typescript
const items = new Map([
  ['projects/web-app.md', { technologies: ['React'] }],
  ['skills/react.md', { name: 'React' }]
]);

const relationships = await RelationshipDetectionEngine
  .detectRelationships(items, 'comprehensive');

console.log(`Found ${relationships.length} relationships`);
```

#### findOrphanedItems()

```typescript
static async findOrphanedItems(
  items: string[],
  relationships: Array<{ from: string; to: string }>
): Promise<string[]>
```

**Description:** Find items with no connections

**Parameters:**
- `items`: List of all items
- `relationships`: List of relationships

**Returns:** List of orphaned items

**Example:**
```typescript
const orphaned = await RelationshipDetectionEngine
  .findOrphanedItems(allItems, connections);

console.log(`${orphaned.length} orphaned items found`);
```

#### identifyClusters()

```typescript
static async identifyClusters(
  items: string[],
  relationships: Array<{ from: string; to: string }>
): Promise<string[][]>
```

**Description:** Identify connected components

**Parameters:**
- `items`: List of all items
- `relationships`: List of relationships

**Returns:** List of clusters

**Example:**
```typescript
const clusters = await RelationshipDetectionEngine
  .identifyClusters(allItems, connections);

clusters.forEach((cluster, i) => {
  console.log(`Cluster ${i + 1}: ${cluster.length} items`);
});
```

### MetadataEnhancementEngine

#### enhanceMetadata()

```typescript
static async enhanceMetadata(
  filePath: string,
  schemaDefinition: Record<string, any>,
  depth: 'surface' | 'detailed' | 'comprehensive'
): Promise<{
  original: Record<string, any>;
  enhanced: Record<string, any>;
  changes: {
    added: string[];
    updated: string[];
    fixed: string[];
  };
}>
```

**Description:** Enhance metadata for a file

**Parameters:**
- `filePath`: Path to file
- `schemaDefinition`: Metadata schema
- `depth`: Analysis depth

**Returns:** Original, enhanced, and changes

**Example:**
```typescript
const enhancement = await MetadataEnhancementEngine
  .enhanceMetadata('projects/project.md', schema, 'comprehensive');

console.log('Added fields:', enhancement.changes.added);
console.log('Fixed:', enhancement.changes.fixed);
```

#### validateMetadata()

```typescript
static validateMetadata(
  metadata: Record<string, any>,
  schema: Record<string, any>
): { valid: boolean; errors: string[] }
```

**Description:** Validate metadata against schema

**Parameters:**
- `metadata`: Metadata to validate
- `schema`: Schema definition

**Returns:** Validation result with errors

**Example:**
```typescript
const validation = MetadataEnhancementEngine
  .validateMetadata(metadata, schema);

if (!validation.valid) {
  console.log('Errors:', validation.errors);
}
```

### TrendAnalysisEngine

#### analyzeTrends()

```typescript
static async analyzeTrends(
  items: Map<string, any>,
  trendKeywords: string[]
): Promise<{
  emerging_skills: Array<{ skill: string; trend_score: number; frequency: number }>;
  technology_evolution: Array<{ tech: string; usage_trend: 'increasing' | 'stable' | 'declining' }>;
  clusters: string[][];
}>
```

**Description:** Analyze trends in content

**Parameters:**
- `items`: Map of items
- `trendKeywords`: Keywords to monitor

**Returns:** Trend analysis

**Example:**
```typescript
const trends = await TrendAnalysisEngine
  .analyzeTrends(items, config.trend_keywords);

console.log('Emerging skills:');
trends.emerging_skills.forEach(skill => {
  console.log(`  - ${skill.skill}: ${skill.trend_score}%`);
});
```

#### identifySkillCombinations()

```typescript
static async identifySkillCombinations(
  items: Map<string, any>
): Promise<Array<{ skills: string[]; frequency: number }>>
```

**Description:** Identify commonly used skill combinations

**Parameters:**
- `items`: Map of items

**Returns:** Skill combinations with frequency

**Example:**
```typescript
const combinations = await TrendAnalysisEngine
  .identifySkillCombinations(items);

console.log('Top skill combinations:');
combinations.slice(0, 5).forEach(combo => {
  console.log(`  ${combo.skills.join(' + ')}: ${combo.frequency}x`);
});
```

### RecommendationEngine

#### generateRecommendations()

```typescript
static async generateRecommendations(
  items: Map<string, any>,
  analysis: any
): Promise<Array<{
  category: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}>>
```

**Description:** Generate recommendations

**Parameters:**
- `items`: Map of items
- `analysis`: Analysis results

**Returns:** List of recommendations

**Example:**
```typescript
const recommendations = await RecommendationEngine
  .generateRecommendations(items, analysis);

const highPriority = recommendations
  .filter(r => r.priority === 'high')
  .sort((a, b) => {
    const order = { low: 0, medium: 1, high: 2 };
    return order[a.effort] - order[b.effort];
  });
```

---

## Utility Functions

### createCurator()

```typescript
async function createCurator(repositoryRoot: string): Promise<PSBCuratorAgent>
```

**Description:** Create curator with default configuration

**Parameters:**
- `repositoryRoot`: Path to repository root

**Returns:** Configured curator agent

**Example:**
```typescript
const curator = await createCurator('.');
const result = await curator.curate({...});
```

### runCurator()

```typescript
async function runCurator(
  repositoryRoot: string,
  input: CurationInput
): Promise<CurationResult>
```

**Description:** Run curator operation directly

**Parameters:**
- `repositoryRoot`: Path to repository root
- `input`: Curation input

**Returns:** Curation result

**Example:**
```typescript
const result = await runCurator('.', {
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});
```

---

## Error Handling

### Error Types

All errors thrown are instances of `Error` with descriptive messages:

```typescript
try {
  const result = await curator.curate(input);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    // Handle error
  }
}
```

### Common Errors

**Configuration Error:**
```
Configuration validation failed: categories must be defined
```

**File Access Error:**
```
Failed to read file: permission denied at /path/to/file
```

**Invalid Input Error:**
```
Invalid curation input: operation must be one of [organize, map_relationships, ...]
```

**Operation Error:**
```
Curation failed: unable to process items
```

### Error Recovery

```typescript
async function safeRunCurator(input: CurationInput) {
  try {
    return await runCurator('.', input);
  } catch (error) {
    console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
    
    // Fallback to simpler operation
    if (input.depth === 'comprehensive') {
      return await runCurator('.', {
        ...input,
        depth: 'detailed'
      });
    }
    
    throw error;
  }
}
```

---

## Examples

### Example 1: Basic Organization

```typescript
import { runCurator } from './psb-curator-agent';

const result = await runCurator('.', {
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});

console.log(`Processed: ${result.curation_metrics.items_processed}`);
console.log(`Changes: ${result.organization_changes.length}`);
result.organization_changes.forEach(change => {
  console.log(`  ${change.item}: ${change.confidence}% confidence`);
});
```

### Example 2: Complete Workflow

```typescript
import { createCurator } from './psb-curator-agent';

const curator = await createCurator('.');

// Step 1: Organize
const orgResult = await curator.curate({
  operation: 'organize',
  scope: 'repository',
  depth: 'detailed',
  auto_apply: false
});

// Step 2: Map relationships
const relResult = await curator.curate({
  operation: 'map_relationships',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: true
});

// Step 3: Enhance metadata
const metaResult = await curator.curate({
  operation: 'enhance_metadata',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: true
});

// Step 4: Identify trends
const trendResult = await curator.curate({
  operation: 'identify_trends',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: false
});

// Step 5: Get recommendations
const recResult = await curator.curate({
  operation: 'recommend',
  scope: 'repository',
  depth: 'comprehensive',
  auto_apply: false
});

// Export results
curator.exportResults(orgResult, 'organize-results.json');
curator.exportRecommendationsAsMarkdown(recResult, 'recommendations.md');
```

### Example 3: Targeted Operations

```typescript
import { runCurator } from './psb-curator-agent';

// Organize only projects
const projectResult = await runCurator('.', {
  operation: 'organize',
  scope: 'directory',
  target_path: 'projects',
  depth: 'detailed',
  auto_apply: false
});

// Enhance skills metadata
const skillsResult = await runCurator('.', {
  operation: 'enhance_metadata',
  scope: 'category',
  target_path: 'skills',
  depth: 'comprehensive',
  auto_apply: true
});

// Find orphaned experiences
const orphanResult = await runCurator('.', {
  operation: 'map_relationships',
  scope: 'directory',
  target_path: 'experience',
  depth: 'comprehensive',
  auto_apply: false,
  options: {
    includeOrphaned: true
  }
});
```

---

## Quick Reference

### Common Patterns

**Safe Experimentation:**
```typescript
{ auto_apply: false, depth: 'surface' }
```

**Production Automation:**
```typescript
{ auto_apply: true, depth: 'detailed' }
```

**Comprehensive Analysis:**
```typescript
{ auto_apply: false, depth: 'comprehensive' }
```

**Targeted Operation:**
```typescript
{ scope: 'directory', target_path: 'projects', depth: 'detailed' }
```

### Common Filters

```typescript
// By category
{ filters: { category: 'projects' } }

// By file type
{ filters: { fileType: '.md' } }

// By tags
{ filters: { tagsInclude: ['python', 'backend'] } }

// By date range
{ filters: { dateRange: { start: '2024-01-01', end: '2024-12-31' } } }
```

---

For complete examples and usage patterns, see `PSB-Curator-IMPLEMENTATION.md` and `PSB-Curator-QUICK-START.md`.
