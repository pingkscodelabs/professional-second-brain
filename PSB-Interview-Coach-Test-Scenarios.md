# PSB Interview Coach - Test Scenarios

Comprehensive test scenarios for behavioral, technical, and system design interviews.

## Test Scenario Structure

Each test scenario includes:
- **Scenario ID**: Unique identifier
- **Category**: Interview type (behavioral, technical, system_design)
- **Difficulty**: junior, mid, senior, staff
- **Setup**: Input parameters
- **Expected Output**: What should be returned
- **Validation**: How to verify success
- **Edge Cases**: Boundary conditions to test

---

## BEHAVIORAL INTERVIEW SCENARIOS

### Scenario B1: Leadership Question

**ID**: `test-behavioral-leadership-001`
**Category**: Behavioral
**Difficulty**: Senior
**Topic**: Leadership and Influence

**Setup**:
```typescript
const input: InterviewPrepInput = {
  interviewType: 'behavioral',
  topicFocus: ['leadership'],
  difficultyLevel: 'senior',
  generateFeedback: true
};
```

**Expected Output**:
```typescript
{
  interviewPrep: {
    type: 'behavioral',
    questions: [
      {
        id: 'leadership-conflict',
        question: 'Tell me about a time when you had to lead a team through a conflict...',
        suggestedAnswerFramework: 'STAR: Describe the situation...',
        keyTalkingPoints: ['Active listening', 'Empathy', 'Decision-making...'],
        confidenceLevel: 'medium'
      }
      // ... more questions
    ]
  },
  coachingFeedback: {
    strengths: ['Good structure in responses...'],
    areasForImprovement: [...],
    recommendedPractice: [...]
  }
}
```

**Validation**:
- [ ] Exactly 10 questions returned
- [ ] Each question has STAR framework
- [ ] Each question has talking points
- [ ] Confidence levels assigned
- [ ] Coaching feedback provided
- [ ] Company context not included (not specified)

**Edge Cases**:
- [ ] Topics filtering works correctly
- [ ] Handles null/undefined topics
- [ ] Handles empty topic array

---

### Scenario B2: Conflict Resolution Question

**ID**: `test-behavioral-conflict-001`
**Category**: Behavioral
**Difficulty**: Mid
**Topic**: Conflict Resolution

**Setup**:
```typescript
const input: InterviewPrepInput = {
  interviewType: 'behavioral',
  topicFocus: ['conflict resolution', 'communication'],
  difficultyLevel: 'mid',
  generateFeedback: true
};
```

**Expected Output**:
- Questions about handling difficult situations
- Emphasis on communication and collaboration
- Guidance on resolving tensions professionally

**Validation**:
- [ ] 10 questions generated
- [ ] At least 1 conflict resolution question
- [ ] At least 1 communication question
- [ ] Appropriate difficulty for mid-level
- [ ] All framework guidance present

**Edge Cases**:
- [ ] Multiple topics combined
- [ ] Overlapping topic keywords

---

### Scenario B3: Failure and Learning

**ID**: `test-behavioral-failure-001`
**Category**: Behavioral
**Difficulty**: Senior
**Topic**: Failure and Learning

**Setup**:
```typescript
const input: InterviewPrepInput = {
  interviewType: 'behavioral',
  topicFocus: ['failure', 'learning'],
  difficultyLevel: 'senior',
  generateFeedback: false
};
```

**Expected Output**:
- 10 behavioral questions
- Questions about learning from mistakes
- No coaching feedback (generateFeedback: false)

**Validation**:
- [ ] No coaching feedback included
- [ ] Questions about failure present
- [ ] Learning mindset questions present
- [ ] STAR frameworks provided

**Edge Cases**:
- [ ] generateFeedback flag respected
- [ ] Works without coaching feedback

---

### Scenario B4: Company-Specific Behavioral

**ID**: `test-behavioral-google-001`
**Category**: Behavioral
**Difficulty**: Senior
**Company**: Google

