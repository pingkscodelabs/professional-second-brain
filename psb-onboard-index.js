#!/usr/bin/env node

/**
 * PSB-Onboard Tool Handler
 * Implements the main tool interface for structuring professional information
 */

const Extractor = require('./lib/extractor');
const Templates = require('./lib/templates');
const Validator = require('./lib/validator');
const Linker = require('./lib/linker');

class PSBOnboardHandler {
  constructor() {
    this.extractor = new Extractor();
    this.templates = new Templates();
    this.validator = new Validator();
    this.linker = new Linker();
  }

  async handleStructureProject(input) {
    const {rawText, category, confidentialityLevel} = input;
    
    // Extract information
    const extracted = this.extractor.extractProjectInfo(rawText);
    
    // Get template
    const template = this.templates.getProjectTemplate();
    
    // Fill template
    const filled = this._fillTemplate(template, extracted);
    
    // Validate completeness
    const validation = this.validator.validateProject(filled);
    
    // Generate suggestions
    const yamlEntry = this._generateProjectYAML(extracted, category, confidentialityLevel);
    const filePath = this._suggestFilePath(extracted, 'projects');
    const linkedContent = await this.linker.suggestProjectLinks(extracted);
    
    return {
      markdown: filled,
      yamlEntry,
      suggestedFilePath: filePath,
      linkedContent,
      completenessScore: validation.score,
      missingFields: validation.missing,
      confidence: extracted.confidence
    };
  }

  async handleStructureAchievement(input) {
    const {rawText, category, confidentialityLevel} = input;
    
    const extracted = this.extractor.extractAchievementInfo(rawText);
    const template = this.templates.getAchievementTemplate();
    const filled = this._fillTemplate(template, extracted);
    const validation = this.validator.validateAchievement(filled);
    
    const yamlEntry = this._generateAchievementYAML(extracted, category, confidentialityLevel);
    const filePath = this._suggestFilePath(extracted, 'evidence/achievements');
    const linkedContent = await this.linker.suggestAchievementLinks(extracted);
    
    return {
      markdown: filled,
      yamlEntry,
      suggestedFilePath: filePath,
      linkedContent,
      completenessScore: validation.score,
      missingFields: validation.missing,
      confidence: extracted.confidence
    };
  }

  async handleStructureSkill(input) {
    const {rawText, category} = input;
    
    const extracted = this.extractor.extractSkillInfo(rawText);
    const template = this.templates.getSkillTemplate();
    const filled = this._fillTemplate(template, extracted);
    const validation = this.validator.validateSkill(filled);
    
    const yamlEntry = this._generateSkillYAML(extracted, category);
    const filePath = this._suggestFilePath(extracted, 'profile/skills');
    const linkedContent = await this.linker.suggestSkillLinks(extracted);
    
    return {
      markdown: filled,
      yamlEntry,
      suggestedFilePath: filePath,
      linkedContent,
      completenessScore: validation.score,
      missingFields: validation.missing,
      confidence: extracted.confidence
    };
  }

  async handleStructureClient(input) {
    const {rawText, category, confidentialityLevel} = input;
    
    const extracted = this.extractor.extractClientInfo(rawText);
    const template = this.templates.getClientTemplate();
    const filled = this._fillTemplate(template, extracted);
    const validation = this.validator.validateClient(filled);
    
    const yamlEntry = this._generateClientYAML(extracted, category, confidentialityLevel);
    const filePath = this._suggestFilePath(extracted, 'clients');
    const linkedContent = await this.linker.suggestClientLinks(extracted);
    
    return {
      markdown: filled,
      yamlEntry,
      suggestedFilePath: filePath,
      linkedContent,
      completenessScore: validation.score,
      missingFields: validation.missing,
      confidence: extracted.confidence
    };
  }

