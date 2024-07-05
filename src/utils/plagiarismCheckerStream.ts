import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (content: string) => {
  const data = (content: string) => {
    return endent`
    You are an expert content plagiarism checker in all languages.
    You know very well what plagiarism of a content is. You know very well if a content is plagiarism-free or not. You will check all sources to verify if the given sentence or content is plagiarized or plagiarism-free. Is the following content: ${content}, plagiarism-free? Reply with "Your content is plagiarized!" if the content is plagiarized, and explain why and from where. Reply with "Your content is plagiarism-free!" if the content is plagiarism-free, and explain why.
    The generated response must be in markdown format but not rendered, it must include all markdown characteristics. The title must be bold, and there should be a &nbsp; between every paragraph.
    Do not include informations about console logs or print messages.
    `;
  };

  if (content) {
    return data(content);
  }
};

export const OpenAIStream = async (
  content: string,
  model: string,
  key: string | undefined,
) => {
  const prompt = createPrompt(content);

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
