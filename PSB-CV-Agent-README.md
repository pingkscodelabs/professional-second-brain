# PSB CV Agent - Comprehensive Documentation

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** 2024-01-XX

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Architecture](#core-architecture)
3. [Feature Overview](#feature-overview)
4. [System Design](#system-design)
5. [Components and Modules](#components-and-modules)
6. [API Reference](#api-reference)
7. [Configuration Guide](#configuration-guide)
8. [Integration Patterns](#integration-patterns)
9. [Deployment Guide](#deployment-guide)
10. [Operations and Monitoring](#operations-and-monitoring)
11. [Performance Tuning](#performance-tuning)
12. [Troubleshooting](#troubleshooting)
13. [Best Practices](#best-practices)
14. [Security Considerations](#security-considerations)
15. [FAQ](#faq)

---

## Executive Summary

The **PSB CV Agent** is an autonomous, enterprise-grade system for intelligent CV (Curriculum Vitae) generation and management. It orchestrates the complete lifecycle of CV creation—from job monitoring through application tracking and performance analytics—leveraging the production-ready **psb-cv-builder-skill** to generate tailored, evidence-backed CVs.

### Key Capabilities

- **Intelligent CV Generation**: Automatically generates tailored CVs based on job descriptions
- **Batch Processing**: Process multiple job postings simultaneously with parallelization
- **Multi-Format Output**: Generate CVs in PDF, Markdown, plain text, or JSON formats
- **Version Control**: Track and manage CV iterations automatically
- **Application Tracking**: Monitor CV submissions and track application status
- **Performance Analytics**: Comprehensive metrics on CV success rates and match scores
- **Smart Suggestions**: AI-powered content improvement recommendations
- **Job Monitoring**: Continuous monitoring of new job opportunities
- **Integration Ecosystem**: Seamless integration with Quality Checker, Analyzer, and CV Builder

### Target Users

- **Job Seekers**: Professionals managing multiple job applications
- **Recruiters**: HR professionals creating bulk candidate CVs
- **Career Coaches**: Professionals helping clients optimize CVs
- **Enterprise Users**: Organizations managing candidate relationships

### Value Proposition

1. **Time Efficiency**: Reduce CV creation time from hours to minutes
2. **Quality Assurance**: Ensure CVs are evidence-backed and non-fabricated
3. **Match Optimization**: Maximize job match scores through tailored content
4. **Application Tracking**: Centralized management of all CV submissions
5. **Data-Driven Insights**: Analytics to inform CV optimization strategies

---

## Core Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│           PSB CV Agent                                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Request Handler & Orchestrator                    │  │
│  └──────────────────────────────────────────────────┘  │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ CV Generation Pipeline                           │  │
│  │ • Single CV Generator                            │  │
│  │ • Batch Processor                                │  │
│  │ • Format Converter                               │  │
│  └──────────────────────────────────────────────────┘  │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Integration Layer                                │  │
│  │ • psb-cv-builder-skill                           │  │
│  │ • psb-quality-checker                            │  │
│  │ • psb-analyzer                                   │  │
│  └──────────────────────────────────────────────────┘  │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Data & Analytics Engine                          │  │
│  │ • Version Control                                │  │
│  │ • Application Tracker                            │  │
│  │ • Analytics Calculator                           │  │
│  └──────────────────────────────────────────────────┘  │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Storage & Persistence                            │  │
│  │ • File Storage (PDF, MD, TXT, JSON)             │  │
│  │ • Metadata Repository                            │  │
│  │ • Analytics Database                             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Language**: TypeScript (ES2020)
- **Runtime**: Node.js 16+
- **Config**: YAML
- **Data**: JSON
- **File Formats**: PDF (pdfkit), Markdown, Text, JSON
- **Logging**: JSON/Text
- **Testing**: Jest

### Key Design Principles

1. **Modularity**: Each responsibility separated into distinct classes
2. **Extensibility**: Easy to add new formats, templates, or integrations
3. **Reliability**: Comprehensive error handling and retry logic
4. **Observability**: Detailed logging and metrics collection
5. **Performance**: Parallel processing and caching for efficiency
6. **Security**: Data validation, confidentiality checks, and encryption support

---

## Feature Overview

### 1. Single CV Generation

Generate a tailored CV for a specific job posting.

**Use Case**: Applying for a specific position
**Input**: Job description + professional profile
**Output**: Tailored CV in requested format
**Match Score**: 0-100 indicating job alignment

### 2. Batch CV Generation

Generate multiple CVs in parallel for numerous job postings.

**Use Case**: Processing 50+ job postings
**Input**: Array of job descriptions
**Output**: Multiple CVs with metadata
**Performance**: Parallel processing with configurable concurrency
**Progress**: Real-time tracking of batch status

### 3. Version Control

Automatic tracking and management of CV iterations.

**Features**:
- Automatic versioning (v1, v2, v3, etc.)
- Change history and diff tracking
- Rollback to previous versions
- Performance comparison between versions

### 4. Application Tracking

Centralized tracking of CV submissions and application status.

**Statuses**:
- Submitted
- Pending
- Shortlisted
- Rejected
- Interview
- Offer

**Tracking**:
- Application timestamp
- Current status
- Status change history
- Linked CV version

### 5. Performance Analytics

Comprehensive analytics on CV generation and success metrics.

**Metrics Tracked**:
- Generation time (milliseconds)
- Match scores by job type
- Format distribution
- Technology coverage
- Success rates
- Performance by role and company

**Reporting**:
- Real-time dashboards
- Historical trends
- Comparative analysis
- Actionable insights

### 6. Content Suggestions

AI-powered recommendations for CV improvement.

**Suggestion Types**:
- Missing skills alignment
- Weak phrasing improvements
- Technology emphasis
- Experience reframing
- Achievement quantification

**Impact Levels**: High, Medium, Low
**Priority Ranking**: Based on impact and relevance

### 7. Format Management

Support for multiple CV output formats.

**Supported Formats**:
- **PDF**: Professional, print-ready CVs
- **Markdown**: Easy-to-edit, version-control friendly
- **Text**: Plain text for ATS systems
- **JSON**: Machine-readable structured data

### 8. Job Monitoring

Continuous monitoring of job opportunities.

**Features**:
- Monitor multiple job platforms
- Filter by keywords, location, salary
- Auto-notification on new matches
- Optional auto-CV generation

---

## System Design

### Data Models

#### CVGenerationRequest
```typescript
{
  operation: 'generate' | 'generate_batch' | 'track' | 'analyze' | 'suggest_improvements';
  job_description?: string;          // Single job description
  job_descriptions?: string[];       // Multiple job descriptions
  format?: 'pdf' | 'markdown' | 'text' | 'json';
  template?: 'resume' | 'cv' | 'linkedin';
  output_path?: string;
  include_analytics?: boolean;
  job_id?: string;
}
```

#### GeneratedCV
```typescript
{
  id: string;                        // Unique CV identifier
  jobId: string;                     // Associated job posting
  format: string;                    // Output format
  pageCount: number;                 // Number of pages
  bulletCount: number;               // Number of bullet points
  technologyCoverage: number;        // 0-100 score
  matchScore: number;                // 0-100 alignment with job
  generatedAt: string;               // ISO timestamp
  filePath: string;                  // Storage location
  version: number;                   // Version number
  summary: string;                   // Professional summary
  skills: string[];                  // Extracted skills
  experience: ExperienceEntry[];     // Work experience
  metrics: CVMetrics;                // Quality metrics
}
```

#### ApplicationTracking
```typescript
{
  jobId: string;
  cvId: string;
  applicationDate: string;
  applicationStatus: 'submitted' | 'pending' | 'shortlisted' | 'rejected' | 'interview' | 'offer';
  companyName: string;
  positionTitle: string;
  lastUpdated: string;
}
```

#### CVAnalytics
```typescript
{
  generationTimeMs: number;
  avgMatchScore: number;
  formatDistribution: Record<string, number>;
  topTechnologies: string[];
  performanceByRole: Record<string, number>;
  performanceByCompany: Record<string, number>;
  totalGenerated: number;
  successRate: number;
}
```

### Process Flows

#### Single CV Generation Flow
```
1. Receive CVGenerationRequest
2. Validate job description
3. Extract focus areas and requirements
4. Invoke CV Builder Skill with parameters
5. Receive generated CV structure
6. Format according to requested format
7. Calculate quality metrics
8. Store CV and metadata
9. Update analytics
10. Return CVAgentResponse with details
```

#### Batch Generation Flow
```
1. Receive CVGenerationRequest with job_descriptions array
2. Validate all job descriptions
3. Split into parallel chunks (respecting maxParallelGenerations)
4. For each chunk:
   a. Invoke single CV generation for each job
   b. Track progress
   c. Handle failures gracefully
5. Aggregate results
6. Generate batch report
7. Update analytics
8. Return aggregated response
```

#### Application Tracking Flow
```
1. Create ApplicationTracking record on CV submission
2. Track application lifecycle events
3. Update status as changes occur
4. Link to specific CV version used
5. Maintain change history
6. Generate status reports
```

---

## Components and Modules

### Core Classes

#### PSBCVAgent (Main Class)
**Responsibilities**:
- Orchestrate all CV operations
- Manage configuration
- Handle request routing
- Coordinate between subsystems
- Persist data and analytics

**Key Methods**:
```typescript
execute(request: CVGenerationRequest): Promise<CVAgentResponse>
generateSingleCV(request): Promise<CVAgentResponse>
generateBatchCVs(request): Promise<CVAgentResponse>
trackApplications(request): Promise<CVAgentResponse>
analyzePerformance(request): Promise<CVAgentResponse>
suggestImprovements(request): Promise<CVAgentResponse>
```

### Supporting Functions

#### Configuration Management
- `loadConfig()`: Load YAML configuration
- `getDefaultConfig()`: Return default settings
- `validateConfiguration()`: Ensure config integrity

#### CV Processing
- `extractFocusAreas()`: Identify key job requirements
- `formatCV()`: Convert CV to target format
- `writeCV()`: Persist CV to storage
- `convertToMarkdown()`: Generate Markdown version
- `convertToText()`: Generate plain text version

#### Quality & Analytics
- `calculateMetrics()`: Compute CV quality scores
- `updateAnalytics()`: Track performance data
- `persistAnalytics()`: Save analytics to disk
- `analyzeCVGaps()`: Identify improvement areas

#### Utility Functions
- `generateCVId()`: Create unique identifiers
- `generateOutputPath()`: Determine storage location
- `getFileExtension()`: Map format to file extension
- `ensureStorageDirectories()`: Prepare file system
- `estimatePageCount()`: Calculate page count
- `countBullets()`: Count experience bullets

---

## API Reference

### Execute Operation

**Endpoint**: Core method on PSBCVAgent instance

```typescript
async execute(request: CVGenerationRequest): Promise<CVAgentResponse>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| operation | string | Yes | Operation type: generate, generate_batch, track, analyze, suggest_improvements |
| job_description | string | No | Single job description (required for generate) |
| job_descriptions | array | No | Multiple job descriptions (required for generate_batch) |
| format | string | No | Output format: pdf, markdown, text, json (default: pdf) |
| template | string | No | Template type: resume, cv, linkedin (default: resume) |
| output_path | string | No | Custom output path |
| include_analytics | boolean | No | Include analytics in response (default: false) |
| job_id | string | No | Job posting identifier for tracking |

#### Response Format

```typescript
{
  operation_result: {
    generated_count: number;
    success_count: number;
    failed_count: number;
    files_created: string[];
  };
  cv_details?: {
    id: string;
    jobId: string;
    format: string;
    pageCount: number;
    bulletCount: number;
    technologyCoverage: number;
    matchScore: number;
    generatedAt: string;
    filePath: string;
    version: number;
    summary: string;
    skills: string[];
    experience: ExperienceEntry[];
    metrics: CVMetrics;
  };
  analytics?: {
    generationTimeMs: number;
    avgMatchScore: number;
    formatDistribution: Record<string, number>;
    topTechnologies: string[];
    performanceByRole: Record<string, number>;
    performanceByCompany: Record<string, number>;
    totalGenerated: number;
    successRate: number;
  };
  suggestions?: [
    {
      section: string;
      suggestion: string;
      impact: 'high' | 'medium' | 'low';
      priority: number;
      example?: string;
    }
  ];
  status: 'success' | 'partial' | 'failed';
  message: string;
  timestamp: string;
}
```

### Operation Details

#### 1. Generate Single CV

```typescript
const request: CVGenerationRequest = {
  operation: 'generate',
  job_description: 'Senior TypeScript Developer...',
  format: 'pdf',
  template: 'resume'
};

const response = await agent.execute(request);
```

**Returns**: CVAgentResponse with single CV details

#### 2. Generate Batch CVs

```typescript
const request: CVGenerationRequest = {
  operation: 'generate_batch',
  job_descriptions: [
    'Job description 1...',
    'Job description 2...',
    'Job description 3...'
  ],
  format: 'markdown'
};

const response = await agent.execute(request);
```

**Returns**: CVAgentResponse with batch results and stats

#### 3. Track Applications

```typescript
const request: CVGenerationRequest = {
  operation: 'track'
};

const response = await agent.execute(request);
```

**Returns**: CVAgentResponse with application tracking data

#### 4. Analyze Performance

```typescript
const request: CVGenerationRequest = {
  operation: 'analyze',
  include_analytics: true
};

const response = await agent.execute(request);
```

**Returns**: CVAgentResponse with comprehensive analytics

#### 5. Suggest Improvements

```typescript
const request: CVGenerationRequest = {
  operation: 'suggest_improvements',
  job_description: 'Job posting text...'
};

const response = await agent.execute(request);
```

**Returns**: CVAgentResponse with improvement suggestions

---

## Configuration Guide

### Configuration File Structure

The PSB CV Agent uses YAML configuration (psb-cv-agent-config.yaml) with the following sections:

### Storage Configuration

```yaml
storage:
  cvDirectory: ./generated-cvs
  historyDirectory: ./cv-history
  analyticsDirectory: ./cv-analytics
  cacheDirectory: ./cv-cache
  logDirectory: ./logs/cv-agent
```

### Format Configuration

```yaml
formats:
  supported:
    - pdf
    - markdown
    - text
    - json
  default: pdf
  pdf:
    library: pdfkit
    pageSize: letter
    margins:
      top: 0.5in
      left: 0.75in
```

### Performance Tuning

```yaml
performance:
  maxParallelGenerations: 5
  batchTimeout: 120000  # milliseconds
  cacheEnabled: true
  cacheTTL: 3600       # seconds
```

### Analytics Configuration

```yaml
analytics:
  trackingEnabled: true
  historyRetention: 90  # days
  reportingInterval: daily
  dashboardEnabled: true
```

### Template Configuration

Each template can be customized:

```yaml
templates:
  resume:
    maxPages: 1
    maxLength: 450
    focusLevel: brief
    targetAudience: ats-optimized
  cv:
    maxPages: 3
    maxLength: 2000
    focusLevel: comprehensive
    targetAudience: hiring-manager
```

---

## Integration Patterns

### Integration with psb-cv-builder-skill

The CV Agent uses the CV Builder Skill to generate tailored CVs:

```typescript
// CV Agent calls CV Builder with parameters
const cvBuilderParams = {
  jobDescription: extractedJobText,
  format: targetTemplate,
  maxLength: templateConfig.maxLength,
  focusAreas: extractedFocusAreas
};

// CV Builder returns structured CV with evidence
const generatedCV = await invokeCV BuilderSkill(cvBuilderParams);
```

### Integration with psb-quality-checker

Optional quality validation:

```typescript
// After CV generation, optionally validate with Quality Checker
if (config.quality.validateFormatting) {
  const issues = await qualityChecker.validate(generatedCV);
  if (issues.length > 0) {
    // Log issues and apply fixes
  }
}
```

### Integration with psb-analyzer

Analyze CV match scores:

```typescript
// Use Analyzer to determine job match percentages
const matchAnalysis = await analyzer.analyze(
  generatedCV,
  jobDescription
);
```

### REST API Integration

For deployment as a service:

```typescript
import express from 'express';
const app = express();
const agent = new PSBCVAgent();

app.post('/api/cv/generate', async (req, res) => {
  const request: CVGenerationRequest = req.body;
  const response = await agent.execute(request);
  res.json(response);
});

app.post('/api/cv/generate-batch', async (req, res) => {
  const request: CVGenerationRequest = req.body;
  const response = await agent.execute(request);
  res.json(response);
});
```

---

## Deployment Guide

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager
- 500MB disk space minimum
- 512MB RAM minimum
- psb-cv-builder-skill installed and operational

### Installation Steps

1. **Clone or download the agent files**
```bash
cp psb-cv-agent.ts /path/to/psb
cp psb-cv-agent-config.yaml /path/to/psb
cp psb-cv-agent-package.json /path/to/psb
```

2. **Install dependencies**
```bash
cd /path/to/psb
npm install --save-dev typescript ts-node
npm install js-yaml pdfkit markdown-it
```

3. **Compile TypeScript**
```bash
tsc psb-cv-agent.ts --target ES2020 --module commonjs
```

4. **Verify installation**
```bash
node -e "require('./psb-cv-agent.js'); console.log('Success!');"
```

5. **Test basic functionality**
```bash
npm test
```

### Configuration Steps

1. **Customize config file**
```yaml
# Edit psb-cv-agent-config.yaml for your environment
storage:
  cvDirectory: /data/cvs
  historyDirectory: /data/cv-history
```

2. **Set environment variables**
```bash
export PSB_CV_AGENT_CONFIG=./psb-cv-agent-config.yaml
export PSB_CV_BUILDER_ENDPOINT=http://localhost:3000
```

3. **Create storage directories**
```bash
mkdir -p generated-cvs cv-history cv-analytics logs
```

### Running the Agent

#### As Node Script
```bash
node dist/psb-cv-agent.js
```

#### As TypeScript (Development)
```bash
ts-node psb-cv-agent.ts
```

#### As Service (systemd)
```ini
[Unit]
Description=PSB CV Agent
After=network.target

[Service]
Type=simple
User=psb
WorkingDirectory=/opt/psb
ExecStart=/usr/bin/node /opt/psb/dist/psb-cv-agent.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### As Docker Container
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY psb-cv-agent.ts package*.json ./
RUN npm ci --only=production
RUN npx tsc psb-cv-agent.ts --target ES2020

CMD ["node", "psb-cv-agent.js"]
```

### Health Checks

```bash
# Check if agent is responsive
curl http://localhost:3000/health

# Verify configuration
curl http://localhost:3000/config

# Test CV generation
curl -X POST http://localhost:3000/api/cv/generate \
  -H "Content-Type: application/json" \
  -d '{"operation":"generate","job_description":"..."}'
```

---

## Operations and Monitoring

### Logging

The agent outputs structured logs in JSON format:

```json
{
  "timestamp": "2024-01-15T09:30:00.000Z",
  "level": "info",
  "component": "CVAgent",
  "message": "CV generation started",
  "jobId": "job-123",
  "operation": "generate"
}
```

Configure logging level in config:

```yaml
logging:
  level: info      # debug, info, warn, error
  format: json     # json or text
  outputs:
    - console
    - file
```

### Metrics Collection

The agent automatically collects:

- Generation time per CV
- Match scores
- Format distribution
- Technology coverage
- Success rates
- Performance trends

Access metrics via:

```typescript
const analytics = agent.analyticsData;
console.log(`Total CVs generated: ${analytics.totalGenerated}`);
console.log(`Average match score: ${analytics.avgMatchScore}`);
```

### Performance Monitoring

Monitor these key metrics:

| Metric | Target | Alert |
|--------|--------|-------|
| Generation Time | < 30s | > 60s |
| Match Score | > 70 | < 50 |
| Success Rate | > 95% | < 90% |
| Cache Hit Rate | > 70% | < 50% |
| Storage Usage | < 1GB | > 5GB |

### Error Handling

The agent implements comprehensive error handling:

```typescript
try {
  const response = await agent.execute(request);
  if (response.status === 'failed') {
    console.error(response.message);
    // Handle failure
  }
} catch (error) {
  console.error('Unexpected error:', error);
  // Graceful degradation
}
```

---

## Performance Tuning

### Parallel Processing

Adjust concurrent generations:

```yaml
performance:
  maxParallelGenerations: 5  # Increase for more parallel work
```

### Caching

Enable/disable caching:

```yaml
performance:
  cacheEnabled: true
  cacheTTL: 3600  # 1 hour
```

### Memory Management

Monitor and optimize:

```typescript
const memUsage = process.memoryUsage();
console.log(`Heap used: ${memUsage.heapUsed / 1024 / 1024}MB`);
```

### Database Optimization

Optimize data persistence:

```bash
# Regular cleanup of old analytics
node -e "require('./psb-cv-agent.js').cleanupOldData({days: 90});"
```

---

## Troubleshooting

### Common Issues

**Issue**: CV generation fails with timeout
**Solution**: 
- Increase timeout in config
- Check CV Builder Skill availability
- Reduce maxParallelGenerations

**Issue**: File write errors
**Solution**:
- Verify directory permissions
- Check disk space
- Ensure directories exist

**Issue**: Low match scores
**Solution**:
- Review job description extraction
- Adjust focus area selection
- Check CV Builder configuration

### Debug Mode

Enable detailed logging:

```yaml
development:
  debugLogging: true
  mockMode: false
```

### Logs Location

- Main log: `./logs/cv-agent/cv-agent.log`
- Errors: `./logs/cv-agent/errors.log`
- Operations: `./logs/cv-agent/operations.log`

---

## Best Practices

1. **Regular Backups**: Backup generated CVs and analytics regularly
2. **Version Updates**: Track CV versions and maintain change history
3. **Quality Reviews**: Validate generated CVs with Quality Checker
4. **Performance Monitoring**: Track key metrics and alert on anomalies
5. **Security**: Mask sensitive data and encrypt when necessary
6. **Documentation**: Keep detailed records of CV customizations
7. **Testing**: Test with real job descriptions before production

---

## Security Considerations

1. **Data Protection**: CVs contain personal and professional information
2. **Access Control**: Implement authentication for API endpoints
3. **Encryption**: Enable encryption for stored CVs
4. **Data Retention**: Implement retention policies for old data
5. **Privacy**: Comply with GDPR and privacy regulations
6. **Audit Logging**: Maintain audit trails of CV access
7. **Rate Limiting**: Prevent abuse with rate limiting

---

## FAQ

**Q: How long does CV generation typically take?**
A: Usually 15-30 seconds for a single CV, depending on job description complexity.

**Q: Can I use custom templates?**
A: Yes, add custom templates to the config and extend the format conversion logic.

**Q: How are CVs stored?**
A: CVs are stored in the configured directory (default: ./generated-cvs) with JSON metadata.

**Q: Can I track application status?**
A: Yes, use the `track` operation to monitor application lifecycle.

**Q: What's the maximum batch size?**
A: Limited by available memory and time. Recommended: 100-500 CVs per batch.

**Q: How do I get improvement suggestions?**
A: Use the `suggest_improvements` operation with a job description.

**Q: Can I export analytics?**
A: Yes, analytics are automatically exported in JSON format.

**Q: Is there a web UI?**
A: The current version is CLI/API based. A UI can be built on top of the API.

---

## Next Steps

1. Review [Quick Start Guide](PSB-CV-Agent-QUICK-START.md)
2. Check [API Reference](PSB-CV-Agent-API-REFERENCE.md)
3. Follow [Deployment Guide](PSB-CV-Agent-DEPLOYMENT-GUIDE.md)
4. Review [Test Scenarios](PSB-CV-Agent-TEST-SCENARIOS.md)
5. See [Deployment Checklist](PSB-CV-Agent-DEPLOYMENT-CHECKLIST.md)

---

**For support and questions, refer to the project repository documentation or contact the Professional Second Brain team.**
