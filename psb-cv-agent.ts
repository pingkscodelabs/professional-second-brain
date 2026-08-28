/**
 * PSB CV Agent - Autonomous CV Generation and Management System
 * Orchestrates CV generation workflows, version tracking, and performance analytics
 * Integrates with psb-cv-builder-skill for tailored CV generation
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  description: string;
  postingUrl?: string;
  postedDate: string;
  applyUrl?: string;
  requirementsSummary?: string;
}

export interface CVGenerationRequest {
  operation: 'generate' | 'generate_batch' | 'track' | 'analyze' | 'suggest_improvements';
  job_description?: string;
  job_descriptions?: string[];
  format?: 'pdf' | 'markdown' | 'text' | 'json';
  template?: 'resume' | 'cv' | 'linkedin';
  output_path?: string;
  include_analytics?: boolean;
  job_id?: string;
}

export interface GeneratedCV {
  id: string;
  jobId: string;
  format: string;
  pageCount: number;
  bulletCount: number;
  technologyCoverage: number; // 0-100
  matchScore: number; // 0-100
  generatedAt: string;
  filePath: string;
  version: number;
  summary: string;
  skills: string[];
  experience: ExperienceEntry[];
  metrics: CVMetrics;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  bullets: string[];
  relevanceScore?: number;
}

export interface CVMetrics {
  readabilityScore: number;
  keywordDensity: number;
  formattingQuality: number;
  contentRelevance: number;
  averageScore: number;
}

export interface CVVersion {
  versionNumber: number;
  generatedAt: string;
  jobId: string;
  filePath: string;
  matchScore: number;
  changes: string[];
}

export interface ApplicationTracking {
  jobId: string;
  cvId: string;
  applicationDate: string;
  applicationStatus: 'submitted' | 'pending' | 'shortlisted' | 'rejected' | 'interview' | 'offer';
  companyName: string;
  positionTitle: string;
  lastUpdated: string;
}

export interface CVAnalytics {
  generationTimeMs: number;
  avgMatchScore: number;
  formatDistribution: Record<string, number>;
  topTechnologies: string[];
  performanceByRole: Record<string, number>;
  performanceByCompany: Record<string, number>;
  totalGenerated: number;
  successRate: number;
}

export interface ImprovementSuggestion {
  section: string;
  currentContent?: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  priority: number;
  example?: string;
}

export interface CVAgentResponse {
  operation_result: {
    generated_count: number;
    success_count: number;
    failed_count: number;
    files_created: string[];
  };
  cv_details?: GeneratedCV;
  analytics?: CVAnalytics;
  suggestions?: ImprovementSuggestion[];
  status: 'success' | 'partial' | 'failed';
  message: string;
  timestamp: string;
}

// ============================================================================
// CV AGENT CORE
// ============================================================================

export class PSBCVAgent {
  private config: any;
  private cvRepository: Map<string, GeneratedCV[]> = new Map();
  private applicationTracker: Map<string, ApplicationTracking> = new Map();
  private analyticsData: CVAnalytics;

  constructor(configPath?: string) {
    this.config = this.loadConfig(configPath);
    this.analyticsData = this.initializeAnalytics();
    this.loadPersistentData();
  }

  /**
   * Load configuration from YAML file
   */
  private loadConfig(configPath?: string): any {
    const defaultPath = configPath || './psb-cv-agent-config.yaml';
    try {
      if (fs.existsSync(defaultPath)) {
        const fileContent = fs.readFileSync(defaultPath, 'utf8');
        return yaml.load(fileContent);
      }
    } catch (error) {
      console.warn(`Config file not found at ${defaultPath}, using defaults`);
    }
    return this.getDefaultConfig();
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): any {
    return {
      agent: {
        name: 'PSB CV Agent',
        version: '1.0.0',
        description: 'Autonomous CV generation and management system',
      },
      cvBuilder: {
        endpoint: 'http://localhost:3000/api/cv-builder',
        timeout: 30000,
        retries: 3,
      },
      storage: {
        cvDirectory: './generated-cvs',
        historyDirectory: './cv-history',
        analyticsDirectory: './cv-analytics',
      },
      formats: {
        supported: ['pdf', 'markdown', 'text', 'json'],
        default: 'pdf',
      },
      templates: {
        supported: ['resume', 'cv', 'linkedin'],
        default: 'resume',
      },
      performance: {
        maxParallelGenerations: 5,
        batchTimeout: 120000,
        cacheEnabled: true,
      },
      analytics: {
        trackingEnabled: true,
        historyRetention: 90, // days
      },
    };
  }

  /**
   * Initialize analytics data structure
   */
  private initializeAnalytics(): CVAnalytics {
    return {
      generationTimeMs: 0,
      avgMatchScore: 0,
      formatDistribution: { pdf: 0, markdown: 0, text: 0, json: 0 },
      topTechnologies: [],
      performanceByRole: {},
      performanceByCompany: {},
      totalGenerated: 0,
      successRate: 0,
    };
  }

  /**
   * Load persistent data from disk
   */
  private loadPersistentData(): void {
    const storageConfig = this.config.storage;
    if (fs.existsSync(storageConfig.analyticsDirectory)) {
      try {
        const analyticsPath = path.join(storageConfig.analyticsDirectory, 'analytics.json');
        if (fs.existsSync(analyticsPath)) {
          const data = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
          this.analyticsData = data;
        }
      } catch (error) {
        console.warn('Failed to load persistent analytics data');
      }
    }
  }

  /**
   * Main entry point for CV agent operations
   */
  async execute(request: CVGenerationRequest): Promise<CVAgentResponse> {
    const startTime = Date.now();

    try {
      // Ensure storage directories exist
      this.ensureStorageDirectories();

      let result: CVAgentResponse;

      switch (request.operation) {
        case 'generate':
          result = await this.generateSingleCV(request);
          break;
        case 'generate_batch':
          result = await this.generateBatchCVs(request);
          break;
        case 'track':
          result = await this.trackApplications(request);
          break;
        case 'analyze':
          result = await this.analyzePerformance(request);
          break;
        case 'suggest_improvements':
          result = await this.suggestImprovements(request);
          break;
        default:
          throw new Error(`Unknown operation: ${request.operation}`);
      }

      // Update execution time
      result.operation_result.generated_count = result.operation_result.files_created.length;
      result.operation_result.success_count = result.operation_result.generated_count;
      result.timestamp = new Date().toISOString();

      // Save analytics
      await this.persistAnalytics();

      return result;
    } catch (error) {
      return {
        operation_result: {
          generated_count: 0,
          success_count: 0,
          failed_count: 1,
          files_created: [],
        },
        status: 'failed',
        message: `Error executing ${request.operation}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Generate a single tailored CV
   */
  private async generateSingleCV(request: CVGenerationRequest): Promise<CVAgentResponse> {
    if (!request.job_description) {
      throw new Error('job_description is required for generate operation');
    }

    const format = request.format || this.config.formats.default || 'pdf';
    const template = request.template || this.config.templates.default || 'resume';
    const outputPath = request.output_path || this.generateOutputPath(format);

    console.log(`Generating CV for job description (${format} format, ${template} template)...`);

    // Generate CV using psb-cv-builder-skill
    const cv = await this.invokeCVBuilderSkill({
      jobDescription: request.job_description,
      format: template,
      maxLength: template === 'resume' ? 1 : 3,
      focusAreas: this.extractFocusAreas(request.job_description),
    });

    // Process and format CV
    const generatedCV = await this.formatCV(cv, format, template);

    // Store CV metadata
    const cvRecord: GeneratedCV = {
      id: this.generateCVId(),
      jobId: request.job_id || 'unknown',
      format,
      pageCount: this.estimatePageCount(format, cv),
      bulletCount: this.countBullets(cv),
      technologyCoverage: cv.analysis?.matchScore || 0,
      matchScore: cv.analysis?.matchScore || 0,
      generatedAt: new Date().toISOString(),
      filePath: outputPath,
      version: 1,
      summary: cv.cv?.summary || '',
      skills: cv.cv?.skills?.map((s: any) => s.skill) || [],
      experience: (cv.cv?.experience || []).map((exp: any) => ({
        title: exp.title,
        company: exp.company,
        period: exp.period,
        bullets: exp.bullets?.map((b: any) => b.text) || [],
      })),
      metrics: await this.calculateMetrics(cv),
    };

    // Write CV to file
    await this.writeCV(outputPath, generatedCV, format);

    // Track in repository
    const jobId = request.job_id || 'unknown';
    if (!this.cvRepository.has(jobId)) {
      this.cvRepository.set(jobId, []);
    }
    this.cvRepository.get(jobId)!.push(cvRecord);

    // Update analytics
    this.updateAnalytics(generatedCV);

    return {
      operation_result: {
        generated_count: 1,
        success_count: 1,
        failed_count: 0,
        files_created: [outputPath],
      },
      cv_details: generatedCV,
      analytics: request.include_analytics ? this.analyticsData : undefined,
      status: 'success',
      message: `CV successfully generated and saved to ${outputPath}`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate multiple CVs in batch
   */
  private async generateBatchCVs(request: CVGenerationRequest): Promise<CVAgentResponse> {
    if (!request.job_descriptions || request.job_descriptions.length === 0) {
      throw new Error('job_descriptions array is required for generate_batch operation');
    }

    const format = request.format || this.config.formats.default || 'pdf';
    const maxParallel = this.config.performance.maxParallelGenerations || 5;
    const filesCreated: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    console.log(`Generating batch of ${request.job_descriptions.length} CVs...`);

    // Process in chunks to avoid overwhelming resources
    for (let i = 0; i < request.job_descriptions.length; i += maxParallel) {
      const chunk = request.job_descriptions.slice(i, i + maxParallel);
      const promises = chunk.map((jobDesc, index) =>
        this.generateSingleCV({
          ...request,
          job_description: jobDesc,
          job_id: `batch-${i + index}`,
        }).then(result => {
          if (result.status === 'success') {
            successCount++;
            filesCreated.push(...result.operation_result.files_created);
          } else {
            failedCount++;
          }
          return result;
        }).catch(() => {
          failedCount++;
          return null;
        })
      );

      await Promise.all(promises);
    }

    return {
      operation_result: {
        generated_count: request.job_descriptions.length,
        success_count: successCount,
        failed_count: failedCount,
        files_created: filesCreated,
      },
      analytics: request.include_analytics ? this.analyticsData : undefined,
      status: failedCount === 0 ? 'success' : failedCount < successCount ? 'partial' : 'failed',
      message: `Batch generation complete: ${successCount} succeeded, ${failedCount} failed`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Track CV applications
   */
  private async trackApplications(request: CVGenerationRequest): Promise<CVAgentResponse> {
    console.log('Tracking CV applications...');

    const applications = Array.from(this.applicationTracker.values());

    return {
      operation_result: {
        generated_count: applications.length,
        success_count: applications.length,
        failed_count: 0,
        files_created: [],
      },
      status: 'success',
      message: `Tracking ${applications.length} applications`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Analyze CV performance metrics
   */
  private async analyzePerformance(request: CVGenerationRequest): Promise<CVAgentResponse> {
    console.log('Analyzing CV performance...');

    return {
      operation_result: {
        generated_count: this.analyticsData.totalGenerated,
        success_count: this.analyticsData.totalGenerated,
        failed_count: 0,
        files_created: [],
      },
      analytics: this.analyticsData,
      status: 'success',
      message: 'Performance analysis complete',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Suggest improvements for CV content
   */
  private async suggestImprovements(request: CVGenerationRequest): Promise<CVAgentResponse> {
    if (!request.job_description) {
      throw new Error('job_description is required for suggest_improvements operation');
    }

    console.log('Generating improvement suggestions...');

    const suggestions = await this.analyzeCVGaps(request.job_description);

    return {
      operation_result: {
        generated_count: 1,
        success_count: 1,
        failed_count: 0,
        files_created: [],
      },
      suggestions,
      status: 'success',
      message: `Generated ${suggestions.length} improvement suggestions`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Invoke CV Builder Skill
   */
  private async invokeCVBuilderSkill(params: any): Promise<any> {
    // In a real implementation, this would call the actual CV Builder skill
    // For now, return a mock structure that matches the expected interface
    return {
      cv: {
        summary: 'Professional with extensive experience in software engineering and architecture',
        skills: [
          { skill: 'TypeScript', level: 'Expert', evidence: 'evidence/typescript.md' },
          { skill: 'System Design', level: 'Expert', evidence: 'evidence/system-design.md' },
          { skill: 'Cloud Architecture', level: 'Advanced', evidence: 'evidence/aws.md' },
        ],
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            period: '2020-Present',
            bullets: [
              { text: 'Led architecture for microservices platform', sourceFile: 'experience/current.md' },
              { text: 'Mentored team of 5 engineers', sourceFile: 'experience/current.md' },
            ],
          },
        ],
      },
      analysis: {
        matchScore: 85,
        strongAreas: ['Software Architecture', 'Cloud Technologies'],
        gapAreas: ['Team Management'],
        fabricationRisk: [],
      },
      sources: {},
    };
  }

  /**
   * Extract focus areas from job description
   */
  private extractFocusAreas(jobDescription: string): string[] {
    const keywords = [
      'typescript', 'javascript', 'react', 'node', 'aws', 'docker', 'kubernetes',
      'microservices', 'architecture', 'api', 'database', 'sql', 'nosql',
      'testing', 'ci/cd', 'devops', 'agile', 'scrum', 'leadership',
    ];

    const found: string[] = [];
    keywords.forEach(keyword => {
      if (jobDescription.toLowerCase().includes(keyword)) {
        found.push(keyword);
      }
    });

    return found.slice(0, 5); // Return top 5
  }

  /**
   * Format CV in specified format
   */
  private async formatCV(cvData: any, format: string, template: string): Promise<any> {
    // In a real implementation, this would format CV to desired output
    // For now, return the CV data as-is (which represents JSON format)
    return cvData;
  }

  /**
   * Write CV to file
   */
  private async writeCV(outputPath: string, cvData: GeneratedCV, format: string): Promise<void> {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (format === 'json') {
      fs.writeFileSync(outputPath, JSON.stringify(cvData, null, 2));
    } else if (format === 'markdown') {
      const markdown = this.convertToMarkdown(cvData);
      fs.writeFileSync(outputPath, markdown);
    } else if (format === 'text') {
      const text = this.convertToText(cvData);
      fs.writeFileSync(outputPath, text);
    } else if (format === 'pdf') {
      // PDF would require additional library (pdfkit, etc.)
      // For now, write JSON and note that PDF conversion would happen here
      fs.writeFileSync(outputPath + '.json', JSON.stringify(cvData, null, 2));
    }
  }

  /**
   * Convert CV to Markdown format
   */
  private convertToMarkdown(cv: GeneratedCV): string {
    let md = `# CV\n\n`;
    md += `## Summary\n${cv.summary}\n\n`;
    md += `## Skills\n${cv.skills.map(s => `- ${s}`).join('\n')}\n\n`;
    md += `## Experience\n`;
    cv.experience.forEach(exp => {
      md += `### ${exp.title} at ${exp.company}\n`;
      md += `${exp.period}\n`;
      md += `${exp.bullets.map(b => `- ${b}`).join('\n')}\n\n`;
    });
    return md;
  }

  /**
   * Convert CV to Text format
   */
  private convertToText(cv: GeneratedCV): string {
    let text = `CV\n\n`;
    text += `SUMMARY\n${cv.summary}\n\n`;
    text += `SKILLS\n${cv.skills.join(', ')}\n\n`;
    text += `EXPERIENCE\n`;
    cv.experience.forEach(exp => {
      text += `${exp.title} at ${exp.company} (${exp.period})\n`;
      text += `${exp.bullets.map(b => `• ${b}`).join('\n')}\n\n`;
    });
    return text;
  }

  /**
   * Calculate CV metrics
   */
  private async calculateMetrics(cv: any): Promise<CVMetrics> {
    return {
      readabilityScore: 75,
      keywordDensity: 65,
      formattingQuality: 80,
      contentRelevance: cv.analysis?.matchScore || 0,
      averageScore: (75 + 65 + 80 + (cv.analysis?.matchScore || 0)) / 4,
    };
  }

  /**
   * Estimate page count
   */
  private estimatePageCount(format: string, cv: any): number {
    if (format === 'resume') return 1;
    if (format === 'linkedin') return 1;
    // Full CV typically 2-3 pages
    const bulletCount = cv.cv?.experience?.reduce((sum: number, exp: any) => sum + (exp.bullets?.length || 0), 0) || 0;
    return Math.ceil(bulletCount / 8);
  }

  /**
   * Count bullets in CV
   */
  private countBullets(cv: any): number {
    return cv.cv?.experience?.reduce((sum: number, exp: any) => sum + (exp.bullets?.length || 0), 0) || 0;
  }

  /**
   * Analyze CV gaps and suggest improvements
   */
  private async analyzeCVGaps(jobDescription: string): Promise<ImprovementSuggestion[]> {
    const suggestions: ImprovementSuggestion[] = [];

    // Extract key requirements from job description
    const requirements = this.extractRequirements(jobDescription);

    // Generate suggestions based on gaps
    requirements.forEach((req, index) => {
      suggestions.push({
        section: 'Skills',
        suggestion: `Add or emphasize ${req} in your skills section to match job requirements`,
        impact: 'high',
        priority: index + 1,
        example: `Proficient in ${req} with 5+ years of production experience`,
      });
    });

    return suggestions.slice(0, 5); // Return top 5
  }

  /**
   * Extract requirements from job description
   */
  private extractRequirements(jobDescription: string): string[] {
    const requirements = new Set<string>();
    const patterns = [
      /required:?\s*(.*?)(?:\n|must)/gi,
      /must\s+have:?\s*(.*?)(?:\n|prefer)/gi,
      /experience\s+with:?\s*(.*?)(?:\n|\.)/gi,
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(jobDescription)) !== null) {
        const items = match[1].split(/[,;]/);
        items.forEach(item => {
          const cleaned = item.trim().toLowerCase();
          if (cleaned.length > 0 && cleaned.length < 50) {
            requirements.add(cleaned);
          }
        });
      }
    });

    return Array.from(requirements).slice(0, 5);
  }

  /**
   * Generate unique CV ID
   */
  private generateCVId(): string {
    return `cv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate output path for CV
   */
  private generateOutputPath(format: string): string {
    const storageConfig = this.config.storage;
    const dir = path.join(storageConfig.cvDirectory, new Date().toISOString().split('T')[0]);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filename = `CV-${Date.now()}.${this.getFileExtension(format)}`;
    return path.join(dir, filename);
  }

  /**
   * Get file extension for format
   */
  private getFileExtension(format: string): string {
    const extensions: Record<string, string> = {
      pdf: 'pdf',
      markdown: 'md',
      text: 'txt',
      json: 'json',
    };
    return extensions[format] || 'txt';
  }

  /**
   * Ensure storage directories exist
   */
  private ensureStorageDirectories(): void {
    const storageConfig = this.config.storage;
    Object.values(storageConfig).forEach(dir => {
      if (typeof dir === 'string' && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Update analytics with new CV data
   */
  private updateAnalytics(cv: GeneratedCV): void {
    this.analyticsData.totalGenerated++;
    this.analyticsData.avgMatchScore =
      (this.analyticsData.avgMatchScore * (this.analyticsData.totalGenerated - 1) + cv.matchScore) /
      this.analyticsData.totalGenerated;

    // Update format distribution
    this.analyticsData.formatDistribution[cv.format] =
      (this.analyticsData.formatDistribution[cv.format] || 0) + 1;

    // Update technologies
    const allTechs = new Set<string>(this.analyticsData.topTechnologies);
    cv.skills.forEach(skill => allTechs.add(skill));
    this.analyticsData.topTechnologies = Array.from(allTechs).slice(0, 10);

    this.analyticsData.successRate = 100; // Simple calculation
  }

  /**
   * Persist analytics to disk
   */
  private async persistAnalytics(): Promise<void> {
    try {
      const storageConfig = this.config.storage;
      const analyticsDir = storageConfig.analyticsDirectory;

      if (!fs.existsSync(analyticsDir)) {
        fs.mkdirSync(analyticsDir, { recursive: true });
      }

      const analyticsPath = path.join(analyticsDir, 'analytics.json');
      fs.writeFileSync(analyticsPath, JSON.stringify(this.analyticsData, null, 2));
    } catch (error) {
      console.warn('Failed to persist analytics:', error);
    }
  }

  /**
   * Get CV history for a job
   */
  getCVHistory(jobId: string): GeneratedCV[] {
    return this.cvRepository.get(jobId) || [];
  }

  /**
   * Get all tracked applications
   */
  getApplications(): ApplicationTracking[] {
    return Array.from(this.applicationTracker.values());
  }
}

// ============================================================================
// EXPORT FOR USE AS EXTENSION
// ============================================================================

export default PSBCVAgent;
