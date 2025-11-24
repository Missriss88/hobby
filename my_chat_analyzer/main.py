from fastapi import FastAPI, UploadFile, Request, Header
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

from fastapi import FastAPI, UploadFile, Request, Header
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

app = FastAPI()
# static 폴더가 없으면 생성
if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
async def analyze_with_gemini(text, api_key):
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        너는 카카오톡 대화 분석 전문가야. 제공된 대화 로그를 바탕으로 두 사람의 관계와 감정을 심층 분석해줘.
        
        [분석 요구사항]
        1. 대화 내용에서 두 명의 화자를 식별해. (보통 '[이름] [시간] 메시지' 형식임)
        2. '나'를 식별하려고 노력해봐. (보통 파일 내보내기를 한 사람이 '나'인데, 텍스트만으로는 알기 어려울 수 있어. 
           대화 맥락상 질문을 많이 받거나, 위로를 받거나, 주도하는 쪽을 파악해봐. 식별이 어려우면 첫 번째 화자를 '나'로 가정해.)
        3. 아래 JSON 형식으로 결과를 반환해.

        [JSON 구조]
        {{
            "partner_name": "상대방 이름 (또는 관계, 예: 엄마)",
            "my_name": "나의 이름 (대화에서 추정)",
            "my_sentiment_score": 0~100 (내가 상대방에게 느끼는 호감도/긍정적 감정),
            "partner_sentiment_score": 0~100 (상대방이 나에게 느끼는 호감도/긍정적 감정),
            "my_sentiment_desc": "내가 상대를 어떻게 생각하는지 한 줄 요약",
            "partner_sentiment_desc": "상대가 나를 어떻게 생각하는지 한 줄 요약",
            "relationship_change": "시간 흐름에 따른 관계 변화 서술 (3문장 내외)",
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
            "topics": ["주제1", "주제2", "주제3", "주제4", "주제5"],
            "advice": "이 관계를 더 발전시키기 위한 구체적인 조언 (2-3문장)",
            "summary": "전체 대화 요약 및 총평",
            "keywords": ["키워드1", "키워드2", "키워드3"]
        }}

        [대화 데이터]
        {text}
        
        주의: 
        - 반드시 순수 JSON 문자열만 반환해. (마크다운 ```json 제외)
        - 감정 점수는 대화의 뉘앙스, 이모티콘 사용, 답장 속도(추정), 말투 등을 종합적으로 고려해.
        - communication_style의 각 항목은 0~100 사이의 정수여야 해.
        """
        
        response = await model.generate_content_async(prompt)
        
        # JSON 파싱
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
        
    except Exception as e:
        print(f"AI 분석 에러: {e}")
        return {"error": "AI_ANALYSIS_FAILED", "message": f"분석 중 오류가 발생했습니다: {str(e)}"}