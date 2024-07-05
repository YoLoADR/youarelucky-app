import { ArticleBody } from '@/types/types';
import { OpenAIStream } from '@/utils/articleGeneratorStream';

export const runtime = 'edge'

export async function GET(req: Request): Promise<Response>{
  try {
    const { topic, title, language, words, model, apiKey } =
      (await req.json()) as ArticleBody;
    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(
      topic,
      title,
      language,
      words,
      model,
      apiKeyFinal,
    );

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};
export async function POST(req: Request): Promise<Response>{
  try {
    const { topic, title, language, words, model, apiKey } =
      (await req.json()) as ArticleBody;
    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(
      topic,
      title,
      language,
      words,
      model,
      apiKeyFinal,
    );

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}; 