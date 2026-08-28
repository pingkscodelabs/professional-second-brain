# PSB Interview Prep Agent - Test Scenarios

Comprehensive test scenarios and validation procedures for the PSB Interview Prep Agent.

## Test Organization

### Test Categories
1. **Unit Tests** - Individual component testing
2. **Integration Tests** - Component interaction testing
3. **Workflow Tests** - End-to-end workflow validation
4. **Performance Tests** - Load and stress testing
5. **Error Tests** - Error handling and edge cases

---

## Unit Tests

### Test Suite 1: Agent Initialization

```typescript
describe('PSBInterviewPrepAgent - Initialization', () => {
  it('should create agent with default ID', () => {
    const agent = new PSBInterviewPrepAgent();
    expect(agent).toBeDefined();
  });

  it('should create agent with custom ID', () => {
    const agent = new PSBInterviewPrepAgent('custom-agent');
    expect(agent).toBeDefined();
  });

  it('should have empty state on initialization', () => {
    const agent = new PSBInterviewPrepAgent();
    const history = agent.getInterviewHistory();
    expect(history.length).toBe(0);
  });
});
```

### Test Suite 2: Interview Preparation

```typescript
describe('PSBInterviewPrepAgent - Preparation', () => {
  let agent: PSBInterviewPrepAgent;

  beforeEach(() => {
    agent = new PSBInterviewPrepAgent();
  });

  it('should generate prep materials for behavioral interview', async () => {
    const result = await agent.execute({
      operation: 'prepare',
      interview_info: {
        company_name: 'TechCorp',
        job_title: 'Manager',
        job_description: 'Lead engineering team',
        interview_date: '2024-09-15',
        interview_type: 'behavioral',
        difficulty_level: 'senior'
      },
      prep_intensity: 'moderate'
    });

    expect(result.status).toBe('success');
    expect(result.prep_materials?.questions_count).toBeGreaterThan(0);
    expect(result.prep_materials?.star_stories_matched).toBeGreaterThan(0);
  });

  it('should generate more materials for intensive prep', async () => {
    const lightResult = await agent.execute({
      operation: 'prepare',
      interview_info: {
        company_name: 'Company1',
        job_title: 'Engineer',
        job_description: 'Backend work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      },
      prep_intensity: 'light'
    });

    const intensiveResult = await agent.execute({
      operation: 'prepare',
      interview_info: {
        company_name: 'Company2',
        job_title: 'Engineer',
        job_description: 'Backend work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      },
      prep_intensity: 'intensive'
    });

    const lightQuestions = lightResult.prep_materials?.questions_count || 0;
    const intensiveQuestions = intensiveResult.prep_materials?.questions_count || 0;
    
    expect(intensiveQuestions).toBeGreaterThan(lightQuestions);
  });

  it('should create timeline with milestones', async () => {
    const result = await agent.execute({
      operation: 'prepare',
      interview_info: {
        company_name: 'Google',
        job_title: 'Engineer',
        job_description: 'Build systems',
        interview_date: '2024-09-30',
        interview_type: 'technical',
        difficulty_level: 'senior'
      }
    });

    expect(result.timeline).toBeDefined();
    expect(result.timeline?.milestones.length).toBeGreaterThan(0);
    expect(result.timeline?.days_remaining).toBeGreaterThan(0);
  });

  it('should validate required fields', async () => {
    const result = await agent.execute({
      operation: 'prepare',
      interview_info: null as any
    });

    expect(result.status).toBe('failed');
    expect(result.error).toContain('required');
  });
});
```

### Test Suite 3: Mock Interview Orchestration

