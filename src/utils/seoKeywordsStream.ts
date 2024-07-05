import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (name: string, topics: string) => {
  const data = (name: string, topics: string) => {
    return endent`
     You are an expert at generating SEO Friendly keywords lists.
      You know very well how to generate compelling & high converting SEO Friendly Keywords lists. Generate a list of 30+ SEO keywords based on ${name} product name, and the following topics: ${topics}. 
      The keywords must be in markdown format but not rendered, it must include all markdown characteristics, and it should be separated only by a comma. The title must be bold.
      Do not include informations about console logs or print messages.
    `;
  };

  if (name) {
    return data(name, topics);
  }
};

export const OpenAIStream = async (
  name: string,
  topics: string,
  model: string,
  key: string | undefined,
) => {
  const prompt = createPrompt(name, topics);

  const system = { role: 'system', content: prompt };

  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key || process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: [system],
      temperature: 0,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`,
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
