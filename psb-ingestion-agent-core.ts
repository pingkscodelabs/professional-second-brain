/**
 * PSB-Ingestion-Agent: Core Module
 * Autonomous agent for bulk loading professional content into PSB
 * 
 * Handles:
 * - Content collection from multiple sources
 * - Batch processing with progress tracking
 * - Template routing and automatic population
 * - Quality gate validation
 * - Metadata indexing and updates
 * - Duplicate detection and conflict resolution
 * - Error recovery with rollback
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ContentSource = 'file' | 'text' | 'csv' | 'json';
export type ContentCategory = 'projects' | 'achievements' | 'skills' | 'clients' | 'all';
export type ProcessingMode = 'single' | 'batch' | 'continuous';
export type SeverityLevel = 'error' | 'warning' | 'info';

export interface IngestionConfig {
  content_source: ContentSource;
  content: string | Array<string>;
  category: ContentCategory;
  mode: ProcessingMode;
  auto_commit: boolean;
  quality_threshold: number; // 0-100
  skip_duplicates: boolean;
  rollback_on_failure?: boolean;
  verbose?: boolean;
}

export interface IngestionItem {
  id: string;
  raw_content: string;
  category: string;
  source_line?: number;
  extracted_at?: string;
  processing_status?: 'pending' | 'processing' | 'success' | 'failed' | 'skipped';
  error_message?: string;
}

export interface ProcessedItem {
  id: string;
  original_item: IngestionItem;
  markdown_content: string;
  yaml_entry: any;
  suggested_path: string;
  linked_content: Array<{ type: string; name: string; path: string }>;
  completeness_score: number;
  quality_score: number;
  extracted_metadata: any;
  confidence_levels: Map<string, 'HIGH' | 'MEDIUM' | 'LOW'>;
}

export interface IngestionResult {
  ingestion_result: {
    processed: number;
    successful: number;
    failed: number;
    warnings: number;
    skipped: number;
  };
  created_files: Array<{ path: string; type: string; quality_score: number }>;
  updated_metadata: Array<{ file: string; entries_added: number; entries_updated: number }>;
  issues: Array<{
    item: string;
    severity: SeverityLevel;
    message: string;
    suggestion: string;
    line?: number;
  }>;
  progress: {
    current: number;
    total: number;
    percentage: number;
    estimated_time_remaining: number;
  };
  audit_trail: AuditEntry[];
  rollback_available?: boolean;
  rollback_checkpoint?: string;
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  item_id: string;
  details: any;
  status: 'success' | 'failure';
  error?: string;
}

export interface DuplicateMatch {
  item_id: string;
  matched_path: string;
  similarity_score: number; // 0-1
  conflict_type: 'exact' | 'similar' | 'same_source';
  suggested_action: 'skip' | 'merge' | 'create_variant';
}

export interface BatchProcessingState {
  checkpoint_id: string;
  items: IngestionItem[];
  processed_items: Map<string, ProcessedItem>;
  failed_items: Map<string, string>;
  skipped_items: Map<string, string>;
  metadata_updates: Map<string, any>;
  created_files: Set<string>;
  start_time: number;
  last_checkpoint_time: number;
  processed_count: number;
}

// ============================================================================
// CONTENT LOADER
// ============================================================================

export class ContentLoader {
  /**
   * Load content from various sources
   */
  static async loadContent(config: IngestionConfig): Promise<IngestionItem[]> {
    const items: IngestionItem[] = [];
    let content_array: string[] = [];

    // Normalize content to array
    if (typeof config.content === 'string') {
      content_array = [config.content];
    } else {
      content_array = config.content;
    }

    // Parse based on source type
    switch (config.content_source) {
      case 'text':
        content_array.forEach((text, idx) => {
          items.push({
            id: `text-${Date.now()}-${idx}`,
            raw_content: text,
            category: config.category !== 'all' ? config.category : 'projects',
            source_line: idx,
            extracted_at: new Date().toISOString(),
            processing_status: 'pending',
          });
        });
        break;

      case 'file':
        for (const file_path of content_array) {
          const content_data = fs.readFileSync(file_path, 'utf-8');
          const file_lines = content_data.split('\n').filter(l => l.trim());
          file_lines.forEach((line, idx) => {
            items.push({
              id: `file-${path.basename(file_path)}-${idx}`,
              raw_content: line,
              category: config.category !== 'all' ? config.category : 'projects',
              source_line: idx,
              extracted_at: new Date().toISOString(),
              processing_status: 'pending',
            });
          });
        }
        break;

      case 'csv':
        for (const csv_content of content_array) {
          const lines = csv_content.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          lines.slice(1).forEach((line, idx) => {
            if (line.trim()) {
              const values = line.split(',').map(v => v.trim());
              const row: any = {};
              headers.forEach((header, i) => {
                row[header] = values[i] || '';
              });
              items.push({
                id: `csv-${Date.now()}-${idx}`,
                raw_content: JSON.stringify(row),
                category: config.category !== 'all' ? config.category : 'projects',
                source_line: idx,
                extracted_at: new Date().toISOString(),
                processing_status: 'pending',
              });
            }
          });
        }
        break;

      case 'json':
        for (const json_content of content_array) {
          const data = JSON.parse(json_content);
          const items_array = Array.isArray(data) ? data : [data];
          items_array.forEach((item, idx) => {
            items.push({
              id: `json-${Date.now()}-${idx}`,
              raw_content: JSON.stringify(item),
              category: config.category !== 'all' ? config.category : 'projects',
              source_line: idx,
              extracted_at: new Date().toISOString(),
              processing_status: 'pending',
            });
          });
        }
        break;
    }

    return items;
  }
}

