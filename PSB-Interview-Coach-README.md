# PSB Interview Coach - Professional Second Brain Skill

A comprehensive interview preparation system for technical and behavioral interviews. This skill leverages documented professional experience from the Professional Second Brain to generate personalized interview questions, match STAR stories to interview scenarios, and orchestrate realistic mock interviews.

## Overview

The PSB Interview Coach is the third foundational skill in the Professional Second Brain ecosystem, designed to help professionals prepare for:

- **Behavioral Interviews** - Questions about past experiences, leadership, and problem-solving
- **Technical Interviews** - Deep technical questions, coding challenges, and architecture discussions
- **System Design Interviews** - Large-scale system design and architectural thinking
- **Mock Interviews** - Full realistic interview simulations with feedback

## Key Features

### 1. Interview Question Generation
- Generates relevant questions based on interview type
- Tailored to difficulty level (junior, mid, senior, staff)
- Includes suggested answer frameworks and talking points
- Supports topic-specific focus areas

### 2. STAR Story Matching
- Matches documented achievements to interview scenarios
- Provides situation, task, action, result (STAR) structure
- Suggests related projects and achievements
- Confidence scoring for each match

### 3. Technical Question Prep
- Generates system design questions
- Creates algorithm and architecture challenges
- Technology-specific preparation
- Performance and optimization focus

### 4. Behavioral Question Prep
- Leadership and conflict resolution scenarios
- Failure analysis and learning questions
- Stakeholder management situations
- Communication and collaboration patterns

### 5. Company/Role Research
- Researches company technology stack
- Suggests preparation focus areas
- Generates company-specific questions
- Creates preparation checklist

### 6. Mock Interview Orchestration
- Realistic interview scenarios
- Timed questions and follow-ups
- Multiple interview styles (friendly, challenging, realistic)
- Progress tracking and readiness scoring

### 7. Coaching Feedback
- Strength identification and reinforcement
- Areas for improvement with specific guidance
- Recommended practice exercises
- Confidence level assessment by topic

### 8. Confidence Scoring
- Tracks preparation level for each topic
- Readiness assessment for interview types
- Areas needing more practice
- Time-to-ready estimates

## Installation

### Prerequisites
- Node.js 16+ or TypeScript 5.0+
- Copilot CLI or Copilot integration environment
- Access to Professional Second Brain repository

### Setup

1. **Copy files to extensions directory:**
```bash
mkdir -p .github/extensions/psb-interview-coach
cp psb-interview-coach.ts .github/extensions/psb-interview-coach/
cp psb-interview-coach-extension.json .github/extensions/psb-interview-coach/extension.json
cp psb-interview-coach-package.json .github/extensions/psb-interview-coach/package.json
```

2. **Install dependencies:**
```bash
cd .github/extensions/psb-interview-coach
npm install
```

3. **Build the extension:**
```bash
npm run build
```

4. **Load in Copilot:**
```bash
copilot extensions load .github/extensions/psb-interview-coach
```

## Usage

### Basic Interview Preparation

```typescript
const coach = new PSBInterviewCoach();

// Prepare for behavioral interview
const result = await coach.prepareInterview({
  interviewType: 'behavioral',
  companyName: 'Google',
  jobDescription: 'Senior Full Stack Engineer',
  difficultyLevel: 'senior',
  generateFeedback: true
});
```

### Generate Specific Questions

```typescript
// Generate technical questions
const technicalQuestions = await coach.generateQuestions({
  questionType: 'technical',
  count: 10,
  topics: ['system design', 'databases'],
  difficultyLevel: 'senior'
});

// Generate behavioral questions
const behavioralQuestions = await coach.generateQuestions({
  questionType: 'behavioral',
  count: 8,
  topics: ['leadership', 'conflict resolution'],
  difficultyLevel: 'mid'
});
```

### Start Mock Interview

```typescript
// Begin a 60-minute mock interview
const mockInterview = await coach.startMockInterview({
  duration: 60,
  interviewType: 'mixed',
  interviewerStyle: 'realistic',
  focusAreas: ['system design', 'behavioral']
});
```

### Match STAR Stories

```typescript
// Find relevant achievements for a scenario
const matches = await coach.matchSTARStories({
  scenario: 'Tell me about a time you led a major technical initiative',
  topCount: 5
});
```

## API Reference

### PSBInterviewCoach Class

#### `prepareInterview(input: InterviewPrepInput): Promise<InterviewPrepOutput>`

Comprehensive interview preparation with questions, company research, and coaching feedback.

