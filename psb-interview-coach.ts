/**
 * PSB Interview Coach - Main Extension File
 * Comprehensive interview preparation system for technical and behavioral interviews
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface InterviewPrepInput {
  interviewType: 'behavioral' | 'technical' | 'system_design' | 'mock_full';
  companyName?: string;
  jobDescription?: string;
  topicFocus?: string[];
  difficultyLevel?: 'junior' | 'mid' | 'senior' | 'staff';
  generateFeedback?: boolean;
}

interface InterviewQuestion {
  id: string;
  question: string;
  suggestedAnswerFramework: string;
  relatedAchievements: { achievement: string; filePath: string }[];
  keyTalkingPoints: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
  followUpQuestions?: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  skills: string[];
  impact: string;
  filePath: string;
  starContext: STARStory;
}

interface STARStory {
  situation: string;
  task: string;
  action: string;
  result: string;
  metrics?: string[];
}

interface CompanyContext {
  companyName: string;
  techStack: string[];
  suggestedFocusAreas: string[];
  preparationChecklist: string[];
  recentNews?: string[];
  teamStructure?: string[];
}

interface MockInterviewScenario {
  id: string;
  questionText: string;
  expectedDuration: number;
  followUpQuestions: string[];
  scoringCriteria: string[];
}

interface InterviewPrepOutput {
  interviewPrep: {
    type: string;
    questions: InterviewQuestion[];
    companyContext?: CompanyContext;
    mockInterview?: {
      scenarioCount: number;
      estimatedDuration: number;
      readinessScore: number;
    };
  };
  coachingFeedback?: {
    strengths: string[];
    areasForImprovement: string[];
    recommendedPractice: string[];
  };
  resources: {
    relatedProjects: string[];
    relatedAchievements: Achievement[];
    technologyReferences: string[];
  };
}

interface QuestionGenerationInput {
  questionType: 'behavioral' | 'technical' | 'system_design' | 'company_research';
  count?: number;
  topics?: string[];
  difficultyLevel?: 'junior' | 'mid' | 'senior' | 'staff';
}

interface MockInterviewInput {
  duration?: number;
  interviewType?: 'behavioral' | 'technical' | 'system_design' | 'mixed';
  interviewerStyle?: 'friendly' | 'challenging' | 'realistic';
  focusAreas?: string[];
}

interface STARMatchingInput {
  scenario: string;
  topCount?: number;
}

// ============================================================================
// BEHAVIORAL QUESTION GENERATOR
// ============================================================================

class BehavioralQuestionGenerator {
  private questions: Map<string, InterviewQuestion> = new Map();

  constructor() {
    this.initializeQuestions();
  }

  private initializeQuestions(): void {
    const behavioralQuestions = [
      {
        id: 'leadership-conflict',
        question: 'Tell me about a time when you had to lead a team through a conflict or disagreement.',
        framework: 'STAR: Describe the situation, your role as leader, the conflict, how you handled it, and the resolution',
        talkingPoints: ['Active listening', 'Empathy', 'Decision-making under pressure', 'Team alignment', 'Resolution outcome'],
      },
      {
        id: 'failure-learning',
        question: 'Describe a significant professional failure and what you learned from it.',
        framework: 'STAR: Explain what went wrong, why, your response, and how you applied those lessons',
        talkingPoints: ['Accountability', 'Problem-solving', 'Growth mindset', 'Specific improvements', 'Application of lessons'],
      },
      {
        id: 'stakeholder-management',
        question: 'How have you managed competing priorities from multiple stakeholders?',
        framework: 'STAR: Describe stakeholders, their needs, your strategy, and outcomes',
        talkingPoints: ['Communication', 'Prioritization', 'Negotiation', 'Stakeholder alignment', 'Successful delivery'],
      },
      {
        id: 'innovation-initiative',
        question: 'Tell me about a time when you initiated a new process or improvement.',
        framework: 'STAR: Describe the problem identified, your proposal, implementation, and impact',
        talkingPoints: ['Problem identification', 'Creative thinking', 'Project execution', 'Team buy-in', 'Measurable results'],
      },
      {
        id: 'difficult-colleague',
        question: 'How have you dealt with a difficult colleague or team member?',
        framework: 'STAR: Describe the situation, challenges, your approach, and resolution',
        talkingPoints: ['Empathy', 'Professional communication', 'Conflict resolution', 'Relationship building', 'Positive outcome'],
      },
      {
        id: 'pressure-deadline',
        question: 'Tell me about a time you had to deliver results under tight deadlines.',
        framework: 'STAR: Describe the project, deadline pressure, your strategy, and delivery',
        talkingPoints: ['Time management', 'Prioritization', 'Quality focus', 'Team coordination', 'Successful delivery'],
      },
      {
        id: 'cross-team-collaboration',
        question: 'Describe your experience working with cross-functional teams.',
        framework: 'STAR: Describe teams involved, your role, collaboration approach, and outcomes',
        talkingPoints: ['Communication', 'Empathy', 'Problem-solving', 'Compromise', 'Shared success'],
      },
      {
        id: 'feedback-criticism',
        question: 'How do you handle constructive criticism or negative feedback?',
        framework: 'STAR: Share a specific example of feedback received, your reaction, and how you responded',
        talkingPoints: ['Openness', 'Self-awareness', 'Growth mindset', 'Specific improvements', 'Results achieved'],
      },
    ];

    behavioralQuestions.forEach((q) => {
      this.questions.set(q.id, {
        id: q.id,
        question: q.question,
        suggestedAnswerFramework: q.framework,
        relatedAchievements: [],
        keyTalkingPoints: q.talkingPoints,
        confidenceLevel: 'medium',
      });
    });
  }

  generate(count: number = 10, topics?: string[], difficultyLevel?: string): InterviewQuestion[] {
    const result: InterviewQuestion[] = [];
    const questionIds = Array.from(this.questions.keys());

    const count_to_return = Math.min(count, questionIds.length);
    for (let i = 0; i < count_to_return; i++) {
      const id = questionIds[i];
      const question = this.questions.get(id);
      if (question) {
        result.push({ ...question });
      }
    }

    return result;
  }
}

// ============================================================================
// TECHNICAL QUESTION GENERATOR
// ============================================================================

class TechnicalQuestionGenerator {
  private questions: Map<string, InterviewQuestion> = new Map();
  private techTopics: Map<string, string[]> = new Map();

  constructor() {
    this.initializeQuestions();
    this.initializeTechTopics();
  }

  private initializeQuestions(): void {
    const technicalQuestions = [
      {
        id: 'system-design-intro',
        question: 'Design a system that can handle 1 million requests per second with low latency.',
        framework: 'Break down: Requirements → High-level design → Database schema → Scaling strategy → Trade-offs',
        talkingPoints: ['Load balancing', 'Database optimization', 'Caching strategies', 'Monitoring', 'Fault tolerance'],
      },
      {
        id: 'database-optimization',
        question: 'How would you optimize a slow database query that\'s impacting user experience?',
        framework: 'Analyze: Profile → Identify bottleneck → Propose solutions → Evaluate trade-offs',
        talkingPoints: ['Query optimization', 'Indexing', 'Denormalization', 'Caching', 'Monitoring'],
      },
      {
        id: 'microservices-architecture',
        question: 'Explain the advantages and disadvantages of microservices architecture.',
        framework: 'Discuss: Definition → Benefits → Challenges → When to use → Real-world examples',
        talkingPoints: ['Scalability', 'Resilience', 'Complexity', 'Testing', 'Deployment'],
      },
      {
        id: 'api-design',
        question: 'Design a RESTful API for an e-commerce platform.',
        framework: 'Structure: Requirements → Endpoints → Request/Response models → Error handling → Security',
        talkingPoints: ['REST principles', 'HTTP methods', 'Status codes', 'Pagination', 'Authentication'],
      },
      {
        id: 'testing-strategy',
        question: 'How do you approach testing a critical production system?',
        framework: 'Approach: Requirements → Unit tests → Integration tests → E2E tests → Performance tests',
        talkingPoints: ['Test coverage', 'Test pyramid', 'Continuous integration', 'Production readiness', 'Monitoring'],
      },
    ];

    technicalQuestions.forEach((q) => {
      this.questions.set(q.id, {
        id: q.id,
        question: q.question,
        suggestedAnswerFramework: q.framework,
        relatedAchievements: [],
        keyTalkingPoints: q.talkingPoints,
        confidenceLevel: 'medium',
      });
    });
  }

  private initializeTechTopics(): void {
    this.techTopics.set('cloud', ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker']);
    this.techTopics.set('backend', ['Node.js', 'Python', 'Java', 'Go', 'Rust']);
    this.techTopics.set('frontend', ['React', 'Vue', 'Angular', 'TypeScript', 'CSS']);
    this.techTopics.set('database', ['SQL', 'NoSQL', 'PostgreSQL', 'MongoDB', 'Redis']);
  }

  generate(count: number = 10, topics?: string[], difficultyLevel?: string): InterviewQuestion[] {
    const result: InterviewQuestion[] = [];
    const questionIds = Array.from(this.questions.keys());

    const count_to_return = Math.min(count, questionIds.length);
    for (let i = 0; i < count_to_return; i++) {
      const id = questionIds[i];
      const question = this.questions.get(id);
      if (question) {
        result.push({ ...question });
      }
    }

    return result;
  }
}

// ============================================================================
// SYSTEM DESIGN QUESTION GENERATOR
// ============================================================================

class SystemDesignQuestionGenerator {
  private questions: Map<string, InterviewQuestion> = new Map();

  constructor() {
    this.initializeQuestions();
  }

  private initializeQuestions(): void {
    const systemDesignQuestions = [
      {
        id: 'design-twitter',
        question: 'Design a social media feed system like Twitter.',
        framework: 'Approach: Requirements → High-level design → Database schema → Scaling → Optimization',
        talkingPoints: ['Real-time updates', 'Distributed systems', 'Data consistency', 'Performance', 'Cost efficiency'],
      },
      {
        id: 'design-video-streaming',
        question: 'How would you design a video streaming service like YouTube?',
        framework: 'Consider: Encoding → Storage → CDN → Playback → Recommendations',
        talkingPoints: ['Video encoding', 'Distributed storage', 'CDN networks', 'Bandwidth optimization', 'Scalability'],
      },
      {
        id: 'design-url-shortener',
        question: 'Design a URL shortening service.',
        framework: 'Plan: Requirements → Encoding → Storage → Retrieval → Scaling',
        talkingPoints: ['Hash functions', 'Database design', 'Collision handling', 'Analytics', 'Scale considerations'],
      },
      {
        id: 'design-search-engine',
        question: 'Design a search engine backend.',
        framework: 'Approach: Crawling → Indexing → Ranking → Query processing → Results',
        talkingPoints: ['Web crawling', 'Indexing strategies', 'Ranking algorithms', 'Performance', 'Fault tolerance'],
      },
    ];

    systemDesignQuestions.forEach((q) => {
      this.questions.set(q.id, {
        id: q.id,
        question: q.question,
        suggestedAnswerFramework: q.framework,
        relatedAchievements: [],
        keyTalkingPoints: q.talkingPoints,
        confidenceLevel: 'low',
      });
    });
  }

  generate(count: number = 5, topics?: string[], difficultyLevel?: string): InterviewQuestion[] {
    const result: InterviewQuestion[] = [];
    const questionIds = Array.from(this.questions.keys());

    const count_to_return = Math.min(count, questionIds.length);
    for (let i = 0; i < count_to_return; i++) {
      const id = questionIds[i];
      const question = this.questions.get(id);
      if (question) {
        result.push({ ...question });
      }
    }

    return result;
  }
}

// ============================================================================
// COMPANY RESEARCH GENERATOR
// ============================================================================

class CompanyResearchGenerator {
  generateContextForCompany(companyName: string, jobDescription?: string): CompanyContext {
    const techStackMap: Map<string, string[]> = new Map([
      ['Google', ['Go', 'Python', 'C++', 'Kubernetes', 'BigTable', 'MapReduce']],
      ['Amazon', ['Java', 'Python', 'AWS', 'DynamoDB', 'S3', 'Microservices']],
      ['Meta', ['Python', 'Hack', 'React', 'Cassandra', 'Memcached', 'High-scale systems']],
      ['Microsoft', ['C#', 'C++', 'Azure', 'SQL Server', '.NET', 'Cloud services']],
      ['Apple', ['Swift', 'Objective-C', 'C++', 'iOS', 'macOS', 'Hardware integration']],
    ]);

    const focusAreasMap: Map<string, string[]> = new Map([
      ['Google', ['Search', 'Ad systems', 'ML/AI', 'Distributed systems', 'Scale']],
      ['Amazon', ['E-commerce', 'AWS services', 'Customer obsession', 'Operations', 'Innovation']],
      ['Meta', ['Social networking', 'Recommendations', 'Ads', 'Real-time systems', 'User growth']],
      ['Microsoft', ['Cloud', 'Enterprise software', 'Azure', 'Productivity', 'Security']],
      ['Apple', ['User experience', 'Quality', 'Security', 'Privacy', 'Integration']],
    ]);

    return {
      companyName,
      techStack: techStackMap.get(companyName) || [],
      suggestedFocusAreas: focusAreasMap.get(companyName) || [],
      preparationChecklist: [
        'Research company values and mission',
        'Understand product offerings',
        'Review recent news and announcements',
        'Study team structure and org chart',
        'Prepare company-specific examples from your experience',
        'Research technical stack and architecture patterns',
        'Understand business model and metrics',
      ],
      recentNews: [
        `Learn about ${companyName}'s recent product launches`,
        `Understand ${companyName}'s current business priorities`,
        `Research ${companyName}'s competitive landscape`,
      ],
    };
  }
}

// ============================================================================
// STAR STORY MATCHER
// ============================================================================

class STARStoryMatcher {
  private achievements: Achievement[] = [];

  constructor() {
    this.initializeAchievements();
  }

  private initializeAchievements(): void {
    // Initialize with sample achievements - in production, these would come from documented experience
    this.achievements = [
      {
        id: 'achievement-1',
        title: 'Led team through technical migration',
        description: 'Led migration of legacy system to microservices',
        skills: ['leadership', 'technical planning', 'communication'],
        impact: 'Reduced system latency by 60%, improved team velocity by 40%',
        filePath: 'experience/technical-migration.md',
        starContext: {
          situation: 'Legacy monolithic system causing performance issues and slowing down development',
          task: 'Lead the architectural migration to microservices with minimal disruption',
          action: 'Created detailed migration plan, led architecture discussions, mentored team through implementation',
          result: 'Successfully migrated 15 services with zero downtime, reduced latency by 60%',
          metrics: ['60% latency reduction', '40% velocity improvement', '0 downtime'],
        },
      },
      {
        id: 'achievement-2',
        title: 'Resolved critical production incident',
        description: 'Diagnosed and fixed database performance issue affecting users',
        skills: ['problem-solving', 'debugging', 'decision-making'],
        impact: 'Restored service within 2 hours, prevented customer churn',
        filePath: 'experience/incident-resolution.md',
        starContext: {
          situation: 'Production database queries suddenly became slow, affecting 10000+ users',
          task: 'Quickly identify and resolve the issue to minimize user impact',
          action: 'Analyzed query logs, identified missing index, implemented fix with proper testing',
          result: 'Resolved issue within 2 hours, restored normal performance',
          metrics: ['2 hour resolution', '0 data loss', '10000+ users unaffected'],
        },
      },
      {
        id: 'achievement-3',
        title: 'Built high-performing team',
        description: 'Hired and developed team that shipped major features',
        skills: ['recruitment', 'mentoring', 'team building'],
        impact: 'Team doubled velocity, zero turnover, 3 promotions in one year',
        filePath: 'experience/team-building.md',
        starContext: {
          situation: 'Team was understaffed and lacked diverse skill sets',
          task: 'Build a high-performing team to tackle ambitious roadmap',
          action: 'Hired senior engineers, created mentorship program, established team standards',
          result: 'Grew team from 3 to 6 engineers, doubled feature output',
          metrics: ['2x velocity', '0% turnover', '3 promotions'],
        },
      },
    ];
  }

  matchToScenario(scenario: string, topCount: number = 5): Achievement[] {
    // Simple keyword matching - in production, would use ML/semantic search
    const keywords = scenario.toLowerCase().split(/\s+/);
    
    const scored = this.achievements.map((achievement) => {
      const titleMatch = keywords.filter((kw) =>
        achievement.title.toLowerCase().includes(kw) || 
        achievement.description.toLowerCase().includes(kw)
      ).length;
      
      const skillMatch = keywords.filter((kw) =>
        achievement.skills.some((skill) => skill.includes(kw))
      ).length;
      
      const score = titleMatch * 2 + skillMatch;
      return { achievement, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topCount)
      .map((s) => s.achievement);
  }

  addAchievement(achievement: Achievement): void {
    this.achievements.push(achievement);
  }
}

// ============================================================================
// MOCK INTERVIEW ORCHESTRATOR
// ============================================================================

class MockInterviewOrchestrator {
  private scenarios: MockInterviewScenario[] = [];
  private currentScenarioIndex: number = 0;

  constructor() {
    this.initializeScenarios();
  }

  private initializeScenarios(): void {
    this.scenarios = [
      {
        id: 'scenario-1',
        questionText: 'Tell me about a project you\'re most proud of and why.',
        expectedDuration: 5,
        followUpQuestions: [
          'What challenges did you face?',
          'How did you overcome them?',
          'What would you do differently?',
        ],
        scoringCriteria: [
          'Clear communication of impact',
          'Technical depth',
          'Personal growth demonstrated',
          'Enthusiasm and passion',
        ],
      },
      {
        id: 'scenario-2',
        questionText: 'How do you approach learning new technologies?',
        expectedDuration: 4,
        followUpQuestions: [
          'Can you give me a recent example?',
          'How do you stay current with technology trends?',
        ],
        scoringCriteria: [
          'Growth mindset',
          'Practical approach',
          'Continuous learning habit',
        ],
      },
      {
        id: 'scenario-3',
        questionText: 'Describe a time you made a mistake. What did you learn?',
        expectedDuration: 5,
        followUpQuestions: [
          'How did you handle it?',
          'Did it affect users or the team?',
          'What changes did you make?',
        ],
        scoringCriteria: [
          'Accountability',
          'Learning from failure',
          'Specific improvements made',
        ],
      },
    ];
  }

  startMockInterview(duration: number = 60, interviewType?: string): { scenarios: MockInterviewScenario[]; estimatedDuration: number } {
    const scenarioDuration = this.scenarios.reduce((sum, s) => sum + s.expectedDuration, 0);
    const scenarioCount = Math.floor(duration / 10);

    return {
      scenarios: this.scenarios.slice(0, scenarioCount),
      estimatedDuration: Math.min(duration, scenarioDuration),
    };
  }

  getCurrentScenario(): MockInterviewScenario | null {
    if (this.currentScenarioIndex < this.scenarios.length) {
      return this.scenarios[this.currentScenarioIndex];
    }
    return null;
  }

  nextScenario(): void {
    this.currentScenarioIndex++;
  }

  reset(): void {
    this.currentScenarioIndex = 0;
  }
}

// ============================================================================
// COACHING FEEDBACK GENERATOR
// ============================================================================

class CoachingFeedbackGenerator {
  generateFeedback(
    interviewType: string,
    questionsAnswered: number,
    totalQuestions: number,
    areasOfConcern: string[]
  ): { strengths: string[]; areasForImprovement: string[]; recommendedPractice: string[] } {
    const completionRate = questionsAnswered / totalQuestions;
    
    return {
      strengths: [
        'Good structure in responses using STAR framework',
        'Clear articulation of technical concepts',
        'Ability to provide specific examples from experience',
        completionRate > 0.8 ? 'High preparation level demonstrated' : '',
      ].filter((s) => s),
      
      areasForImprovement: [
        ...areasOfConcern,
        completionRate < 0.8 ? 'Focus on preparing more complete answers' : '',
        interviewType === 'system_design' ? 'Consider more edge cases in your design' : '',
      ].filter((s) => s),
      
      recommendedPractice: [
        'Practice mock interviews with a peer',
        'Record yourself answering questions and review',
        'Research more about the specific company and role',
        'Work on improving response time management',
        'Study recent case studies in your area of expertise',
      ],
    };
  }
}

// ============================================================================
// MAIN INTERVIEW COACH CLASS
// ============================================================================

class PSBInterviewCoach {
  private behavioralGenerator: BehavioralQuestionGenerator;
  private technicalGenerator: TechnicalQuestionGenerator;
  private systemDesignGenerator: SystemDesignQuestionGenerator;
  private companyResearcher: CompanyResearchGenerator;
  private starMatcher: STARStoryMatcher;
  private mockInterviewOrchestrator: MockInterviewOrchestrator;
  private feedbackGenerator: CoachingFeedbackGenerator;

  constructor() {
    this.behavioralGenerator = new BehavioralQuestionGenerator();
    this.technicalGenerator = new TechnicalQuestionGenerator();
    this.systemDesignGenerator = new SystemDesignQuestionGenerator();
    this.companyResearcher = new CompanyResearchGenerator();
    this.starMatcher = new STARStoryMatcher();
    this.mockInterviewOrchestrator = new MockInterviewOrchestrator();
    this.feedbackGenerator = new CoachingFeedbackGenerator();
  }

  async prepareInterview(input: InterviewPrepInput): Promise<InterviewPrepOutput> {
    try {
      let questions: InterviewQuestion[] = [];

      // Generate questions based on interview type
      switch (input.interviewType) {
        case 'behavioral':
          questions = this.behavioralGenerator.generate(10, input.topicFocus, input.difficultyLevel);
          break;
        case 'technical':
          questions = this.technicalGenerator.generate(10, input.topicFocus, input.difficultyLevel);
          break;
        case 'system_design':
          questions = this.systemDesignGenerator.generate(5, input.topicFocus, input.difficultyLevel);
          break;
        case 'mock_full':
          questions = [
            ...this.behavioralGenerator.generate(5, input.topicFocus, input.difficultyLevel),
            ...this.technicalGenerator.generate(5, input.topicFocus, input.difficultyLevel),
          ];
          break;
      }

      // Match STAR stories to questions
      for (const question of questions) {
        const relatedAchievements = this.starMatcher.matchToScenario(question.question, 3);
        question.relatedAchievements = relatedAchievements.map((a) => ({
          achievement: a.title,
          filePath: a.filePath,
        }));
      }

      // Generate company context if provided
      let companyContext: CompanyContext | undefined;
      if (input.companyName) {
        companyContext = this.companyResearcher.generateContextForCompany(
          input.companyName,
          input.jobDescription
        );
      }

      // Generate mock interview info
      const mockInterview = input.interviewType === 'mock_full' 
        ? {
            scenarioCount: 5,
            estimatedDuration: 60,
            readinessScore: Math.floor(Math.random() * 100),
          }
        : undefined;

      // Generate coaching feedback if requested
      let coachingFeedback: { strengths: string[]; areasForImprovement: string[]; recommendedPractice: string[] } | undefined;
      if (input.generateFeedback) {
        coachingFeedback = this.feedbackGenerator.generateFeedback(
          input.interviewType,
          questions.length,
          questions.length,
          input.topicFocus || []
        );
      }

      return {
        interviewPrep: {
          type: input.interviewType,
          questions,
          companyContext,
          mockInterview,
        },
        coachingFeedback,
        resources: {
          relatedProjects: ['Project 1', 'Project 2'],
          relatedAchievements: this.starMatcher['achievements'],
          technologyReferences: ['React', 'Node.js', 'PostgreSQL'],
        },
      };
    } catch (error) {
      throw new Error(`Failed to prepare interview: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async generateQuestions(input: QuestionGenerationInput): Promise<InterviewQuestion[]> {
    try {
      switch (input.questionType) {
        case 'behavioral':
          return this.behavioralGenerator.generate(input.count || 10, input.topics, input.difficultyLevel);
        case 'technical':
          return this.technicalGenerator.generate(input.count || 10, input.topics, input.difficultyLevel);
        case 'system_design':
          return this.systemDesignGenerator.generate(input.count || 5, input.topics, input.difficultyLevel);
        case 'company_research':
          // This would generate company-specific questions
          return this.behavioralGenerator.generate(input.count || 5, input.topics, input.difficultyLevel);
        default:
          return [];
      }
    } catch (error) {
      throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async startMockInterview(input: MockInterviewInput): Promise<{ scenarios: MockInterviewScenario[]; estimatedDuration: number }> {
    try {
      return this.mockInterviewOrchestrator.startMockInterview(
        input.duration || 60,
        input.interviewType || 'mixed'
      );
    } catch (error) {
      throw new Error(`Failed to start mock interview: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async matchSTARStories(input: STARMatchingInput): Promise<Achievement[]> {
    try {
      return this.starMatcher.matchToScenario(input.scenario, input.topCount || 5);
    } catch (error) {
      throw new Error(`Failed to match STAR stories: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { PSBInterviewCoach, InterviewPrepInput, InterviewPrepOutput, InterviewQuestion, Achievement };
export type { STARStory, CompanyContext, MockInterviewScenario };
