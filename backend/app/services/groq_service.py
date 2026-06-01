import os
import json
from groq import AsyncGroq
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = os.getenv("GROQ_FAST_MODEL", "meta-llama/llama-4-maverick-17b-128e-instruct")

# Initialize async client
client = AsyncGroq(api_key=GROQ_API_KEY)

async def analyze_text_to_json(prompt: str, system_prompt: str, response_model: type[BaseModel]) -> BaseModel:
    """
    Calls the Groq API enforcing a JSON schema output corresponding to the passed Pydantic model.
    """
    schema = response_model.model_json_schema()
    
    # We force the LLM to understand the schema by injecting it into the prompt.
    full_system_prompt = f"{system_prompt}\n\nYou must respond ONLY with a valid JSON object matching this JSON schema:\n{json.dumps(schema)}\nDo not include any markdown formatting like ```json."
    
    try:
        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": full_system_prompt},
                {"role": "user", "content": prompt}
            ],
            model=MODEL_NAME,
            temperature=0.1,
            # Groq JSON mode allows specifying response_format
            response_format={"type": "json_object"},
        )
        
        content = response.choices[0].message.content
        return response_model.model_validate_json(content)
    
    except Exception as e:
        print(f"Error calling Groq API: {str(e)}")
        raise e