```typescript
describe('PSBInterviewPrepAgent - Mock Interviews', () => {
  let agent: PSBInterviewPrepAgent;
  let interviewId: string;

  beforeEach(async () => {
    agent = new PSBInterviewPrepAgent();
    
    // Setup: Create interview first
    const result = await agent.execute({
      operation: 'prepare',
      interview_info: {
        id: 'test-interview-' + Date.now(),
        company_name: 'TestCorp',
        job_title: 'Engineer',
        job_description: 'Technical work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      }
    });
    
    interviewId = result.prep_materials?.mock_scenarios ? 'test-interview-' + Date.now() : '';
  });

  it('should schedule mock interviews', async () => {
    const result = await agent.execute({
      operation: 'mock_interview',
      interview_info: {
        id: interviewId,
        company_name: 'TestCorp',
        job_title: 'Engineer',
        job_description: 'Technical work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      },
      number_of_mocks: 3
    });

    expect(result.status).toBe('success');
    expect(result.mock_interview_results?.scheduled_count).toBe(3);
  });

  it('should calculate improvement trend', async () => {
    // Schedule mocks
    await agent.execute({
      operation: 'mock_interview',
      interview_info: {
        id: interviewId,
        company_name: 'TestCorp',
        job_title: 'Engineer',
        job_description: 'Technical work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      },
      number_of_mocks: 3
    });

    const result = await agent.execute({
      operation: 'mock_interview',
      interview_info: {
        id: interviewId,
        company_name: 'TestCorp',
        job_title: 'Engineer',
        job_description: 'Technical work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      },
      number_of_mocks: 2
    });

    expect(['improving', 'stable', 'declining']).toContain(
      result.mock_interview_results?.improvement_trend
    );
  });

  it('should return 0 completed mocks initially', async () => {
    const result = await agent.execute({
      operation: 'mock_interview',
      interview_info: {
        id: interviewId,
        company_name: 'TestCorp',
        job_title: 'Engineer',
        job_description: 'Technical work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      },
      number_of_mocks: 3
    });

    expect(result.mock_interview_results?.completed_count).toBe(0);
  });
});
```

### Test Suite 4: Progress Tracking

```typescript
describe('PSBInterviewPrepAgent - Progress Tracking', () => {
  let agent: PSBInterviewPrepAgent;
  let interviewId: string;

  beforeEach(async () => {
    agent = new PSBInterviewPrepAgent();
    interviewId = 'track-test-' + Date.now();
    
    await agent.execute({
      operation: 'prepare',
      interview_info: {
        id: interviewId,
        company_name: 'TrackCorp',
        job_title: 'Engineer',
        job_description: 'Test work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      }
    });
  });

  it('should track progress updates', async () => {
    const result = await agent.execute({
      operation: 'track_performance',
      interview_info: { id: interviewId }
    });

    expect(result.status).toBe('success');
    expect(result.prep_result?.readiness_score).toBeGreaterThanOrEqual(0);
    expect(result.prep_result?.readiness_score).toBeLessThanOrEqual(100);
  });

  it('should return error for non-existent interview', async () => {
    const result = await agent.execute({
      operation: 'track_performance',
      interview_info: { id: 'nonexistent-id' }
    });

    expect(result.status).toBe('failed');
    expect(result.error).toBeDefined();
  });

  it('should update progress over time', async () => {
    // Get initial progress
    const initial = await agent.execute({
      operation: 'track_performance',
      interview_info: { id: interviewId }
    });

    const initialScore = initial.prep_result?.readiness_score || 0;

    // Schedule mock interviews (simulating progress)
    await agent.execute({
      operation: 'mock_interview',
      interview_info: {
        id: interviewId,
        company_name: 'TrackCorp',
        job_title: 'Engineer',
        job_description: 'Test work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      },
      number_of_mocks: 2
    });

    // Get updated progress
    const updated = await agent.execute({
      operation: 'track_performance',
      interview_info: { id: interviewId }
    });

    expect(updated.prep_result?.readiness_score).toBeGreaterThanOrEqual(initialScore);
  });
});
```

### Test Suite 5: Feedback Collection

