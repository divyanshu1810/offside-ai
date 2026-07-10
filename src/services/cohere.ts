/**
 * Cohere AI Service — Offside AI
 * Powers tactical analysis, ELI10 explanations, fantasy advice, and match predictions.
 */

import { COHERE_API } from '@/constants/api';

// ─── Types ──────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CohereResponse {
  message?: {
    content?: Array<{ text: string }>;
  };
}

export type AIMode = 'tactical' | 'eli10' | 'fantasy' | 'predictor' | 'general';

// ─── Cohere Chat ────────────────────────────────────────────────

export async function chatWithCohere(
  messages: ChatMessage[],
  mode: AIMode = 'general',
  matchContext?: string
): Promise<string> {
  try {
    const response = await fetch(`${COHERE_API.BASE_URL}${COHERE_API.ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        mode,
        matchContext,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('[Cohere] Error:', response.status, errorText);
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data = await response.json();
    return data.text ?? 'I couldn\'t generate a response. Please try again.';
  } catch (error) {
    console.error('[Cohere] Chat error:', error);
    return getFallbackResponse(messages[messages.length - 1]?.content ?? '');
  }
}

// ─── Context Builders ───────────────────────────────────────────

export function buildMatchContext(fixture: {
  teams: { home: { name: string }; away: { name: string } };
  goals: { home: number | null; away: number | null };
  status: { elapsed: number | null; short: string };
  statistics?: {
    possession: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
    xG: [number, number];
  };
}): string {
  const { teams, goals, status, statistics } = fixture;
  let ctx = `${teams.home.name} vs ${teams.away.name}\n`;
  ctx += `Score: ${goals.home ?? 0} - ${goals.away ?? 0}\n`;
  ctx += `Status: ${status.short} (${status.elapsed ?? 0}')\n`;

  if (statistics) {
    ctx += `Possession: ${statistics.possession[0]}% - ${statistics.possession[1]}%\n`;
    ctx += `Shots: ${statistics.shots[0]} - ${statistics.shots[1]}\n`;
    ctx += `Shots on Target: ${statistics.shotsOnTarget[0]} - ${statistics.shotsOnTarget[1]}\n`;
    ctx += `xG: ${statistics.xG[0]} - ${statistics.xG[1]}\n`;
  }

  return ctx;
}

// ─── Fallback Responses ─────────────────────────────────────────

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('offside')) {
    return `**Offside Rule Explained**\n\nA player is in an offside position if they are closer to the opponent's goal line than both the ball and the second-to-last defender when the ball is played to them.\n\n✓ You can't be offside from a goal kick, throw-in, or corner\n✓ Being in an offside position isn't an offense — you have to be involved in play\n✓ VAR now checks offside with millimeter precision using semi-automated technology`;
  }

  if (q.includes('win') || q.includes('predict')) {
    return `**Match Prediction**\n\nBased on current form and head-to-head records:\n\n✓ Home advantage plays a significant role\n✓ Recent form over last 5 matches is key\n✓ Key player availability can swing the odds\n\nI'd need specific match details to give you accurate probabilities. Which match are you interested in?`;
  }

  if (q.includes('compare')) {
    return `**Player Comparison**\n\nTo compare players effectively, I look at:\n\n✓ Goals and assists per 90 minutes\n✓ Expected goals (xG) vs actual output\n✓ Progressive passes and carries\n✓ Defensive contributions\n✓ Big game performances\n\nWho would you like me to compare?`;
  }

  return `I'm Coach AI, your football analysis assistant. I can help with:\n\n✓ Match predictions and tactical analysis\n✓ Player comparisons with stats\n✓ Fantasy football recommendations\n✓ Rule explanations (even like you're 10!)\n✓ Transfer talk and football history\n\nWhat would you like to know?`;
}
