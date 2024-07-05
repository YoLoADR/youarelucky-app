'use client';
/*eslint-disable*/

import Card from '@/components/card/Card';
import MessageBox from '@/components/MessageBox';
import { EmailEnhancerBody, OpenAIModel } from '@/types/types';
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function Home() {
  // *** If you use .env.local variable for your API key, method which we recommend, use the apiKey variable commented below
  // Input States
  const [topic, setTopic] = useState<string>('');
  const [toneOfVoice, setToneOfVoice] = useState<
    | ''
    | 'Formal'
    | 'Informal'
    | 'Humorous'
    | 'Serious'
    | 'Optimistic'
    | 'Motivating'
    | 'Respectful'
    | 'Assertive'
    | 'Conversational'
  >('');
  const [content, setContent] = useState<string>('');
  // Response message
  const [outputCode, setOutputCode] = useState<string>('');
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  // API Key
  // const [apiKey, setApiKey] = useState<string>();
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const toast = useToast();

  // -------------- Main API Handler --------------
  const handleTranslate = async () => {
    const apiKey = localStorage.getItem('apiKey');
    // Chat post conditions(maximum number of characters, valid message etc.)
    if (!apiKey?.includes('sk-')) {
      alert('Please enter an API key.');
      return;
    }

    if (!toneOfVoice) {
      alert('Please choose the tone of voice.');
      return;
    }

    if (!topic) {
      alert('Please enter your topic.');
      return;
    }

    if (!content) {
      alert('Please enter your content.');
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: EmailEnhancerBody = {
      topic,
      toneOfVoice,
      content,
      model,
      // *** Initializing apiKey with .env.local/ .env value :
      // just remove the `apiKey` variable below
      apiKey,
    };

    // -------------- Fetch --------------
    const response =  await fetch('/api/emailEnhancerAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert(
        'Something went wrong went fetching from the API. Make sure to use a valid API key.',
      );
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      setLoading(true);
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    copyToClipboard(code);
  };

  // -------------- Copy Response --------------
  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  // -------------- Input Value Handler --------------
  const handleTopic = (Event: any) => {
    setTopic(Event.target.value);
  };
  const handleToneOfVoice = (Event: any) => {
    setToneOfVoice(Event.target.value);
  };
  const handleContent = (Event: any) => {
    setContent(Event.target.value);
  };

  return (
    <Flex
      w="100%"
      direction="column"
      position="relative"
      mt={{ base: '70px', md: '0px', xl: '0px' }}
    >
      <Flex
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        maxW="100%"
        justify="center"
        direction={{ base: 'column', md: 'row' }}
      >
        <Card
          minW={{ base: '100%', md: '40%', xl: '476px' }}
          maxW={{ base: '100%', md: '40%', xl: '476px' }}
          h="min-content"
          me={{ base: '0px', md: '20px' }}
          mb={{ base: '20px', md: '0px' }}
        >
          <Text fontSize={'30px'} color={textColor} fontWeight="800" mb="10px">
            Enhancer
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            What your email will be about?
          </Text>
          <FormLabel
            display="flex"
            ms="10px"
            htmlFor={'topic'}
            fontSize="md"
            color={textColor}
            letterSpacing="0px"
            fontWeight="bold"
            _hover={{ cursor: 'pointer' }}
          >
            Topic
          </FormLabel>
          <Input
            color={textColor}
            border="1px solid"
            borderRadius={'10px'}
            borderColor={borderColor}
            h="60px"
            id="topic"
            fontWeight="500"
            placeholder="Type here the topic..."
            _placeholder={placeholderColor}
            _focus={{ borderColor: 'none' }}
            mb="28px"
            onChange={handleTopic}
          />
          <FormLabel
            display="flex"
            ms="10px"
            htmlFor={'content'}
            fontSize="md"
            color={textColor}
            letterSpacing="0px"
            fontWeight="bold"
            _hover={{ cursor: 'pointer' }}
          >
            Content
          </FormLabel>
          <Textarea
            border="1px solid"
            borderRadius={'10px'}
            borderColor={borderColor}
            p="15px 20px"
            mb="28px"
            minH="324px"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={textColor}
            placeholder="Enter here your content..."
            _placeholder={placeholderColor}
            id="content"
            onChange={handleContent}
          />
          <FormLabel
            display="flex"
            ms="10px"
            htmlFor={'topic'}
            fontSize="md"
            color={textColor}
            letterSpacing="0px"
            fontWeight="bold"
            _hover={{ cursor: 'pointer' }}
          >
            Tone of voice
          </FormLabel>
          <Select
            border="1px solid"
            borderRadius={'10px'}
            borderColor={borderColor}
            h="60px"
            id="topic"
            placeholder="Select the tone of voice..."
            _focus={{ borderColor: 'none' }}
            mb="28px"
            onChange={handleToneOfVoice}
          >
            <option value="Formal">Formal</option>
            <option value="Informal">Informal</option>
            <option value="Humorous">Humorous</option>
            <option value="Serious">Serious</option>
            <option value="Optimistic">Optimistic</option>
            <option value="Motivating">Motivating</option>
            <option value="Respectful">Respectful</option>
            <option value="Assertive">Assertive</option>
            <option value="Conversational">Conversational</option>
          </Select>
          <Button
            py="20px"
            px="16px"
            fontSize="md"
            variant="primary"
            borderRadius="45px"
            w={{ base: '100%' }}
            mt="28px"
            h="54px"
            onClick={handleTranslate}
            isLoading={loading ? true : false}
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
          >
            Enhance your Email
          </Button>
        </Card>
        <Card maxW="100%" h="100%">
          <Text fontSize={'30px'} color={textColor} fontWeight="800" mb="10px">
            AI Output
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            Enjoy your enhanced email!
          </Text>
          <MessageBox output={outputCode} />
          <Button
            variant="transparent"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            maxW="160px"
            ms="auto"
            fontSize="md"
            w={{ base: '300px', md: '420px' }}
            h="54px"
            onClick={() => {
              if (outputCode) navigator.clipboard.writeText(outputCode);
              toast({
                title: outputCode
                  ? `Content succesfully copied!`
                  : `Generate some content first!`,
                position: 'top',
                status: outputCode ? 'success' : `error`,
                isClosable: true,
              });
            }}
          >
            Copy text
          </Button>
        </Card>
      </Flex>
    </Flex>
  );
}
0;
