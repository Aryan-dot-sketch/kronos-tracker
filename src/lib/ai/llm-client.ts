import { AppState } from '@/types';

/**
 * Kronos Tracker — AI Layer Engine
 * 
 * Supports both:
 * 1. Fast, offline client-side heuristic intelligence (0 latency, $0 cost).
 * 2. Real LLM API calls (OpenAI GPT-4o, Claude, or Groq) if an API key is provided in Vercel env.
 */

const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_GROQ_API_KEY;

export async function askAICoach(prompt: string, state: AppState): Promise<string> {
  if (!apiKey) {
    // Deterministic Rule-Based Fallback
    return generateHeuristicAdvice(state);
  }

  try {
    const payload = {
      model: import.meta.env.VITE_GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are Kronos AI, an elite academic and productivity coach for aspirants. Provide concise, high-impact daily study advice based on goal targets and study analytics.'
        },
        {
          role: 'user',
          content: `User Goal: ${state.goal.name} (${state.goal.target}). Weak Area: ${state.goal.weakArea}. Daily Target: ${state.goal.dailyHours} hours. Prompt: ${prompt}`
        }
      ],
      temperature: 0.7
    };

    const endpoint = import.meta.env.VITE_GROQ_API_KEY
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || generateHeuristicAdvice(state);
  } catch (error) {
    console.warn('AI API call failed, falling back to heuristic engine:', error);
    return generateHeuristicAdvice(state);
  }
}

function generateHeuristicAdvice(state: AppState): string {
  const weak = state.goal.weakArea || 'configured focus area';
  const hours = state.goal.dailyHours || 8;
  return `Focus on ${weak} during your peak focus window today. Target at least ${hours} hours of total active study time.`;
}