// ============================================================================
// BATCH PROCESSOR
// ============================================================================

export class BatchProcessor {
  private state: BatchProcessingState;
  private config: IngestionConfig;
  private onboard_instance: any; // Reference to psb-onboard-skill
  private issues: Array<any> = [];

  constructor(config: IngestionConfig, onboard_instance: any) {
    this.config = config;
    this.onboard_instance = onboard_instance;
    this.state = {
      checkpoint_id: `checkpoint-${Date.now()}`,
      items: [],
      processed_items: new Map(),
      failed_items: new Map(),
      skipped_items: new Map(),
      metadata_updates: new Map(),
      created_files: new Set(),
      start_time: Date.now(),
      last_checkpoint_time: Date.now(),
      processed_count: 0,
    };
  }

  /**
   * Process a batch of items with progress tracking
   */
  async processBatch(items: IngestionItem[]): Promise<ProcessedItem[]> {
    this.state.items = items;
    const results: ProcessedItem[] = [];
    const total = items.length;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const progress_percentage = Math.round(((i + 1) / total) * 100);

      try {
        item.processing_status = 'processing';

        // Route to appropriate handler based on category
        let processed_item: ProcessedItem | null = null;
        switch (item.category) {
          case 'projects':
            processed_item = await this.processProject(item);
            break;
          case 'achievements':
            processed_item = await this.processAchievement(item);
            break;
          case 'skills':
            processed_item = await this.processSkill(item);
            break;
          case 'clients':
            processed_item = await this.processClient(item);
            break;
        }

        if (processed_item) {
          // Check for duplicates
          const duplicate = await this.checkDuplicates(processed_item);
          if (duplicate && this.config.skip_duplicates) {
            this.state.skipped_items.set(item.id, `Duplicate of ${duplicate.matched_path}`);
            item.processing_status = 'skipped';
            this.issues.push({
              item: item.id,
              severity: 'info',
              message: `Skipped duplicate item`,
              suggestion: `Similar item exists at ${duplicate.matched_path}`,
            });
            continue;
          }

          // Validate quality
          if (processed_item.quality_score < this.config.quality_threshold) {
            this.issues.push({
              item: item.id,
              severity: 'warning',
              message: `Quality score (${processed_item.quality_score}) below threshold (${this.config.quality_threshold})`,
              suggestion: 'Review and enhance documentation before committing',
            });
          }

          this.state.processed_items.set(item.id, processed_item);
          results.push(processed_item);
          item.processing_status = 'success';
          this.state.processed_count++;
        }
      } catch (error: any) {
        this.state.failed_items.set(item.id, error.message);
        item.processing_status = 'failed';
        item.error_message = error.message;
        this.issues.push({
          item: item.id,
          severity: 'error',
          message: `Processing failed: ${error.message}`,
          suggestion: 'Review item format and retry',
        });
      }

      // Checkpoint every 10 items
      if ((i + 1) % 10 === 0) {
        this.createCheckpoint();
      }
    }