**Setup**:
```typescript
const input: InterviewPrepInput = {
  interviewType: 'behavioral',
  companyName: 'Google',
  jobDescription: 'Senior Software Engineer at Google',
  difficultyLevel: 'senior',
  generateFeedback: true
};
```

**Expected Output**:
```typescript
{
  interviewPrep: {
    type: 'behavioral',
    questions: [...],
    companyContext: {
      companyName: 'Google',
      techStack: ['Go', 'Python', 'C++', 'Kubernetes', 'BigTable'],
      suggestedFocusAreas: ['Search', 'Ad systems', 'ML/AI', 'Scale'],
      preparationChecklist: [
        'Research company values...',
        'Understand product offerings...',
        // ...
      ]
    }
  },
  coachingFeedback: {...}
}
```

**Validation**:
- [ ] Company context included
- [ ] Tech stack correct for Google
- [ ] Focus areas relevant
- [ ] Preparation checklist provided
- [ ] Questions available
- [ ] Coaching feedback provided

**Edge Cases**:
- [ ] Unknown company name
- [ ] Null company name
- [ ] Case sensitivity handling

---

## TECHNICAL INTERVIEW SCENARIOS

### Scenario T1: System Design Question

**ID**: `test-technical-system-design-001`
**Category**: Technical
**Difficulty**: Senior
**Topic**: System Design

**Setup**:
```typescript
const input: QuestionGenerationInput = {
  questionType: 'technical',
  count: 5,
  topics: ['system design', 'databases'],
  difficultyLevel: 'senior'
};
```

**Expected Output**:
```typescript
[
  {
    id: 'system-design-intro',
    question: 'Design a system that can handle 1 million requests...',
    suggestedAnswerFramework: 'Break down: Requirements...',
    keyTalkingPoints: ['Load balancing', 'Database optimization', ...],
    confidenceLevel: 'low'
  },
  // ... more questions
]
```

**Validation**:
- [ ] 5 questions returned (not 10)
- [ ] All are technical questions
- [ ] System design included
- [ ] Database optimization included
- [ ] Complexity appropriate for senior

**Edge Cases**:
- [ ] Count parameter respected
- [ ] Default count handling
- [ ] Large count handling

---

### Scenario T2: API Design Question

**ID**: `test-technical-api-design-001`
**Category**: Technical
**Difficulty**: Mid
**Topic**: API Design

**Setup**:
```typescript
const input: QuestionGenerationInput = {
  questionType: 'technical',
  count: 10,
  topics: ['API', 'design'],
  difficultyLevel: 'mid'
};
```

**Expected Output**:
- 10 technical questions
- API design focused
- Appropriate for mid-level difficulty
- REST principles included

**Validation**:
- [ ] 10 questions returned
- [ ] API design question included
- [ ] REST principles in talking points
- [ ] Mid-level difficulty

**Edge Cases**:
- [ ] Topic filtering
- [ ] Multiple topic combinations

---

### Scenario T3: Database Optimization

**ID**: `test-technical-database-001`
**Category**: Technical
**Difficulty**: Senior
**Topic**: Database Optimization

**Setup**:
```typescript
const input: QuestionGenerationInput = {
  questionType: 'technical',
  count: 10,
  topics: ['database', 'performance', 'optimization'],
  difficultyLevel: 'senior'
};
```

**Expected Output**:
- Questions about database optimization
- Performance considerations included
- Indexing strategies discussed
- Query optimization guidance

**Validation**:
- [ ] Database question included
- [ ] Performance focus evident
- [ ] Optimization strategies mentioned
- [ ] Framework guidance provided

**Edge Cases**:
- [ ] Multiple specific topics
- [ ] Topic relevance filtering

---

### Scenario T4: Testing Strategy

**ID**: `test-technical-testing-001`
**Category**: Technical
**Difficulty**: Senior
**Topic**: Testing

