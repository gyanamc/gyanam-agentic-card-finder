// src/api/ask.ts

export async function askGyanam(query: string, onChunk: (text: string) => void) {
  const response = await fetch("https://primary-production-da3f.up.railway.app/webhook/gyanam.store", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.body) {
    throw new Error("No response body from server");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // split by newlines if n8n sends `\n\n` chunks
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      if (part.trim()) {
        try {
          const data = JSON.parse(part);
          if (data.html) {
            onChunk(data.html);
          }
        } catch (err) {
          console.error("Error parsing stream chunk", err, part);
        }
      }
    }
  }
}
