# PSB Curator Agent - Test Scenarios

## Test Execution Framework

### Test Environment Setup

```typescript
import { createCurator, runCurator, PSBCuratorAgent } from './psb-curator-agent';
import * as assert from 'assert';

class CuratorTestSuite {
  private curator: PSBCuratorAgent;
  private testDataPath: string;
  
  async setup() {
    this.testDataPath = './test-data';
    this.curator = await createCurator(this.testDataPath);
  }
  
  async teardown() {
    // Clean up test data
  }
}
```

---

## Test Scenario 1: Content Organization

### TC-001: Basic File Organization

**Objective:** Verify files are correctly categorized

**Preconditions:**
- Repository with mixed files
- Categories defined in config
- Files have metadata or content patterns

**Steps:**
```typescript
async function testBasicOrganization() {
  const result = await runCurator('./test-data', {
    operation: 'organize',
    scope: 'repository',
    depth: 'surface',
    auto_apply: false
  });

  // Verify metrics
  assert(result.curation_metrics.items_processed > 0, 'Should process items');
  assert(result.organization_changes.length > 0, 'Should find changes');
  
  // Verify confidence scoring
  result.organization_changes.forEach(change => {
    assert(change.confidence >= 0 && change.confidence <= 100, 'Confidence in range');
  });
}
```

**Expected Results:**
- Organization changes identified
- Confidence scores assigned (0-100)
- Reasoning provided
- Alternative categories suggested

**Pass Criteria:**
- ✅ Changes identified for >50% of files
- ✅ Average confidence >70%
- ✅ All changes have reasoning
- ✅ Execution time <10s

---

### TC-002: Categorization Accuracy

**Objective:** Verify categorization accuracy

**Test Data:**
```
test-data/
├── projects/project1.md (contains "implemented project")
├── skills/python.md (contains "skill Python")
├── experience/role.md (contains "position at company")
└── mixed/unknown.md (ambiguous content)
```

**Verification:**
```typescript
async function testCategorizationAccuracy() {
  const result = await runCurator('./test-data', {
    operation: 'organize',
    scope: 'repository',
    depth: 'detailed',
    auto_apply: false
  });

  // Check specific files
  const projectChange = result.organization_changes
    .find(c => c.item.includes('project1.md'));
  
  assert(projectChange?.suggested_location.includes('projects'), 
    'Project file should go to projects');
  
  assert(projectChange?.confidence >= 80, 'Confidence should be high');
}
```

**Pass Criteria:**
- ✅ Projects categorized correctly (>90% accuracy)
- ✅ Skills categorized correctly (>85% accuracy)
- ✅ Experience categorized correctly (>80% accuracy)

---

### TC-003: Structure Optimization

**Objective:** Verify structure optimization suggestions

**Test Scenario:**
- Large category with 30+ files
- Deeply nested directories
- Orphaned files in root

**Verification:**
```typescript
async function testStructureOptimization() {
  const result = await runCurator('./test-data', {
    operation: 'organize',
    scope: 'repository',
    depth: 'comprehensive',
    auto_apply: false
  });

  // Should suggest subcategories for large categories
  const optimizations = result.organization_changes
    .filter(c => c.reason.includes('subcategory'));
  
  assert(optimizations.length > 0, 'Should suggest subcategories');
}
```

**Pass Criteria:**
- ✅ Large directories identified (>20 files)
- ✅ Optimization suggestions provided
- ✅ Implementation steps suggested

---

## Test Scenario 2: Relationship Mapping

### TC-004: Skill-to-Project Relationships

**Objective:** Verify skill-to-project connections detected

**Test Data:**
```
projects/web-app.md:
  - technologies: [React, TypeScript]
  - skills: [Frontend Development, React]

skills/react.md:
  - name: React
  - proficiency: expert
```

**Verification:**
```typescript
async function testSkillProjectRelationships() {
  const result = await runCurator('./test-data', {
    operation: 'map_relationships',
    scope: 'repository',
    depth: 'detailed',
    auto_apply: false
  });

  const skillProjectRelations = result.relationship_map.connections
    .filter(c => c.type === 'skill_to_project');
  
  assert(skillProjectRelations.length > 0, 'Should find skill-project relations');
  assert(skillProjectRelations.some(r => r.strength === 'strong'), 
    'Should have strong connections');
}
```

**Expected Results:**
- React skill linked to web-app project
- Connection strength: strong
- Evidence: "Skill React used in project"

**Pass Criteria:**
- ✅ Skill-project connections found
- ✅ Connection strength accurate
- ✅ Evidence provided

