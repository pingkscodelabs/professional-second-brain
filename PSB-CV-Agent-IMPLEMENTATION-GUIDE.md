# PSB CV Agent - Implementation Guide

## Deep Dive into Architecture and Development

This guide provides detailed technical implementation information for developers working with or extending the PSB CV Agent.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Classes](#core-classes)
3. [Module Breakdown](#module-breakdown)
4. [Development Patterns](#development-patterns)
5. [Extending the System](#extending-the-system)
6. [Internal APIs](#internal-apis)
7. [Performance Optimization](#performance-optimization)
8. [Debugging & Development](#debugging--development)

---

## Architecture Overview

### High-Level Design

The PSB CV Agent follows a modular, layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                  External API Layer                      │
│              (REST/CLI Entry Points)                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│            Request Handler & Validation                  │
│        (CVGenerationRequest → Response)                  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                Operation Router                          │
│  ┌──────────┬──────────┬──────────┬────────────┐       │
│  │ Generate │  Batch   │   Track  │  Analyze   │       │
│  └──────────┴──────────┴──────────┴────────────┘       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              Processing Layer                            │
│  ┌─────────────────────────────────────────────────┐  │
│  │ CV Generation Pipeline                          │  │
│  │  1. Extract Focus Areas                         │  │
│  │  2. Invoke CV Builder Skill                     │  │
│  │  3. Process Results                             │  │
│  │  4. Calculate Metrics                           │  │
│  │  5. Format Output                               │  │
│  │  6. Store Files                                 │  │
│  └─────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│            Integration Layer                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ External Service Integration                     │  │
│  │ • CV Builder Skill                               │  │
│  │ • Quality Checker (optional)                     │  │
│  │ • Analyzer (optional)                            │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              Data Access Layer                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Storage & Persistence                            │  │
│  │ • File System (JSON, PDF, MD, TXT)              │  │
│  │ • Metadata Repository                           │  │
│  │ • Analytics Store                               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Single Responsibility**: Each class handles one primary concern
2. **Dependency Injection**: Dependencies passed to classes
3. **Interface Segregation**: Small, focused interfaces
4. **Composition over Inheritance**: Prefer composition patterns
5. **Configuration Driven**: Externalized configuration
6. **Error Handling**: Comprehensive error management
7. **Observability**: Built-in logging and metrics

---

## Core Classes

### PSBCVAgent (Main Class)

**Location**: `psb-cv-agent.ts` (Root class)

**Responsibilities**:
- Orchestrate all CV operations
- Route requests to appropriate handlers
- Manage configuration lifecycle
- Coordinate between subsystems
- Persist data and analytics

**Key Properties**:
```typescript
private config: any;
private cvRepository: Map<string, GeneratedCV[]>;
private applicationTracker: Map<string, ApplicationTracking>;
private analyticsData: CVAnalytics;
```

**Key Methods**:
```typescript
execute(request: CVGenerationRequest): Promise<CVAgentResponse>
generateSingleCV(request): Promise<CVAgentResponse>
generateBatchCVs(request): Promise<CVAgentResponse>
trackApplications(request): Promise<CVAgentResponse>
analyzePerformance(request): Promise<CVAgentResponse>
suggestImprovements(request): Promise<CVAgentResponse>
```

**Instantiation**:
```typescript
// With default config
const agent = new PSBCVAgent();

// With custom config
const agent = new PSBCVAgent('./custom-config.yaml');
```

---

## Module Breakdown

### 1. Configuration Management Module

**Methods**:
```typescript
private loadConfig(configPath?: string): any
private getDefaultConfig(): any
private ensureStorageDirectories(): void
```

**Default Configuration Structure**:
```yaml
agent:
  name: PSB CV Agent
  version: 1.0.0

cvBuilder:
  endpoint: http://localhost:3000/api/cv-builder
  timeout: 30000
  retries: 3

storage:
  cvDirectory: ./generated-cvs
  historyDirectory: ./cv-history
  analyticsDirectory: ./cv-analytics

formats:
  supported: [pdf, markdown, text, json]
  default: pdf

performance:
  maxParallelGenerations: 5
  batchTimeout: 120000
```

### 2. CV Generation Module

**Methods**:
```typescript
private generateSingleCV(request): Promise<CVAgentResponse>
private generateBatchCVs(request): Promise<CVAgentResponse>
private invokeCVBuilderSkill(params: any): Promise<any>
private extractFocusAreas(jobDescription: string): string[]
```

**Processing Pipeline**:
```
1. Validate Input
   ↓
2. Extract Focus Areas from Job Description
   ↓
3. Call CV Builder Skill
   ↓
4. Receive Structured CV
   ↓
5. Calculate Metrics
   ↓
6. Format to Output Format
   ↓
7. Write to Storage
   ↓
8. Update Analytics
   ↓
9. Return Response
```

### 3. Format Conversion Module

**Methods**:
```typescript
private formatCV(cvData: any, format: string, template: string): Promise<any>
private convertToMarkdown(cv: GeneratedCV): string
private convertToText(cv: GeneratedCV): string
private writeCV(outputPath: string, cvData: GeneratedCV, format: string): Promise<void>
```

**Format Specifications**:
- **PDF**: Professional format with styling
- **Markdown**: Clean, git-friendly format
- **Text**: Plain text for ATS systems
- **JSON**: Structured data with full metadata

### 4. Analytics Module

**Methods**:
```typescript
private calculateMetrics(cv: any): Promise<CVMetrics>
private updateAnalytics(cv: GeneratedCV): void
private persistAnalytics(): Promise<void>
private loadPersistentData(): void
```

**Tracked Metrics**:
- Generation time (milliseconds)
- Match scores (0-100)
- Format distribution
- Technology coverage
- Performance by role/company
- Success rates

### 5. Application Tracking Module

**Methods**:
```typescript
private trackApplications(request): Promise<CVAgentResponse>
getApplications(): ApplicationTracking[]
```

**Tracked Information**:
- Application timestamp
- Current status
- Linked CV version
- Company and position
- Status history

---

## Development Patterns

### Pattern 1: Adding New Operations

To add a new operation:

1. **Define the Request Type**:
```typescript
interface CustomRequest extends CVGenerationRequest {
  operation: 'custom_operation';
  customParam?: string;
}
```

2. **Create Handler Method**:
```typescript
private async handleCustomOperation(request: CustomRequest): Promise<CVAgentResponse> {
  try {
    // Implementation
    return {
      operation_result: { /* ... */ },
      status: 'success',
      message: 'Operation completed',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'failed',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
```

3. **Add to Router**:
```typescript
case 'custom_operation':
  result = await this.handleCustomOperation(request);
  break;
```

### Pattern 2: Adding New Formats

To add support for a new output format:

1. **Extend Format Configuration**:
```yaml
formats:
  supported: [pdf, markdown, text, json, newformat]
  newformat:
    option1: value1
    option2: value2
```

2. **Add Conversion Method**:
```typescript
private convertToNewFormat(cv: GeneratedCV): string {
  // Conversion logic
  return formattedString;
}
```

3. **Update writeCV**:
```typescript
if (format === 'newformat') {
  const converted = this.convertToNewFormat(cvData);
  fs.writeFileSync(outputPath, converted);
}
```

### Pattern 3: Adding Integrations

To integrate with external systems:

1. **Create Integration Class**:
```typescript
class ExternalSystemIntegration {
  async connect(config: any): Promise<void> { }
  async invoke(params: any): Promise<any> { }
  async disconnect(): Promise<void> { }
}
```

2. **Use in Agent**:
```typescript
private integration: ExternalSystemIntegration;

constructor(configPath?: string) {
  this.integration = new ExternalSystemIntegration();
  this.integration.connect(this.config.externalSystem);
}
```

### Pattern 4: Parallel Processing

For batch operations with parallel processing:

```typescript
async processBatch(items: Item[], maxParallel: number): Promise<Result[]> {
  const results: Result[] = [];
  
  for (let i = 0; i < items.length; i += maxParallel) {
    const chunk = items.slice(i, i + maxParallel);
    const chunkResults = await Promise.all(
      chunk.map(item => this.processItem(item))
    );
    results.push(...chunkResults);
  }
  
  return results;
}
```

---

## Extending the System

### Extending Configuration

1. Add new section to `psb-cv-agent-config.yaml`:
```yaml
customFeature:
  enabled: true
  option1: value1
  option2: value2
```

2. Access in code:
```typescript
const customConfig = this.config.customFeature;
if (customConfig.enabled) {
  // Use custom feature
}
```

### Creating Custom CV Templates

1. Create template class:
```typescript
class CustomTemplate {
  format(cv: GeneratedCV): string {
    // Custom formatting logic
  }
}
```

2. Register in agent:
```typescript
private templates: Map<string, TemplateFormatter> = new Map([
  ['custom', new CustomTemplate()],
  // ...
]);
```

### Adding Quality Checks

Integrate with Quality Checker:

```typescript
private async validateQuality(cv: GeneratedCV): Promise<QualityIssue[]> {
  const checker = new PSBQualityChecker();
  const issues = await checker.validate(cv);
  
  if (issues.length > 0) {
    logger.warn(`Quality issues found: ${issues.length}`);
  }
  
  return issues;
}
```

---

## Internal APIs

### Configuration API

```typescript
// Load configuration
loadConfig(path: string): any

// Get defaults
getDefaultConfig(): any

// Validate configuration
validateConfig(config: any): boolean

// Merge configs
mergeConfig(base: any, override: any): any
```

### CV Generation API

```typescript
// Generate single CV
generateSingleCV(request: CVGenerationRequest): Promise<CVAgentResponse>

// Generate batch
generateBatchCVs(request: CVGenerationRequest): Promise<CVAgentResponse>

// Extract focus areas
extractFocusAreas(jobDescription: string): string[]

// Invoke CV Builder
invokeCVBuilderSkill(params: any): Promise<any>
```

### Analytics API

```typescript
// Calculate metrics
calculateMetrics(cv: any): Promise<CVMetrics>

// Update analytics
updateAnalytics(cv: GeneratedCV): void

// Get analytics
getAnalytics(): CVAnalytics

// Persist analytics
persistAnalytics(): Promise<void>
```

### Storage API

```typescript
// Write CV to file
writeCV(path: string, data: GeneratedCV, format: string): Promise<void>

// Read CV from file
readCV(path: string): Promise<GeneratedCV>

// List CVs
listCVs(jobId?: string): GeneratedCV[]

// Delete CV
deleteCV(cvId: string): Promise<void>
```

---

## Performance Optimization

### Optimization Strategies

1. **Batch Processing**:
```typescript
// Process in parallel chunks
for (let i = 0; i < jobs.length; i += maxParallel) {
  const chunk = jobs.slice(i, i + maxParallel);
  await Promise.all(chunk.map(job => process(job)));
}
```

2. **Caching**:
```typescript
private cache: Map<string, any> = new Map();

private getCachedResult(key: string): any {
  const cached = this.cache.get(key);
  if (cached && Date.now() - cached.timestamp < this.config.performance.cacheTTL) {
    return cached.data;
  }
  return null;
}
```

3. **Lazy Loading**:
```typescript
private _config: any;

get config(): any {
  if (!this._config) {
    this._config = this.loadConfig();
  }
  return this._config;
}
```

4. **Resource Pooling**:
```typescript
private connections: Connection[] = [];

private getConnection(): Connection {
  if (this.connections.length > 0) {
    return this.connections.pop();
  }
  return new Connection();
}
```

### Memory Optimization

- Use streaming for large files
- Clear caches periodically
- Limit parallel operations
- Monitor heap usage

### CPU Optimization

- Batch operations together
- Use worker threads for heavy processing
- Implement progressive processing
- Cache computed results

---

## Debugging & Development

### Enable Debug Logging

```yaml
development:
  debugLogging: true
  mockMode: false
  dryRun: false
```

### Debug Environment Variables

```bash
export DEBUG=psb-cv-agent:*
export LOG_LEVEL=debug
export NODE_DEBUG=http,fs
```

### Development Tools

```bash
# Start with debug info
DEBUG=* npm start

# Use Node debugger
node --inspect dist/psb-cv-agent.js

# Run TypeScript directly
ts-node --transpile-only psb-cv-agent.ts
```

### Testing During Development

```bash
# Run specific test
npm test -- config.test.ts

# Watch mode
npm test -- --watch

# Debug test
node --inspect-brk ./node_modules/jest/bin/jest.js
```

### Common Development Tasks

```bash
# Rebuild after changes
npm run build

# Watch and rebuild
npm run build -- --watch

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run validate
```

### Performance Profiling

```typescript
// Profile operation
const startTime = performance.now();
await agent.execute(request);
const duration = performance.now() - startTime;
console.log(`Operation took ${duration}ms`);

// Memory profiling
console.log(process.memoryUsage());
```

---

## Error Handling Strategy

### Error Types

1. **Configuration Errors**: Invalid config
2. **Validation Errors**: Invalid input
3. **Integration Errors**: External service failures
4. **Storage Errors**: File I/O failures
5. **Processing Errors**: Generation failures

### Error Handling Pattern

```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
  } else if (error instanceof IntegrationError) {
    // Handle integration error
  } else {
    // Handle unknown error
  }
  
  // Log error
  logger.error('Operation failed', { error, context });
  
  // Return error response
  return createErrorResponse(error);
}
```

---

## Testing Strategy for Developers

### Unit Test Template

```typescript
describe('Module', () => {
  let instance: Module;
  
  beforeEach(() => {
    instance = new Module();
  });
  
  it('should perform action', () => {
    const result = instance.method();
    expect(result).toBe(expectedValue);
  });
});
```

### Mocking Dependencies

```typescript
// Mock CV Builder Skill
jest.mock('./cv-builder-skill', () => ({
  invoke: jest.fn().mockResolvedValue({
    // Mock response
  })
}));
```

### Integration Testing

```typescript
// Test with real dependencies
describe('Integration', () => {
  it('should work with CV Builder', async () => {
    const response = await agent.execute({
      operation: 'generate',
      job_description: 'Test job'
    });
    
    expect(response.status).toBe('success');
  });
});
```

---

## Maintenance & Updates

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Security audit
npm audit
npm audit fix
```

### Version Bumping

1. Update version in package.json
2. Update version in config.yaml
3. Update version in extension.json
4. Create git tag
5. Document changes in CHANGELOG

### Backward Compatibility

Maintain backward compatibility:
- Don't remove existing operations
- Don't change existing response formats
- Deprecate gradually with warnings
- Support legacy config formats

---

**For production deployment, refer to [PSB-CV-Agent-DEPLOYMENT-GUIDE.md](PSB-CV-Agent-DEPLOYMENT-GUIDE.md).**

**For testing details, refer to [PSB-CV-Agent-TEST-SCENARIOS.md](PSB-CV-Agent-TEST-SCENARIOS.md).**
