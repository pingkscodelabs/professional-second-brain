# PSB CV Builder - Implementation Guide

## Overview

The PSB CV Builder is a Copilot skill that generates tailored CVs/resumes by intelligently matching job requirements against documented professional experience in the Professional Second Brain repository.

## Architecture

### Core Modules

1. **Job Description Parser** (`psb-job-parser.ts`)
   - Extracts key requirements from job descriptions
   - Identifies required vs. nice-to-have skills
   - Determines experience level needed
   - Classifies technology stack
   - Extracts industry/domain context

2. **Repository Searcher** (`psb-repo-searcher.ts`)
   - Searches metadata files for matching projects, skills, and achievements
   - Calculates relevance scores for matches
   - Retrieves documented evidence and metrics
   - Aggregates results from multiple sources

3. **Experience Ranker & Formatter** (`psb-ranker-formatter.ts`)
   - Ranks projects/achievements by relevance to job requirements
   - Generates professional CV bullets with quantified metrics
   - Formats output in multiple formats (resume, CV, LinkedIn)
   - Ensures ATS-friendly formatting

4. **CV Match Analyzer** (`psb-match-analyzer.ts`)
   - Calculates overall match score (0-100)
   - Identifies strong areas and gaps
   - Validates CV claims against documented evidence
   - Assesses confidence levels for each skill claim
   - Generates actionable recommendations

5. **Main Integration** (`psb-cv-builder-main.ts`)
   - Orchestrates the full CV generation workflow
   - Coordinates between modules
   - Generates professional summary
   - Produces final output with citations

## Input/Output Format

### Input
```typescript
{
  jobDescription: string;        // Full job description or role title
  format?: "resume" | "cv" | "linkedin";  // Output format
  maxLength?: number;            // Pages (resume/cv) or characters (linkedin)
  targetLevel?: "junior" | "mid" | "senior" | "staff" | "principal";
  focusAreas?: string[];        // Optional areas to emphasize
}
```

### Output
```typescript
{
  cv: {
    summary: string;           // Tailored professional summary
    skills: [{
      skill: string;
      level: string;
      evidence: string;       // Link to source documentation
    }];
    experience: [{
      title: string;
      company: string;
      period: string;
      bullets: [{
        text: string;
        sourceFile: string;   // Link to evidence
      }];
    }];
  };
  analysis: {
    matchScore: number;        // 0-100
    strongAreas: string[];     // What you do well
    gapAreas: string[];        // What's missing
    fabricationRisk: string[]; // Unverified claims
  };
  sources: {
    [bulletId: string]: string; // Map of bullet IDs to source files
  };
  formattedCV: string;        // Formatted CV output
}
```

## Workflow

```
1. Parse Job Description
   ↓
2. Extract Required Skills/Technologies
   ↓
3. Search Repository Metadata
   ↓
4. Match Projects & Achievements
   ↓
5. Rank by Relevance & Recency
   ↓
6. Generate CV Bullets
   ↓
7. Validate All Claims (No Fabrication)
   ↓
8. Calculate Match Score
   ↓
9. Identify Gaps & Recommendations
   ↓
10. Format & Output
```

## Key Features

### 1. Intelligent Job Parsing
- Extracts core requirements from natural language
- Distinguishes must-haves from nice-to-haves
- Identifies experience level and scale requirements
- Captures industry/domain context

### 2. Smart Repository Search
- Searches projects.yml, skills.yml, technologies.yml
- Matches against documented evidence
- Calculates relevance scores (0-100)
- Returns ranked results

### 3. Relevance Ranking
- Multi-factor scoring:
  - Technology match (40%)
  - Skill/responsibility alignment (30%)
  - Focus areas (20%)
  - Recency boost (10%)
- Secondary sort by project recency

### 4. Professional CV Generation
- Tailored professional summary
- Skill levels mapped to documentation
- Achievement bullets with quantified metrics
- All claims sourced to documentation
- ATS-friendly formatting

### 5. Zero-Fabrication Guarantee
- All claims must reference documented evidence
- Unverified claims flagged with confidence levels
- Automatic validation against repository
- Clear fabrication risk reporting

### 6. Match Analysis
- Match score calculation (weighted factors)
- Strong areas identification
- Gap analysis with specific recommendations
- Confidence level assessment per claim

## Implementation Notes

### Dependencies
- YAML parsing for metadata files
- File system access to repository
- Date/time utilities for recency calculation
- Text processing for parsing and matching

