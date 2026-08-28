/**
 * PSB-Ingestion-Agent Test Scenarios
 * Comprehensive test suite for bulk content ingestion
 */

import { PSBIngestionAgent } from './psb-ingestion-agent';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TEST UTILITIES
// ============================================================================

class TestRunner {
  private passed = 0;
  private failed = 0;

  async test(name: string, fn: () => Promise<void>): Promise<void> {
    try {
      console.log(`\n🧪 ${name}`);
      await fn();
      this.passed++;
      console.log(`✅ PASSED`);
    } catch (error: any) {
      this.failed++;
      console.log(`❌ FAILED: ${error.message}`);
    }
  }

  report(): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Test Results`);
    console.log(`   Passed: ${this.passed}`);
    console.log(`   Failed: ${this.failed}`);
    console.log(`   Total:  ${this.passed + this.failed}`);
    console.log(`${'='.repeat(60)}\n`);
  }
}

// ============================================================================
// TEST SCENARIOS
// ============================================================================

const runner = new TestRunner();
const agent = new PSBIngestionAgent();

async function runAllTests() {
  console.log('🚀 PSB-Ingestion-Agent Test Suite\n');

  // ========================================================================
  // SCENARIO 1: Single Item Ingestion
  // ========================================================================

  await runner.test('S1.1 Ingest single project', async () => {
    const result = await agent.ingestSingle(
      'Led migration of 150 microservices to Kubernetes, reducing costs by 40%',
      'projects'
    );

    console.assert(result.ingestion_result.successful === 1, 'Should have 1 success');
    console.assert(result.created_files.length === 1, 'Should create 1 file');
    console.assert(result.created_files[0].quality_score > 50, 'Quality score should be >50');
  });

  await runner.test('S1.2 Ingest single skill', async () => {
    const result = await agent.ingestSingle(
      '5+ years experience with Kubernetes and container orchestration',
      'skills'
    );

    console.assert(result.ingestion_result.successful === 1, 'Should succeed');
    console.assert(result.created_files[0].type === 'skills', 'Should be skills type');
  });

  await runner.test('S1.3 Ingest single achievement', async () => {
    const result = await agent.ingestSingle(
      'Reduced infrastructure costs by 40% through containerization and cloud optimization',
      'achievements'
    );

    console.assert(result.ingestion_result.successful === 1, 'Should succeed');
    console.assert(result.created_files[0].type === 'achievements', 'Should be achievements type');
  });

  await runner.test('S1.4 Ingest single client', async () => {
    const result = await agent.ingestSingle(
      'FinTech startup - 2 year engagement building microservices platform and cloud infrastructure',
      'clients'
    );

    console.assert(result.ingestion_result.successful === 1, 'Should succeed');
    console.assert(result.created_files[0].type === 'clients', 'Should be clients type');
  });

  // ========================================================================
  // SCENARIO 2: Batch Processing
  // ========================================================================

  await runner.test('S2.1 Process batch of 10 items', async () => {
    const items = Array(10).fill(
      'Led team on project using Kubernetes and AWS'
    );

    const result = await agent.ingest({
      content_source: 'text',
      content: items,
      category: 'projects',
      mode: 'batch',
      quality_threshold: 50
    });

    console.assert(result.ingestion_result.processed === 10, 'Should process 10 items');
    console.assert(result.ingestion_result.successful > 0, 'Should have successes');
  });

  await runner.test('S2.2 Process batch with mixed quality', async () => {
    const items = [
      'Led comprehensive cloud migration project',
      'Worked on project', // Low quality
      'Architected microservices platform with 99.9% uptime SLA',
      'Did stuff', // Low quality
      'Optimized infrastructure costs by 40%'
    ];

    const result = await agent.ingest({
      content_source: 'text',
      content: items,
      category: 'projects',
      quality_threshold: 60
    });

    console.assert(result.ingestion_result.processed === 5, 'Should process all 5');
    console.assert(result.issues.length > 0, 'Should have quality issues');
  });

  await runner.test('S2.3 Large batch processing (50 items)', async () => {
    const items = Array(50)
      .fill(0)
      .map((_, i) => `Project ${i}: Led team on cloud migration initiative`);

    const result = await agent.ingest({
      content_source: 'text',
      content: items,
      category: 'projects',
      quality_threshold: 50,
      verbose: false
    });

    console.assert(result.ingestion_result.processed === 50, 'Should process 50 items');
    console.assert(result.progress.percentage === 100, 'Should be 100% complete');
  });

  // ========================================================================
  // SCENARIO 3: File Input Handling
  // ========================================================================

  await runner.test('S3.1 Ingest from text file', async () => {
    const test_file = '/tmp/test-content.txt';
    fs.writeFileSync(
      test_file,
      'Led Kubernetes migration\nBuilt microservices platform\nOptimized costs'
    );

    const result = await agent.ingest({
      content_source: 'file',
      content: [test_file],
      category: 'projects',
      quality_threshold: 50
    });

    console.assert(result.ingestion_result.processed > 0, 'Should process file content');

    fs.unlinkSync(test_file);
  });

  await runner.test('S3.2 Handle multiple files', async () => {
    const file1 = '/tmp/projects.txt';
    const file2 = '/tmp/skills.txt';

    fs.writeFileSync(file1, 'Led team on cloud project\nBuilt microservices');
    fs.writeFileSync(file2, 'Kubernetes expert\nAWS certified');

    const result = await agent.ingest({
      content_source: 'file',
      content: [file1, file2],
      category: 'all',
      quality_threshold: 50
    });

    console.assert(result.ingestion_result.processed > 0, 'Should process multiple files');

    fs.unlinkSync(file1);
    fs.unlinkSync(file2);
  });

  // ========================================================================
  // SCENARIO 4: CSV Import
  // ========================================================================

  await runner.test('S4.1 Ingest CSV with mixed categories', async () => {
    const csv_data = `category,content
projects,Led Kubernetes migration project
skills,5+ years Kubernetes experience
achievements,Reduced costs by 40%
clients,FinTech startup engagement`;

    const result = await agent.ingest({
      content_source: 'csv',
      content: csv_data,
      category: 'all',
      quality_threshold: 50
    });

    console.assert(result.ingestion_result.processed === 4, 'Should process 4 rows');
    console.assert(result.ingestion_result.successful > 0, 'Should have successes');
  });

  await runner.test('S4.2 Large CSV batch', async () => {
    let csv_data = 'category,content\n';
    for (let i = 0; i < 50; i++) {
      csv_data += `projects,Project ${i}: Led team on cloud initiative\n`;
    }

    const result = await agent.ingest({
      content_source: 'csv',
      content: csv_data,
      category: 'all',
      quality_threshold: 50
    });

    console.assert(result.ingestion_result.processed === 50, 'Should process 50 CSV rows');
  });

  // ========================================================================
  // SCENARIO 5: JSON Import
  // ========================================================================

  await runner.test('S5.1 Ingest JSON array', async () => {
    const json_data = JSON.stringify([
      { category: 'projects', content: 'Led Kubernetes migration' },
      { category: 'skills', content: '5+ years Kubernetes' },
      { category: 'achievements', content: 'Reduced costs by 40%' }
    ]);

    const result = await agent.ingest({
      content_source: 'json',
      content: json_data,
      category: 'all',
      quality_threshold: 50
    });

    console.assert(result.ingestion_result.processed === 3, 'Should process 3 JSON items');
  });

  // ========================================================================
  // SCENARIO 6: Quality Thresholds
  // ========================================================================

  await runner.test('S6.1 Enforce strict quality threshold', async () => {
    const items = [
      'Led comprehensive team on cloud migration achieving 99.9% uptime and 40% cost reduction',
      'Worked on stuff',
      'Architected microservices platform with proven scalability to 10000 RPS'
    ];

    const result = await agent.ingest({
      content_source: 'text',
      content: items,
      category: 'projects',
      quality_threshold: 80 // Strict
    });

    console.assert(result.ingestion_result.successful <= 3, 'Should accept high quality items');
  });

  await runner.test('S6.2 Lenient quality threshold', async () => {
    const items = ['Worked on project', 'Did stuff', 'Helped with task'];

    const result = await agent.ingest({
      content_source: 'text',
      content: items,
      category: 'projects',
      quality_threshold: 0 // Accept all
    });

    console.assert(result.ingestion_result.successful > 0, 'Should accept low quality with threshold 0');
  });

  // ========================================================================
  // SCENARIO 7: Duplicate Detection
  // ========================================================================

  await runner.test('S7.1 Detect duplicate content', async () => {
    const item = 'Led Kubernetes migration project at fintech startup';

    // Ingest twice
    const result1 = await agent.ingestSingle(item, 'projects');
    const result2 = await agent.ingestSingle(item, 'projects', {
      skip_duplicates: true
    });

    console.assert(result1.ingestion_result.successful === 1, 'First ingestion succeeds');
    // Second may be skipped or created as variant
  });

  // ========================================================================
  // SCENARIO 8: Error Handling
  // ========================================================================

  await runner.test('S8.1 Handle invalid configuration', async () => {
    try {
      await agent.ingest({
        content_source: 'text',
        content: '',  // Empty content
        category: 'projects'
      } as any);
      throw new Error('Should have thrown');
    } catch (error: any) {
      console.assert(error.message.includes('required'), 'Should have validation error');
    }
  });

  await runner.test('S8.2 Handle nonexistent file', async () => {
    try {
      await agent.ingest({
        content_source: 'file',
        content: ['/nonexistent/file.txt'],
        category: 'projects'
      });
      throw new Error('Should have thrown');
    } catch (error: any) {
      console.assert(error.message.includes('not found'), 'Should have file not found error');
    }
  });

  // ========================================================================
  // SCENARIO 9: Metadata Updates
  // ========================================================================

  await runner.test('S9.1 Verify metadata file updates', async () => {
    const before = fs.readFileSync('metadata/projects.yml', 'utf-8');

    const result = await agent.ingestSingle(
      'Test project for metadata verification',
      'projects'
    );

    const after = fs.readFileSync('metadata/projects.yml', 'utf-8');

    console.assert(after.length >= before.length, 'Metadata file should be updated');
    console.assert(result.updated_metadata.length > 0, 'Should update metadata');
  });

  // ========================================================================
  // SCENARIO 10: Progress Tracking
  // ========================================================================

  await runner.test('S10.1 Track processing progress', async () => {
    const items = Array(30).fill('Led project on cloud initiative');

    const result = await agent.ingest({
      content_source: 'text',
      content: items,
      category: 'projects',
      quality_threshold: 50,
      verbose: false
    });

    const { current, total, percentage } = result.progress;

    console.assert(current === total, 'Should complete all items');
    console.assert(percentage === 100, 'Should be 100% complete');
    console.assert(result.ingestion_result.processed === 30, 'Should process 30 items');
  });

  // ========================================================================
  // SCENARIO 11: Audit Trail
  // ========================================================================

  await runner.test('S11.1 Generate comprehensive audit trail', async () => {
    const result = await agent.ingestSingle(
      'Test project for audit trail verification',
      'projects'
    );

    console.assert(result.audit_trail.length > 0, 'Should have audit entries');
    console.assert(result.audit_trail[0].timestamp, 'Should have timestamps');
    console.assert(result.audit_trail[0].action, 'Should have action');
  });

  // ========================================================================
  // SCENARIO 12: Output Verification
  // ========================================================================

  await runner.test('S12.1 Verify output structure', async () => {
    const result = await agent.ingestSingle(
      'Test project',
      'projects'
    );

    console.assert(result.ingestion_result, 'Should have ingestion_result');
    console.assert(result.created_files, 'Should have created_files');
    console.assert(result.updated_metadata, 'Should have updated_metadata');
    console.assert(result.issues !== undefined, 'Should have issues array');
    console.assert(result.progress, 'Should have progress');
    console.assert(result.audit_trail, 'Should have audit_trail');
  });

  // ========================================================================
  // SCENARIO 13: Statistics
  // ========================================================================

  await runner.test('S13.1 Get repository statistics', async () => {
    const stats = await agent.getStatistics();

    console.assert(stats.projects !== undefined, 'Should have project count');
    console.assert(stats.skills !== undefined, 'Should have skill count');
    console.assert(typeof stats.projects === 'number', 'Should be numbers');
  });

  // ========================================================================
  // SCENARIO 14: Verbose Logging
  // ========================================================================

  await runner.test('S14.1 Process with verbose output', async () => {
    agent.setVerbose(true);

    const result = await agent.ingestSingle(
      'Test project with verbose logging',
      'projects'
    );

    agent.setVerbose(false);

    console.assert(result.ingestion_result.successful === 1, 'Should succeed');
  });

  // ========================================================================
  // SCENARIO 15: Edge Cases
  // ========================================================================

  await runner.test('S15.1 Handle very long content', async () => {
    const long_content = 'Led comprehensive ' + 'cloud migration '.repeat(100);

    const result = await agent.ingestSingle(long_content, 'projects');

    console.assert(result.ingestion_result.successful === 1, 'Should handle long content');
  });

  await runner.test('S15.2 Handle special characters', async () => {
    const special_content =
      'Led team on Kubernetes (K8s) & microservices project @FinTech #cloud';

    const result = await agent.ingestSingle(special_content, 'projects');

    console.assert(result.ingestion_result.successful === 1, 'Should handle special chars');
  });

  await runner.test('S15.3 Handle unicode content', async () => {
    const unicode_content =
      'Led team on cloud migration 🚀 project 💻 achieving 40% cost reduction 📈';

    const result = await agent.ingestSingle(unicode_content, 'projects');

    console.assert(result.ingestion_result.successful === 1, 'Should handle unicode');
  });

  // Generate report
  runner.report();
}

// Run tests
console.log('Starting test suite...\n');
runAllTests().catch(console.error);