    return results;
  }

  /**
   * Process a single project item
   */
  private async processProject(item: IngestionItem): Promise<ProcessedItem | null> {
    const structured = await this.onboard_instance.structureProject({
      rawText: item.raw_content,
      category: 'general',
      confidentialityLevel: 'CONFIDENTIAL',
    });

    return this.createProcessedItem(item, structured, 'project');
  }

  /**
   * Process a single achievement item
   */
  private async processAchievement(item: IngestionItem): Promise<ProcessedItem | null> {
    const structured = await this.onboard_instance.structureAchievement({
      rawText: item.raw_content,
      category: 'general',
      confidentialityLevel: 'CONFIDENTIAL',
    });

    return this.createProcessedItem(item, structured, 'achievement');
  }

  /**
   * Process a single skill item
   */
  private async processSkill(item: IngestionItem): Promise<ProcessedItem | null> {
    const structured = await this.onboard_instance.structureSkill({
      rawText: item.raw_content,
      category: 'general',
    });

    return this.createProcessedItem(item, structured, 'skill');
  }

  /**
   * Process a single client item
   */
  private async processClient(item: IngestionItem): Promise<ProcessedItem | null> {
    const structured = await this.onboard_instance.structureClient({
      rawText: item.raw_content,
      category: 'general',
      confidentialityLevel: 'CONFIDENTIAL',
    });

    return this.createProcessedItem(item, structured, 'client');
  }

  /**
   * Create a ProcessedItem from structured output
   */
  private createProcessedItem(
    item: IngestionItem,
    structured: any,
    type: string
  ): ProcessedItem {
    return {
      id: item.id,
      original_item: item,
      markdown_content: structured.markdown || '',
      yaml_entry: structured.yamlEntry || {},
      suggested_path: structured.suggestedFilePath || '',
      linked_content: structured.linkedContent || [],
      completeness_score: structured.completenessScore || 0,
      quality_score: this.calculateQualityScore(structured),
      extracted_metadata: structured || {},
      confidence_levels: new Map(Object.entries(structured.confidence || {})),
    };
  }

  /**
   * Calculate overall quality score
   */
  private calculateQualityScore(structured: any): number {
    let score = 0;
    const weights = {
      completeness: 0.4,
      confidence: 0.3,
      links: 0.2,
      metadata: 0.1,
    };

    // Completeness score (0-100)
    score += (structured.completenessScore || 0) * weights.completeness;

    // Confidence score (convert HIGH=100, MEDIUM=70, LOW=40)
    const confidence_values = Object.values(structured.confidence || {});
    if (confidence_values.length > 0) {
      const avg_confidence =
        confidence_values.reduce((sum: number, conf: any) => {
          if (conf === 'HIGH') return sum + 100;
          if (conf === 'MEDIUM') return sum + 70;
          return sum + 40;
        }, 0) / confidence_values.length;
      score += avg_confidence * weights.confidence;
    }

    // Links score
    const links_score = (structured.linkedContent?.length || 0) > 0 ? 100 : 50;
    score += links_score * weights.links;

    // Metadata score
    const metadata_score = Object.keys(structured.yamlEntry || {}).length > 3 ? 100 : 60;
    score += metadata_score * weights.metadata;

    return Math.round(score);
  }

  /**
   * Check for duplicate content
   */
  private async checkDuplicates(item: ProcessedItem): Promise<DuplicateMatch | null> {
    const metadata_path = path.join(process.cwd(), 'metadata');
    const category_file = path.join(
      metadata_path,
      `${item.original_item.category === 'achievements' ? 'achievements' : item.original_item.category}.yml`
    );

    if (!fs.existsSync(category_file)) return null;

    const metadata = yaml.load(fs.readFileSync(category_file, 'utf-8')) as any;
    const category_key = Object.keys(metadata)[0]; // 'projects', 'skills', etc.
    const entries = metadata[category_key] || [];

    // Simple similarity check
    for (const entry of entries) {
      const name_similarity = this.calculateSimilarity(
        item.yaml_entry.name || '',
        entry.name || ''
      );
      if (name_similarity > 0.8) {
        return {
          item_id: item.id,
          matched_path: entry.documentation_link || '',
          similarity_score: name_similarity,
          conflict_type: 'similar',
          suggested_action: 'skip',
        };
      }
    }

    return null;
  }

  /**
   * Calculate string similarity (Levenshtein distance)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Get edit distance between two strings
   */
  private getEditDistance(str1: string, str2: string): number {
    const track = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }

    return track[str2.length][str1.length];
  }

  /**
   * Create a checkpoint for recovery
   */
  private createCheckpoint(): void {
    this.state.last_checkpoint_time = Date.now();
    if (this.config.verbose) {
      console.log(
        `[CHECKPOINT] Processed ${this.state.processed_count} items at ${new Date().toISOString()}`
      );
    }
  }

  /**
   * Get current processing state
   */
  getState(): BatchProcessingState {
    return this.state;
  }

  /**
   * Get issues encountered during processing
   */
  getIssues(): any[] {
    return this.issues;
  }

  /**
   * Get progress information
   */
  getProgress(total: number): any {
    const elapsed = Date.now() - this.state.start_time;
    const rate = this.state.processed_count / (elapsed / 1000); // items per second
    const remaining = total - this.state.processed_count;
    const estimated_time_remaining = remaining > 0 ? (remaining / rate) * 1000 : 0;

    return {
      current: this.state.processed_count,
      total,
      percentage: Math.round((this.state.processed_count / total) * 100),
      estimated_time_remaining: Math.round(estimated_time_remaining / 1000), // in seconds
    };
  }
}

