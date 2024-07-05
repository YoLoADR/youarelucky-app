import { EmailEnhancerBody } from '@/types/types';
import { OpenAIStream } from '@/utils/emailEnhancerStream';

export const runtime = 'edge'

export async function POST(req: Request): Promise<Response>{
  try {
    const { topic, toneOfVoice, content, model, apiKey } =
      (await req.json()) as EmailEnhancerBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await OpenAIStream(
      topic,
      toneOfVoice,
      content,
      model,
      apiKeyFinal,
    );

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};  