  async handleValidateCompleteness(input) {
    const {informationType, extractedData} = input;
    
    let validation;
    switch (informationType) {
      case 'project':
        validation = this.validator.validateProject(extractedData);
        break;
      case 'achievement':
        validation = this.validator.validateAchievement(extractedData);
        break;
      case 'skill':
        validation = this.validator.validateSkill(extractedData);
        break;
      case 'client':
        validation = this.validator.validateClient(extractedData);
        break;
      case 'adr':
        validation = this.validator.validateADR(extractedData);
        break;
      default:
        throw new Error(`Unknown information type: ${informationType}`);
    }
    
    return {
      isComplete: validation.score >= 0.85,
      completenessScore: validation.score,
      missingFields: validation.missing,
      recommendations: validation.recommendations
    };
  }

  _fillTemplate(template, extracted) {
    // Replace template placeholders with extracted values
    let result = template;
    
    for (const [key, value] of Object.entries(extracted.fields)) {
      const placeholder = `{${key}}`;
      if (value && value !== null && value !== undefined) {
        result = result.replace(new RegExp(placeholder, 'g'), value);
      } else {
        result = result.replace(new RegExp(placeholder, 'g'), 'TBD');
      }
    }
    
    // Add confidence indicators for low-confidence fields
    const confidenceNotes = this._generateConfidenceNotes(extracted);
    result += '\n\n' + confidenceNotes;
    
    return result;
  }

  _generateConfidenceNotes(extracted) {
    const lowConfidence = Object.entries(extracted.confidence)
      .filter(([_, conf]) => conf === 'LOW')
      .map(([field, _]) => `- ${field}`)
      .join('\n');
    
    if (!lowConfidence) return '';
    
    return `## Extraction Confidence Notes\n\nThe following fields have LOW confidence and should be verified:\n${lowConfidence}`;
  }

  _generateProjectYAML(extracted, category, confidentialityLevel) {
    return {
      name: extracted.fields.projectName || 'TBD',
      client: extracted.fields.client || 'TBD',
      period: extracted.fields.timePeriod || 'TBD',
      technologies: extracted.fields.technologies || [],
      role: extracted.fields.role || 'TBD',
      team_size: extracted.fields.teamSize || 'TBD',
      category: category || '',
      confidentiality_level: confidentialityLevel || 'CONFIDENTIAL',
      status: 'needs_review',
      documentation_link: ''  // To be filled after file creation
    };
  }

  _generateAchievementYAML(extracted, category, confidentialityLevel) {
    return {
      title: extracted.fields.title || 'TBD',
      date: extracted.fields.date || 'TBD',
      context: extracted.fields.context || 'TBD',
      business_impact: extracted.fields.businessImpact || 'TBD',
      metrics: extracted.fields.metrics || {},
      technologies: extracted.fields.technologies || [],
      category: category || '',
      confidentiality_level: confidentialityLevel || 'CONFIDENTIAL',
      status: 'needs_review',
      documentation_link: ''
    };
  }

  _generateSkillYAML(extracted, category) {
    return {
      name: extracted.fields.skillName || 'TBD',
      category: category || extracted.fields.category || '',
      level: extracted.fields.level || 'BEGINNER',
      years_of_experience: extracted.fields.yearsOfExperience || 0,
      last_used: extracted.fields.lastUsed || 'TBD',
      status: 'needs_review',
      documentation_link: ''
    };
  }

  _generateClientYAML(extracted, category, confidentialityLevel) {
    return {
      name: extracted.fields.clientName || 'TBD',
      anonymized_name: extracted.fields.anonymizedName || 'CLIENT_X',
      industry: category || extracted.fields.industry || '',
      engagement_period: extracted.fields.engagementPeriod || 'TBD',
      confidentiality_level: confidentialityLevel || 'CONFIDENTIAL',
      status: 'needs_review',
      documentation_link: ''
    };
  }

  _suggestFilePath(extracted, baseDir) {
    const name = extracted.fields.projectName || 
                 extracted.fields.title || 
                 extracted.fields.skillName || 
                 extracted.fields.clientName ||
                 'unnamed';
    
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const category = extracted.fields.category || 'general';
    return `${baseDir}/${category}/${slug}.md`;
  }
}

module.exports = PSBOnboardHandler;
