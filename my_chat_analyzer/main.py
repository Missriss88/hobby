from fastapi import FastAPI, UploadFile, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

app = FastAPI(title="카카오톡 대화 분석기 Pro API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# static 폴더가 없으면 생성
if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# API 키 가져오기
API_KEY = os.getenv("GEMINI_API_KEY", "")


async def analyze_with_gemini(text: str, advanced: bool = False) -> dict:
    """Gemini AI를 사용하여 대화 분석 수행 (다중 모델 Fallback 지원)"""
    genai.configure(api_key=API_KEY)
    
    # 사용자가 요청한 최신 모델부터 순차적으로 시도
    # 실제 존재하는지 여부와 관계없이 순차적으로 시도하여 성공하는 모델을 사용
    candidate_models = [
        'gemini-3-pro',       # 사용자 요청 (최우선)
        'gemini-2.5-pro',     # 사용자 요청
        'gemini-2.5-flash',   # 사용자 요청
        'gemini-1.5-pro',     # 최신 고성능
        'gemini-1.5-flash',   # 최신 경량
        'gemini-pro',         # 안정적 (최후의 보루)
    ]

    if advanced:
        prompt = create_advanced_prompt(text)
    else:
        prompt = create_basic_prompt(text)

    last_error = None

    for model_name in candidate_models:
        try:
            print(f"Attempting analysis with model: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = await model.generate_content_async(prompt)
            
            # 응답이 비어있거나 에러인 경우 체크
            if not response.text:
                raise Exception("Empty response from AI")

            # JSON 파싱
            clean_json = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_json)
            
            print(f"Analysis success with model: {model_name}")
            return result
            
        except Exception as e:
            # 404 Not Found 등 모든 에러에 대해 다음 모델 시도
            print(f"Model {model_name} failed: {str(e)}")
            last_error = e
            continue
    
    # 모든 모델 실패 시
    print("All models failed.")
    return {"error": "AI_ANALYSIS_FAILED", "message": f"모든 AI 모델 분석에 실패했습니다. 마지막 오류: {str(last_error)}"}


def create_basic_prompt(text: str) -> str:
    """기본 분석 프롬프트 생성"""
    return f"""
    너는 카카오톡 대화 분석 전문가야. 제공된 대화 로그를 바탕으로 두 사람의 관계와 감정을 심층 분석해줘.
    
    [분석 요구사항]
    1. 대화 내용에서 두 명의 화자를 식별해. (보통 '[이름] [시간] 메시지' 형식임)
    2. '나'를 식별하려고 노력해봐. (대화 맥락상 질문을 많이 받거나, 주도하는 쪽을 파악해봐)
    3. 아래 JSON 형식으로 결과를 반환해.

    [JSON 구조]
    {{
        "partner_name": "상대방 이름",
        "my_name": "나의 이름",
        "my_sentiment_score": 0~100,
        "partner_sentiment_score": 0~100,
        "my_sentiment_desc": "내가 상대를 어떻게 생각하는지 한 줄 요약",
        "partner_sentiment_desc": "상대가 나를 어떻게 생각하는지 한 줄 요약",
        "relationship_change": "시간 흐름에 따른 관계 변화 서술",
        "sentiment_graph": [
            {{ "time": "초반", "me": 0, "partner": 0 }},
            {{ "time": "초반-중반", "me": 0, "partner": 0 }},
            {{ "time": "중반", "me": 0, "partner": 0 }},
            {{ "time": "중반-후반", "me": 0, "partner": 0 }},
            {{ "time": "후반", "me": 0, "partner": 0 }}
        ],
        "communication_style": {{
            "affection": 0,
            "humor": 0,
            "trust": 0,
            "conflict": 0,
            "frequency": 0
        }},
        "topics": ["주제1", "주제2", "주제3"],
        "advice": "관계 발전 조언",
        "summary": "전체 대화 요약",
        "keywords": ["키워드1", "키워드2", "키워드3"]
    }}

    [대화 데이터]
    {text}
    
    주의: 반드시 순수 JSON 문자열만 반환해.
    """


def create_advanced_prompt(text: str) -> str:
    """고급 분석 프롬프트 생성"""
    return f"""
    너는 카카오톡 대화 분석 전문가야. 제공된 대화 로그를 바탕으로 두 사람의 관계와 감정을 **심층 분석**해줘.
    
    [분석 요구사항]
    1. 대화 내용에서 화자들을 식별해 (보통 '[이름] [시간] 메시지' 형식)
    2. '나'와 '상대방'을 구분해
    3. 아래 JSON 형식으로 **상세한** 결과를 반환해

    [JSON 구조 - 상세 분석]
    {{
        "partner_name": "상대방 이름",
        "my_name": "나의 이름",
        "my_sentiment_score": 0~100,
        "partner_sentiment_score": 0~100,
        "my_sentiment_desc": "내가 상대를 어떻게 생각하는지 2-3문장 분석",
        "partner_sentiment_desc": "상대가 나를 어떻게 생각하는지 2-3문장 분석",
        "relationship_change": "시간 흐름에 따른 관계 변화 상세 서술 (3-4문장)",
        "sentiment_graph": [
            {{ "time": "초반", "me": 0~100, "partner": 0~100 }},
            {{ "time": "초반-중반", "me": 0~100, "partner": 0~100 }},
            {{ "time": "중반", "me": 0~100, "partner": 0~100 }},
            {{ "time": "중반-후반", "me": 0~100, "partner": 0~100 }},
            {{ "time": "후반", "me": 0~100, "partner": 0~100 }}
        ],
        "communication_style": {{
            "affection": 0~100,
            "humor": 0~100,
            "trust": 0~100,
            "conflict": 0~100,
            "frequency": 0~100
        }},
        "topics": ["주제1", "주제2", "주제3", "주제4", "주제5"],
        "advice": "관계 발전을 위한 구체적인 조언 (3-4문장)",
        "summary": "전체 대화의 핵심을 요약 (3-4문장)",
        "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
        
        "advanced_analysis": {{
            "statistics": {{
                "total_messages": 0,
                "my_messages": 0,
                "partner_messages": 0,
                "avg_response_time_minutes": 0,
                "most_active_hour": 0,
                "emoji_count": 0,
                "photo_count": 0,
                "link_count": 0,
                "daily_average_messages": 0.0
            }},
            "deep_emotions": {{
                "emotions": {{
                    "joy": 0~100,
                    "sadness": 0~100,
                    "anger": 0~100,
                    "fear": 0~100,
                    "surprise": 0~100,
                    "disgust": 0~100
                }},
                "emotion_timeline": [
                    {{ "period": "초반", "dominant_emotion": "감정명", "intensity": 0~100 }},
                    {{ "period": "중반", "dominant_emotion": "감정명", "intensity": 0~100 }},
                    {{ "period": "후반", "dominant_emotion": "감정명", "intensity": 0~100 }}
                ],
                "emotion_triggers": [
                    {{ "emotion": "감정명", "trigger": "원인", "context": "맥락 설명" }}
                ]
            }},
            "patterns": {{
                "initiative_ratio": 0~100,
                "question_ratio": 0~100,
                "empathy_score": 0~100,
                "formality_level": "formal|informal|mixed",
                "response_pattern": "quick|normal|delayed",
                "conversation_depth": "shallow|moderate|deep"
            }},
            "key_moments": [
                {{
                    "type": "highlight|conflict|resolution|turning_point",
                    "period": "시점 설명",
                    "description": "이 순간이 중요한 이유",
                    "impact_score": 1~10,
                    "quote": "대표적인 대화 인용 (선택적)"
                }}
            ],
            "relationship_prediction": {{
                "trend": "improving|stable|declining",
                "confidence": 0~100,
                "factors": ["근거1", "근거2"],
                "recommendations": ["추천1", "추천2"]
            }},
            "topic_clusters": [
                {{
                    "name": "주제 클러스터명",
                    "frequency": 0~100,
                    "sentiment": "positive|neutral|negative",
                    "keywords": ["관련 키워드들"]
                }}
            ]
        }}
    }}

    [대화 데이터]
    {text}
    
    [중요 지침]
    - 반드시 순수 JSON 문자열만 반환 (마크다운 코드블록 제외)
    - 통계는 대화 내용을 기반으로 최대한 정확하게 추정
    - key_moments는 최소 2개, 최대 5개의 중요 순간을 선별
    - 모든 점수는 대화의 실제 뉘앙스를 반영해야 함
    - 감정 분석은 이모티콘, 말투, 문맥을 종합적으로 고려
    """


@app.get("/")
async def home(request: Request):
    """홈페이지 렌더링 (기존 템플릿용)"""
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/analyze")
async def analyze_chat(file: UploadFile):
    """기본 대화 분석 API"""
    try:
        content = await file.read()
        text = content.decode("utf-8")
        
        if len(text.strip()) < 100:
            return JSONResponse(
                status_code=400,
                content={"error": "INSUFFICIENT_DATA", "message": "대화 내용이 너무 짧습니다."}
            )
        
        result = await analyze_with_gemini(text, advanced=False)
        
        if "error" in result:
            return JSONResponse(status_code=500, content=result)
        
        return result
        
    except UnicodeDecodeError:
        return JSONResponse(
            status_code=400,
            content={"error": "ENCODING_ERROR", "message": "파일 인코딩을 확인해주세요. UTF-8 형식이어야 합니다."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "UNKNOWN_ERROR", "message": str(e)}
        )


@app.post("/analyze/advanced")
async def analyze_chat_advanced(file: UploadFile):
    """고급 대화 분석 API (심층 분석 포함)"""
    try:
        content = await file.read()
        text = content.decode("utf-8")
        
        if len(text.strip()) < 100:
            return JSONResponse(
                status_code=400,
                content={"error": "INSUFFICIENT_DATA", "message": "대화 내용이 너무 짧습니다."}
            )
        
        result = await analyze_with_gemini(text, advanced=True)
        
        if "error" in result:
            return JSONResponse(status_code=500, content=result)
        
        return result
        
    except UnicodeDecodeError:
        return JSONResponse(
            status_code=400,
            content={"error": "ENCODING_ERROR", "message": "파일 인코딩을 확인해주세요. UTF-8 형식이어야 합니다."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "UNKNOWN_ERROR", "message": str(e)}
        )


@app.post("/validate")
async def validate_chat_file(file: UploadFile):
    """대화 파일 유효성 검사 API"""
    try:
        content = await file.read()
        text = content.decode("utf-8")
        
        lines = text.strip().split("\n")
        message_count = len([l for l in lines if l.strip()])
        
        if message_count < 10:
            return {
                "valid": False,
                "error": "대화 내용이 너무 적습니다. 최소 10줄 이상의 대화가 필요합니다."
            }
        
        return {
            "valid": True,
            "message_count": message_count
        }
        
    except UnicodeDecodeError:
        return {
            "valid": False,
            "error": "파일 인코딩을 확인해주세요. UTF-8 형식이어야 합니다."
        }
    except Exception as e:
        return {
            "valid": False,
            "error": str(e)
        }


@app.get("/health")
async def health_check():
    """서버 상태 확인"""
    return {"status": "healthy", "api_configured": bool(API_KEY)}