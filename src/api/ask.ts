// src/api/ask.ts
import { v4 as uuidv4 } from "uuid";

// Ensure sessionId persists across page reloads
let sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = uuidv4();
  localStorage.setItem("sessionId", sessionId);
}

export type AskResponse = {
  html: string;
  suggestedQuestions: string[];
};

async function ask(query: string): Promise<AskResponse> {
  try {
    const response = await fetch("https://primary-production-da3f.up.railway.app/webhook/gyanam.store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  query,
  sessionId: sessionId
})
});

if (!response.ok) {
  throw new Error(`HTTP error ${response.status}`);
}
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    // Handle both object and array formats
    const payload = Array.isArray(data) ? data[0] : data;

    return {
      html: payload?.html || "<p>No response received</p>",
      suggestedQuestions: payload?.suggestedQuestions || [],
    };
  } catch (error) {
    console.error("❌ Error in ask.ts:", error);
    return {
      html: "<p>Sorry, something went wrong.</p>",
      suggestedQuestions: [],
    };
  }
}

export default ask;