### Configuration
- Repository root path (default: `.`)
- Metadata file locations (default: `./metadata/`)
- CV format options (resume/cv/linkedin)
- Match score weighting factors

### Error Handling
- Graceful degradation if metadata files missing
- Default values for incomplete data
- Clear error messages for invalid input
- Validation of all parsed data

## Testing Scenarios

### Scenario 1: Senior Platform Engineer Role
- **Input**: Job description for "Senior Platform Engineer at BigTech"
- **Expected**: 85-95 match score if documented Kubernetes/Terraform experience
- **Verifies**: Technology matching, relevance ranking, skill level calculation

### Scenario 2: Staff Architect Role
- **Input**: "Staff Architect - Cloud Infrastructure" with focus on architecture/leadership
- **Expected**: 70-85 match score, emphasis on leadership experience
- **Verifies**: Focus areas, team size matching, experience level assessment

### Scenario 3: Non-Core Area Role
- **Input**: "DevOps Engineer" role when mostly platform/architecture experience
- **Expected**: 60-75 match score with noted gaps
- **Verifies**: Gap identification and recommendations

### Scenario 4: Role with Missing Experience
- **Input**: Role requiring significant ServiceMesh experience (not documented)
- **Expected**: Lower match score with clear gap flagging
- **Verifies**: Honest gap reporting, fabrication prevention

## Usage Examples

### Example 1: Generate 1-page Resume
```typescript
const input = {
  jobDescription: "Senior Platform Engineer at TechCorp...",
  format: "resume",
  maxLength: 1,
  targetLevel: "senior"
};

const output = await generateCV(input);
console.log(output.formattedCV);
console.log(`Match Score: ${output.analysis.matchScore}/100`);
```

### Example 2: Generate Detailed CV with Analysis
```typescript
const input = {
  jobDescription: jobDescriptionText,
  format: "cv",
  focusAreas: ["Cloud Architecture", "Cost Optimization"]
};

const output = await generateCV(input);

// Access structured data
output.cv.skills.forEach(skill => {
  console.log(`${skill.skill} (${skill.level}) - ${skill.evidence}`);
});

// Review analysis
output.analysis.strongAreas.forEach(area => console.log(`✓ ${area}`));
output.analysis.gapAreas.forEach(area => console.log(`⚠ ${area}`));
```

## Quality Assurance

### Verification Checklist
- [ ] All skills have evidence links
- [ ] All CV bullets reference source files
- [ ] No conflicting information
- [ ] Match score calculation correct
- [ ] Gaps identified accurately
- [ ] Recommendations actionable
- [ ] Format is ATS-friendly
- [ ] No fabricated claims

### Match Score Interpretation
- **85-100**: Strong match - High likelihood of progression
- **70-84**: Good match - Address gaps in interviews
- **60-69**: Moderate match - Additional prep needed
- **<60**: Significant gaps - Consider upskilling or different role

## Future Enhancements

1. **Learning Gap Detection**
   - Identify quick-win learning opportunities
   - Suggest resources for gap areas

2. **Interview Prep**
   - Generate interview questions for gaps
   - Prepare talking points for strengths

3. **Resume Optimization**
   - ATS keyword optimization
   - Length and formatting optimization for different industries

4. **Batch CV Generation**
   - Generate CVs for multiple job postings
   - Compare match scores across opportunities

5. **Historical Tracking**
   - Track CV versions and improvements
   - Compare match scores over time

## Troubleshooting

### No projects found
- **Cause**: Metadata files empty or incorrectly formatted
- **Solution**: Verify projects.yml exists and contains project entries

### Low match score despite relevant experience
- **Cause**: Experience not documented in metadata
- **Solution**: Add projects to metadata/projects.yml with full details

### Missing evidence links
- **Cause**: Projects missing documentation_link field
- **Solution**: Add documentation_link to projects in metadata

### Unverified claims flagged
- **Cause**: Skills claimed but not documented
- **Solution**: Add to skills.yml or link to documented evidence

## Integration with PSB System

This skill integrates with the broader PSB system:

1. **PSB-Onboard**: Use to document new projects/skills
2. **PSB-Quality-Checker**: Validate CV output quality
3. **PSB-Analyzer**: Analyze career patterns and growth areas
4. **PSB-Interview-Coach**: Prepare for interviews based on CV gaps

## Security & Privacy

- All processing stays local (no external calls)
- Respects confidentiality levels in metadata
- Anonymizes sensitive client information
- No data persistence beyond session
- GDPR compliant (user-controlled data)

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: August 2026