**Setup**:
```typescript
const input: QuestionGenerationInput = {
  questionType: 'technical',
  count: 10,
  topics: ['testing', 'quality assurance'],
  difficultyLevel: 'senior'
};
```

**Expected Output**:
- Questions about testing approaches
- Test strategy and coverage discussed
- CI/CD pipeline knowledge
- Quality assurance emphasis

**Validation**:
- [ ] Testing question included
- [ ] Multiple testing levels mentioned
- [ ] CI/CD reference present
- [ ] Production readiness focus

**Edge Cases**:
- [ ] Specialized testing topics
- [ ] Cross-cutting concerns

---

## SYSTEM DESIGN INTERVIEW SCENARIOS

### Scenario SD1: Social Media Feed Design

**ID**: `test-system-design-feed-001`
**Category**: System Design
**Difficulty**: Senior
**Question**: Design a social media feed system

**Setup**:
```typescript
const input: InterviewPrepInput = {
  interviewType: 'system_design',
  topicFocus: ['real-time updates', 'scale'],
  difficultyLevel: 'senior'
};
```

**Expected Output**:
```typescript
{
  interviewPrep: {
    type: 'system_design',
    questions: [
      {
        id: 'design-twitter',
        question: 'Design a social media feed system...',
        suggestedAnswerFramework: 'Approach: Requirements...',
        keyTalkingPoints: [
          'Real-time updates',
          'Distributed systems',
          'Data consistency',
          'Performance'
        ],
        confidenceLevel: 'low'
      },
      // ... more system design questions
    ]
  }
}
```

**Validation**:
- [ ] 5 system design questions (not 10)
- [ ] Twitter-like question included
- [ ] Low confidence level (appropriate for hard)
- [ ] Real-time considerations included
- [ ] Scaling discussed

**Edge Cases**:
- [ ] System design specific count
- [ ] Complexity for different levels
- [ ] Realistic timing estimates

---

### Scenario SD2: Video Streaming Platform

**ID**: `test-system-design-streaming-001`
**Category**: System Design
**Difficulty**: Staff
**Question**: Design YouTube

**Setup**:
```typescript
const input: InterviewPrepInput = {
  interviewType: 'system_design',
  topicFocus: ['video', 'streaming', 'scale'],
  difficultyLevel: 'staff'
};
```

**Expected Output**:
- Video streaming questions
- CDN considerations
- Encoding strategies
- Scalability at massive scale

**Validation**:
- [ ] Video streaming question included
- [ ] CDN mentioned
- [ ] Bandwidth optimization discussed
- [ ] Staff-level complexity

**Edge Cases**:
- [ ] Large-scale considerations
- [ ] Multi-region architecture

---

### Scenario SD3: URL Shortener

**ID**: `test-system-design-shortener-001`
**Category**: System Design
**Difficulty**: Mid
**Question**: Design URL shortener

**Setup**:
```typescript
const input: InterviewPrepInput = {
  interviewType: 'system_design',
  topicFocus: ['hash', 'database', 'scale'],
  difficultyLevel: 'mid'
};
```

**Expected Output**:
- URL shortening question included
- Hash function considerations
- Storage approach discussed
- Analytics requirements

**Validation**:
- [ ] URL shortener question present
- [ ] Hash function strategy
- [ ] Database design approach
- [ ] Mid-level difficulty appropriate
- [ ] Collision handling discussed

**Edge Cases**:
- [ ] Edge case scaling
- [ ] Custom URLs
- [ ] Analytics at scale

---

## STAR STORY MATCHING SCENARIOS

### Scenario STAR1: Leadership Match

**ID**: `test-star-leadership-001`
**Category**: STAR Matching
**Scenario**: "Tell me about a time you led a team through a technical challenge"

**Setup**:
```typescript
const input: STARMatchingInput = {
  scenario: 'Tell me about a time you led a technical migration',
  topCount: 5
};

const result = await coach.matchSTARStories(input);
```

