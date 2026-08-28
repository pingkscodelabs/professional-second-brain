# PSB Interview Prep Agent - Quick Start Guide

Get started with the PSB Interview Prep Agent in 5 minutes.

## ⚡ Installation (2 minutes)

### 1. Copy Files
```bash
mkdir -p .github/extensions/psb-interview-prep-agent
cp psb-interview-prep-agent.ts .github/extensions/psb-interview-prep-agent/
cp psb-interview-prep-agent-extension.json .github/extensions/psb-interview-prep-agent/extension.json
cp psb-interview-prep-agent-package.json .github/extensions/psb-interview-prep-agent/package.json
```

### 2. Install & Build
```bash
cd .github/extensions/psb-interview-prep-agent
npm install
npm run build
```

### 3. Load Extension
```bash
copilot extensions load .github/extensions/psb-interview-prep-agent
```

## 🚀 Usage (3 minutes)

### Basic Usage Example

```typescript
import PSBInterviewPrepAgent, { AgentInput } from './psb-interview-prep-agent';

// Create agent instance
const agent = new PSBInterviewPrepAgent();

// Example: Prepare for an interview
const prepInput: AgentInput = {
  operation: 'prepare',
  interview_info: {
    company_name: 'TechCorp',
    job_title: 'Senior Software Engineer',
    job_description: 'Lead backend infrastructure team. Design scalable systems.',
    interview_date: '2024-09-15',
    interview_type: 'technical',
    difficulty_level: 'senior'
  },
  prep_intensity: 'intensive',
  include_mock_interviews: true,
  number_of_mocks: 4
};

// Execute operation
const result = await agent.execute(prepInput);

// View results
console.log('Preparation Status:', result.prep_result);
console.log('Materials Generated:', result.prep_materials);
console.log('Timeline:', result.timeline);
```

## 📋 Common Operations

### 1. Generate Preparation Materials

```typescript
const result = await agent.execute({
  operation: 'prepare',
  interview_info: {
    company_name: 'Google',
    job_title: 'Backend Engineer',
    job_description: 'Architect distributed systems',
    interview_date: '2024-09-20',
    interview_type: 'system_design',
    difficulty_level: 'senior',
    id: 'interview-001'
  },
  prep_intensity: 'intensive'
});

console.log(`Generated ${result.prep_materials?.questions_count} questions`);
console.log(`Matched ${result.prep_materials?.star_stories_matched} STAR stories`);
```

### 2. Schedule Mock Interviews

```typescript
const mockResult = await agent.execute({
  operation: 'mock_interview',
  interview_info: {
    id: 'interview-001',
    company_name: 'Google',
    job_title: 'Backend Engineer',
    job_description: 'Architect distributed systems',
    interview_date: '2024-09-20',
    interview_type: 'system_design',
    difficulty_level: 'senior'
  },
  number_of_mocks: 3
});

console.log(`Scheduled ${mockResult.mock_interview_results?.scheduled_count} mocks`);
```

### 3. Track Progress

```typescript
const progress = await agent.execute({
  operation: 'track_performance',
  interview_info: {
    id: 'interview-001'
  }
});

console.log(`Readiness: ${progress.prep_result?.readiness_score}/100`);
console.log(`Progress: ${progress.prep_result?.completion_percentage}%`);
```

### 4. Collect Interview Feedback

```typescript
const feedbackResult = await agent.execute({
  operation: 'get_feedback',
  feedback_data: {
    interview_id: 'interview-001',
    interview_date: '2024-09-20',
    company_name: 'Google',
    feedback_notes: 'Strong system design discussion. Good communication.',
    strengths: [
      'System Design Thinking',
      'Clear Communication',
      'Problem Analysis'
    ],
    areas_for_improvement: [
      'Trade-off Discussion',
      'Code Implementation Details'
    ],
    performance_score: 85,
    passed: true
  }
});

console.log(`Feedback integrated. ${feedbackResult.interview_feedback?.learning_items_added_to_psb} items added to PSB`);
```

### 5. Update PSB Learnings

```typescript
const learningsResult = await agent.execute({
  operation: 'update_learnings',
  feedback_data: {
    interview_id: 'interview-001',
    interview_date: '2024-09-20',
    company_name: 'Google',
    feedback_notes: 'Strong system design discussion. Good communication.',
    strengths: [
      'System Design Thinking',
      'Clear Communication',
      'Problem Analysis'
    ],
    areas_for_improvement: [
      'Trade-off Discussion',
      'Code Implementation Details'
    ]
  }
});

console.log('PSB updated with interview learnings');
```

## 🎯 Intensity Levels

### Light (30 min/day)
- Best for: Quick refresher, familiar companies
- Questions: 5 behavioral + 5 technical
- Mocks: 2 sessions
- Duration: 1-2 weeks

### Moderate (60 min/day)
- Best for: Standard preparation
- Questions: 10 behavioral + 15 technical
- Mocks: 3-4 sessions
- Duration: 2-3 weeks

