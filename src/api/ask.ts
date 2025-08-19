// src/api/ask.ts

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
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return {
      html: data[0]?.html || "<p>No response received</p>",
      suggestedQuestions: data[0]?.suggestedQuestions || [],
    };
  } catch (error) {
    console.error("❌ Error in ask.ts:", error);
    return {
      html: "<p>Sorry, something went wrong.</p>",
      suggestedQuestions: [],
    };
  }
}

// ✅ Default export so Hero.tsx works
export default ask;
