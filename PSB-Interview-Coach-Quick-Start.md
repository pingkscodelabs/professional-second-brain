# PSB Interview Coach - Quick Start Guide

Get started with interview preparation in 5 minutes!

## Installation

### Step 1: Copy Files
```bash
# From project root
mkdir -p .github/extensions/psb-interview-coach
cp psb-interview-coach.ts .github/extensions/psb-interview-coach/
cp psb-interview-coach-extension.json .github/extensions/psb-interview-coach/extension.json
cp psb-interview-coach-package.json .github/extensions/psb-interview-coach/package.json
```

### Step 2: Install Dependencies
```bash
cd .github/extensions/psb-interview-coach
npm install
npm run build
```

### Step 3: Load Extension
```bash
copilot extensions load .github/extensions/psb-interview-coach
```

## First Use

### 1. Prepare for Behavioral Interview
```typescript
const coach = new PSBInterviewCoach();

const prep = await coach.prepareInterview({
  interviewType: 'behavioral',
  companyName: 'Google',
  difficultyLevel: 'senior',
  generateFeedback: true
});

// Results include:
// - 10 behavioral questions
// - STAR story matches
// - Google company context
// - Coaching feedback
// - Resources
```

### 2. Review Generated Questions
```typescript
prep.interviewPrep.questions.forEach(q => {
  console.log(`Q: ${q.question}`);
  console.log(`Framework: ${q.suggestedAnswerFramework}`);
  console.log(`Talking Points: ${q.keyTalkingPoints.join(', ')}`);
  console.log(`Related Achievements: ${q.relatedAchievements.map(a => a.achievement).join(', ')}`);
  console.log('---');
});
```

### 3. Practice with Mock Interview
```typescript
const mockInterview = await coach.startMockInterview({
  duration: 30,
  interviewType: 'behavioral',
  interviewerStyle: 'realistic'
});

console.log(`Mock interview ready!`);
console.log(`Scenarios: ${mockInterview.scenarios.length}`);
console.log(`Duration: ${mockInterview.estimatedDuration} minutes`);
```

### 4. Match Your Achievements
```typescript
const matches = await coach.matchSTARStories({
  scenario: 'Tell me about a time you led a technical project',
  topCount: 3
});

matches.forEach(achievement => {
  console.log(`Achievement: ${achievement.title}`);
  console.log(`Situation: ${achievement.starContext.situation}`);
  console.log(`Result: ${achievement.starContext.result}`);
});
```

## Common Use Cases

### Preparing for Senior Engineering Role

```typescript
// Comprehensive preparation for senior role
const prep = await coach.prepareInterview({
  interviewType: 'mock_full',
  companyName: 'Amazon',
  jobDescription: 'Senior Software Engineer - Backend',
  difficultyLevel: 'senior',
  topicFocus: ['system design', 'leadership', 'technical depth'],
  generateFeedback: true
});

// Results: 20 questions (5 behavioral, 5 technical, 5 system design, 5 follow-ups)
```

### Technical Interview Preparation

```typescript
// Focus on technical depth
const technicalQuestions = await coach.generateQuestions({
  questionType: 'technical',
  count: 15,
  topics: ['databases', 'APIs', 'performance', 'scalability'],
  difficultyLevel: 'senior'
});

// Detailed technical questions ready for practice
```

### Behavioral Interview Practice

```typescript
// Pure behavioral preparation
const behavioralQuestions = await coach.generateQuestions({
  questionType: 'behavioral',
  count: 12,
  topics: ['leadership', 'conflict', 'failure', 'communication'],
  difficultyLevel: 'mid'
});

// Practice behavioral responses
```

### System Design Deep-Dive

```typescript
// System design focused preparation
const prep = await coach.prepareInterview({
  interviewType: 'system_design',
  jobDescription: 'Staff Engineer - Cloud Architecture',
  topicFocus: ['microservices', 'distributed systems', 'scalability'],
  difficultyLevel: 'senior'
});

// System design questions with frameworks
```

## Interview Preparation Workflow

### Day 1: Planning (30 minutes)
```typescript
// 1. Get company context
const company = await coach.prepareInterview({
  interviewType: 'behavioral',
  companyName: 'Your Target Company'
});

// 2. Review company context
console.log(company.interviewPrep.companyContext);
// Shows: tech stack, focus areas, preparation checklist

// 3. Identify focus areas
const focusAreas = company.interviewPrep.companyContext?.suggestedFocusAreas || [];
console.log('Focus areas:', focusAreas);
```

### Day 2-3: Question Review (60 minutes)
```typescript
// 1. Generate all question types
const behavioral = await coach.generateQuestions({
  questionType: 'behavioral',
  count: 8,
  difficultyLevel: 'senior'
});

const technical = await coach.generateQuestions({
  questionType: 'technical',
  count: 8,
  difficultyLevel: 'senior'
});

const systemDesign = await coach.generateQuestions({
  questionType: 'system_design',
  count: 3,
  difficultyLevel: 'senior'
});

// 2. Review and map to your experience
// 3. Create answer outlines
```