**Input Parameters:**
- `interviewType` (required): 'behavioral' | 'technical' | 'system_design' | 'mock_full'
- `companyName` (optional): Target company for research
- `jobDescription` (optional): Job description for role-specific prep
- `topicFocus` (optional): Array of specific topics to focus on
- `difficultyLevel` (optional): 'junior' | 'mid' | 'senior' | 'staff' (default: 'senior')
- `generateFeedback` (optional): Generate coaching feedback (default: true)

**Output:**
```typescript
{
  interviewPrep: {
    type: string,
    questions: InterviewQuestion[],
    companyContext?: CompanyContext,
    mockInterview?: {
      scenarioCount: number,
      estimatedDuration: number,
      readinessScore: number
    }
  },
  coachingFeedback?: {
    strengths: string[],
    areasForImprovement: string[],
    recommendedPractice: string[]
  },
  resources: {
    relatedProjects: string[],
    relatedAchievements: Achievement[],
    technologyReferences: string[]
  }
}
```

#### `generateQuestions(input: QuestionGenerationInput): Promise<InterviewQuestion[]>`

Generate specific interview questions tailored to type and difficulty.

**Input Parameters:**
- `questionType` (required): 'behavioral' | 'technical' | 'system_design' | 'company_research'
- `count` (optional): Number of questions to generate (default: 10)
- `topics` (optional): Array of topics to focus on
- `difficultyLevel` (optional): 'junior' | 'mid' | 'senior' | 'staff'

#### `startMockInterview(input: MockInterviewInput): Promise<MockInterviewResult>`

Start a realistic mock interview session.

**Input Parameters:**
- `duration` (optional): Duration in minutes (default: 60)
- `interviewType` (optional): 'behavioral' | 'technical' | 'system_design' | 'mixed' (default: 'mixed')
- `interviewerStyle` (optional): 'friendly' | 'challenging' | 'realistic' (default: 'realistic')
- `focusAreas` (optional): Array of areas to focus on

#### `matchSTARStories(input: STARMatchingInput): Promise<Achievement[]>`

Match documented achievements to interview scenarios using STAR framework.

**Input Parameters:**
- `scenario` (required): Interview scenario or question to match against
- `topCount` (optional): Number of matches to return (default: 5)

## Data Models

### InterviewQuestion

```typescript
interface InterviewQuestion {
  id: string;
  question: string;
  suggestedAnswerFramework: string;
  relatedAchievements: {
    achievement: string;
    filePath: string;
  }[];
  keyTalkingPoints: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
  followUpQuestions?: string[];
}
```

### Achievement

```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  skills: string[];
  impact: string;
  filePath: string;
  starContext: {
    situation: string;
    task: string;
    action: string;
    result: string;
    metrics?: string[];
  };
}
```

### CompanyContext

```typescript
interface CompanyContext {
  companyName: string;
  techStack: string[];
  suggestedFocusAreas: string[];
  preparationChecklist: string[];
  recentNews?: string[];
  teamStructure?: string[];
}
```

## Interview Preparation Workflow

### Phase 1: Planning
1. Define interview type and difficulty level
2. Research company and role
3. Identify relevant past experiences
4. Review suggested focus areas

### Phase 2: Question Review
1. Study generated questions
2. Map STAR stories to questions
3. Identify gaps in preparation
4. Create answer outlines

### Phase 3: Practice
1. Practice mock interviews
2. Time your responses
3. Record yourself for review
4. Get feedback on answers

### Phase 4: Refinement
1. Focus on weak areas
2. Refine answer narratives
3. Practice follow-ups
4. Build confidence

### Phase 5: Final Prep
1. Company research deep-dive
2. Technical review sessions
3. Mock interview full runs
4. Rest and confidence building

## Interview Types

### Behavioral Interviews
Focus on past experiences and how you handle situations. Key themes:
- Leadership and influence
- Conflict resolution
- Failure and learning
- Communication
- Collaboration
- Pressure handling

**Success Metrics:**
- Use STAR framework consistently
- Provide specific, quantified results
- Connect to role requirements
- Show self-awareness and growth

### Technical Interviews
Assess technical depth and problem-solving. Key areas:
- System design
- Algorithm analysis
- Code quality
- Architecture decisions
- Technology choices
- Performance optimization

**Success Metrics:**
- Clear communication of approach
- Consideration of trade-offs
- Scalability awareness
- Code quality focus
- Testing strategy

### System Design Interviews
Evaluate large-scale architecture thinking. Key elements:
- Requirements analysis
- High-level design
- Data models and schema
- Scaling strategies
- Reliability and fault tolerance
- Trade-off analysis

**Success Metrics:**
- Systematic approach
- Clear communication
- Trade-off discussions
- Scalability considerations
- Real-world awareness

### Mock Full Interviews
Complete interview simulation with behavioral and technical components.