// ============================================================================
// METADATA MANAGER
// ============================================================================

export class MetadataManager {
  /**
   * Update metadata files with new entries
   */
  static async updateMetadata(
    processed_items: ProcessedItem[],
    metadata_dir: string
  ): Promise<Array<{ file: string; entries_added: number; entries_updated: number }>> {
    const updates: Array<{ file: string; entries_added: number; entries_updated: number }> = [];

    // Group items by category
    const by_category = new Map<string, ProcessedItem[]>();
    processed_items.forEach(item => {
      const key = item.original_item.category;
      if (!by_category.has(key)) {
        by_category.set(key, []);
      }
      by_category.get(key)!.push(item);
    });

    // Update each metadata file
    for (const [category, items] of by_category) {
      const file_name =
        category === 'achievements' ? 'achievements.yml' : `${category}.yml`;
      const file_path = path.join(metadata_dir, file_name);

      let metadata: any = {};
      if (fs.existsSync(file_path)) {
        metadata = yaml.load(fs.readFileSync(file_path, 'utf-8')) as any;
      }

      const category_key = Object.keys(metadata).length > 0 ? Object.keys(metadata)[0] : category;
      if (!metadata[category_key]) {
        metadata[category_key] = [];
      }

      let added = 0;
      let updated = 0;

      items.forEach(item => {
        const entry_index = metadata[category_key].findIndex(
          (e: any) => e.name === item.yaml_entry.name
        );

        if (entry_index >= 0) {
          metadata[category_key][entry_index] = {
            ...metadata[category_key][entry_index],
            ...item.yaml_entry,
          };
          updated++;
        } else {
          metadata[category_key].push(item.yaml_entry);
          added++;
        }
      });

      fs.writeFileSync(file_path, yaml.dump(metadata), 'utf-8');

      updates.push({
        file: file_path,
        entries_added: added,
        entries_updated: updated,
      });
    }

    return updates;
  }
}