**Expected Output**:
```typescript
[
  {
    id: 'achievement-1',
    title: 'Led team through technical migration',
    description: 'Led migration of legacy system...',
    starContext: {
      situation: 'Legacy monolithic system...',
      task: 'Lead architectural migration...',
      action: 'Created migration plan...',
      result: 'Successfully migrated...',
      metrics: ['60% latency reduction', '40% velocity improvement']
    }
  },
  // ... more matches
]
```

**Validation**:
- [ ] Results returned (up to 5)
- [ ] STAR context included
- [ ] Title matches scenario
- [ ] Metrics provided
- [ ] File paths correct
- [ ] Score appropriate

**Edge Cases**:
- [ ] No matches found
- [ ] Partial keyword matches
- [ ] Multiple relevant achievements

---

### Scenario STAR2: Problem-Solving Match

**ID**: `test-star-problem-solving-001`
**Category**: STAR Matching
**Scenario**: "Describe a time you solved a critical production issue"

**Setup**:
```typescript
const input: STARMatchingInput = {
  scenario: 'Tell me about resolving a critical production incident',
  topCount: 3
};

const result = await coach.matchSTARStories(input);
```

**Expected Output**:
- Achievement about incident resolution
- STAR context with specific actions
- Metrics showing impact
- Quick resolution time highlighted

**Validation**:
- [ ] Up to 3 matches returned
- [ ] Problem-solving emphasis
- [ ] Quick resolution highlighted
- [ ] STAR structure complete
- [ ] Impact metrics provided

**Edge Cases**:
- [ ] topCount parameter respected
- [ ] Empty or null scenario
- [ ] Vague scenarios

---

### Scenario STAR3: Team Building Match

**ID**: `test-star-team-building-001`
**Category**: STAR Matching
**Scenario**: "Describe your experience building and developing teams"

**Setup**:
```typescript
const input: STARMatchingInput = {
  scenario: 'Tell me about building a high-performing team',
  topCount: 5
};
```

**Expected Output**:
- Team building achievement
- Recruitment and mentoring highlighted
- Growth metrics included
- Team dynamics improvements shown

**Validation**:
- [ ] Team-focused achievement returned
- [ ] Mentoring aspects highlighted
- [ ] Growth metrics present
- [ ] Team composition changes documented
- [ ] Retention metrics included

**Edge Cases**:
- [ ] Multiple team scenarios
- [ ] Different team sizes
- [ ] Cross-functional teams

---

## MOCK INTERVIEW SCENARIOS

### Scenario MI1: 30-Minute Behavioral Mock

**ID**: `test-mock-behavioral-30-001`
**Category**: Mock Interview
**Duration**: 30 minutes
**Type**: Behavioral

**Setup**:
```typescript
const input: MockInterviewInput = {
  duration: 30,
  interviewType: 'behavioral',
  interviewerStyle: 'realistic'
};

const result = await coach.startMockInterview(input);
```

**Expected Output**:
```typescript
{
  scenarios: [
    {
      id: 'scenario-1',
      questionText: 'Tell me about a project...',
      expectedDuration: 5,
      followUpQuestions: [
        'What challenges did you face?',
        'How did you overcome them?'
      ],
      scoringCriteria: [
        'Clear communication',
        'Technical depth',
        'Personal growth'
      ]
    },
    // ... more scenarios
  ],
  estimatedDuration: 30
}
```

**Validation**:
- [ ] 3 scenarios for 30-minute interview
- [ ] Expected durations reasonable
- [ ] Follow-up questions included
- [ ] Scoring criteria defined
- [ ] Total estimated time ~30 minutes

**Edge Cases**:
- [ ] Exact time matching
- [ ] Partial scenarios
- [ ] Interview style variations

---

### Scenario MI2: 60-Minute Mixed Mock

**ID**: `test-mock-mixed-60-001`
**Category**: Mock Interview
**Duration**: 60 minutes
**Type**: Mixed (behavioral + technical)

**Setup**:
```typescript
const input: MockInterviewInput = {
  duration: 60,
  interviewType: 'mixed',
  interviewerStyle: 'challenging'
};
```