### Day 4-5: Practice (120 minutes)
```typescript
// 1. Run mock interviews
for (let i = 0; i < 3; i++) {
  const mockInterview = await coach.startMockInterview({
    duration: 45,
    interviewType: 'mixed',
    interviewerStyle: 'realistic'
  });
  
  // Practice each scenario
  // Time your responses
  // Record for review
}

// 2. Focus on weak areas
// 3. Get peer feedback
```

### Day 6: Final Prep (30 minutes)
```typescript
// 1. One final mock interview
const finalMock = await coach.startMockInterview({
  duration: 60,
  interviewType: 'mixed'
});

// 2. Review coaching feedback
const prep = await coach.prepareInterview({
  interviewType: 'mock_full',
  generateFeedback: true
});

console.log('Strengths:', prep.coachingFeedback?.strengths);
console.log('Areas to improve:', prep.coachingFeedback?.areasForImprovement);
console.log('Practice recommendations:', prep.coachingFeedback?.recommendedPractice);

// 3. Rest and prepare mentally
```

## Tips for Success

### 1. Be Consistent
- Dedicate time daily to preparation
- Use structured workflow above
- Complete all mock interviews
- Review feedback thoroughly

### 2. Use STAR Framework
- Situation: Set the context
- Task: Define your role and responsibility
- Action: Describe what you did specifically
- Result: Quantify the outcome

### 3. Tell Real Stories
- Use actual achievements from PSB
- Don't make up or exaggerate
- Be authentic and genuine
- Show growth and learning

### 4. Practice Timing
- Behavioral answers: 2-3 minutes
- Technical deep-dive: 5-10 minutes
- System design: 15-20 minutes
- Mock interview: Full duration

### 5. Record Yourself
- Review your recorded answers
- Check for filler words (um, like, you know)
- Assess pacing and clarity
- Note areas for improvement

### 6. Get Feedback
- Share with mentor or peer
- Ask for constructive criticism
- Focus on specific improvements
- Practice revisions

## Confidence Scoring Guide

### Understanding Your Score

**High Confidence (80-100%)**
- ✅ Comprehensive preparation
- ✅ Multiple practice rounds
- ✅ Strong STAR story matches
- ✅ Ready for interview

**Medium-High Confidence (60-80%)**
- ⚠️ Good preparation but some gaps
- ⚠️ Focus on weak areas
- ⚠️ Additional practice recommended
- ⚠️ One more mock interview

**Medium Confidence (40-60%)**
- ❌ Significant preparation needed
- ❌ Address major gaps
- ❌ Multiple practice sessions required
- ❌ Not ready yet

**Low Confidence (0-40%)**
- ❌ Substantial work needed
- ❌ Restructure preparation plan
- ❌ Focus on fundamentals first
- ❌ Delay interview if possible

## Troubleshooting

### No STAR matches found
**Problem**: Achievement database is empty
**Solution**: 
1. Add achievements using PSB Onboard
2. Use `matchSTARStories` with broader scenarios
3. Create custom STAR stories

### Questions seem generic
**Problem**: Not enough company-specific data
**Solution**:
1. Provide detailed job description
2. Use company name for research
3. Add custom topic focus
4. Research company manually for context

### Mock interviews feel flat
**Problem**: Limited scenario variety
**Solution**:
1. Practice different interview styles
2. Run multiple mock sessions
3. Get peer to interview you
4. Record real interviews for reference

### Not improving after practice
**Problem**: Practicing without focused feedback
**Solution**:
1. Review coaching feedback carefully
2. Target weak areas specifically
3. Get mentor review
4. Change practice approach

## Next Steps

1. **Complete Installation** (5 min)
   - Follow installation steps above
   - Verify extension loads

2. **Run First Prep** (10 min)
   - Use example above
   - Review generated questions
   - Map to your experience

3. **Create Your Plan** (20 min)
   - Identify target companies
   - Define role level
   - Plan interview types
   - Set timeline

4. **Start Preparation** (daily)
   - Follow workflow above
   - Practice consistently
   - Get feedback
   - Iterate and improve

5. **Track Progress** (weekly)
   - Run readiness assessments
   - Monitor confidence scores
   - Focus on weak areas
   - Celebrate improvements

## Additional Resources

- **PSB Onboard Skill**: Document your experience in STAR format
- **PSB CV Builder Skill**: Build resumes that support your interview prep
- **Interview Websites**: LeetCode, Glassdoor, Blind, Levels.fyi
- **Books**: "Cracking the Coding Interview", "Designing Data-Intensive Applications"
- **Practice**: Mock interviews with peers, mentors, or services

## Getting Help

- Check the main README for detailed API documentation
- Review Implementation Guide for advanced features
- Check Deployment Checklist for setup issues
- Reach out to PSB maintainers for support

Good luck with your interview preparation!