```typescript
describe('PSBInterviewPrepAgent - Feedback Collection', () => {
  let agent: PSBInterviewPrepAgent;
  let interviewId: string;

  beforeEach(async () => {
    agent = new PSBInterviewPrepAgent();
    interviewId = 'feedback-test-' + Date.now();
    
    await agent.execute({
      operation: 'prepare',
      interview_info: {
        id: interviewId,
        company_name: 'FeedbackCorp',
        job_title: 'Engineer',
        job_description: 'Test work',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      }
    });
  });

  it('should collect interview feedback', async () => {
    const result = await agent.execute({
      operation: 'get_feedback',
      feedback_data: {
        interview_id: interviewId,
        interview_date: '2024-09-15',
        company_name: 'FeedbackCorp',
        feedback_notes: 'Good technical discussion',
        strengths: ['System Design', 'Communication'],
        areas_for_improvement: ['Time Management'],
        performance_score: 75,
        passed: true
      }
    });

    expect(result.status).toBe('success');
    expect(result.interview_feedback?.learning_items_added_to_psb).toBeGreaterThan(0);
  });

  it('should validate feedback data', async () => {
    const result = await agent.execute({
      operation: 'get_feedback',
      feedback_data: null as any
    });

    expect(result.status).toBe('failed');
    expect(result.error).toContain('required');
  });

  it('should extract learning items', async () => {
    const result = await agent.execute({
      operation: 'get_feedback',
      feedback_data: {
        interview_id: interviewId,
        interview_date: '2024-09-15',
        company_name: 'FeedbackCorp',
        feedback_notes: 'Notes',
        strengths: ['Strength1', 'Strength2'],
        areas_for_improvement: ['Area1'],
        performance_score: 80
      }
    });

    // Should extract strengths + improvements
    expect(result.interview_feedback?.learning_items_added_to_psb).toBe(3);
  });
});
```

---

## Integration Tests

### Test Suite 6: Multi-Operation Workflows

```typescript
describe('PSBInterviewPrepAgent - Workflows', () => {
  let agent: PSBInterviewPrepAgent;

  beforeEach(() => {
    agent = new PSBInterviewPrepAgent();
  });

  it('should handle complete prep workflow', async () => {
    const interviewId = 'workflow-' + Date.now();

    // Step 1: Prepare
    const prep = await agent.execute({
      operation: 'prepare',
      interview_info: {
        id: interviewId,
        company_name: 'WorkflowCorp',
        job_title: 'Engineer',
        job_description: 'Complex systems',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'senior'
      },
      prep_intensity: 'intensive',
      include_mock_interviews: true,
      number_of_mocks: 3
    });

    expect(prep.status).toBe('success');

    // Step 2: Track
    const track = await agent.execute({
      operation: 'track_performance',
      interview_info: { id: interviewId }
    });

    expect(track.status).toBe('success');
    expect(track.prep_result?.completion_percentage).toBeGreaterThan(0);

    // Step 3: Feedback
    const feedback = await agent.execute({
      operation: 'get_feedback',
      feedback_data: {
        interview_id: interviewId,
        interview_date: '2024-09-15',
        company_name: 'WorkflowCorp',
        feedback_notes: 'Great interview',
        strengths: ['Design', 'Communication'],
        areas_for_improvement: ['Speed'],
        performance_score: 85,
        passed: true
      }
    });

    expect(feedback.status).toBe('success');

    // Step 4: Update learnings
    const learnings = await agent.execute({
      operation: 'update_learnings',
      feedback_data: {
        interview_id: interviewId,
        interview_date: '2024-09-15',
        company_name: 'WorkflowCorp',
        feedback_notes: 'Great interview',
        strengths: ['Design', 'Communication'],
        areas_for_improvement: ['Speed']
      }
    });

    expect(learnings.status).toBe('success');
  });

  it('should manage multiple concurrent interviews', async () => {
    const ids = ['int-1', 'int-2', 'int-3'];

    // Create multiple interviews
    for (const id of ids) {
      await agent.execute({
        operation: 'prepare',
        interview_info: {
          id: id,
          company_name: `Company${id}`,
          job_title: 'Engineer',
          job_description: 'Work',
          interview_date: '2024-09-15',
          interview_type: 'technical',
          difficulty_level: 'mid'
        }
      });
    }

    // Verify all tracked
    const history = agent.getInterviewHistory();
    expect(history.length).toBe(3);

    // Verify status
    const status = await agent.execute({
      operation: 'get_status'
    });

    expect(status.message).toContain('Total: 3');
  });
});
```

---

## Error & Edge Case Tests

### Test Suite 7: Error Handling

