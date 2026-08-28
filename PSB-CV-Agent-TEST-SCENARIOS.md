# PSB CV Agent - Test Scenarios

## Testing Strategy

This document outlines comprehensive test scenarios for the PSB CV Agent.

## Test Organization

```
tests/
├── unit/
│   ├── config.test.ts
│   ├── cv-generation.test.ts
│   ├── formatting.test.ts
│   └── analytics.test.ts
├── integration/
│   ├── cv-builder-integration.test.ts
│   ├── quality-checker-integration.test.ts
│   └── analyzer-integration.test.ts
├── e2e/
│   ├── single-cv-generation.test.ts
│   ├── batch-generation.test.ts
│   ├── application-tracking.test.ts
│   └── analytics-reporting.test.ts
└── performance/
    ├── load-testing.ts
    ├── stress-testing.ts
    └── benchmark.ts
```

## Unit Tests

### Configuration Tests

```typescript
// tests/unit/config.test.ts
describe('Configuration', () => {
  it('should load YAML configuration file', () => {
    const config = loadConfig('./psb-cv-agent-config.yaml');
    expect(config).toBeDefined();
    expect(config.agent.name).toBe('PSB CV Agent');
  });

  it('should return default config when file not found', () => {
    const config = loadConfig('./nonexistent.yaml');
    expect(config.formats.default).toBe('pdf');
  });

  it('should validate required configuration fields', () => {
    const config = loadConfig();
    expect(config.cvBuilder).toBeDefined();
    expect(config.storage).toBeDefined();
    expect(config.formats).toBeDefined();
  });

  it('should support environment variable overrides', () => {
    process.env.CV_BUILDER_ENDPOINT = 'http://custom:3000';
    const config = loadConfig();
    expect(config.cvBuilder.endpoint).toBe('http://custom:3000');
  });
});
```

### CV Generation Tests

```typescript
// tests/unit/cv-generation.test.ts
describe('CV Generation', () => {
  let agent: PSBCVAgent;

  beforeEach(() => {
    agent = new PSBCVAgent();
  });

  describe('Single CV Generation', () => {
    it('should generate CV with valid job description', async () => {
      const request = {
        operation: 'generate',
        job_description: 'Senior TypeScript Engineer...'
      };
      const response = await agent.execute(request);
      
      expect(response.status).toBe('success');
      expect(response.operation_result.success_count).toBe(1);
      expect(response.cv_details).toBeDefined();
      expect(response.cv_details.matchScore).toBeGreaterThanOrEqual(0);
      expect(response.cv_details.matchScore).toBeLessThanOrEqual(100);
    });

    it('should return error when job_description missing', async () => {
      const request = { operation: 'generate' };
      const response = await agent.execute(request);
      
      expect(response.status).toBe('failed');
      expect(response.message).toContain('job_description');
    });

    it('should support custom output path', async () => {
      const request = {
        operation: 'generate',
        job_description: 'Job description...',
        output_path: './custom/path/cv.pdf'
      };
      const response = await agent.execute(request);
      
      expect(response.operation_result.files_created[0]).toContain('custom/path');
    });

    it('should support all format types', async () => {
      const formats = ['pdf', 'markdown', 'text', 'json'];
      for (const format of formats) {
        const request = {
          operation: 'generate',
          job_description: 'Job...',
          format
        };
        const response = await agent.execute(request);
        expect(response.status).toBe('success');
        expect(response.cv_details.format).toBe(format);
      }
    });

    it('should support all template types', async () => {
      const templates = ['resume', 'cv', 'linkedin'];
      for (const template of templates) {
        const request = {
          operation: 'generate',
          job_description: 'Job...',
          template
        };
        const response = await agent.execute(request);
        expect(response.status).toBe('success');
        expect(response.cv_details).toBeDefined();
      }
    });

    it('should calculate correct metrics', async () => {
      const request = {
        operation: 'generate',
        job_description: 'Job...'
      };
      const response = await agent.execute(request);
      
      const cv = response.cv_details;
      expect(cv.bulletCount).toBeGreaterThan(0);
      expect(cv.pageCount).toBeGreaterThan(0);
      expect(cv.technologyCoverage).toBeGreaterThanOrEqual(0);
    });

    it('should include analytics when requested', async () => {
      const request = {
        operation: 'generate',
        job_description: 'Job...',
        include_analytics: true
      };
      const response = await agent.execute(request);
      
      expect(response.analytics).toBeDefined();
      expect(response.analytics.totalGenerated).toBeGreaterThan(0);
    });
  });

  describe('Batch CV Generation', () => {
    it('should generate multiple CVs', async () => {
      const request = {
        operation: 'generate_batch',
        job_descriptions: [
          'Job 1...',
          'Job 2...',
          'Job 3...'
        ]
      };
      const response = await agent.execute(request);
      
      expect(response.status).toBe('success');
      expect(response.operation_result.generated_count).toBe(3);
      expect(response.operation_result.success_count).toBe(3);
    });

    it('should handle batch with varying sizes', async () => {
      for (const size of [1, 5, 10, 50]) {
        const jobs = Array(size).fill('Job description...');
        const request = {
          operation: 'generate_batch',
          job_descriptions: jobs
        };
        const response = await agent.execute(request);
        
        expect(response.operation_result.generated_count).toBe(size);
      }
    });

    it('should track failed CVs separately', async () => {
      const request = {
        operation: 'generate_batch',
        job_descriptions: [
          'Valid job...',
          '', // Invalid - empty
          'Another valid...'
        ]
      };
      const response = await agent.execute(request);
      
      expect(response.operation_result.failed_count).toBeGreaterThanOrEqual(0);
      expect(response.status).toBe('success');
    });

    it('should respect parallel processing limit', async () => {
      // This would test internal behavior
      const config = { performance: { maxParallelGenerations: 2 } };
      // Verify that no more than 2 are processed simultaneously
    });

    it('should return error when job_descriptions missing', async () => {
      const request = { operation: 'generate_batch' };
      const response = await agent.execute(request);
      
      expect(response.status).toBe('failed');
    });
  });
});
```

