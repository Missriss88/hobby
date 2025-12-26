// 분석 결과 타입 정의
export interface AnalysisResult {
    // 기본 정보
    partner_name: string;
    my_name: string;

    // 감정 점수
    my_sentiment_score: number;
    partner_sentiment_score: number;
    my_sentiment_desc: string;
    partner_sentiment_desc: string;

    // 관계 변화
    relationship_change: string;

    // 감정 그래프 데이터
    sentiment_graph: SentimentPoint[];

    // 대화 스타일
    communication_style: CommunicationStyle;

    // 주제 및 조언
    topics: string[];
    advice: string;
    summary: string;
    keywords: string[];

    // 고급 분석 (새로 추가)
    advanced_analysis?: AdvancedAnalysis;
}

export interface SentimentPoint {
    time: string;
    me: number;
    partner: number;
}

export interface CommunicationStyle {
    affection: number;
    humor: number;
    trust: number;
    conflict: number;
    frequency: number;
}

// 고급 분석 타입
export interface AdvancedAnalysis {
    // 대화 통계
    statistics: ConversationStatistics;

    // 심층 감정 분석
    deep_emotions: DeepEmotionAnalysis;

    // 대화 패턴
    patterns: ConversationPatterns;

    // 핵심 순간
    key_moments: KeyMoment[];

    // 관계 예측
    relationship_prediction: RelationshipPrediction;

    // 토픽 클러스터
    topic_clusters: TopicCluster[];
}

export interface ConversationStatistics {
    total_messages: number;
    my_messages: number;
    partner_messages: number;
    avg_response_time_minutes: number;
    most_active_hour: number;
    emoji_count: number;
    photo_count: number;
    link_count: number;
    daily_average_messages: number;
}

export interface DeepEmotionAnalysis {
    emotions: {
        joy: number;
        sadness: number;
        anger: number;
        fear: number;
        surprise: number;
        disgust: number;
    };
    emotion_timeline: EmotionTimelinePoint[];
    emotion_triggers: EmotionTrigger[];
}

export interface EmotionTimelinePoint {
    period: string;
    dominant_emotion: string;
    intensity: number;
}

export interface EmotionTrigger {
    emotion: string;
    trigger: string;
    context: string;
}

export interface ConversationPatterns {
    initiative_ratio: number; // 0-100, 내가 대화를 시작하는 비율
    question_ratio: number; // 질문 비율
    empathy_score: number; // 공감 표현 점수
    formality_level: 'formal' | 'informal' | 'mixed';
    response_pattern: 'quick' | 'normal' | 'delayed';
    conversation_depth: 'shallow' | 'moderate' | 'deep';
}

export interface KeyMoment {
    type: 'highlight' | 'conflict' | 'resolution' | 'turning_point';
    period: string;
    description: string;
    impact_score: number; // 1-10
    quote?: string;
}

export interface RelationshipPrediction {
    trend: 'improving' | 'stable' | 'declining';
    confidence: number;
    factors: string[];
    recommendations: string[];
}

export interface TopicCluster {
    name: string;
    frequency: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keywords: string[];
}

// UI 상태 타입
export interface UploadState {
    status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
    progress: number;
    error?: string;
}

export interface AppState {
    currentAnalysis: AnalysisResult | null;
    uploadState: UploadState;
    analysisHistory: AnalysisHistoryItem[];
}

export interface AnalysisHistoryItem {
    id: string;
    date: string;
    partner_name: string;
    summary: string;
    result: AnalysisResult;
}
