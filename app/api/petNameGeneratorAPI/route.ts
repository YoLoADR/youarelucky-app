import { PetNameGeneratorBody } from '@/types/types';
import { OpenAIStream } from '@/utils/petNameGeneratorStream';

export const runtime = 'edge'

export async function GET(req: Request): Promise<Response>{
  try {
    const { type, traits, gender, model, apiKey } =
      (await req.json()) as PetNameGeneratorBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(type, traits, gender, model, apiKeyFinal);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export async function POST(req: Request): Promise<Response>{
  try {
    const { type, traits, gender, model, apiKey } =
      (await req.json()) as PetNameGeneratorBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(type, traits, gender, model, apiKeyFinal);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};  