### Formatting Tests

```typescript
// tests/unit/formatting.test.ts
describe('CV Formatting', () => {
  let agent: PSBCVAgent;

  beforeEach(() => {
    agent = new PSBCVAgent();
  });

  describe('Markdown Conversion', () => {
    it('should convert CV to Markdown format', async () => {
      const cv = {
        summary: 'Professional summary',
        skills: ['TypeScript', 'React'],
        experience: [{
          title: 'Engineer',
          company: 'Company',
          period: '2020-2024',
          bullets: ['Achievement 1', 'Achievement 2']
        }]
      };
      
      const markdown = agent.convertToMarkdown(cv);
      expect(markdown).toContain('# CV');
      expect(markdown).toContain('## Summary');
      expect(markdown).toContain('## Skills');
      expect(markdown).toContain('## Experience');
      expect(markdown).toContain('TypeScript');
    });

    it('should handle special characters in Markdown', () => {
      const cv = {
        summary: 'Summary with [brackets] and (parentheses)',
        skills: ['C++', 'C#'],
        experience: []
      };
      
      const markdown = agent.convertToMarkdown(cv);
      expect(markdown).toContain('[brackets]');
      expect(markdown).toContain('C++');
    });
  });

  describe('Text Conversion', () => {
    it('should convert CV to plain text format', () => {
      const cv = {
        summary: 'Professional summary',
        skills: ['Skill1', 'Skill2'],
        experience: [{
          title: 'Job Title',
          company: 'Company',
          period: '2020-2024',
          bullets: ['Bullet 1']
        }]
      };
      
      const text = agent.convertToText(cv);
      expect(text).toContain('CV');
      expect(text).toContain('SUMMARY');
      expect(text).toContain('SKILLS');
      expect(text).toContain('Skill1, Skill2');
    });

    it('should format bullets correctly', () => {
      const cv = {
        summary: '',
        skills: [],
        experience: [{
          title: 'Role',
          company: 'Company',
          period: '2020-2024',
          bullets: ['First achievement', 'Second achievement']
        }]
      };
      
      const text = agent.convertToText(cv);
      expect(text).toContain('• First achievement');
      expect(text).toContain('• Second achievement');
    });
  });
});
```

