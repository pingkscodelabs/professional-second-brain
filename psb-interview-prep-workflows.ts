/**
 * PSB Interview Prep Agent - Workflow Examples
 * Real-world usage patterns and integration examples
 */

import PSBInterviewPrepAgent, { AgentInput, AgentOutput } from './psb-interview-prep-agent';

// ============================================================================
// WORKFLOW 1: Complete Tech Interview Preparation
// ============================================================================

async function workflowTechInterviewPrep() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('WORKFLOW 1: Complete Tech Interview Preparation');
  console.log('═══════════════════════════════════════════════════════════\n');

  const agent = new PSBInterviewPrepAgent('google-tech-prep');

  // Step 1: Schedule Preparation
  console.log('📅 Step 1: Scheduling Preparation Timeline');
  const scheduleResult = await agent.execute({
    operation: 'schedule_prep',
    interview_info: {
      company_name: 'Google',
      job_title: 'Senior Software Engineer',
      job_description: 'Design and build large-scale distributed systems for Google Cloud Platform',
      interview_date: '2024-09-22',
      interview_type: 'system_design',
      difficulty_level: 'senior'
    },
    prep_intensity: 'intensive'
  });

  console.log(`✓ Timeline created with ${scheduleResult.timeline?.milestones.length} milestones`);
  console.log(`  Daily prep: ${scheduleResult.timeline?.recommended_daily_prep_minutes} minutes`);
  scheduleResult.timeline?.milestones.forEach((m, i) => {
    console.log(`  Milestone ${i + 1}: ${m.date} - ${m.task}`);
  });

  // Step 2: Generate Prep Materials
  console.log('\n📚 Step 2: Generating Comprehensive Prep Materials');
  const prepResult = await agent.execute({
    operation: 'prepare',
    interview_info: {
      id: 'google-sde-001',
      company_name: 'Google',
      job_title: 'Senior Software Engineer',
      job_description: 'Design and build large-scale distributed systems for Google Cloud Platform',
      interview_date: '2024-09-22',
      interview_type: 'system_design',
      difficulty_level: 'senior'
    },
    prep_intensity: 'intensive',
    include_mock_interviews: true,
    number_of_mocks: 6
  });

  console.log(`✓ Generated ${prepResult.prep_materials?.questions_count} system design questions`);
  console.log(`✓ Matched ${prepResult.prep_materials?.star_stories_matched} STAR stories`);
  console.log(`✓ Covered ${prepResult.prep_materials?.tech_topics_covered} technology topics`);
  console.log(`✓ Company research items: ${prepResult.prep_materials?.company_research_items}`);

  // Step 3: Schedule Mock Interviews
  console.log('\n🎤 Step 3: Orchestrating Mock Interview Series');
  const mockResult = await agent.execute({
    operation: 'mock_interview',
    interview_info: {
      id: 'google-sde-001',
      company_name: 'Google',
      job_title: 'Senior Software Engineer',
      job_description: 'Design and build large-scale distributed systems for Google Cloud Platform',
      interview_date: '2024-09-22',
      interview_type: 'system_design',
      difficulty_level: 'senior'
    },
    number_of_mocks: 6
  });

  console.log(`✓ Scheduled ${mockResult.mock_interview_results?.scheduled_count} mock interviews`);
  console.log(`  Weekly spacing for progressive challenge`);

  // Step 4: Track Progress (Simulated over time)
  console.log('\n📈 Step 4: Tracking Preparation Progress');
  for (let i = 0; i < 3; i++) {
    const progressResult = await agent.execute({
      operation: 'track_performance',
      interview_info: { id: 'google-sde-001' }
    });
    console.log(`  Week ${i + 1}: ${progressResult.prep_result?.completion_percentage}% - Readiness: ${progressResult.prep_result?.readiness_score}/100`);
  }

  // Step 5: Simulate Interview & Collect Feedback
  console.log('\n💬 Step 5: Collecting Post-Interview Feedback');
  const feedbackResult = await agent.execute({
    operation: 'get_feedback',
    feedback_data: {
      interview_id: 'google-sde-001',
      interview_date: '2024-09-22',
      company_name: 'Google',
      feedback_notes: 'Excellent system design discussion. Strong architectural thinking. Good trade-off analysis.',
      strengths: [
        'System Design Fundamentals',
        'Scalability Thinking',
        'Clear Communication',
        'Trade-off Analysis',
        'Technology Breadth'
      ],
      areas_for_improvement: [
        'Database Sharding Strategies',
        'Cost Optimization'
      ],
      performance_score: 88,
      passed: true
    }
  });

  console.log(`✓ Feedback collected and analyzed`);
  console.log(`✓ Strengths identified: ${feedbackResult.interview_feedback?.strengths.length}`);
  console.log(`✓ Growth areas: ${feedbackResult.interview_feedback?.areas_for_improvement.length}`);

  // Step 6: Update PSB with Learnings
  console.log('\n🧠 Step 6: Integrating Learnings into PSB');
  const learningsResult = await agent.execute({
    operation: 'update_learnings',
    feedback_data: {
      interview_id: 'google-sde-001',
      interview_date: '2024-09-22',
      company_name: 'Google',
      feedback_notes: 'Excellent system design discussion. Strong architectural thinking. Good trade-off analysis.',
      strengths: [
        'System Design Fundamentals',
        'Scalability Thinking',
        'Clear Communication',
        'Trade-off Analysis',
        'Technology Breadth'
      ],
      areas_for_improvement: [
        'Database Sharding Strategies',
        'Cost Optimization'
      ]
    }
  });

  console.log(`✓ PSB updated with ${learningsResult.interview_feedback?.learning_items_added_to_psb} learning items`);
}