**Expected Output**:
- 6 scenarios for 60-minute interview
- Mix of behavioral and technical
- Challenging interviewer style reflected
- Progressive difficulty

**Validation**:
- [ ] 6 scenarios returned
- [ ] Mix of types present
- [ ] Challenging tone evident
- [ ] Total duration ~60 minutes
- [ ] Progressive difficulty

**Edge Cases**:
- [ ] Interviewer style effects
- [ ] Different type combinations
- [ ] Extended duration handling

---

### Scenario MI3: System Design Mock

**ID**: `test-mock-system-design-45-001`
**Category**: Mock Interview
**Duration**: 45 minutes
**Type**: System Design

**Setup**:
```typescript
const input: MockInterviewInput = {
  duration: 45,
  interviewType: 'technical',
  focusAreas: ['system design', 'scalability']
};
```

**Expected Output**:
- System design focused scenarios
- Scalability emphasis
- 45-minute duration
- Deep technical questions

**Validation**:
- [ ] System design questions included
- [ ] Scalability focus
- [ ] 45-minute scenarios
- [ ] Focus areas respected
- [ ] Complexity appropriate

**Edge Cases**:
- [ ] Focus area filtering
- [ ] Duration precision
- [ ] Question selection

---

## COMPANY RESEARCH SCENARIOS

### Scenario CR1: Google Preparation

**ID**: `test-company-google-001`
**Category**: Company Research
**Company**: Google

**Setup**:
```typescript
const context = companyResearcher.generateContextForCompany('Google', jobDescription);
```

**Expected Output**:
```typescript
{
  companyName: 'Google',
  techStack: ['Go', 'Python', 'C++', 'Kubernetes', 'BigTable', 'MapReduce'],
  suggestedFocusAreas: ['Search', 'Ad systems', 'ML/AI', 'Distributed systems', 'Scale'],
  preparationChecklist: [
    'Research company values and mission',
    'Understand product offerings',
    'Review recent news and announcements',
    'Study team structure and org chart',
    'Prepare company-specific examples',
    'Research technical stack and architecture',
    'Understand business model and metrics'
  ]
}
```

**Validation**:
- [ ] Tech stack accurate
- [ ] Focus areas relevant
- [ ] Preparation checklist comprehensive
- [ ] Company name correct
- [ ] Data source reliable

**Edge Cases**:
- [ ] Unknown company name
- [ ] Case sensitivity
- [ ] Partial company name match

---

### Scenario CR2: Amazon Preparation

**ID**: `test-company-amazon-001`
**Category**: Company Research
**Company**: Amazon

**Setup**:
```typescript
const context = companyResearcher.generateContextForCompany('Amazon');
```

**Expected Output**:
- AWS-focused tech stack
- E-commerce and operations emphasis
- Customer obsession principle
- Scale and innovation focus

**Validation**:
- [ ] AWS technologies listed
- [ ] E-commerce relevant
- [ ] Leadership principles mentioned
- [ ] Scale focus evident
- [ ] Preparation checklist specific

**Edge Cases**:
- [ ] Regional variations
- [ ] Different business units
- [ ] AWS certification relevance

---

## COACHING FEEDBACK SCENARIOS

### Scenario CF1: High Preparation Level

**ID**: `test-feedback-high-001`
**Category**: Coaching Feedback
**Preparation Level**: 90%

**Setup**:
```typescript
const feedback = feedbackGenerator.generateFeedback(
  'behavioral',
  10,  // questions answered
  10,  // total questions
  []   // areas of concern
);
```

**Expected Output**:
```typescript
{
  strengths: [
    'Good structure in responses using STAR framework',
    'Clear articulation of technical concepts',
    'Ability to provide specific examples',
    'High preparation level demonstrated'
  ],
  areasForImprovement: [
    // Minimal or empty
  ],
  recommendedPractice: [
    'Practice mock interviews with a peer',
    'Record yourself for review',
    // ...
  ]
}
```

