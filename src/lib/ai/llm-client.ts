import { AppState } from '@/types';

/**
 * Kronos Tracker — Zero-API-Key LLM Integration Suite
 * 
 * Supports:
 * 1. Local Ollama (`http://localhost:11434`) — $0, No API Key needed!
 * 2. Custom Local/Network LLM Host (LM Studio, LocalAI, Text-Gen-WebUI) — No API Key needed!
 * 3. Built-in Client-side Heuristic Core — Instant 0ms response, $0 cost!
 * 4. Optional Cloud APIs (Groq / OpenAI) if key is supplied.
 */

export type AIProvider = 'heuristic' | 'ollama' | 'custom' | 'openai_groq';

export interface AIConfig {
  provider: AIProvider;
  ollamaUrl: string; // e.g. "http://localhost:11434"
  ollamaModel: string; // e.g. "llama3", "qwen2.5", "phi3", "mistral"
  customUrl: string; // e.g. "http://127.0.0.1:1234/v1"
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'ollama',
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3',
  customUrl: 'http://127.0.0.1:1234/v1'
};

export async function askAICoach(
  prompt: string,
  state: AppState,
  config: AIConfig = DEFAULT_AI_CONFIG
): Promise<string> {
  const context = `Aspirant Goal: ${state.goal.name} (${state.goal.target}). Weak Area: ${state.goal.weakArea}. Daily Target: ${state.goal.dailyHours}h.`;

  // Option 1: Local Ollama Server (http://localhost:11434) — NO API KEY NEEDED!
  if (config.provider === 'ollama') {
    try {
      const response = await fetch(`${config.ollamaUrl.replace(/\/$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.ollamaModel || 'llama3',
          prompt: `You are Kronos AI, an elite productivity coach for aspirants. Provide concise, high-impact study direction based on this context.\nContext: ${context}\nUser Question: ${prompt}`,
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) return data.response.trim();
      }
    } catch (e) {
      console.warn('Ollama local connection failed (is Ollama running locally?). Falling back to heuristic engine.', e);
    }
  }

  // Option 2: Custom Local Endpoint (LM Studio, LocalAI, vLLM on localhost) — NO API KEY NEEDED!
  if (config.provider === 'custom' && config.customUrl) {
    try {
      const response = await fetch(`${config.customUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are Kronos AI, an elite productivity coach for serious aspirants.' },
            { role: 'user', content: `Context: ${context}\nPrompt: ${prompt}` }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const msg = data.choices?.[0]?.message?.content;
        if (msg) return msg.trim();
      }
    } catch (e) {
      console.warn('Custom local LLM endpoint error:', e);
    }
  }

  // Option 3: Cloud APIs (if key provided in env)
  const cloudKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_GROQ_API_KEY;
  if (config.provider === 'openai_groq' && cloudKey) {
    try {
      const endpoint = import.meta.env.VITE_GROQ_API_KEY
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cloudKey}`
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are Kronos AI, an elite productivity coach.' },
            { role: 'user', content: `Context: ${context}\nPrompt: ${prompt}` }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const msg = data.choices?.[0]?.message?.content;
        if (msg) return msg.trim();
      }
    } catch (e) {
      console.warn('Cloud LLM API error:', e);
    }
  }

  // Option 4: Local Heuristic Engine Fallback ($0 cost, 100% reliable)
  return generateHeuristicAdvice(state, prompt);
}

function generateHeuristicAdvice(state: AppState, prompt: string): string {
  const weak = state.goal.weakArea || 'primary weak module';
  const hours = state.goal.dailyHours || 8;
  return `[Kronos Local Coach] Focus on ${weak} during your highest energy study block today. Maintain discipline to complete your ${hours}-hour daily time quota before midnight IST reset.`;
}