// ============================================================================
// WORKFLOW 2: Behavioral Interview Prep (Quick Refresh)
// ============================================================================

async function workflowBehavioralInterviewPrep() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('WORKFLOW 2: Behavioral Interview Prep (Quick Refresh)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const agent = new PSBInterviewPrepAgent('amazon-behavioral');

  console.log('👤 Preparing for Amazon Leadership Interview\n');

  // Quick prep with moderate intensity
  const result = await agent.execute({
    operation: 'prepare',
    interview_info: {
      id: 'amazon-bar-raiser-001',
      company_name: 'Amazon',
      job_title: 'Senior Engineering Manager',
      job_description: 'Lead engineering org, drive culture and performance',
      interview_date: '2024-09-10',
      interview_type: 'behavioral',
      difficulty_level: 'senior'
    },
    prep_intensity: 'moderate',
    include_mock_interviews: true,
    number_of_mocks: 3
  });

  console.log(`✓ Generated ${result.prep_materials?.questions_count} behavioral questions`);
  console.log(`✓ Matched STAR stories: ${result.prep_materials?.star_stories_matched}`);
  console.log(`✓ Timeline: ${result.timeline?.days_remaining} days remaining`);
  console.log(`✓ Daily prep: ${result.timeline?.recommended_daily_prep_minutes} minutes\n`);

  // Key preparation areas
  const prepAreas = result.prep_materials?.star_stories_matched || 0;
  console.log(`Focus areas for ${prepAreas} STAR stories:`);
  console.log('  1. Leadership under pressure');
  console.log('  2. Conflict resolution');
  console.log('  3. Mentoring and development');
  console.log('  4. Customer obsession');
  console.log('  5. Ownership mindset');
}

// ============================================================================
// WORKFLOW 3: Concurrent Interview Management
// ============================================================================

async function workflowConcurrentInterviews() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('WORKFLOW 3: Managing Multiple Concurrent Interviews');
  console.log('═══════════════════════════════════════════════════════════\n');

  const agent = new PSBInterviewPrepAgent('multi-offer-agent');

  const interviews = [
    {
      id: 'google-001',
      company: 'Google',
      role: 'Senior SDE',
      type: 'system_design' as const,
      date: '2024-09-22'
    },
    {
      id: 'amazon-001',
      company: 'Amazon',
      role: 'Sr Manager',
      type: 'behavioral' as const,
      date: '2024-09-10'
    },
    {
      id: 'microsoft-001',
      company: 'Microsoft',
      role: 'Principal Architect',
      type: 'technical' as const,
      date: '2024-09-15'
    }
  ];

  console.log(`Managing ${interviews.length} concurrent interviews:\n`);

  // Prepare for all interviews
  for (const interview of interviews) {
    console.log(`📍 ${interview.company} - ${interview.role}`);
    
    const result = await agent.execute({
      operation: 'prepare',
      interview_info: {
        id: interview.id,
        company_name: interview.company,
        job_title: interview.role,
        job_description: `Detailed role description for ${interview.role}`,
        interview_date: interview.date,
        interview_type: interview.type,
        difficulty_level: 'senior'
      },
      prep_intensity: 'moderate'
    });

    console.log(`   ✓ ${result.prep_materials?.questions_count} questions generated`);
    console.log(`   ✓ Timeline: ${result.timeline?.days_remaining} days\n`);
  }

  // Get overall agent status
  console.log('Overall Agent Status:');
  const status = await agent.execute({
    operation: 'get_status'
  });
  console.log(`${status.message}\n`);

  // Show interview history
  console.log('Interview History:');
  const history = agent.getInterviewHistory();
  history.forEach((interview, i) => {
    console.log(`  ${i + 1}. ${interview.company_name} - ${interview.job_title} (${interview.status})`);
  });
}

