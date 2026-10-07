/**
 * n8n Code node: Parse LLM output + re-attach source metadata
 * Mode: Run Once for All Items | Language: JavaScript
 *
 * Input: items from the OpenAI "Message a Model" node (Simplify Output OFF).
 * The OpenAI node drops upstream fields, so post URLs and the matched
 * keyword are snapshotted earlier by an Edit Fields node
 * (savedPostUrl, savedLinkedinUrl, savedKeyword) and re-joined here.
 */

const items = [];

for (const item of $input.all()) {
  try {
    const outputs = item.json.output;

    for (const out of outputs) {
      const text = out.content[0].text;

      // Models sometimes wrap JSON in markdown fences. Strip them.
      const cleanText = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanText);

      // Re-attach metadata the LLM never sees
      parsed.linkedinUrl = item.json.savedLinkedinUrl || null;
      parsed.postUrl = item.json.savedPostUrl || null;
      parsed.keywordMatched = item.json.savedKeyword || null;

      items.push({ json: parsed });
    }
  } catch (e) {
    // Malformed response: skip this post rather than fail the whole run
  }
}

return items;