**Validation**:
- [ ] Strengths highlighted
- [ ] Few areas for improvement
- [ ] Positive but realistic
- [ ] Practice recommendations included
- [ ] High confidence maintained

**Edge Cases**:
- [ ] 100% preparation
- [ ] Realistic ceiling on confidence

---

### Scenario CF2: Low Preparation Level

**ID**: `test-feedback-low-001`
**Category**: Coaching Feedback
**Preparation Level**: 30%

**Setup**:
```typescript
const feedback = feedbackGenerator.generateFeedback(
  'technical',
  3,   // questions answered
  10,  // total questions
  ['system design', 'databases']  // areas of concern
);
```

**Expected Output**:
- Identified weaknesses
- Specific improvement areas
- Focused practice recommendations
- Realistic timeline guidance

**Validation**:
- [ ] Weaknesses identified
- [ ] Specific focus areas
- [ ] Actionable recommendations
- [ ] Motivational tone
- [ ] Improvement path clear

**Edge Cases**:
- [ ] 0% preparation
- [ ] Multiple concern areas
- [ ] Prioritized recommendations

---

## ERROR AND EDGE CASE SCENARIOS

### Scenario E1: Invalid Interview Type

**ID**: `test-error-invalid-type-001`
**Category**: Error Handling
**Error**: Invalid interview type

**Setup**:
```typescript
const input = {
  interviewType: 'invalid_type' // Not a valid enum value
};

try {
  await coach.prepareInterview(input as any);
} catch (error) {
  // Expect error
}
```

**Expected Output**:
- Error thrown
- Error message descriptive
- Graceful failure

**Validation**:
- [ ] Error caught properly
- [ ] Message helpful
- [ ] No application crash
- [ ] Logging present

---

### Scenario E2: Empty Achievement Database

**ID**: `test-error-empty-achievements-001`
**Category**: Error Handling
**Error**: No achievements found

**Setup**:
```typescript
const matcher = new STARStoryMatcher();
// No achievements loaded

const result = await coach.matchSTARStories({
  scenario: 'Any scenario',
  topCount: 5
});
```

**Expected Output**:
- Empty array returned or default message
- No errors thrown
- Graceful fallback

**Validation**:
- [ ] No exception thrown
- [ ] Empty result handled
- [ ] User guidance provided
- [ ] Continued functionality

---

### Scenario E3: Very Long Input Scenario

**ID**: `test-error-long-input-001`
**Category**: Error Handling
**Error**: Input exceeds reasonable length

**Setup**:
```typescript
const veryLongScenario = 'A'.repeat(10000);

const result = await coach.matchSTARStories({
  scenario: veryLongScenario,
  topCount: 5
});
```

**Expected Output**:
- Processed without error
- Performance acceptable
- Results reasonable

**Validation**:
- [ ] No crash or timeout
- [ ] Results returned in <2s
- [ ] Memory usage reasonable
- [ ] Edge case handled

---

## PERFORMANCE TEST SCENARIOS

### Scenario P1: Question Generation Performance

**ID**: `test-performance-questions-001`
**Category**: Performance
**Metric**: Generation time

**Setup**:
```typescript
const start = Date.now();
const questions = await coach.generateQuestions({
  questionType: 'behavioral',
  count: 10
});
const duration = Date.now() - start;
```

**Expected Output**:
- Duration < 200ms
- All 10 questions returned
- No memory leaks

**Validation**:
- [ ] Generation < 200ms
- [ ] Result completeness
- [ ] Memory cleanup
- [ ] Consistent performance

---

### Scenario P2: STAR Matching Performance

**ID**: `test-performance-star-matching-001`
**Category**: Performance
**Metric**: Matching time

**Setup**:
```typescript
const start = Date.now();
const matches = await coach.matchSTARStories({
  scenario: 'Complex technical scenario with many keywords',
  topCount: 5
});
const duration = Date.now() - start;
```

