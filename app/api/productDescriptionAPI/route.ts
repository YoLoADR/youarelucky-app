import { ProductDescriptionBody } from '@/types/types';
import { OpenAIStream } from '@/utils/productDescriptionStream';

export const runtime = 'edge'

export async function GET(req: Request): Promise<Response>{
  try {
    const { name, keyBenefitsFeatures, model, apiKey } =
      (await req.json()) as ProductDescriptionBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(
      name,
      keyBenefitsFeatures,
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
    const { name, keyBenefitsFeatures, model, apiKey } =
      (await req.json()) as ProductDescriptionBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(
      name,
      keyBenefitsFeatures,
      model,
      apiKeyFinal,
    );

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};  