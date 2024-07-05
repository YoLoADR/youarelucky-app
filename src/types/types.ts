export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4-1106-preview';

export interface EssayBody {
  topic: string;
  paragraphs: 3 | 4 | 5;
  essayType:
    | ''
    | 'Argumentative'
    | 'Classic'
    | 'Persuasive'
    | 'Memoir'
    | 'Critique'
    | 'Compare/Contrast';
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface SimplifierBody {
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface ProductDescriptionBody {
  name: string;
  keyBenefitsFeatures: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface EmailEnhancerBody {
  topic: string;
  toneOfVoice:
    | ''
    | 'Formal'
    | 'Informal'
    | 'Humorous'
    | 'Serious'
    | 'Optimistic'
    | 'Motivating'
    | 'Respectful'
    | 'Assertive'
    | 'Conversational';
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface LinkedinBody {
  topic: string;
  audience: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface CaptionBody {
  topic: string;
  toneOfVoice:
    | ''
    | 'Formal'
    | 'Informal'
    | 'Humorous'
    | 'Serious'
    | 'Optimistic'
    | 'Motivating'
    | 'Respectful'
    | 'Assertive'
    | 'Conversational';
  description: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface FaqBody {
  topic: string;
  productType: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface NameGeneratorBody {
  topic: string;
  productType: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface SeoKeywordsBody {
  name: string;
  topics: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface ReviewResponderBody {
  review: string;
  name: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface BusinessGeneratorBody {
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
    | 'Travel & Hospitality';
  productType: '' | 'Physical' | 'Digital' | 'Service';
  budget:
    | ''
    | 'Under $500'
    | '$500-$1000'
    | '$1000-$5000'
    | '$5000-$20,000'
    | '$20,000+';
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface ArticleBody {
  topic: string;
  title: string;
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
    | 'German';
  words: 200 | 300 | 400 | 500 | 600;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}

export interface PlagiarismCheckerBody {
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}

export interface HashtagsGeneratorBody {
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}

export interface PetNameGeneratorBody {
  type: string;
  traits:
    | ''
    | 'Friendly'
    | 'Playful'
    | 'Energetic'
    | 'Intelligent'
    | 'Loyal'
    | 'Curious'
    | 'Affectionate'
    | 'Independent'
    | 'Calm'
    | 'Protective';
  gender: '' | 'Male' | 'Female' | 'Neutral';
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}

export interface TranslatorBody {
  content: string;
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
    | 'German';
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}

export interface DomainNameGeneratorBody {
  keywords: string;
  industry:
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
    | 'Travel & Hospitality';
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}

export interface BootstrapToTailwindConverterBody {
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