### Intensive (120 min/day)
- Best for: High-stakes, competitive roles
- Questions: 20 behavioral + 30 technical
- Mocks: 4-6 sessions
- Duration: 3-4 weeks

## 📅 Interview Types

### Behavioral
- Focus: Leadership, teamwork, conflict resolution
- Duration: 45-60 minutes
- Questions: 4-8 STAR questions

### Technical
- Focus: Coding, algorithms, system design
- Duration: 60-90 minutes
- Questions: Deep technical questions

### System Design
- Focus: Large-scale architecture
- Duration: 45-60 minutes
- Questions: Design 2-3 systems

### Mock Full
- Focus: Complete interview simulation
- Duration: 2-3 hours
- Includes: Behavioral + Technical + Culture fit

## 🔍 Retrieving Results

### Get Agent Status

```typescript
const status = await agent.execute({
  operation: 'get_status'
});

console.log(status.message);
// Output: "Agent Status - Total: 5, In Progress: 2, Completed: 3, Mocks: 8/12, Avg Readiness: 76/100"
```

### Access Interview History

```typescript
// Get all interviews
const history = agent.getInterviewHistory();
console.log(`Managing ${history.length} interviews`);

// Get interview details
history.forEach(interview => {
  console.log(`${interview.company_name} - ${interview.job_title} (${interview.status})`);
});
```

### Access Mock Results

```typescript
// Get mock results for specific interview
const mocks = agent.getMockResults('interview-001');
console.log(`Completed ${mocks.filter(m => m.status === 'completed').length} of ${mocks.length} mocks`);

mocks.forEach(mock => {
  if (mock.status === 'completed') {
    console.log(`Mock ${mock.id}: Score ${mock.score}/100`);
  }
});
```

### Access Feedback History

```typescript
// Get all feedback for interview
const feedback = agent.getFeedbackHistory('interview-001');
console.log(`Received ${feedback.length} feedback(s)`);

feedback.forEach(f => {
  console.log(`Date: ${f.interview_date}`);
  console.log(`Score: ${f.performance_score}`);
  console.log(`Passed: ${f.passed ? 'Yes' : 'No'}`);
});
```

### View Operation Log

```typescript
// Get all operations
const allOps = agent.getOperationLog();
console.log(`Total operations: ${allOps.length}`);

// Get specific operation
const op = agent.getOperationLog('op-1693494000000-abc123');
if (op.length > 0) {
  console.log(`Operation: ${op[0].operation} - ${op[0].status}`);
}
```

## 📊 Example Workflow

### Complete Interview Prep Journey

```typescript
import PSBInterviewPrepAgent from './psb-interview-prep-agent';

const agent = new PSBInterviewPrepAgent();

// Step 1: Create interview record and schedule prep
console.log('📅 Step 1: Schedule Preparation');
const scheduleResult = await agent.execute({
  operation: 'schedule_prep',
  interview_info: {
    company_name: 'Amazon',
    job_title: 'Senior SDE',
    job_description: 'Build scalable systems serving millions...',
    interview_date: '2024-09-22',
    interview_type: 'system_design',
    difficulty_level: 'senior'
  },
  prep_intensity: 'intensive'
});
console.log(`✓ Prep scheduled. ${scheduleResult.timeline?.milestones.length} milestones created\n`);

// Step 2: Generate comprehensive prep materials
console.log('📚 Step 2: Generate Prep Materials');
const prepResult = await agent.execute({
  operation: 'prepare',
  interview_info: {
    id: 'interview-amazon-001',
    company_name: 'Amazon',
    job_title: 'Senior SDE',
    job_description: 'Build scalable systems serving millions...',
    interview_date: '2024-09-22',
    interview_type: 'system_design',
    difficulty_level: 'senior'
  },
  prep_intensity: 'intensive',
  include_mock_interviews: true,
  number_of_mocks: 4
});
console.log(`✓ Generated ${prepResult.prep_materials?.questions_count} questions`);
console.log(`✓ Matched ${prepResult.prep_materials?.star_stories_matched} STAR stories\n`);

// Step 3: Schedule mock interview series
console.log('🎤 Step 3: Schedule Mock Interviews');
const mockResult = await agent.execute({
  operation: 'mock_interview',
  interview_info: {
    id: 'interview-amazon-001',
    company_name: 'Amazon',
    job_title: 'Senior SDE',
    job_description: 'Build scalable systems serving millions...',
    interview_date: '2024-09-22',
    interview_type: 'system_design',
    difficulty_level: 'senior'
  },
  number_of_mocks: 4
});
console.log(`✓ Scheduled ${mockResult.mock_interview_results?.scheduled_count} mock interviews\n`);

// Step 4: Track progress (simulate over time)
console.log('📈 Step 4: Track Preparation Progress');
const progressResult = await agent.execute({
  operation: 'track_performance',
  interview_info: { id: 'interview-amazon-001' }
});
console.log(`✓ Readiness Score: ${progressResult.prep_result?.readiness_score}/100`);
console.log(`✓ Completion: ${progressResult.prep_result?.completion_percentage}%\n`);

// Step 5: Simulate interview completion and feedback
console.log('💬 Step 5: Collect Interview Feedback');
const feedbackResult = await agent.execute({
  operation: 'get_feedback',
  feedback_data: {
    interview_id: 'interview-amazon-001',
    interview_date: '2024-09-22',
    company_name: 'Amazon',
    feedback_notes: 'Excellent system design thinking. Strong in scalability discussion.',
    strengths: [
      'System Design Fundamentals',
      'Scalability Thinking',
      'Clear Communication',
      'Trade-off Analysis'
    ],
    areas_for_improvement: [
      'Database Design Details',
      'Monitoring Strategy'
    ],
    performance_score: 88,
    passed: true
  }
});
console.log(`✓ Feedback collected and analyzed`);
console.log(`✓ ${feedbackResult.interview_feedback?.learning_items_added_to_psb} learning items identified\n`);

// Step 6: Update PSB with learnings
console.log('🧠 Step 6: Update PSB with Learnings');
const learningsResult = await agent.execute({
  operation: 'update_learnings',
  feedback_data: {
    interview_id: 'interview-amazon-001',
    interview_date: '2024-09-22',
    company_name: 'Amazon',
    feedback_notes: 'Excellent system design thinking. Strong in scalability discussion.',
    strengths: [
      'System Design Fundamentals',
      'Scalability Thinking',
      'Clear Communication',
      'Trade-off Analysis'
    ],
    areas_for_improvement: [
      'Database Design Details',
      'Monitoring Strategy'
    ]
  }
});
console.log(`✓ PSB updated with ${learningsResult.interview_feedback?.learning_items_added_to_psb} items\n`);

// Step 7: Final status
console.log('🎯 Step 7: Final Status');
const finalStatus = await agent.execute({
  operation: 'get_status'
});
console.log('✓ Interview Prep Agent Status:');
console.log(finalStatus.message);
```