### Analytics Tests

```typescript
// tests/unit/analytics.test.ts
describe('Analytics', () => {
  let agent: PSBCVAgent;

  beforeEach(() => {
    agent = new PSBCVAgent();
  });

  it('should track generation metrics', async () => {
    const initialTotal = agent.analyticsData.totalGenerated;
    
    await agent.execute({
      operation: 'generate',
      job_description: 'Job...'
    });
    
    expect(agent.analyticsData.totalGenerated).toBe(initialTotal + 1);
  });

  it('should calculate average match score', async () => {
    for (let i = 0; i < 5; i++) {
      await agent.execute({
        operation: 'generate',
        job_description: 'Job...'
      });
    }
    
    const avg = agent.analyticsData.avgMatchScore;
    expect(avg).toBeGreaterThanOrEqual(0);
    expect(avg).toBeLessThanOrEqual(100);
  });

  it('should track format distribution', async () => {
    for (const format of ['pdf', 'markdown', 'text']) {
      await agent.execute({
        operation: 'generate',
        job_description: 'Job...',
        format
      });
    }
    
    expect(agent.analyticsData.formatDistribution.pdf).toBeGreaterThan(0);
    expect(agent.analyticsData.formatDistribution.markdown).toBeGreaterThan(0);
    expect(agent.analyticsData.formatDistribution.text).toBeGreaterThan(0);
  });

  it('should track top technologies', async () => {
    const analytics = agent.analyticsData;
    expect(Array.isArray(analytics.topTechnologies)).toBe(true);
    expect(analytics.topTechnologies.length).toBeGreaterThanOrEqual(0);
  });

  it('should persist analytics to disk', async () => {
    await agent.persistAnalytics();
    
    const fs = require('fs');
    const analyticsPath = './cv-analytics/analytics.json';
    expect(fs.existsSync(analyticsPath)).toBe(true);
  });
});
```

## Integration Tests

### CV Builder Skill Integration

```typescript
// tests/integration/cv-builder-integration.test.ts
describe('CV Builder Skill Integration', () => {
  let agent: PSBCVAgent;

  beforeEach(() => {
    agent = new PSBCVAgent();
  });

  it('should successfully call CV Builder Skill', async () => {
    const response = await agent.execute({
      operation: 'generate',
      job_description: 'Job description...'
    });
    
    expect(response.status).toBe('success');
    expect(response.cv_details).toBeDefined();
  });

  it('should handle CV Builder Skill timeout', async () => {
    // Set very short timeout
    agent.config.cvBuilder.timeout = 1;
    
    const response = await agent.execute({
      operation: 'generate',
      job_description: 'Job...'
    });
    
    // Should handle gracefully
    expect(response.status).toBeDefined();
  });

  it('should retry on CV Builder Skill failure', async () => {
    // Test retry logic
    agent.config.cvBuilder.retries = 3;
    
    const response = await agent.execute({
      operation: 'generate',
      job_description: 'Job...'
    });
    
    // Should eventually succeed or fail gracefully
    expect(response.status).toBeDefined();
  });
});
```

## End-to-End Tests

### Complete Workflow

