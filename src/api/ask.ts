// src/api/ask.ts

export interface AskResponse {
  html: string;
  suggestedQuestions: string[];
}

const WEBHOOK_URL =
  "https://primary-production-da3f.up.railway.app/webhook/gyanam.store";

/**
 * Sends a query to the backend webhook and returns structured data.
 */
export async function ask(query: string): Promise<AskResponse> {
  if (!query || query.trim().length === 0) {
    throw new Error("Query cannot be empty.");
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid JSON response from server.");
    }

    // Normalize
    return {
      html: data?.html ?? "<p>Sorry, I couldn’t generate an answer.</p>",
      suggestedQuestions: Array.isArray(data?.suggestedQuestions)
        ? data.suggestedQuestions
        : [],
    };
  } catch (err: any) {
    console.error("Error in ask.ts:", err);
    return {
      html: `<p style="color:red;">⚠️ ${err.message || "Something went wrong"}</p>`,
      suggestedQuestions: [],
    };
  }
}
