import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (
  topic:
    | ''
    | 'Art and Entertainment'
    | 'Business Equipment and Supplies'
    | 'Clothing and Accessories'
    | 'Food and Drink'
    | 'Hardware and Automotive'
    | 'Health and Beauty'
    | 'Home and Garden'
    | 'Internet and Technology'
    | 'Pet supplies'
    | 'Sports and Recreation'
    | 'Toys and Games'
    | 'Travel & Hospitality',
  productType: '' | 'Physical' | 'Digital' | 'Service',
  budget:
    | ''
    | 'Under $500'
    | '$500-$1000'
    | '$1000-$5000'
    | '$5000-$20,000'
    | '$20,000+',
) => {
  const data = (
    topic:
      | ''
      | 'Art and Entertainment'
      | 'Business Equipment and Supplies'
      | 'Clothing and Accessories'
      | 'Food and Drink'
      | 'Hardware and Automotive'
      | 'Health and Beauty'
      | 'Home and Garden'
      | 'Internet and Technology'
      | 'Pet supplies'
      | 'Sports and Recreation'
      | 'Toys and Games'
      | 'Travel & Hospitality',
    productType: '' | 'Physical' | 'Digital' | 'Service',
    budget:
      | ''
      | 'Under $500'
      | '$500-$1000'
      | '$1000-$5000'
      | '$5000-$20,000'
      | '$20,000+',
  ) => {
    return endent`
    You are an expert at generating great business ideas.
    You know very well how to generate great business ideas. Generate a business idea for a ${productType} product, with a budget of ${budget}, for the ${topic} topic.
    The generated content must be in markdown format but not rendered, it must include all markdown characteristics.The title must be bold, and there should be a &nbsp; between every paragraph.
    Do not include informations about console logs or print messages.
    `;
  };

  if (topic) {
    return data(topic, productType, budget);
  }
};

export const OpenAIStream = async (
  topic:
    | ''
    | 'Art and Entertainment'
    | 'Business Equipment and Supplies'
    | 'Clothing and Accessories'
    | 'Food and Drink'
    | 'Hardware and Automotive'
    | 'Health and Beauty'
    | 'Home and Garden'
    | 'Internet and Technology'
    | 'Pet supplies'
    | 'Sports and Recreation'
    | 'Toys and Games'
    | 'Travel & Hospitality',
  productType: '' | 'Physical' | 'Digital' | 'Service',
  budget:
    | ''
    | 'Under $500'
    | '$500-$1000'
    | '$1000-$5000'
    | '$5000-$20,000'
    | '$20,000+',
  model: string,
  key: string | undefined,
) => {
  const prompt = createPrompt(topic, productType, budget);

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