---

### TC-005: Orphaned Item Detection

**Objective:** Verify orphaned items identified

**Test Data:**
- Isolated files with no connections
- Files with no metadata
- Archived items

**Verification:**
```typescript
async function testOrphanedItemDetection() {
  const result = await runCurator('./test-data', {
    operation: 'map_relationships',
    scope: 'repository',
    depth: 'comprehensive',
    auto_apply: false
  });

  assert(result.relationship_map.orphaned_items.length > 0, 
    'Should identify orphaned items');
  
  // Verify recommendations for orphaned items
  const recommendations = result.recommendations
    .filter(r => r.category === 'Orphaned Items');
  
  assert(recommendations.length > 0, 'Should recommend actions for orphaned items');
}
```

**Pass Criteria:**
- ✅ Orphaned items identified
- ✅ Count accurate
- ✅ Recommendations provided

---

### TC-006: Cluster Identification

**Objective:** Verify connected clusters identified

**Verification:**
```typescript
async function testClusterIdentification() {
  const result = await runCurator('./test-data', {
    operation: 'map_relationships',
    scope: 'repository',
    depth: 'comprehensive',
    auto_apply: false
  });

  assert(result.relationship_map.clusters.length > 0, 'Should identify clusters');
  
  // Verify cluster properties
  result.relationship_map.clusters.forEach(cluster => {
    assert(Array.isArray(cluster), 'Cluster should be array');
    assert(cluster.length > 0, 'Cluster should have items');
  });
}
```

**Pass Criteria:**
- ✅ Clusters identified
- ✅ Cluster composition correct
- ✅ Size distribution reasonable

---

## Test Scenario 3: Metadata Enhancement

### TC-007: Required Fields Addition

**Objective:** Verify missing required fields added

**Test Data:**
```yaml
# Before
---
title: Project XYZ
---

# After should have:
---
title: Project XYZ
category: projects
tags: []
status: active
---
```

**Verification:**
```typescript
async function testRequiredFieldsAddition() {
  const result = await runCurator('./test-data', {
    operation: 'enhance_metadata',
    scope: 'directory',
    target_path: 'projects',
    depth: 'comprehensive',
    auto_apply: true
  });

  assert(result.metadata_improvements.total_fields_added > 0, 
    'Should add missing fields');
  
  result.metadata_improvements.improvements.forEach(imp => {
    assert(imp.fields_added.length > 0, 'Should have added fields');
  });
}
```

**Pass Criteria:**
- ✅ All required fields added
- ✅ Default values reasonable
- ✅ No data loss
- ✅ Metadata valid

---

### TC-008: Metadata Consistency

**Objective:** Verify metadata inconsistencies fixed

**Test Data:**
```yaml
# Inconsistent metadata
---
tags: "python, typescript"  # Should be array
status: "Active"  # Should be lowercase
---
```

**Verification:**
```typescript
async function testMetadataConsistency() {
  const result = await runCurator('./test-data', {
    operation: 'enhance_metadata',
    scope: 'repository',
    depth: 'comprehensive',
    auto_apply: true
  });

  assert(result.metadata_improvements.total_inconsistencies_fixed > 0, 
    'Should fix inconsistencies');
  
  // Verify format consistency
  result.metadata_improvements.improvements.forEach(imp => {
    if (imp.fields_enhanced.includes('tags')) {
      assert(Array.isArray(imp.after.tags), 'Tags should be array');
    }
  });
}
```

**Pass Criteria:**
- ✅ Inconsistencies identified
- ✅ Fixed correctly
- ✅ Format standardized
- ✅ Validation passes

---

### TC-009: Tag Inference

**Objective:** Verify tags inferred from content

**Test Data:**
```markdown
---
title: Python Project
---

# Project Description
This uses ```python code examples```
Tagged with #python #backend
```

**Verification:**
```typescript
async function testTagInference() {
  const result = await runCurator('./test-data', {
    operation: 'enhance_metadata',
    scope: 'directory',
    target_path: 'projects',
    depth: 'comprehensive',
    auto_apply: false
  });

  // Check if tags were inferred
  const improvements = result.metadata_improvements.improvements
    .filter(i => i.fields_added.includes('tags'));
  
  assert(improvements.length > 0, 'Should infer tags');
  assert(improvements[0].after.tags.includes('python'), 'Should include python tag');
}
```

**Pass Criteria:**
- ✅ Tags extracted from content
- ✅ Hashtags recognized
- ✅ Code languages identified
- ✅ Duplicates removed