**Expected Output:**
```
📅 Step 1: Schedule Preparation
✓ Prep scheduled. 4 milestones created

📚 Step 2: Generate Prep Materials
✓ Generated 30 questions
✓ Matched 21 STAR stories

🎤 Step 3: Schedule Mock Interviews
✓ Scheduled 4 mock interviews

📈 Step 4: Track Preparation Progress
✓ Readiness Score: 25/100
✓ Completion: 25%

💬 Step 5: Collect Interview Feedback
✓ Feedback collected and analyzed
✓ 8 learning items identified

🧠 Step 6: Update PSB with Learnings
✓ PSB updated with 8 items

🎯 Step 7: Final Status
✓ Interview Prep Agent Status:
Agent Status - Total: 1, In Progress: 0, Completed: 1, Mocks: 0/4, Avg Readiness: 25/100
```

## 🔧 Configuration

Default settings:
```typescript
{
  prep_intensity: 'moderate',
  number_of_mocks: 3,
  collect_feedback: true,
  enable_learnings_update: true
}
```

## 🆘 Troubleshooting

### Interview not found
```typescript
// Make sure to use consistent interview ID
const result = await agent.execute({
  operation: 'prepare',
  interview_info: { id: 'interview-001', ... }
});

// Later, use same ID
await agent.execute({
  operation: 'track_performance',
  interview_info: { id: 'interview-001' }
});
```

### Date format issues
```typescript
// Use YYYY-MM-DD format
interview_date: '2024-09-15'  // ✓ Correct
interview_date: '09/15/2024'  // ✗ Wrong
```

### Feedback collection error
```typescript
// Ensure all required fields in feedback_data
{
  interview_id: 'interview-001',      // Required
  interview_date: '2024-09-15',       // Required
  company_name: 'Company',            // Required
  feedback_notes: 'Notes',            // Required
  strengths: ['...'],                 // Required
  areas_for_improvement: ['...'],     // Required
  performance_score: 80,              // Optional
  passed: true                        // Optional
}
```

## 📚 Next Steps

- Read [Implementation Guide](PSB-Interview-Prep-Agent-IMPLEMENTATION.md) for detailed architecture
- Check [API Reference](PSB-Interview-Prep-Agent-API-REFERENCE.md) for all methods
- Review [Test Scenarios](PSB-Interview-Prep-Agent-TEST-SCENARIOS.md) for testing patterns
- See [Deployment Guide](PSB-Interview-Prep-Agent-DEPLOYMENT.md) for production setup

## 💡 Tips

1. Start with 'moderate' intensity for first interview
2. Schedule mocks across 1-2 weeks before interview
3. Review feedback within 24 hours while fresh
4. Use agent status to track multiple concurrent interviews
5. Export operation logs for interview performance analytics

---

**Ready to prepare!** 🚀
