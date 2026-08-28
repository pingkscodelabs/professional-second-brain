# PSB Interview Prep Agent - API Reference

Complete API documentation for the PSB Interview Prep Agent.

## Table of Contents

1. [Class: PSBInterviewPrepAgent](#class-psbinterviewprepagent)
2. [Operation Methods](#operation-methods)
3. [Data Types](#data-types)
4. [Utility Methods](#utility-methods)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

---

## Class: PSBInterviewPrepAgent

The main agent class providing interview preparation orchestration.

### Constructor

```typescript
constructor(agentId?: string = 'psb-interview-prep-agent-v1')
```

**Parameters:**
- `agentId` (optional): Unique identifier for the agent instance
  - Type: `string`
  - Default: `'psb-interview-prep-agent-v1'`
  - Usage: Helpful for multi-instance tracking

**Example:**
```typescript
const agent = new PSBInterviewPrepAgent('google-prep-agent');
```

---

## Operation Methods

### 1. execute(input: AgentInput): Promise<AgentOutput>

Main method that routes operations to appropriate handlers.

```typescript
async execute(input: AgentInput): Promise<AgentOutput>
```

**Parameters:**
- `input` (required): Operation request
  - Type: `AgentInput`
  - Must include: `operation` field
  - Optional: Other fields depend on operation type

**Returns:**
- Type: `Promise<AgentOutput>`
- Always resolves (never rejects)
- Contains `status`, `operation_id`, and operation-specific results

**Errors:** Caught and returned in output with status='failed'

**Example:**
```typescript
const result = await agent.execute({
  operation: 'prepare',
  interview_info: {
    company_name: 'TechCorp',
    job_title: 'Engineer',
    job_description: 'Design systems',
    interview_date: '2024-09-15',
    interview_type: 'technical',
    difficulty_level: 'senior'
  },
  prep_intensity: 'intensive'
});

if (result.status === 'success') {
  console.log('Prep ready:', result.prep_materials);
} else {
  console.error('Error:', result.error);
}
```

---

### 2. prepare Operation

Generates comprehensive interview preparation materials.

**Input Structure:**
```typescript
{
  operation: 'prepare',
  interview_info: InterviewInfo,  // Required
  prep_intensity?: 'light' | 'moderate' | 'intensive',  // Default: 'moderate'
  include_mock_interviews?: boolean,  // Default: false
  number_of_mocks?: number  // Default: 3, used if include_mock_interviews=true
}
```

**Output Structure:**
```typescript
{
  operation_id: string,
  operation: 'prepare',
  status: 'success' | 'failed',
  timestamp: string (ISO 8601),
  
  prep_result?: {
    status: 'in_progress' | 'ready' | 'completed',
    completion_percentage: number,
    readiness_score: number
  },
  
  prep_materials?: {
    questions_count: number,
    star_stories_matched: number,
    tech_topics_covered: number,
    company_research_items: number,
    mock_scenarios: number,
    prep_guide_path?: string,
    company_profile_path?: string
  },
  
  timeline?: PrepTimeline,
  message?: string,
  error?: string
}
```

**Example:**
```typescript
const result = await agent.execute({
  operation: 'prepare',
  interview_info: {
    company_name: 'Google',
    job_title: 'Software Engineer',
    job_description: 'Full-stack development',
    interview_date: '2024-09-15',
    interview_type: 'technical',
    difficulty_level: 'senior',
    id: 'google-001'
  },
  prep_intensity: 'intensive',
  include_mock_interviews: true,
  number_of_mocks: 4
});

console.log(`
  Questions: ${result.prep_materials?.questions_count}
  STAR Stories: ${result.prep_materials?.star_stories_matched}
  Timeline: ${result.timeline?.milestones.length} milestones
`);
```

---

### 3. mock_interview Operation

Orchestrates realistic mock interview sessions.

**Input Structure:**
```typescript
{
  operation: 'mock_interview',
  interview_info: InterviewInfo,  // Required (needs id)
  number_of_mocks?: number  // Default: 3
}
```

**Output Structure:**
```typescript
{
  operation_id: string,
  operation: 'mock_interview',
  status: 'success' | 'failed',
  timestamp: string,
  
  mock_interview_results?: {
    scheduled_count: number,
    completed_count: number,
    average_score: number,
    improvement_trend: 'improving' | 'stable' | 'declining'
  },
  
  message?: string,
  error?: string
}
```

**Example:**
```typescript
const result = await agent.execute({
  operation: 'mock_interview',
  interview_info: {
    id: 'google-001',
    company_name: 'Google',
    job_title: 'Software Engineer',
    job_description: 'Full-stack development',
    interview_date: '2024-09-15',
    interview_type: 'technical',
    difficulty_level: 'senior'
  },
  number_of_mocks: 5
});

console.log(`Scheduled: ${result.mock_interview_results?.scheduled_count} mocks`);
```

---

### 4. track_performance Operation

Monitors preparation progress and readiness.

**Input Structure:**
```typescript
{
  operation: 'track_performance',
  interview_info: {
    id: string  // Required - must be existing interview ID
  }
}
```

**Output Structure:**
```typescript
{
  operation_id: string,
  operation: 'track_performance',
  status: 'success' | 'failed',
  timestamp: string,
  
  prep_result?: {
    status: 'in_progress' | 'ready' | 'completed',
    completion_percentage: number,  // 0-100
    readiness_score: number  // 0-100
  },
  
  message?: string,
  error?: string
}
```

**Example:**
```typescript
const result = await agent.execute({
  operation: 'track_performance',
  interview_info: {
    id: 'google-001'
  }
});

const score = result.prep_result?.readiness_score;
const progress = result.prep_result?.completion_percentage;

console.log(`Progress: ${progress}%, Readiness: ${score}/100`);
```

---

### 5. get_feedback Operation

Collects and processes interview feedback.

**Input Structure:**
```typescript
{
  operation: 'get_feedback',
  feedback_data: InterviewFeedback  // Required
}
```

**InterviewFeedback Structure:**
```typescript
{
  interview_id: string,              // Required
  interview_date: string,            // Required (YYYY-MM-DD)
  company_name: string,              // Required
  feedback_notes: string,            // Required
  strengths: string[],               // Required (array)
  areas_for_improvement: string[],   // Required (array)
  performance_score?: number,        // Optional (0-100)
  passed?: boolean                   // Optional
}
```

**Output Structure:**
```typescript
{
  operation_id: string,
  operation: 'get_feedback',
  status: 'success' | 'failed',
  timestamp: string,
  
  interview_feedback?: {
    strengths: string[],
    areas_for_improvement: string[],
    learning_items_added_to_psb: number
  },
  
  message?: string,
  error?: string
}
```

**Example:**
```typescript
const result = await agent.execute({
  operation: 'get_feedback',
  feedback_data: {
    interview_id: 'google-001',
    interview_date: '2024-09-15',
    company_name: 'Google',
    feedback_notes: 'Strong system design. Communication clear.',
    strengths: [
      'System Design',
      'Communication',
      'Problem Analysis'
    ],
    areas_for_improvement: [
      'Time Management',
      'Code Implementation Speed'
    ],
    performance_score: 85,
    passed: true
  }
});

console.log(`Learning items: ${result.interview_feedback?.learning_items_added_to_psb}`);
```

---

### 6. update_learnings Operation

Integrates interview learnings into the PSB knowledge base.

**Input Structure:**
```typescript
{
  operation: 'update_learnings',
  feedback_data: InterviewFeedback  // Required
}
```

**Output Structure:**
```typescript
{
  operation_id: string,
  operation: 'update_learnings',
  status: 'success' | 'failed',
  timestamp: string,
  
  interview_feedback?: {
    strengths: string[],  // Deduplicated
    areas_for_improvement: string[],  // Deduplicated
    learning_items_added_to_psb: number
  },
  
  message?: string,
  error?: string
}
```

**Example:**
```typescript
const result = await agent.execute({
  operation: 'update_learnings',
  feedback_data: {
    interview_id: 'google-001',
    interview_date: '2024-09-15',
    company_name: 'Google',
    feedback_notes: 'Strong system design. Communication clear.',
    strengths: ['System Design', 'Communication'],
    areas_for_improvement: ['Time Management']
  }
});

console.log('PSB updated with learnings');
```

---

### 7. get_status Operation

Retrieves current agent status and statistics.

**Input Structure:**
```typescript
{
  operation: 'get_status'
  // No additional parameters needed
}
```

**Output Structure:**
```typescript
{
  operation_id: string,
  operation: 'get_status',
  status: 'success',  // Always succeeds
  timestamp: string,
  message: string  // Contains formatted status info
}
```

**Status Message Format:**
```
Agent Status - Total: X, In Progress: Y, Completed: Z, Mocks: A/B, Avg Readiness: C/100
```

**Example:**
```typescript
const result = await agent.execute({
  operation: 'get_status'
});

console.log(result.message);
// Output: "Agent Status - Total: 5, In Progress: 2, Completed: 3, Mocks: 12/18, Avg Readiness: 72/100"
```

---

### 8. schedule_prep Operation

Creates optimized preparation timeline.

**Input Structure:**
```typescript
{
  operation: 'schedule_prep',
  interview_info: InterviewInfo,  // Required
  prep_intensity?: 'light' | 'moderate' | 'intensive'  // Default: 'moderate'
}
```

**Output Structure:**
```typescript
{
  operation_id: string,
  operation: 'schedule_prep',
  status: 'success' | 'failed',
  timestamp: string,
  
  timeline?: {
    prep_start_date: string (YYYY-MM-DD),
    interview_date: string (YYYY-MM-DD),
    days_remaining: number,
    recommended_daily_prep_minutes: number,
    milestones: Array<{
      date: string (YYYY-MM-DD),
      task: string,
      status: 'pending' | 'in_progress' | 'completed'
    }>
  },
  
  message?: string,
  error?: string
}
```

**Example:**
```typescript
const result = await agent.execute({
  operation: 'schedule_prep',
  interview_info: {
    company_name: 'Amazon',
    job_title: 'SDE III',
    job_description: 'Lead backend systems',
    interview_date: '2024-09-20',
    interview_type: 'system_design',
    difficulty_level: 'senior'
  },
  prep_intensity: 'intensive'
});

result.timeline?.milestones.forEach(milestone => {
  console.log(`${milestone.date}: ${milestone.task}`);
});
```

---

## Data Types

### AgentInput

```typescript
interface AgentInput {
  operation: 'prepare' | 'mock_interview' | 'track_performance' | 
            'get_feedback' | 'update_learnings' | 'get_status' | 'schedule_prep';
  
  interview_info?: {
    id?: string;
    company_name: string;
    job_title: string;
    job_description: string;
    interview_date: string;
    interview_type: 'behavioral' | 'technical' | 'system_design' | 'mock_full';
    difficulty_level: 'junior' | 'mid' | 'senior' | 'staff';
    status?: 'scheduled' | 'in_progress' | 'completed';
  };
  
  prep_intensity?: 'light' | 'moderate' | 'intensive';
  include_mock_interviews?: boolean;
  number_of_mocks?: number;
  collect_feedback?: boolean;
  
  feedback_data?: {
    interview_id: string;
    interview_date: string;
    company_name: string;
    feedback_notes: string;
    strengths: string[];
    areas_for_improvement: string[];
    performance_score?: number;
    passed?: boolean;
  };
}
```

### AgentOutput

```typescript
interface AgentOutput {
  operation_id: string;
  operation: string;
  status: 'success' | 'in_progress' | 'failed';
  timestamp: string;
  
  prep_result?: {
    status: 'ready' | 'in_progress' | 'completed';
    completion_percentage: number;
    readiness_score: number;
  };
  
  prep_materials?: {
    questions_count: number;
    star_stories_matched: number;
    tech_topics_covered: number;
    company_research_items: number;
    prep_guide_path?: string;
    mock_scenarios: number;
    company_profile_path?: string;
  };
  
  mock_interview_results?: {
    scheduled_count: number;
    completed_count: number;
    average_score: number;
    improvement_trend: 'improving' | 'stable' | 'declining';
  };
  
  interview_feedback?: {
    strengths: string[];
    areas_for_improvement: string[];
    learning_items_added_to_psb: number;
  };
  
  timeline?: {
    prep_start_date: string;
    interview_date: string;
    days_remaining: number;
    recommended_daily_prep_minutes: number;
    milestones: Array<{
      date: string;
      task: string;
      status: 'pending' | 'in_progress' | 'completed';
    }>;
  };
  
  resources?: {
    prep_guide_path: string;
    mock_scenarios: number;
    company_profile_path: string;
  };
  
  message?: string;
  error?: string;
}
```

---

## Utility Methods

### getInterviewHistory(): InterviewInfo[]

Returns all tracked interviews.

```typescript
const interviews = agent.getInterviewHistory();
interviews.forEach(interview => {
  console.log(`${interview.company_name} - ${interview.status}`);
});
```

**Returns:** Array of InterviewInfo objects

---

### getOperationLog(operationId?: string): AgentOutput[]

Returns operation log entries.

```typescript
// Get all operations
const allOps = agent.getOperationLog();

// Get specific operation
const op = agent.getOperationLog('op-1693494000000-abc123');
```

**Parameters:**
- `operationId` (optional): Specific operation ID to retrieve

**Returns:** Array of AgentOutput entries

---

### getMockResults(interviewId: string): MockInterviewResult[]

Returns mock interview results for an interview.

```typescript
const mocks = agent.getMockResults('interview-001');
console.log(`Completed: ${mocks.filter(m => m.status === 'completed').length}`);
```

**Parameters:**
- `interviewId` (required): Interview ID

**Returns:** Array of MockInterviewResult objects

---

### getFeedbackHistory(interviewId: string): InterviewFeedback[]

Returns all feedback for an interview.

```typescript
const feedbackList = agent.getFeedbackHistory('interview-001');
feedbackList.forEach(feedback => {
  console.log(`${feedback.interview_date}: Score ${feedback.performance_score}`);
});
```

**Parameters:**
- `interviewId` (required): Interview ID

**Returns:** Array of InterviewFeedback objects

---

## Error Handling

### Error Response Format

All operations return structured error responses:

```typescript
{
  operation_id: string,
  operation: string,
  status: 'failed',
  timestamp: string,
  error: string  // Human-readable error message
}
```

### Common Errors

**Missing Required Fields**
```
Error: interview_info is required for prepare operation
```

**Invalid Interview Type**
```
Error: invalid interview_type
```

**Interview Not Found**
```
Error: No preparation progress found for interview [id]
```

**Invalid Feedback Data**
```
Error: feedback_data is required for get_feedback operation
```

### Error Handling Example

```typescript
const result = await agent.execute({
  operation: 'prepare',
  interview_info: {
    company_name: 'TechCorp',
    // Missing required fields...
  }
});

if (result.status === 'failed') {
  console.error(`Operation failed: ${result.error}`);
  // Handle error appropriately
} else {
  console.log('Success!');
}
```

---

## Examples

### Example 1: Complete Workflow

```typescript
const agent = new PSBInterviewPrepAgent();

// Create interview
const prep = await agent.execute({
  operation: 'prepare',
  interview_info: { /* ... */ }
});

const interviewId = prep.prep_result ? 'interview-' + Date.now() : null;

// Schedule mocks
await agent.execute({
  operation: 'mock_interview',
  interview_info: { id: interviewId, /* ... */ },
  number_of_mocks: 3
});

// Track progress
const progress = await agent.execute({
  operation: 'track_performance',
  interview_info: { id: interviewId }
});

console.log(`Ready: ${progress.prep_result?.readiness_score}%`);
```

### Example 2: Error Handling

```typescript
try {
  const result = await agent.execute({
    operation: 'prepare',
    interview_info: null  // Missing required
  });
  
  if (result.status === 'failed') {
    throw new Error(result.error);
  }
} catch (error) {
  console.error('Preparation failed:', error);
}
```

---

**API Reference Version:** 1.0.0  
**Last Updated:** 2024-08-29