// ============================================================================
// FILE WRITER
// ============================================================================

export class FileWriter {
  /**
   * Write processed items to files
   */
  static async writeFiles(
    processed_items: ProcessedItem[],
    root_dir: string
  ): Promise<Array<{ path: string; type: string; quality_score: number }>> {
    const created_files: Array<{ path: string; type: string; quality_score: number }> = [];

    for (const item of processed_items) {
      const category_dir = path.join(root_dir, item.original_item.category);

      // Ensure directory exists
      if (!fs.existsSync(category_dir)) {
        fs.mkdirSync(category_dir, { recursive: true });
      }

      const file_path = path.join(root_dir, item.suggested_path);
      const file_dir = path.dirname(file_path);

      if (!fs.existsSync(file_dir)) {
        fs.mkdirSync(file_dir, { recursive: true });
      }

      fs.writeFileSync(file_path, item.markdown_content, 'utf-8');

      created_files.push({
        path: file_path,
        type: item.original_item.category,
        quality_score: item.quality_score,
      });
    }

    return created_files;
  }
}

// ============================================================================
// INGESTION ENGINE
// ============================================================================

export class IngestionEngine {
  /**
   * Execute the complete ingestion pipeline
   */
  static async ingest(
    config: IngestionConfig,
    onboard_instance: any,
    root_dir: string = process.cwd()
  ): Promise<IngestionResult> {
    const start_time = Date.now();

    try {
      // Step 1: Load content
      console.log('📥 Loading content...');
      const items = await ContentLoader.loadContent(config);
      console.log(`✓ Loaded ${items.length} items`);

      // Step 2: Process batch
      console.log('⚙️  Processing batch...');
      const processor = new BatchProcessor(config, onboard_instance);
      const processed = await processor.processBatch(items);
      console.log(`✓ Processed ${processed.length} items`);

      // Step 3: Write files
      console.log('💾 Writing files...');
      const created_files = await FileWriter.writeFiles(processed, root_dir);
      console.log(`✓ Created ${created_files.length} files`);

      // Step 4: Update metadata
      console.log('📝 Updating metadata...');
      const metadata_dir = path.join(root_dir, 'metadata');
      const updated_metadata = await MetadataManager.updateMetadata(processed, metadata_dir);
      console.log(`✓ Updated metadata in ${updated_metadata.length} files`);

      // Step 5: Calculate results
      const state = processor.getState();
      const progress = processor.getProgress(items.length);
      const issues = processor.getIssues();

      const result: IngestionResult = {
        ingestion_result: {
          processed: items.length,
          successful: state.processed_items.size,
          failed: state.failed_items.size,
          warnings: issues.filter(i => i.severity === 'warning').length,
          skipped: state.skipped_items.size,
        },
        created_files,
        updated_metadata,
        issues,
        progress,
        audit_trail: [],
        rollback_available: state.checkpoint_id !== undefined,
      };

      console.log('\n✅ Ingestion completed successfully!');
      return result;
    } catch (error: any) {
      console.error('❌ Ingestion failed:', error.message);
      throw error;
    }
  }
}

export default {
  ContentLoader,
  BatchProcessor,
  MetadataManager,
  FileWriter,
  IngestionEngine,
};