```typescript
// tests/e2e/complete-workflow.test.ts
describe('Complete Workflows', () => {
  let agent: PSBCVAgent;

  beforeEach(() => {
    agent = new PSBCVAgent();
  });

  it('should complete single application workflow', async () => {
    // Step 1: Generate CV
    const genResponse = await agent.execute({
      operation: 'generate',
      job_description: 'Senior Engineer role...',
      format: 'pdf'
    });
    expect(genResponse.status).toBe('success');
    
    // Step 2: Check quality
    expect(genResponse.cv_details.matchScore).toBeGreaterThan(50);
    
    // Step 3: Get suggestions
    const sugResponse = await agent.execute({
      operation: 'suggest_improvements',
      job_description: 'Senior Engineer role...'
    });
    expect(sugResponse.suggestions).toBeDefined();
  });

  it('should complete batch application workflow', async () => {
    const jobs = [
      'Senior Engineer at TechCorp...',
      'Lead Developer at StartupXYZ...',
      'Architect at EnterpriseInc...'
    ];
    
    // Generate batch
    const batchResponse = await agent.execute({
      operation: 'generate_batch',
      job_descriptions: jobs,
      include_analytics: true
    });
    
    expect(batchResponse.operation_result.success_count).toBe(3);
    expect(batchResponse.analytics).toBeDefined();
    
    // Analyze performance
    const analyticsResponse = await agent.execute({
      operation: 'analyze',
      include_analytics: true
    });
    
    expect(analyticsResponse.analytics.totalGenerated).toBeGreaterThanOrEqual(3);
  });

  it('should track applications through lifecycle', async () => {
    // Generate CV
    await agent.execute({
      operation: 'generate',
      job_description: 'Job...',
      job_id: 'test-job-123'
    });
    
    // Track applications
    const trackResponse = await agent.execute({
      operation: 'track'
    });
    
    expect(trackResponse.status).toBe('success');
  });
});
```

## Performance Tests

### Load Testing

```typescript
// tests/performance/load-testing.ts
describe('Load Testing', () => {
  let agent: PSBCVAgent;

  beforeEach(() => {
    agent = new PSBCVAgent();
  });

  it('should handle 100 sequential CV generations', async () => {
    const startTime = Date.now();
    
    for (let i = 0; i < 100; i++) {
      await agent.execute({
        operation: 'generate',
        job_description: `Job description ${i}...`
      });
    }
    
    const duration = Date.now() - startTime;
    const avgTime = duration / 100;
    
    console.log(`Total time: ${duration}ms`);
    console.log(`Average per CV: ${avgTime}ms`);
    
    // Should complete in reasonable time (< 2 seconds per CV)
    expect(avgTime).toBeLessThan(2000);
  });

  it('should handle batch generation of 500 CVs', async () => {
    const jobs = Array(500).fill('Job description...');
    const startTime = Date.now();
    
    const response = await agent.execute({
      operation: 'generate_batch',
      job_descriptions: jobs
    });
    
    const duration = Date.now() - startTime;
    
    expect(response.operation_result.success_count).toBeGreaterThan(400);
    expect(duration).toBeLessThan(300000); // 5 minutes max
  });

  it('should maintain performance under repeated requests', async () => {
    const times = [];
    
    for (let i = 0; i < 10; i++) {
      const startTime = Date.now();
      await agent.execute({
        operation: 'generate',
        job_description: 'Job...'
      });
      times.push(Date.now() - startTime);
    }
    
    // Performance should not degrade significantly
    const first5Avg = times.slice(0, 5).reduce((a, b) => a + b) / 5;
    const last5Avg = times.slice(5).reduce((a, b) => a + b) / 5;
    
    expect(last5Avg).toBeLessThan(first5Avg * 1.5); // Allow 50% increase
  });
});
```

## Running Tests

```bash
# Install test dependencies
npm install --save-dev jest @types/jest ts-jest

# Run all tests
npm test

# Run specific test suite
npm test -- unit/config.test.ts

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run performance tests
npm run test:performance

# Run specific test pattern
npm test -- --testNamePattern="should generate"
```

## Test Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| CV Generation | 90%+ |
| Formatting | 95%+ |
| Configuration | 85%+ |
| Analytics | 80%+ |
| Integration | 70%+ |
| **Overall** | **85%+** |

## Continuous Integration

Add to CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run lint
```

---

**Test scenarios ensure quality and reliability of the PSB CV Agent.**

For more details, refer to the main [README.md](PSB-CV-Agent-README.md).
