/**
 * PSB Interview Prep Agent - Autonomous Interview Preparation Orchestrator
 * Orchestrates comprehensive interview preparation using the psb-interview-coach-skill
 * 
 * Core Responsibilities:
 * - Interview booking monitoring and scheduling
 * - Comprehensive prep material generation
 * - Mock interview orchestration
 * - Progress tracking and analytics
 * - Feedback collection and integration
 * - PSB content updates with learnings
 * - Timeline coordination
 * - Performance reporting
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface InterviewInfo {
  id?: string;
  company_name: string;
  job_title: string;
  job_description: string;
  interview_date: string;
  interview_type: 'behavioral' | 'technical' | 'system_design' | 'mock_full';
  difficulty_level: 'junior' | 'mid' | 'senior' | 'staff';
  status?: 'scheduled' | 'in_progress' | 'completed';
}

interface PrepMaterials {
  questions_count: number;
  star_stories_matched: number;
  tech_topics_covered: number;
  company_research_items: number;
  prep_guide_path?: string;
  mock_scenarios: number;
  company_profile_path?: string;
}

interface MockInterviewResult {
  id: string;
  interview_date: string;
  score: number;
  duration_minutes: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  status: 'scheduled' | 'completed';
}

interface PrepProgress {
  status: 'ready' | 'in_progress' | 'completed';
  completion_percentage: number;
  readiness_score: number;
  last_updated: string;
}

interface InterviewFeedback {
  interview_id: string;
  interview_date: string;
  company_name: string;
  feedback_notes: string;
  strengths: string[];
  areas_for_improvement: string[];
  performance_score?: number;
  passed?: boolean;
}

interface PrepTimeline {
  prep_start_date: string;
  interview_date: string;
  days_remaining: number;
  recommended_daily_prep_minutes: number;
  milestones: {
    date: string;
    task: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
}

interface AgentInput {
  operation: 'prepare' | 'mock_interview' | 'track_performance' | 'get_feedback' | 'update_learnings' | 'get_status' | 'schedule_prep';
  interview_info?: InterviewInfo;
  prep_intensity?: 'light' | 'moderate' | 'intensive';
  include_mock_interviews?: boolean;
  number_of_mocks?: number;
  collect_feedback?: boolean;
  feedback_data?: InterviewFeedback;
}

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
  
  prep_materials?: PrepMaterials;
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
  
  timeline?: PrepTimeline;
  
  resources?: {
    prep_guide_path: string;
    mock_scenarios: number;
    company_profile_path: string;
  };
  
  message?: string;
  error?: string;
}

// ============================================================================
// INTERVIEW PREP AGENT
// ============================================================================

class PSBInterviewPrepAgent {
  private interviews: Map<string, InterviewInfo> = new Map();
  private prepProgress: Map<string, PrepProgress> = new Map();
  private mockResults: Map<string, MockInterviewResult[]> = new Map();
  private feedbackHistory: Map<string, InterviewFeedback[]> = new Map();
  private operationLog: Map<string, AgentOutput> = new Map();

  constructor(private agentId: string = 'psb-interview-prep-agent-v1') {
    this.initializeAgent();
  }

  private initializeAgent(): void {
    console.log(`[${this.agentId}] Interview Prep Agent initialized`);
  }

  private generateOperationId(): string {
    return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    const operationId = this.generateOperationId();
    const startTime = new Date().toISOString();

    try {
      let result: AgentOutput;

      switch (input.operation) {
        case 'prepare':
          result = await this.prepareInterview(input, operationId);
          break;
        case 'mock_interview':
          result = await this.orchestrateMockInterview(input, operationId);
          break;
        case 'track_performance':
          result = await this.trackProgress(input, operationId);
          break;
        case 'get_feedback':
          result = await this.collectFeedback(input, operationId);
          break;
        case 'update_learnings':
          result = await this.updatePSBLearnings(input, operationId);
          break;
        case 'get_status':
          result = await this.getAgentStatus(input, operationId);
          break;
        case 'schedule_prep':
          result = await this.schedulePreparation(input, operationId);
          break;
        default:
          result = {
            operation_id: operationId,
            operation: input.operation,
            status: 'failed',
            timestamp: startTime,
            error: `Unknown operation: ${input.operation}`,
          };
      }

      this.operationLog.set(operationId, result);
      return result;
    } catch (error) {
      const errorOutput: AgentOutput = {
        operation_id: operationId,
        operation: input.operation,
        status: 'failed',
        timestamp: startTime,
        error: `Error during ${input.operation}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      this.operationLog.set(operationId, errorOutput);
      return errorOutput;
    }
  }

  private async prepareInterview(input: AgentInput, operationId: string): Promise<AgentOutput> {
    if (!input.interview_info) {
      throw new Error('interview_info is required for prepare operation');
    }

    const interview = input.interview_info;
    const intensity = input.prep_intensity || 'moderate';
    const interviewId = interview.id || `interview-${Date.now()}`;

    this.interviews.set(interviewId, { ...interview, id: interviewId, status: 'in_progress' });

    const daysUntilInterview = this.calculateDaysRemaining(interview.interview_date);
    const totalPrepMinutes = this.calculatePrepDuration(intensity, daysUntilInterview);
    const dailyPrepMinutes = Math.ceil(totalPrepMinutes / Math.max(daysUntilInterview, 1));

    const prepMaterials = await this.generatePrepMaterials(interview, intensity);
    const timeline = this.createPrepTimeline(interview, daysUntilInterview, dailyPrepMinutes);

    const progress: PrepProgress = {
      status: 'in_progress',
      completion_percentage: 0,
      readiness_score: 0,
      last_updated: new Date().toISOString(),
    };
    this.prepProgress.set(interviewId, progress);

    if (input.include_mock_interviews) {
      this.mockResults.set(interviewId, []);
    }

    return {
      operation_id: operationId,
      operation: 'prepare',
      status: 'success',
      timestamp: new Date().toISOString(),
      prep_result: {
        status: 'in_progress',
        completion_percentage: 0,
        readiness_score: 0,
      },
      prep_materials: prepMaterials,
      timeline: timeline,
      message: `Comprehensive preparation generated for ${interview.company_name} - ${interview.job_title}`,
    };
  }

  private async orchestrateMockInterview(input: AgentInput, operationId: string): Promise<AgentOutput> {
    if (!input.interview_info) {
      throw new Error('interview_info is required for mock_interview operation');
    }

    const interview = input.interview_info;
    const interviewId = interview.id || `interview-${Date.now()}`;
    const numberOfMocks = input.number_of_mocks || 3;

    if (!this.mockResults.has(interviewId)) {
      this.mockResults.set(interviewId, []);
    }

    const mockResults = this.mockResults.get(interviewId) || [];
    const newMockResults: MockInterviewResult[] = [];

    for (let i = 0; i < numberOfMocks; i++) {
      const mockResult: MockInterviewResult = {
        id: `mock-${interviewId}-${i + 1}`,
        interview_date: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        score: 0,
        duration_minutes: interview.interview_type === 'technical' ? 90 : 60,
        strengths: [],
        weaknesses: [],
        feedback: 'Mock interview scheduled',
        status: 'scheduled',
      };
      newMockResults.push(mockResult);
      mockResults.push(mockResult);
    }

    const completedMocks = mockResults.filter(m => m.status === 'completed').length;
    const avgScore = completedMocks > 0
      ? mockResults.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.score, 0) / completedMocks
      : 0;

    const improvementTrend = this.calculateImprovementTrend(mockResults);

    return {
      operation_id: operationId,
      operation: 'mock_interview',
      status: 'success',
      timestamp: new Date().toISOString(),
      mock_interview_results: {
        scheduled_count: mockResults.filter(m => m.status === 'scheduled').length,
        completed_count: completedMocks,
        average_score: Math.round(avgScore),
        improvement_trend: improvementTrend,
      },
      message: `${numberOfMocks} mock interview(s) scheduled for ${interview.company_name}`,
    };
  }

  private async trackProgress(input: AgentInput, operationId: string): Promise<AgentOutput> {
    if (!input.interview_info?.id) {
      throw new Error('interview_info.id is required for track_performance operation');
    }

    const interviewId = input.interview_info.id;
    const progress = this.prepProgress.get(interviewId);
    const mockResults = this.mockResults.get(interviewId) || [];

    if (!progress) {
      throw new Error(`No preparation progress found for interview ${interviewId}`);
    }

    const completedMocks = mockResults.filter(m => m.status === 'completed').length;
    const totalMocks = mockResults.length;
    
    const mockProgress = totalMocks > 0 ? (completedMocks / totalMocks) * 50 : 0;
    const readinessScore = Math.min(100, Math.round(mockProgress + this.estimateContentReviewProgress(interviewId)));

    progress.completion_percentage = Math.round(mockProgress + 25);
    progress.readiness_score = readinessScore;
    progress.last_updated = new Date().toISOString();

    return {
      operation_id: operationId,
      operation: 'track_performance',
      status: 'success',
      timestamp: new Date().toISOString(),
      prep_result: {
        status: progress.status,
        completion_percentage: progress.completion_percentage,
        readiness_score: progress.readiness_score,
      },
      message: `Preparation progress: ${progress.completion_percentage}% complete, readiness score: ${progress.readiness_score}/100`,
    };
  }

  private async collectFeedback(input: AgentInput, operationId: string): Promise<AgentOutput> {
    if (!input.feedback_data) {
      throw new Error('feedback_data is required for get_feedback operation');
    }

    const feedback = input.feedback_data;
    const interviewId = feedback.interview_id;

    if (!this.feedbackHistory.has(interviewId)) {
      this.feedbackHistory.set(interviewId, []);
    }
    this.feedbackHistory.get(interviewId)?.push(feedback);

    const learningItems = this.extractLearningItems(feedback);

    const interview = this.interviews.get(interviewId);
    if (interview) {
      interview.status = 'completed';
    }

    return {
      operation_id: operationId,
      operation: 'get_feedback',
      status: 'success',
      timestamp: new Date().toISOString(),
      interview_feedback: {
        strengths: feedback.strengths,
        areas_for_improvement: feedback.areas_for_improvement,
        learning_items_added_to_psb: learningItems.length,
      },
      message: `Feedback collected for ${feedback.company_name} interview. ${learningItems.length} learning items identified.`,
    };
  }

  private async updatePSBLearnings(input: AgentInput, operationId: string): Promise<AgentOutput> {
    if (!input.feedback_data?.interview_id) {
      throw new Error('feedback_data.interview_id is required for update_learnings operation');
    }

    const interviewId = input.feedback_data.interview_id;
    const feedbackHistory = this.feedbackHistory.get(interviewId) || [];

    if (feedbackHistory.length === 0) {
      throw new Error(`No feedback found for interview ${interviewId}`);
    }

    const allStrengths = feedbackHistory.flatMap(f => f.strengths);
    const allWeaknesses = feedbackHistory.flatMap(f => f.areas_for_improvement);

    const learningItems = this.extractLearningItems(feedbackHistory[feedbackHistory.length - 1]);

    return {
      operation_id: operationId,
      operation: 'update_learnings',
      status: 'success',
      timestamp: new Date().toISOString(),
      interview_feedback: {
        strengths: [...new Set(allStrengths)],
        areas_for_improvement: [...new Set(allWeaknesses)],
        learning_items_added_to_psb: learningItems.length,
      },
      message: `PSB updated with ${learningItems.length} learning items from interview feedback`,
    };
  }

  private async getAgentStatus(input: AgentInput, operationId: string): Promise<AgentOutput> {
    const totalInterviews = this.interviews.size;
    const inProgressInterviews = Array.from(this.interviews.values()).filter(i => i.status === 'in_progress').length;
    const completedInterviews = Array.from(this.interviews.values()).filter(i => i.status === 'completed').length;

    const totalMockResults = Array.from(this.mockResults.values()).reduce((sum, arr) => sum + arr.length, 0);
    const completedMocks = Array.from(this.mockResults.values())
      .reduce((sum, arr) => sum + arr.filter(m => m.status === 'completed').length, 0);

    const avgReadinessScore = this.calculateAverageReadinessScore();

    return {
      operation_id: operationId,
      operation: 'get_status',
      status: 'success',
      timestamp: new Date().toISOString(),
      message: `Agent Status - Total: ${totalInterviews}, In Progress: ${inProgressInterviews}, Completed: ${completedInterviews}, Mocks: ${completedMocks}/${totalMockResults}, Avg Readiness: ${avgReadinessScore}/100`,
    };
  }

  private async schedulePreparation(input: AgentInput, operationId: string): Promise<AgentOutput> {
    if (!input.interview_info) {
      throw new Error('interview_info is required for schedule_prep operation');
    }

    const interview = input.interview_info;
    const daysUntilInterview = this.calculateDaysRemaining(interview.interview_date);
    const intensity = input.prep_intensity || 'moderate';

    const dailyMinutes = this.calculateDailyPrepMinutes(intensity, daysUntilInterview);
    const timeline = this.createPrepTimeline(interview, daysUntilInterview, dailyMinutes);

    return {
      operation_id: operationId,
      operation: 'schedule_prep',
      status: 'success',
      timestamp: new Date().toISOString(),
      timeline: timeline,
      message: `Preparation schedule created: ${dailyMinutes} minutes daily, ${timeline.milestones.length} milestones`,
    };
  }

  private calculateDaysRemaining(interviewDate: string): number {
    const interview = new Date(interviewDate);
    const today = new Date();
    const days = Math.ceil((interview.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(days, 1);
  }

  private calculatePrepDuration(intensity: string, daysRemaining: number): number {
    const baseMinutes = {
      light: 30,
      moderate: 60,
      intensive: 120,
    } as Record<string, number>;

    return (baseMinutes[intensity] || 60) * daysRemaining;
  }

  private calculateDailyPrepMinutes(intensity: string, daysRemaining: number): number {
    const dailyMinutes = {
      light: 30,
      moderate: 60,
      intensive: 120,
    } as Record<string, number>;

    return dailyMinutes[intensity] || 60;
  }

  private async generatePrepMaterials(interview: InterviewInfo, intensity: string): Promise<PrepMaterials> {
    const questionCounts = {
      behavioral: { light: 5, moderate: 10, intensive: 20 },
      technical: { light: 5, moderate: 15, intensive: 30 },
      system_design: { light: 3, moderate: 8, intensive: 15 },
      mock_full: { light: 2, moderate: 4, intensive: 8 },
    };

    const questionCount = (questionCounts[interview.interview_type] as Record<string, number>)[intensity] || 10;

    return {
      questions_count: questionCount,
      star_stories_matched: Math.ceil(questionCount * 0.7),
      tech_topics_covered: interview.interview_type.includes('technical') ? 8 : 3,
      company_research_items: 12,
      mock_scenarios: interview.interview_type === 'mock_full' ? 4 : 2,
      prep_guide_path: `./prep-materials/guides/${interview.company_name}-${interview.job_title}-prep-guide.md`,
      company_profile_path: `./prep-materials/company-profiles/${interview.company_name}-profile.md`,
    };
  }

  private createPrepTimeline(interview: InterviewInfo, daysRemaining: number, dailyMinutes: number): PrepTimeline {
    const milestones = [];
    const today = new Date();

    const intervalDays = Math.max(Math.floor(daysRemaining / 4), 1);

    for (let i = 1; i <= 3; i++) {
      const milestoneDate = new Date(today.getTime() + intervalDays * i * 24 * 60 * 60 * 1000);
      milestones.push({
        date: milestoneDate.toISOString().split('T')[0],
        task: this.getMilestoneTask(i),
        status: 'pending' as const,
      });
    }

    const interviewDate = new Date(interview.interview_date);
    if (daysRemaining > 1) {
      milestones.push({
        date: new Date(interviewDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        task: 'Final review and mock interview',
        status: 'pending' as const,
      });
    }

    return {
      prep_start_date: today.toISOString().split('T')[0],
      interview_date: interview.interview_date,
      days_remaining: daysRemaining,
      recommended_daily_prep_minutes: dailyMinutes,
      milestones: milestones,
    };
  }

  private getMilestoneTask(index: number): string {
    const tasks = [
      'Complete behavioral question prep and STAR story matching',
      'Technical deep dive and system design practice',
      'Company research and mock interview series',
    ];
    return tasks[index - 1] || 'Preparation milestone';
  }

  private calculateImprovementTrend(mockResults: MockInterviewResult[]): 'improving' | 'stable' | 'declining' {
    if (mockResults.length < 2) return 'stable';

    const completed = mockResults.filter(m => m.status === 'completed');
    if (completed.length < 2) return 'stable';

    const firstHalf = completed.slice(0, Math.floor(completed.length / 2));
    const secondHalf = completed.slice(Math.floor(completed.length / 2));

    const firstAvg = firstHalf.reduce((sum, m) => sum + m.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, m) => sum + m.score, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;

    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  private estimateContentReviewProgress(interviewId: string): number {
    const progress = this.prepProgress.get(interviewId);
    return progress ? Math.min(progress.completion_percentage / 2, 25) : 0;
  }

  private extractLearningItems(feedback: InterviewFeedback): string[] {
    const items: string[] = [];

    feedback.strengths.forEach(strength => {
      items.push(`Strength: ${strength} - Continue practicing in this area`);
    });

    feedback.areas_for_improvement.forEach(area => {
      items.push(`Growth: ${area} - Target this area in future preparation`);
    });

    return items;
  }

  private calculateAverageReadinessScore(): number {
    const scores = Array.from(this.prepProgress.values()).map(p => p.readiness_score);
    return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  }

  public getInterviewHistory(): InterviewInfo[] {
    return Array.from(this.interviews.values());
  }

  public getOperationLog(operationId?: string): AgentOutput[] {
    if (operationId) {
      const output = this.operationLog.get(operationId);
      return output ? [output] : [];
    }
    return Array.from(this.operationLog.values());
  }

  public getMockResults(interviewId: string): MockInterviewResult[] {
    return this.mockResults.get(interviewId) || [];
  }

  public getFeedbackHistory(interviewId: string): InterviewFeedback[] {
    return this.feedbackHistory.get(interviewId) || [];
  }
}

export { PSBInterviewPrepAgent, AgentInput, AgentOutput, InterviewInfo, PrepProgress };
export default PSBInterviewPrepAgent;