// ============================================================================
// WORKFLOW 4: Mock Interview Series with Feedback Loop
// ============================================================================

async function workflowMockInterviewSeries() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('WORKFLOW 4: Mock Interview Series with Feedback Integration');
  console.log('═══════════════════════════════════════════════════════════\n');

  const agent = new PSBInterviewPrepAgent('mock-series-agent');
  const interviewId = 'mock-series-001';

  // Setup
  console.log('🎯 Setting up mock interview series for Facebook Engineering\n');

  await agent.execute({
    operation: 'prepare',
    interview_info: {
      id: interviewId,
      company_name: 'Meta (Facebook)',
      job_title: 'Engineering Manager',
      job_description: 'Lead core infrastructure team',
      interview_date: '2024-09-30',
      interview_type: 'technical',
      difficulty_level: 'senior'
    },
    prep_intensity: 'intensive'
  });

  // Schedule mocks
  const mockSchedule = await agent.execute({
    operation: 'mock_interview',
    interview_info: {
      id: interviewId,
      company_name: 'Meta (Facebook)',
      job_title: 'Engineering Manager',
      job_description: 'Lead core infrastructure team',
      interview_date: '2024-09-30',
      interview_type: 'technical',
      difficulty_level: 'senior'
    },
    number_of_mocks: 4
  });

  console.log(`🎤 Mock Interview Series: ${mockSchedule.mock_interview_results?.scheduled_count} sessions scheduled\n`);

  // Simulate progression through mock series
  console.log('Simulating Mock Interview Series Progress:\n');
  
  const mockProgression = [
    { week: 1, score: 65, feedback: 'Good start. Need more depth in architecture.' },
    { week: 2, score: 72, feedback: 'Improving. Better trade-off discussions.' },
    { week: 3, score: 78, feedback: 'Strong. Minor gaps in cost analysis.' },
    { week: 4, score: 85, feedback: 'Excellent. Ready for real interview.' }
  ];

  for (const mock of mockProgression) {
    console.log(`Mock ${mock.week}: Score ${mock.score}/100`);
    console.log(`  Feedback: ${mock.feedback}`);
    
    // Track progress
    const progress = await agent.execute({
      operation: 'track_performance',
      interview_info: { id: interviewId }
    });
    
    console.log(`  Readiness: ${progress.prep_result?.readiness_score}/100\n`);
  }

  // Final feedback collection
  console.log('💬 Final Feedback from Real Interview:\n');
  const finalFeedback = await agent.execute({
    operation: 'get_feedback',
    feedback_data: {
      interview_id: interviewId,
      interview_date: '2024-09-30',
      company_name: 'Meta (Facebook)',
      feedback_notes: 'Excellent technical depth and leadership perspective. Strong on system thinking.',
      strengths: [
        'Technical Architecture',
        'System Design',
        'Leadership Communication',
        'Problem Decomposition'
      ],
      areas_for_improvement: [
        'Cost Optimization Details'
      ],
      performance_score: 87,
      passed: true
    }
  });

  console.log(`✓ Interview Result: PASSED (87/100)`);
  console.log(`✓ Learning items: ${finalFeedback.interview_feedback?.learning_items_added_to_psb}`);
}

// ============================================================================
// WORKFLOW 5: Quick Technical Interview Brush-up
// ============================================================================

