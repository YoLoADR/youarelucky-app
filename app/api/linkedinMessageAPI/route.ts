import { LinkedinBody } from '@/types/types';
import { OpenAIStream } from '@/utils/linkedinMessageStream';

export const runtime = 'edge'

export async function GET(req: Request): Promise<Response>{
  try {
    const { topic, audience, model, apiKey } =
      (await req.json()) as LinkedinBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(topic, audience, model, apiKeyFinal);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export async function POST(req: Request): Promise<Response>{
  try {
    const { topic, audience, model, apiKey } =
      (await req.json()) as LinkedinBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(topic, audience, model, apiKeyFinal);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};  