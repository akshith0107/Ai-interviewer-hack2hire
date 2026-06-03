import os
import json
from groq import AsyncGroq
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
def get_fast_model() -> str:
    return os.getenv("GROQ_FAST_MODEL", "openai/gpt-oss-20b")

def get_evaluation_model() -> str:
    return os.getenv("GROQ_EVALUATION_MODEL", "openai/gpt-oss-120b")

# Initialize async client
client = AsyncGroq(api_key=GROQ_API_KEY)

async def analyze_text_to_json(prompt: str, system_prompt: str, response_model: type[BaseModel], model_name: str = None) -> BaseModel:
    """
    Calls the Groq API enforcing a JSON schema output corresponding to the passed Pydantic model.
    """
    schema = response_model.model_json_schema()
    
    # We force the LLM to understand the schema by injecting it into the prompt.
    full_system_prompt = f"{system_prompt}\n\nYou must respond ONLY with a valid JSON object matching this JSON schema:\n{json.dumps(schema)}\nDo not include any markdown formatting like ```json."
    
    
    target_model = model_name or get_fast_model()
    
    try:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = await client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": full_system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    model=target_model,
                    temperature=0.1,
                    response_format={"type": "json_object"},
                )
                
                content = response.choices[0].message.content
                if not content:
                    raise ValueError("Empty response received from LLM")
                    
                return response_model.model_validate_json(content)
            
            except Exception as e:
                print(f"Error calling Groq API with model {target_model} (attempt {attempt + 1}): {str(e)}")
                if attempt == max_retries - 1:
                    raise e
                    
    except Exception as e:
        # Fallback mechanism: If Eval model fails, try Fast model
        if target_model != get_fast_model():
            print(f"Attempting fallback to fast model: {get_fast_model()}")
            try:
                fallback_response = await client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": full_system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    model=get_fast_model(),
                    temperature=0.1,
                    response_format={"type": "json_object"},
                )
                
                content = fallback_response.choices[0].message.content
                if not content:
                    raise ValueError("Empty fallback response received from LLM")
                    
                return response_model.model_validate_json(content)
            except Exception as fallback_err:
                print(f"Fallback to fast model also failed: {str(fallback_err)}")
                raise fallback_err
        else:
            raise e