**Expected Output**:
- Duration < 300ms
- 5 matches returned
- Relevance accurate

**Validation**:
- [ ] Matching < 300ms
- [ ] Result quality
- [ ] Scaling behavior
- [ ] Consistent performance

---

### Scenario P3: Full Interview Prep Performance

**ID**: `test-performance-full-prep-001`
**Category**: Performance
**Metric**: Full pipeline time

**Setup**:
```typescript
const start = Date.now();
const result = await coach.prepareInterview({
  interviewType: 'mock_full',
  companyName: 'Google',
  generateFeedback: true
});
const duration = Date.now() - start;
```

**Expected Output**:
- Duration < 2000ms
- All components present
- No timeouts

**Validation**:
- [ ] Full prep < 2s
- [ ] All sections populated
- [ ] Company context included
- [ ] Coaching feedback present
- [ ] Resources included

---

## Integration Test Scenarios

### Scenario INT1: PSB Onboard Integration

**ID**: `test-integration-onboard-001`
**Category**: Integration
**System**: PSB Onboard

**Setup**:
```typescript
// Assume PSB Onboard has documented achievement
const achievement = await getPSBOnboardAchievement('migration-project');
const matcher = new STARStoryMatcher();
matcher.addAchievement(achievement);

const result = await coach.matchSTARStories({
  scenario: 'Tell me about a major project you led'
});
```

**Expected Output**:
- Achievement from PSB Onboard found
- STAR context recognized
- Integration successful

**Validation**:
- [ ] Achievement loaded
- [ ] STAR structure preserved
- [ ] File paths correct
- [ ] Metadata intact

---

### Scenario INT2: PSB CV Builder Alignment

**ID**: `test-integration-cv-builder-001`
**Category**: Integration
**System**: PSB CV Builder

**Setup**:
```typescript
// CV Builder has analyzed job description
const jobAnalysis = getCVBuilderAnalysis('senior-engineer-jd');

// Interview Coach uses for prep
const prep = await coach.prepareInterview({
  jobDescription: jobAnalysis.description,
  topicFocus: jobAnalysis.requiredSkills
});
```

**Expected Output**:
- Questions aligned with CV Builder analysis
- Skills from job description addressed
- Consistent experience documentation

**Validation**:
- [ ] Skill alignment
- [ ] Description parsing
- [ ] Consistent data model
- [ ] Cross-skill validation

---

## Test Execution Checklist

### Before Running Tests
- [ ] All dependencies installed
- [ ] TypeScript compiled
- [ ] Extension loaded
- [ ] Sample data initialized
- [ ] Environment variables set

### During Test Execution
- [ ] Run each scenario in order
- [ ] Document results
- [ ] Note timing metrics
- [ ] Capture error messages
- [ ] Monitor resource usage

### After Test Execution
- [ ] Verify all tests passed
- [ ] Review performance metrics
- [ ] Check for regressions
- [ ] Document findings
- [ ] Create issue tickets for failures

---

## Test Result Template

```
Test Scenario: [ID]
Category: [Type]
Difficulty: [Level]

Setup: [Input]
Expected: [Output]

Result: [ ] PASSED [ ] FAILED

Actual Output:
[Captured output]

Validation Points:
- [ ] Check 1: [Result]
- [ ] Check 2: [Result]
- [ ] Check 3: [Result]

Performance:
Duration: [ms]
Memory: [MB]
Status: [Acceptable/Warning/Critical]

Issues Found:
[List any issues]

Notes:
[Additional observations]

Timestamp: [Date/Time]
Tester: [Name]
```

---

## Success Criteria

All tests should:
- ✅ Complete without errors
- ✅ Return expected output format
- ✅ Validate all output fields
- ✅ Handle edge cases gracefully
- ✅ Perform within time limits
- ✅ Integrate with PSB systems

## Conclusion

These test scenarios provide comprehensive coverage of the PSB Interview Coach functionality. Execute all scenarios before deployment to ensure production readiness.
