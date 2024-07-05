import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (
  topic: string,
  title: string,
  language:
    | ''
    | 'English'
    | 'Chinese'
    | 'Spanish'
    | 'Arabic'
    | 'Hindi'
    | 'Italian'
    | 'Portuguese'
    | 'Russian'
    | 'Japanese'
    | 'Romanian'
    | 'German',
  words: 200 | 300 | 400 | 500 | 600,
) => {
  const data = (
    topic: string,
    title: string,
    language:
      | ''
      | 'English'
      | 'Chinese'
      | 'Spanish'
      | 'Arabic'
      | 'Hindi'
      | 'Italian'
      | 'Portuguese'
      | 'Russian'
      | 'Japanese'
      | 'Romanian'
      | 'German',
    words: 200 | 300 | 400 | 500 | 600,
  ) => {
    return endent`
      You are an expert at generating compelling, high converting and SEO-Friendly articles.
      You know very well how to generate compelling, high converting and SEO-Friendly articles. Generate an article with the ${title} title and about the following topic: ${topic}.
      The article should contain AT LEAST ${words} words.
      The article should be written in ${language}.
      The content must be in markdown format but not rendered, it must include all markdown characteristics. The title must be bold, and there should be a &nbsp; between every paragraph.
      Do not include informations about console logs or print messages.
    `;
  };

  if (topic) {
    return data(topic, title, language, words);
  }
};

export const OpenAIStream = async (
  topic: string,
  title: string,
  language:
    | ''
    | 'English'
    | 'Chinese'
    | 'Spanish'
    | 'Arabic'
    | 'Hindi'
    | 'Italian'
    | 'Portuguese'
    | 'Russian'
    | 'Japanese'
    | 'Romanian'
    | 'German',
  words: 200 | 300 | 400 | 500 | 600,
  model: string,
  key: string | undefined,
) => {
  const prompt = createPrompt(topic, title, language, words);

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
