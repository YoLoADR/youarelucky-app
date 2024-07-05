import { SeoKeywordsBody } from '@/types/types';
import { OpenAIStream } from '@/utils/seoKeywordsStream';

export const runtime = 'edge'

export async function GET(req: Request): Promise<Response>{
  try {
    const { name, topics, model, apiKey } =
      (await req.json()) as SeoKeywordsBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(name, topics, model, apiKeyFinal);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export async function POST(req: Request): Promise<Response>{
  try {
    const { name, topics, model, apiKey } =
      (await req.json()) as SeoKeywordsBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(name, topics, model, apiKeyFinal);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};  