/**
 * PSB Curator Implementation - Core curation algorithms and utilities
 * 
 * Implements the actual curation operations:
 * - Content organization algorithms
 * - Relationship detection and mapping
 * - Metadata analysis and enhancement
 * - Trend identification
 * - Intelligent recommendations
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// ============================================================================
// CONTENT ORGANIZATION ENGINE
// ============================================================================

export class ContentOrganizationEngine {
  /**
   * Analyze content and suggest optimal categorization
   */
  static async categorizeContent(
    filePath: string,
    knownCategories: Record<string, any>
  ): Promise<{
    suggestedCategory: string;
    confidence: number;
    reasoning: string[];
    alternativeCategories?: Array<{ category: string; confidence: number }>;
  }> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const metadata = this.extractMetadata(content);
      
      const scores = new Map<string, number>();
      const reasoning: string[] = [];

      // Score based on metadata tags
      if (metadata.tags) {
        for (const tag of metadata.tags) {
          const lowerTag = tag.toLowerCase();
          for (const [category, categoryData] of Object.entries(knownCategories)) {
            if (categoryData.keywords?.some((kw: string) => lowerTag.includes(kw))) {
              scores.set(category, (scores.get(category) || 0) + 2);
            }
          }
        }
      }

      // Score based on content keywords
      const keywordCounts = this.countKeywords(content);
      for (const [category, categoryData] of Object.entries(knownCategories)) {
        for (const keyword of categoryData.keywords || []) {
          if (keywordCounts.has(keyword.toLowerCase())) {
            const count = keywordCounts.get(keyword.toLowerCase())!;
            scores.set(category, (scores.get(category) || 0) + count);
            reasoning.push(`Found "${keyword}" ${count} times in ${category}`);
          }
        }
      }

      // Score based on file type
      const ext = path.extname(filePath);
      for (const [category, categoryData] of Object.entries(knownCategories)) {
        if (categoryData.fileTypes?.includes(ext)) {
          scores.set(category, (scores.get(category) || 0) + 1);
          reasoning.push(`File extension ${ext} associated with ${category}`);
        }
      }

      // Determine best category
      const sorted = Array.from(scores.entries())
        .sort(([_, a], [__, b]) => b - a);

      if (sorted.length === 0) {
        return {
          suggestedCategory: 'uncategorized',
          confidence: 0,
          reasoning: ['No matching keywords or metadata found']
        };
      }

      const [bestCategory, bestScore] = sorted[0];
      const maxPossibleScore = Math.max(...Array.from(scores.values())) || 1;
      const confidence = Math.min((bestScore / maxPossibleScore) * 100, 100);

      return {
        suggestedCategory: bestCategory,
        confidence: Math.round(confidence),
        reasoning,
        alternativeCategories: sorted
          .slice(1, 4)
          .map(([cat, score]) => ({
            category: cat,
            confidence: Math.round((score / maxPossibleScore) * 100)
          }))
      };
    } catch (error) {
      throw new Error(`Failed to categorize content: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extract metadata from file
   */
  private static extractMetadata(content: string): Record<string, any> {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      try {
        return yaml.load(frontmatterMatch[1]) as Record<string, any>;
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  /**
   * Count keyword occurrences
   */
  private static countKeywords(content: string): Map<string, number> {
    const counts = new Map<string, number>();
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    
    for (const word of words) {
      counts.set(word, (counts.get(word) || 0) + 1);
    }

    return counts;
  }

  /**
   * Suggest optimal file structure
   */
  static async suggestStructureOptimizations(
    files: string[]
  ): Promise<Array<{
    current_structure: string;
    suggested_structure: string;
    benefits: string[];
    effort: string;
  }>> {
    const optimizations = [];

    // Analyze current structure
    const structureStats = this.analyzeFileStructure(files);

    // Check for oversized directories
    for (const [dir, count] of Object.entries(structureStats.directoryFileCounts || {})) {
      if (count > 20) {
        optimizations.push({
          current_structure: `${dir}/ (${count} files)`,
          suggested_structure: `${dir}/ split into subcategories`,
          benefits: ['Improved navigation', 'Better organization', 'Faster search'],
          effort: 'medium'
        });
      }
    }

    // Check for poorly organized files
    if ((structureStats.filesInRoot || 0) > 5) {
      optimizations.push({
        current_structure: `Root directory (${structureStats.filesInRoot} files)`,
        suggested_structure: 'Move files to category directories',
        benefits: ['Cleaner root', 'Better structure', 'Easier maintenance'],
        effort: 'low'
      });
    }

    return optimizations;
  }

  /**
   * Analyze file structure
   */
  private static analyzeFileStructure(files: string[]): Record<string, any> {
    const stats: Record<string, any> = {
      directoryFileCounts: {},
      filesInRoot: 0,
      maxDepth: 0
    };

    for (const file of files) {
      const dir = path.dirname(file);
      const depth = dir.split(path.sep).length;

      if (depth === 1) {
        stats.filesInRoot++;
      }

      stats.directoryFileCounts[dir] = (stats.directoryFileCounts[dir] || 0) + 1;
      stats.maxDepth = Math.max(stats.maxDepth, depth);
    }

    return stats;
  }
}

// ============================================================================
// RELATIONSHIP DETECTION ENGINE
// ============================================================================

export class RelationshipDetectionEngine {
  /**
   * Detect relationships between content items
   */
  static async detectRelationships(
    items: Map<string, any>,
    depth: 'surface' | 'detailed' | 'comprehensive'
  ): Promise<Array<{
    from: string;
    to: string;
    type: string;
    strength: 'strong' | 'moderate' | 'weak';
    evidence: string[];
  }>> {
    const relationships: any[] = [];

    const itemArray = Array.from(items.entries());

    for (let i = 0; i < itemArray.length; i++) {
      for (let j = i + 1; j < itemArray.length; j++) {
        const [fromPath, fromData] = itemArray[i];
        const [toPath, toData] = itemArray[j];

        const rel = await this.findRelationshipBetween(
          fromPath, fromData,
          toPath, toData,
          depth
        );

        if (rel) {
          relationships.push(rel);
        }
      }
    }

    return relationships;
  }

  /**
   * Find relationship between two items
   */
  private static async findRelationshipBetween(
    fromPath: string, fromData: any,
    toPath: string, toData: any,
    depth: string
  ): Promise<any> {
    const evidence: string[] = [];

    // Check skill-to-project relationships
    if (this.isSkillItem(fromData) && this.isProjectItem(toData)) {
      const skillMentions = this.extractSkillMentions(toData.content);
      if (skillMentions.includes(fromData.name)) {
        evidence.push(`Skill "${fromData.name}" mentioned in project`);
        return {
          from: fromPath,
          to: toPath,
          type: 'skill_to_project',
          strength: 'strong',
          evidence
        };
      }
    }

    // Check technology-to-project relationships
    if (this.isTechnologyItem(fromData) && this.isProjectItem(toData)) {
      if (toData.technologies?.includes(fromData.name)) {
        evidence.push(`Technology "${fromData.name}" used in project`);
        return {
          from: fromPath,
          to: toPath,
          type: 'technology_to_project',
          strength: 'strong',
          evidence
        };
      }
    }

    // Check for related skills
    if (this.isSkillItem(fromData) && this.isSkillItem(toData)) {
      const similarity = this.calculateSimilarity(fromData.category, toData.category);
      if (similarity > 0.5) {
        evidence.push(`Both skills in ${fromData.category} category`);
        return {
          from: fromPath,
          to: toPath,
          type: 'skill_to_skill',
          strength: similarity > 0.8 ? 'strong' : 'moderate',
          evidence
        };
      }
    }

    return null;
  }

  /**
   * Check if item is a skill
   */
  private static isSkillItem(data: any): boolean {
    return data.type === 'skill' || data.category === 'skills';
  }

  /**
   * Check if item is a project
   */
  private static isProjectItem(data: any): boolean {
    return data.type === 'project' || data.category === 'projects';
  }

  /**
   * Check if item is a technology
   */
  private static isTechnologyItem(data: any): boolean {
    return data.type === 'technology' || data.category === 'technologies';
  }

  /**
   * Extract skill mentions from content
   */
  private static extractSkillMentions(content: string): string[] {
    // Implementation would use NLP or pattern matching
    return [];
  }

  /**
   * Calculate similarity between two values
   */
  private static calculateSimilarity(a: string, b: string): number {
    if (!a || !b) return 0;
    if (a === b) return 1;

    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();

    // Simple string similarity using Levenshtein-like approach
    const matches = aLower.split('').filter(c => bLower.includes(c)).length;
    return matches / Math.max(aLower.length, bLower.length);
  }

  /**
   * Find orphaned items (no connections)
   */
  static async findOrphanedItems(
    items: string[],
    relationships: Array<{ from: string; to: string }>
  ): Promise<string[]> {
    const connected = new Set<string>();

    for (const rel of relationships) {
      connected.add(rel.from);
      connected.add(rel.to);
    }

    return items.filter(item => !connected.has(item));
  }

  /**
   * Identify clusters (connected components)
   */
  static async identifyClusters(
    items: string[],
    relationships: Array<{ from: string; to: string }>
  ): Promise<string[][]> {
    const graph = new Map<string, Set<string>>();

    // Build adjacency list
    for (const item of items) {
      graph.set(item, new Set());
    }

    for (const rel of relationships) {
      graph.get(rel.from)?.add(rel.to);
      graph.get(rel.to)?.add(rel.from);
    }

    // Find connected components using DFS
    const visited = new Set<string>();
    const clusters: string[][] = [];

    for (const item of items) {
      if (!visited.has(item)) {
        const cluster = this.dfsCluster(item, graph, visited);
        if (cluster.length > 0) {
          clusters.push(cluster);
        }
      }
    }

    return clusters;
  }

  /**
   * DFS to find cluster
   */
  private static dfsCluster(
    node: string,
    graph: Map<string, Set<string>>,
    visited: Set<string>
  ): string[] {
    const cluster: string[] = [];
    const stack = [node];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;

      visited.add(current);
      cluster.push(current);

      const neighbors = graph.get(current) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }

    return cluster;
  }
}

// ============================================================================
// METADATA ENHANCEMENT ENGINE
// ============================================================================

export class MetadataEnhancementEngine {
  /**
   * Enhance metadata for a file
   */
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
  }> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const original = this.extractFrontmatter(content) || {};
    const enhanced = JSON.parse(JSON.stringify(original)); // Deep copy

    const changes = {
      added: [] as string[],
      updated: [] as string[],
      fixed: [] as string[]
    };

    // Add missing required fields
    for (const [field, schema] of Object.entries(schemaDefinition)) {
      const fieldSchema = schema as any;
      
      if (fieldSchema.required && !(field in enhanced)) {
        enhanced[field] = this.generateDefaultValue(field, fieldSchema, content);
        changes.added.push(field);
      }
    }

    // Fix inconsistencies
    if (enhanced.tags && !Array.isArray(enhanced.tags)) {
      enhanced.tags = String(enhanced.tags).split(',').map((t: string) => t.trim());
      changes.fixed.push('tags');
    }

    // Add inferred fields based on content
    if (depth !== 'surface') {
      if (!enhanced.category) {
        enhanced.category = this.inferCategory(content);
        changes.added.push('category');
      }

      if (!enhanced.tags || enhanced.tags.length === 0) {
        enhanced.tags = this.inferTags(content);
        changes.added.push('tags');
      }
    }

    if (depth === 'comprehensive') {
      // Add rich metadata
      enhanced.wordCount = content.split(/\s+/).length;
      enhanced.headingCount = (content.match(/^#+\s/gm) || []).length;
      enhanced.codeBlockCount = (content.match(/```/g) || []).length / 2;
      
      if (!enhanced.lastModified) {
        enhanced.lastModified = new Date().toISOString();
      }

      changes.added.push('wordCount', 'headingCount', 'codeBlockCount', 'lastModified');
    }

    return {
      original,
      enhanced,
      changes
    };
  }

  /**
   * Extract frontmatter from content
   */
  private static extractFrontmatter(content: string): Record<string, any> {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      try {
        return yaml.load(match[1]) as Record<string, any>;
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  /**
   * Generate default value for field
   */
  private static generateDefaultValue(field: string, schema: any, content: string): any {
    if (field === 'created' || field === 'updated') {
      return new Date().toISOString();
    }
    if (field === 'status') {
      return 'draft';
    }
    if (field === 'description') {
      const lines = content.split('\n');
      return lines.slice(0, 3).join(' ').substring(0, 200);
    }
    return '';
  }

  /**
   * Infer category from content
   */
  private static inferCategory(content: string): string {
    const keywords = {
      skills: ['skill', 'proficiency', 'expertise', 'knowledge'],
      projects: ['project', 'implemented', 'built', 'developed'],
      experience: ['role', 'position', 'company', 'employment'],
      learning: ['learned', 'course', 'tutorial', 'study'],
      achievements: ['achievement', 'award', 'accomplishment', 'milestone']
    };

    const contentLower = content.toLowerCase();
    let bestCategory = 'other';
    let bestScore = 0;

    for (const [category, kws] of Object.entries(keywords)) {
      const score = kws.filter(kw => contentLower.includes(kw)).length;
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }

    return bestCategory;
  }

  /**
   * Infer tags from content
   */
  private static inferTags(content: string): string[] {
    const tags = new Set<string>();

    // Extract hashtags
    const hashtagMatches = content.match(/#[\w]+/g) || [];
    hashtagMatches.forEach(tag => tags.add(tag.substring(1)));

    // Extract code languages
    const codeMatches = content.match(/```(\w+)/g) || [];
    codeMatches.forEach(match => {
      const lang = match.substring(3);
      if (lang) tags.add(lang);
    });

    return Array.from(tags);
  }

  /**
   * Validate metadata against schema
   */
  static validateMetadata(
    metadata: Record<string, any>,
    schema: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [field, fieldSchema] of Object.entries(schema)) {
      const fs = fieldSchema as any;

      if (fs.required && !(field in metadata)) {
        errors.push(`Required field missing: ${field}`);
      }

      if (field in metadata) {
        const value = metadata[field];

        if (fs.type === 'string' && typeof value !== 'string') {
          errors.push(`Field ${field} should be string, got ${typeof value}`);
        }

        if (fs.type === 'array' && !Array.isArray(value)) {
          errors.push(`Field ${field} should be array, got ${typeof value}`);
        }

        if (fs.enum && !fs.enum.includes(value)) {
          errors.push(`Field ${field} value "${value}" not in enum: ${fs.enum.join(', ')}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// ============================================================================
// TREND ANALYSIS ENGINE
// ============================================================================

export class TrendAnalysisEngine {
  /**
   * Analyze trends in content
   */
  static async analyzeTrends(
    items: Map<string, any>,
    trendKeywords: string[]
  ): Promise<{
    emerging_skills: Array<{ skill: string; trend_score: number; frequency: number }>;
    technology_evolution: Array<{ tech: string; usage_trend: 'increasing' | 'stable' | 'declining' }>;
    clusters: string[][];
  }> {
    const skillFrequency = new Map<string, number>();
    const techEvolution = new Map<string, number[]>();
    const relatedSkills = new Map<string, Set<string>>();

    for (const [path, data] of items) {
      if (data.skills) {
        for (const skill of data.skills) {
          skillFrequency.set(skill, (skillFrequency.get(skill) || 0) + 1);
        }
      }

      if (data.technologies) {
        for (const tech of data.technologies) {
          if (!techEvolution.has(tech)) {
            techEvolution.set(tech, []);
          }
          techEvolution.get(tech)!.push(new Date(data.date || Date.now()).getFullYear());
        }
      }
    }

    // Calculate emerging skills
    const emerging_skills = Array.from(skillFrequency.entries())
      .map(([skill, freq]) => ({
        skill,
        trend_score: Math.min((freq / items.size) * 100, 100),
        frequency: freq
      }))
      .filter(s => s.frequency >= 2)
      .sort((a, b) => b.trend_score - a.trend_score);

    // Analyze technology evolution
    const technology_evolution = Array.from(techEvolution.entries()).map(([tech, years]) => {
      const recentYears = years.filter(y => y >= new Date().getFullYear() - 2).length;
      const olderYears = years.length - recentYears;

      return {
        tech,
        usage_trend: recentYears > olderYears ? 'increasing' : olderYears > recentYears ? 'declining' : 'stable'
      };
    });

    return {
      emerging_skills: emerging_skills.slice(0, 10),
      technology_evolution,
      clusters: []
    };
  }

  /**
   * Identify skill combinations
   */
  static async identifySkillCombinations(
    items: Map<string, any>
  ): Promise<Array<{ skills: string[]; frequency: number }>> {
    const combinations = new Map<string, number>();

    for (const [_, data] of items) {
      if (data.skills && Array.isArray(data.skills)) {
        const sorted = data.skills.sort();
        for (let i = 0; i < sorted.length; i++) {
          for (let j = i + 1; j < sorted.length; j++) {
            const key = `${sorted[i]}|${sorted[j]}`;
            combinations.set(key, (combinations.get(key) || 0) + 1);
          }
        }
      }
    }

    return Array.from(combinations.entries())
      .filter(([_, freq]) => freq >= 2)
      .map(([key, freq]) => ({
        skills: key.split('|'),
        frequency: freq
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }
}

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

export class RecommendationEngine {
  /**
   * Generate recommendations
   */
  static async generateRecommendations(
    items: Map<string, any>,
    analysis: any
  ): Promise<Array<{
    category: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
  }>> {
    const recommendations = [];

    // Content gap recommendations
    const contentGaps = this.identifyContentGaps(items);
    for (const gap of contentGaps) {
      recommendations.push({
        category: 'Content Gap',
        recommendation: gap,
        priority: 'medium',
        effort: 'medium'
      });
    }

    // Metadata recommendations
    const metadataGaps = this.identifyMetadataGaps(items);
    for (const gap of metadataGaps) {
      recommendations.push({
        category: 'Metadata',
        recommendation: gap,
        priority: 'low',
        effort: 'low'
      });
    }

    // Organization recommendations
    const orgRecs = this.identifyOrganizationImprovements(items);
    for (const rec of orgRecs) {
      recommendations.push({
        category: 'Organization',
        recommendation: rec,
        priority: 'medium',
        effort: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Identify content gaps
   */
  private static identifyContentGaps(items: Map<string, any>): string[] {
    const gaps: string[] = [];
    let itemCount = 0;
    let documentedItems = 0;

    for (const [_, data] of items) {
      itemCount++;
      if (data.description && data.description.length > 50) {
        documentedItems++;
      }
    }

    if (documentedItems / itemCount < 0.7) {
      gaps.push('Many items lack detailed descriptions - consider adding more documentation');
    }

    return gaps;
  }

  /**
   * Identify metadata gaps
   */
  private static identifyMetadataGaps(items: Map<string, any>): string[] {
    const gaps: string[] = [];
    let withTags = 0;
    let itemCount = items.size;

    for (const [_, data] of items) {
      if (data.tags && data.tags.length > 0) {
        withTags++;
      }
    }

    if (withTags / itemCount < 0.5) {
      gaps.push('Consider adding tags to more items for better discoverability');
    }

    return gaps;
  }

  /**
   * Identify organization improvements
   */
  private static identifyOrganizationImprovements(items: Map<string, any>): string[] {
    const improvements: string[] = [];

    const categories = new Map<string, number>();
    for (const [_, data] of items) {
      if (data.category) {
        categories.set(data.category, (categories.get(data.category) || 0) + 1);
      }
    }

    const imbalancedCategories = Array.from(categories.entries())
      .filter(([_, count]) => count > 20);

    if (imbalancedCategories.length > 0) {
      improvements.push(`Consider creating subcategories for: ${imbalancedCategories.map(([cat]) => cat).join(', ')}`);
    }

    return improvements;
  }
}

// Export all engines
export { ContentOrganizationEngine, RelationshipDetectionEngine, MetadataEnhancementEngine, TrendAnalysisEngine, RecommendationEngine };