---

## Test Scenario 4: Trend Analysis

### TC-010: Emerging Skills Detection

**Objective:** Verify emerging skills identified

**Test Data:**
- Multiple projects using same skill
- Skills appearing more frequently over time
- New technologies adopted

**Verification:**
```typescript
async function testEmergingSkillsDetection() {
  const result = await runCurator('./test-data', {
    operation: 'identify_trends',
    scope: 'repository',
    depth: 'comprehensive',
    auto_apply: false
  });

  assert(result.trend_analysis.emerging_skills.length > 0, 
    'Should identify emerging skills');
  
  // Verify scoring
  result.trend_analysis.emerging_skills.forEach(skill => {
    assert(skill.trend_score >= 0 && skill.trend_score <= 100, 
      'Trend score should be 0-100');
    assert(skill.projects_mentioning > 0, 'Should have project count');
  });
}
```

**Pass Criteria:**
- ✅ Emerging skills identified
- ✅ Trend scores accurate
- ✅ Project counts correct
- ✅ Growth rates calculated

---

### TC-011: Technology Evolution

**Objective:** Verify technology evolution tracked

**Test Data:**
- Technologies used over time
- Adoption and adoption patterns
- Replacement technologies

**Verification:**
```typescript
async function testTechnologyEvolution() {
  const result = await runCurator('./test-data', {
    operation: 'identify_trends',
    scope: 'repository',
    depth: 'comprehensive',
    auto_apply: false
  });

  assert(result.trend_analysis.technology_evolution.length > 0, 
    'Should track technology evolution');
  
  // Verify evolution status
  result.trend_analysis.technology_evolution.forEach(tech => {
    assert(['active', 'archived', 'emerging'].includes(tech.current_status), 
      'Should have valid status');
  });
}
```

**Pass Criteria:**
- ✅ Technology timeline built
- ✅ Adoption dates tracked
- ✅ Current status determined
- ✅ Trends identified

---

### TC-012: Skill Combinations

**Objective:** Verify skill combinations identified

**Test Data:**
```
Projects using combined skills:
- Python + React
- TypeScript + React
- Python + Machine Learning
```

**Verification:**
```typescript
async function testSkillCombinations() {
  const result = await runCurator('./test-data', {
    operation: 'identify_trends',
    scope: 'repository',
    depth: 'comprehensive',
    auto_apply: false
  });

  assert(result.trend_analysis.skill_combinations.length > 0, 
    'Should identify skill combinations');
  
  // Verify frequency
  result.trend_analysis.skill_combinations.forEach(combo => {
    assert(combo.frequency > 0, 'Should have frequency');
    assert(Array.isArray(combo.skills), 'Should have skills array');
  });
}
```

**Pass Criteria:**
- ✅ Combinations identified
- ✅ Frequency accurate
- ✅ Sorted by frequency
- ✅ Context preserved

---

## Test Scenario 5: Recommendations

### TC-013: Content Gap Identification

**Objective:** Verify content gaps identified

**Verification:**
```typescript
async function testContentGapIdentification() {
  const result = await runCurator('./test-data', {
    operation: 'recommend',
    scope: 'repository',
    depth: 'comprehensive',
    auto_apply: false
  });

  const contentGaps = result.recommendations
    .filter(r => r.category === 'Content Gap');
  
  assert(contentGaps.length > 0, 'Should identify content gaps');
  
  contentGaps.forEach(gap => {
    assert(gap.priority !== undefined, 'Should have priority');
    assert(gap.estimated_effort !== undefined, 'Should have effort estimate');
  });
}
```

**Pass Criteria:**
- ✅ Gaps identified
- ✅ Reasoning provided
- ✅ Priority assigned
- ✅ Effort estimated

---

### TC-014: Prioritization Accuracy

**Objective:** Verify recommendations prioritized correctly

**Verification:**
```typescript
async function testPrioritizationAccuracy() {
  const result = await runCurator('./test-data', {
    operation: 'recommend',
    scope: 'repository',
    depth: 'comprehensive',
    auto_apply: false
  });

  // Verify high-priority items first
  const sorted = [...result.recommendations];
  const priorities = ['high', 'medium', 'low'];
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = priorities.indexOf(sorted[i].priority);
    const next = priorities.indexOf(sorted[i + 1].priority);
    assert(current <= next, 'Should be sorted by priority');
  }
}
```

**Pass Criteria:**
- ✅ Recommendations sorted by priority
- ✅ High-impact items first
- ✅ Effort estimates reasonable
- ✅ Implementation steps clear

