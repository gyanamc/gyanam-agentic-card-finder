// src/api/ask.ts
export async function askGyanam(
  question: string,
  onChunk?: (chunk: string) => void
): Promise<{ html: string; suggestedQuestions: string[] }> {
  try {
    const response = await fetch(
      "https://primary-production-da3f.up.railway.app/webhook/gyanam.store",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      }
    );

    // If streaming is supported (ReadableStream exists)
    if (response.body && response.body.getReader) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        result += chunk;

        if (onChunk) {
          onChunk(chunk); // Pass chunk to Hero.tsx for typing effect
        }
      }

      try {
        return JSON.parse(result);
      } catch {
        return { html: result, suggestedQuestions: [] };
      }
    }

    // Fallback: parse full JSON
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { html: text, suggestedQuestions: [] };
    }
  } catch (error) {
    console.error("askGyanam error:", error);
    return {
      html: `<p>⚠️ Something went wrong. Please try again later.</p>`,
      suggestedQuestions: [],
    };
  }
}