## Scoring and Readiness

### Confidence Levels
- **High**: Well-prepared with strong examples and deep knowledge
- **Medium**: Adequate preparation, some areas could be stronger
- **Low**: Limited preparation, needs more work before interview

### Readiness Score (0-100)
- **80-100**: Ready for interview - comprehensive preparation
- **60-80**: Mostly ready - focus on weak areas
- **40-60**: Needs more preparation - significant gaps
- **0-40**: Not ready - substantial preparation needed

## Best Practices

### Before Your Interview

1. **Prepare thoroughly**
   - Generate questions for all interview types
   - Match STAR stories to scenarios
   - Run at least 3 mock interviews
   - Research the company extensively

2. **Practice systematically**
   - Record yourself answering questions
   - Time your responses (avoid rambling)
   - Practice follow-up questions
   - Get feedback from peers or mentor

3. **Manage anxiety**
   - Practice relaxation techniques
   - Prepare for difficult questions
   - Build confidence through repetition
   - Get good sleep before interview

### During Your Interview

1. **Listen carefully**
   - Let interviewer finish questions
   - Ask clarifying questions if needed
   - Take a moment before answering

2. **Structure your responses**
   - Use STAR framework for behavioral questions
   - State your approach before diving in
   - Provide specific examples
   - Include quantified results

3. **Be authentic**
   - Don't memorize answers
   - Show genuine enthusiasm
   - Admit when you don't know
   - Ask thoughtful questions

4. **Manage time**
   - Watch for time signals
   - Summarize if running long
   - Pause for questions
   - Don't rush through answers

### After Your Interview

1. **Reflect and learn**
   - Note difficult questions
   - Identify areas for improvement
   - Thank your interviewer
   - Follow up appropriately

2. **Continue preparing**
   - Address weak areas
   - Prepare for next rounds
   - Update your experience documentation
   - Practice more mock interviews

## Integration with PSB

The Interview Coach integrates with other PSB skills:

### With PSB Onboard Skill
- Structures raw career information into templates
- Creates organized achievement database
- Generates STAR frameworks from documented experiences

### With PSB CV Builder Skill
- Uses documented experience to generate questions
- Matches job descriptions to your background
- Aligns interview prep with CV content

### Future Integrations
- Interview recording analysis
- Real-time interviewer feedback
- Performance analytics
- Continuous learning recommendations

## Troubleshooting

### Questions don't match my experience
- Ensure experience is documented in PSB
- Use `matchSTARStories` to find best matches
- Focus on relevance over perfect matches
- Ask for clarification in interview

### Mock interviews feel unrealistic
- Adjust interviewer style settings
- Practice with different difficulty levels
- Record real interviews as reference
- Get peer feedback on realism

### Low readiness score
- Focus on identified weak areas
- Run more targeted mock interviews
- Practice specific question types
- Update documentation with recent work

### Extension not loading
- Check file paths and naming
- Verify TypeScript compilation
- Review error logs
- Ensure all dependencies installed

## Performance Considerations

- Question generation: ~200ms for 10 questions
- STAR matching: ~300ms per scenario
- Mock interview setup: ~100ms
- Company research: ~150ms
- Full interview prep: ~1-2 seconds

## Testing

Run test suite:
```bash
npm test
```

Run specific test:
```bash
npm test -- --testNamePattern="behavioral questions"
```

## Contributing

To contribute improvements:
1. Create a feature branch
2. Add tests for new functionality
3. Update documentation
4. Submit PR with description

## License

MIT - See LICENSE file for details

## Support

For issues or questions:
1. Check troubleshooting section
2. Review documentation files
3. Check implementation guide
4. Contact PSB maintainers

## Version History

### v1.0.0 (Current)
- Initial release
- Behavioral question generation
- Technical question generation
- System design question generation
- STAR story matching
- Mock interview orchestration
- Coaching feedback
- Company research
- Confidence scoring

## Roadmap

### v1.1.0 (Planned)
- Interview recording analysis
- Real-time performance feedback
- Extended company database
- Custom question generation
- Interview transcript analysis

### v1.2.0 (Future)
- Machine learning based STAR matching
- Industry-specific question sets
- Peer comparison analytics
- Interview outcome prediction
- Personalized learning paths

## Conclusion

The PSB Interview Coach provides a comprehensive system for interview preparation, leveraging your documented professional experience to create personalized, effective preparation. By using STAR frameworks, targeted mock interviews, and coaching feedback, you can significantly improve your interview performance.

Start with behavioral questions to build confidence, progress to technical depth, and finish with full mock interviews. Track your readiness score and focus on areas needing improvement until you're fully prepared.

Good luck with your interviews!