---

## Test Scenario 6: Performance & Scalability

### TC-015: Large Repository Handling

**Objective:** Verify handling of large repositories

**Test Setup:**
- 100+ files
- Multiple categories
- Deep nesting

**Verification:**
```typescript
async function testLargeRepositoryHandling() {
  const startTime = Date.now();
  
  const result = await runCurator('./test-data', {
    operation: 'organize',
    scope: 'repository',
    depth: 'detailed',
    auto_apply: false
  });
  
  const duration = Date.now() - startTime;
  
  // Performance assertions
  assert(duration < 30000, `Should complete in <30s, took ${duration}ms`);
  assert(result.curation_metrics.items_processed > 100, 'Should process 100+ items');
  assert(result.curation_metrics.success_rate > 90, 'Should have >90% success');
}
```

**Pass Criteria:**
- ✅ Processes 100+ items
- ✅ Completes in <30 seconds
- ✅ Memory usage reasonable
- ✅ No crashes or errors

---

### TC-016: Batch Operations

**Objective:** Verify batch processing works

**Verification:**
```typescript
async function testBatchOperations() {
  const result1 = await runCurator('.', { operation: 'organize', ... });
  const result2 = await runCurator('.', { operation: 'enhance_metadata', ... });
  const result3 = await runCurator('.', { operation: 'identify_trends', ... });
  
  // All should succeed
  assert(result1.status === 'success', 'Organize should succeed');
  assert(result2.status === 'success', 'Metadata should succeed');
  assert(result3.status === 'success', 'Trends should succeed');
}
```

**Pass Criteria:**
- ✅ All operations complete successfully
- ✅ No data conflicts
- ✅ Results consistent
- ✅ Performance acceptable

---

## Test Scenario 7: Error Handling

### TC-017: Invalid Configuration

**Objective:** Verify error handling for invalid config

**Verification:**
```typescript
async function testInvalidConfiguration() {
  const config = { categories: null }; // Invalid
  
  try {
    const curator = new PSBCuratorAgent(config);
    assert.fail('Should throw error');
  } catch (error) {
    assert(error instanceof Error, 'Should be Error');
    assert(error.message.includes('configuration'), 'Should mention config');
  }
}
```

**Pass Criteria:**
- ✅ Error thrown
- ✅ Error message clear
- ✅ No silent failures

---

### TC-018: Missing Files

**Objective:** Verify graceful handling of missing files

**Verification:**
```typescript
async function testMissingFiles() {
  const result = await runCurator('./nonexistent', {
    operation: 'organize',
    scope: 'repository',
    depth: 'surface',
    auto_apply: false
  });
  
  assert(result.status !== 'success', 'Should handle missing path');
  assert(result.errors.length > 0, 'Should have error message');
}
```

**Pass Criteria:**
- ✅ Graceful error handling
- ✅ Clear error messages
- ✅ No crashes

---

## Test Execution Report Template

```
TEST EXECUTION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: [YYYY-MM-DD]
Version: [1.0.0]
Environment: [Dev/Staging/Prod]

SUMMARY
───────────────────────────────────────
Total Tests: [XX]
Passed: [XX]
Failed: [XX]
Skipped: [XX]
Success Rate: [XX%]

DETAILED RESULTS
───────────────────────────────────────
✅ TC-001: Basic File Organization
✅ TC-002: Categorization Accuracy
✅ TC-003: Structure Optimization
...

ISSUES FOUND
───────────────────────────────────────
[Issue #1]
[Issue #2]

PERFORMANCE METRICS
───────────────────────────────────────
Average Execution Time: [XXs]
Max Memory Usage: [XXMb]
Items Processed: [XXX]

RECOMMENDATIONS
───────────────────────────────────────
[Recommendation 1]
[Recommendation 2]

Sign-Off: _________________ Date: ______
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run specific test scenario
npm test -- --testNamePattern="TC-001"

# Run with coverage
npm test -- --coverage

# Run performance tests
npm run test:perf

# Run integration tests
npm run test:integration
```

## Success Criteria Summary

| Category | Pass Criteria |
|----------|---------------|
| Organization | >80% accuracy, <10s execution |
| Relationships | All connection types detected |
| Metadata | 100% required fields added |
| Trends | Accurate emerging skill detection |
| Recommendations | >90% actionable, prioritized correctly |
| Performance | 100+ items in <30s |
| Error Handling | Graceful failures, clear messages |

---

All tests should pass before deployment to production.