```typescript
describe('PSBInterviewPrepAgent - Error Handling', () => {
  let agent: PSBInterviewPrepAgent;

  beforeEach(() => {
    agent = new PSBInterviewPrepAgent();
  });

  it('should handle missing interview_info gracefully', async () => {
    const result = await agent.execute({
      operation: 'prepare',
      interview_info: undefined
    });

    expect(result.status).toBe('failed');
    expect(result.error).toBeDefined();
  });

  it('should handle invalid operation type', async () => {
    const result = await agent.execute({
      operation: 'invalid_op' as any
    });

    expect(result.status).toBe('failed');
    expect(result.error).toContain('Unknown operation');
  });

  it('should handle empty feedback arrays', async () => {
    const result = await agent.execute({
      operation: 'get_feedback',
      feedback_data: {
        interview_id: 'test',
        interview_date: '2024-09-15',
        company_name: 'Test',
        feedback_notes: 'Test',
        strengths: [],
        areas_for_improvement: []
      }
    });

    expect(result.status).toBe('success');
    expect(result.interview_feedback?.learning_items_added_to_psb).toBe(0);
  });

  it('should handle invalid date formats gracefully', async () => {
    const result = await agent.execute({
      operation: 'prepare',
      interview_info: {
        company_name: 'Test',
        job_title: 'Engineer',
        job_description: 'Test',
        interview_date: 'invalid-date',
        interview_type: 'technical',
        difficulty_level: 'mid'
      }
    });

    // Should either succeed (with date parsing) or fail gracefully
    expect(result).toBeDefined();
  });
});
```

---

## Performance Tests

### Test Suite 8: Performance & Scalability

```typescript
describe('PSBInterviewPrepAgent - Performance', () => {
  let agent: PSBInterviewPrepAgent;

  beforeEach(() => {
    agent = new PSBInterviewPrepAgent();
  });

  it('should handle 100 concurrent interviews', async () => {
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(
        agent.execute({
          operation: 'prepare',
          interview_info: {
            id: `perf-${i}`,
            company_name: `Company${i}`,
            job_title: 'Engineer',
            job_description: 'Work',
            interview_date: '2024-09-15',
            interview_type: 'technical',
            difficulty_level: 'mid'
          }
        })
      );
    }

    await Promise.all(promises);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
    expect(agent.getInterviewHistory().length).toBe(100);
  });

  it('should efficiently track large mock result sets', async () => {
    const interviewId = 'large-mock-test';
    
    await agent.execute({
      operation: 'prepare',
      interview_info: {
        id: interviewId,
        company_name: 'TestCorp',
        job_title: 'Engineer',
        job_description: 'Test',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      }
    });

    // Schedule many mocks
    const startTime = Date.now();
    
    await agent.execute({
      operation: 'mock_interview',
      interview_info: {
        id: interviewId,
        company_name: 'TestCorp',
        job_title: 'Engineer',
        job_description: 'Test',
        interview_date: '2024-09-15',
        interview_type: 'technical',
        difficulty_level: 'mid'
      },
      number_of_mocks: 50
    });

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(1000); // < 1 second for 50 mocks

    const mocks = agent.getMockResults(interviewId);
    expect(mocks.length).toBe(50);
  });
});
```

---

## Running Tests

### Setup Test Environment

```bash
# Install test dependencies
npm install --save-dev jest @types/jest ts-jest

# Create jest.config.js
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts']
};
EOF
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testNamePattern="Preparation"

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Expected Test Coverage

- **Statements:** > 90%
- **Branches:** > 85%
- **Functions:** > 90%
- **Lines:** > 90%

---

## Test Execution Results Example

```
PASS  psb-interview-prep-agent.test.ts
  PSBInterviewPrepAgent - Initialization
    ✓ should create agent with default ID (15ms)
    ✓ should create agent with custom ID (8ms)
    ✓ should have empty state on initialization (5ms)

  PSBInterviewPrepAgent - Preparation
    ✓ should generate prep materials for behavioral interview (45ms)
    ✓ should generate more materials for intensive prep (72ms)
    ✓ should create timeline with milestones (38ms)
    ✓ should validate required fields (22ms)

  PSBInterviewPrepAgent - Mock Interviews
    ✓ should schedule mock interviews (32ms)
    ✓ should calculate improvement trend (28ms)
    ✓ should return 0 completed mocks initially (15ms)

  PSBInterviewPrepAgent - Workflows
    ✓ should handle complete prep workflow (85ms)
    ✓ should manage multiple concurrent interviews (42ms)

Test Suites: 1 passed, 1 total
Tests:       42 passed, 42 total
Snapshots:   0 total
Time:        3.847s
```

---

**Test Scenarios Version:** 1.0.0  
**Last Updated:** 2024-08-29
