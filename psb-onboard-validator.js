/**
 * Completeness Validator
 * Validates extracted information against template requirements
 */

class Validator {
  validateProject(data) {
    const required = [
      'projectName',
      'client',
      'timePeriod',
      'role',
      'businessOutcome'
    ];

    const recommended = [
      'teamSize',
      'technologies',
      'scale',
      'challenges'
    ];

    const validation = this._validateFields(data, required, recommended);
    validation.type = 'project';
    return validation;
  }

  validateAchievement(data) {
    const required = [
      'title',
      'date',
      'businessImpact',
      'metrics'
    ];

    const recommended = [
      'context',
      'technicalOutcome',
      'technologies',
      'scale'
    ];

    const validation = this._validateFields(data, required, recommended);
    validation.type = 'achievement';
    return validation;
  }

  validateSkill(data) {
    const required = [
      'skillName',
      'category',
      'level'
    ];

    const recommended = [
      'yearsOfExperience',
      'productionExperience',
      'expertiseAreas'
    ];

    const validation = this._validateFields(data, required, recommended);
    validation.type = 'skill';
    return validation;
  }

  validateClient(data) {
    const required = [
      'clientName',
      'industry',
      'engagementPeriod'
    ];

    const recommended = [
      'engagementType',
      'scale',
      'majorProjects'
    ];

    const validation = this._validateFields(data, required, recommended);
    validation.type = 'client';
    return validation;
  }

  validateADR(data) {
    const required = [
      'title',
      'context',
      'decision',
      'rationale',
      'consequences'
    ];

    const recommended = [
      'alternatives',
      'tradeoffs',
      'implementation',
      'securityImplications'
    ];

    const validation = this._validateFields(data, required, recommended);
    validation.type = 'adr';
    return validation;
  }

  _validateFields(data, required, recommended) {
    const missing = [];
    const incomplete = [];
    let score = 100;

    // Check required fields
    for (const field of required) {
      const value = data.fields?.[field] || data[field];
      if (!value || value === 'TBD' || value === null || value === undefined) {
        missing.push(field);
        score -= 10;  // Each missing required field costs 10 points
      }
    }

    // Check recommended fields
    for (const field of recommended) {
      const value = data.fields?.[field] || data[field];
      if (!value || value === 'TBD' || value === null || value === undefined) {
        incomplete.push(field);
        score -= 3;   // Each missing recommended field costs 3 points
      }
    }

    // Check for TBD placeholders in text
    const textContent = data.markdown || JSON.stringify(data);
    const tbdCount = (textContent.match(/TBD/g) || []).length;
    score = Math.max(0, score - (tbdCount * 2));

    // Normalize score to 0-100
    score = Math.max(0, Math.min(100, score));
    scoreAsPercentage = score / 100;

    const recommendations = this._generateRecommendations(missing, incomplete, data);

    return {
      score: scoreAsPercentage,
      scorePercentage: score,
      missing,
      incomplete,
      recommendations,
      isComplete: missing.length === 0,
      needsReview: incomplete.length > 0 || tbdCount > 0
    };
  }

  _generateRecommendations(missing, incomplete, data) {
    const recommendations = [];

    if (missing.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        message: `Fill in missing required fields: ${missing.join(', ')}`,
        fields: missing
      });
    }

    if (incomplete.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        message: `Complete recommended fields: ${incomplete.join(', ')}`,
        fields: incomplete
      });
    }

    // Check for vague or suspicious content
    const suspiciousPatterns = [
      { pattern: /significantly|substantially|greatly/i, message: 'Use specific metrics instead of vague qualifiers' },
      { pattern: /probably|possibly|maybe|likely/i, message: 'Avoid uncertain language; stick to facts' },
      { pattern: /very|really|extremely/i, message: 'Replace subjective intensifiers with metrics' }
    ];

    const textContent = data.markdown || JSON.stringify(data);
    for (const {pattern, message} of suspiciousPatterns) {
      if (pattern.test(textContent)) {
        recommendations.push({
          priority: 'MEDIUM',
          message: message
        });
      }
    }

    return recommendations;
  }
}

module.exports = Validator;