async function workflowQuickTechBrushup() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('WORKFLOW 5: Quick Technical Interview Brush-up');
  console.log('═══════════════════════════════════════════════════════════\n');

  const agent = new PSBInterviewPrepAgent('quick-tech-prep');

  console.log('⚡ Light preparation for mid-level technical interview\n');

  const result = await agent.execute({
    operation: 'prepare',
    interview_info: {
      id: 'stripe-backend-001',
      company_name: 'Stripe',
      job_title: 'Software Engineer II',
      job_description: 'Backend system development',
      interview_date: '2024-09-08',
      interview_type: 'technical',
      difficulty_level: 'mid'
    },
    prep_intensity: 'light'
  });

  console.log(`Timeline: ${result.timeline?.days_remaining} days until interview`);
  console.log(`Daily prep: ${result.timeline?.recommended_daily_prep_minutes} minutes\n`);

  // Show prep materials
  const materials = result.prep_materials;
  console.log('Prep Materials:');
  console.log(`  • ${materials?.questions_count} technical questions`);
  console.log(`  • ${materials?.star_stories_matched} relevant STAR stories`);
  console.log(`  • ${materials?.tech_topics_covered} technology topics`);
  console.log(`  • ${materials?.company_research_items} company research items\n`);

  // Quick schedule
  console.log('Suggested Schedule:');
  console.log(`  Day 1-2: Review ${Math.ceil((materials?.questions_count || 5) / 2)} questions`);
  console.log(`  Day 3: Prepare STAR stories (${materials?.star_stories_matched || 3})`);
  console.log(`  Day 4: Light mock interview`);
}

// ============================================================================
// WORKFLOW 6: Executive Leadership Interview Prep
// ============================================================================

async function workflowExecutiveInterviewPrep() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('WORKFLOW 6: Executive Leadership Interview Prep');
  console.log('═══════════════════════════════════════════════════════════\n');

  const agent = new PSBInterviewPrepAgent('exec-prep-agent');

  console.log('👔 Preparing for VP Engineering role at Fortune 500\n');

  // Intensive behavioral focus
  const behavioralPrep = await agent.execute({
    operation: 'prepare',
    interview_info: {
      id: 'executive-001',
      company_name: 'Fortune 500 Tech',
      job_title: 'VP of Engineering',
      job_description: 'Lead engineering org, drive technical vision',
      interview_date: '2024-10-05',
      interview_type: 'behavioral',
      difficulty_level: 'senior'
    },
    prep_intensity: 'intensive',
    include_mock_interviews: true,
    number_of_mocks: 5
  });

  console.log('Leadership Competency Focus Areas:\n');
  
  const focusAreas = [
    'Strategic Vision & Roadmapping',
    'Organizational Leadership',
    'Stakeholder Management',
    'P&L Responsibility',
    'Culture Building',
    'Executive Communication'
  ];

  focusAreas.forEach((area, i) => {
    console.log(`${i + 1}. ${area}`);
  });

  console.log(`\nPrep Plan:`);
  console.log(`  • ${behavioralPrep.prep_materials?.questions_count} leadership questions`);
  console.log(`  • ${behavioralPrep.prep_materials?.star_stories_matched} STAR stories aligned`);
  console.log(`  • ${behavioralPrep.timeline?.milestones.length} preparation milestones`);
  console.log(`  • ${behavioralPrep.timeline?.recommended_daily_prep_minutes} minutes daily prep`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runAllWorkflows() {
  console.log('\n');
  console.log('████████████████████████████████████████████████████████');
  console.log('█                                                        █');
  console.log('█  PSB Interview Prep Agent - Workflow Examples         █');
  console.log('█  Demonstrating real-world usage patterns              █');
  console.log('█                                                        █');
  console.log('████████████████████████████████████████████████████████');

  try {
    // Run workflows
    await workflowTechInterviewPrep();
    await workflowBehavioralInterviewPrep();
    await workflowConcurrentInterviews();
    await workflowMockInterviewSeries();
    await workflowQuickTechBrushup();
    await workflowExecutiveInterviewPrep();

    console.log('\n');
    console.log('████████████████████████████████████████████████████████');
    console.log('█  ✓ All workflows completed successfully!             █');
    console.log('████████████████████████████████████████████████████████');
    console.log('\n');
  } catch (error) {
    console.error('Error running workflows:', error);
  }
}

// Export functions for testing
export {
  workflowTechInterviewPrep,
  workflowBehavioralInterviewPrep,
  workflowConcurrentInterviews,
  workflowMockInterviewSeries,
  workflowQuickTechBrushup,
  workflowExecutiveInterviewPrep,
  runAllWorkflows
};

// Run if executed directly
if (require.main === module) {
  runAllWorkflows().catch(console.error);
}
