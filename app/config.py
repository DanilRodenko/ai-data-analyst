import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

load_dotenv()

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGSMITH_PROJECT", "ai-data-analyst")
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGSMITH_API_KEY")

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq")

if LLM_PROVIDER == "groq":
    llm = ChatOpenAI(
        model=os.getenv("GROQ_MODEL"),
        api_key=os.getenv("GROQ_API_KEY"),
        base_url="https://api.groq.com/openai/v1"
    )
elif LLM_PROVIDER == "anthropic":
    llm = ChatOpenAI(
        model=os.getenv("ANTHROPIC_MODEL"),
        api_key=os.getenv("ANTHROPIC_API_KEY"),
        base_url="https://api.anthropic.com/v1"
    )
elif LLM_PROVIDER == "openai":
    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL"),
        api_key=os.getenv("OPENAI_API_KEY")
    )


visualizer_llm = ChatAnthropic(
    model=os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6"),
    api_key=os.getenv("ANTHROPIC_API_KEY")
)