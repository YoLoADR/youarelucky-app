'use client';
/*eslint-disable*/

import {
  Flex,
  Button,
  FormLabel,
  Select,
  Text,
  Textarea,
  useToast,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { OpenAIModel, TranslatorBody } from '@/types/types';
import { useEffect, useState } from 'react';
import MessageBox from '@/components/MessageBox';

export default function Home() {
  // *** If you use .env.local variable for your API key, method which we recommend, use the apiKey variable commented below
  // Input States
  const [content, setContent] = useState<string>('');
  const [language, setLanguage] = useState<
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
    | 'German'
  >('');
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
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 500 : 500;
    const apiKey = localStorage.getItem('apiKey');

    // Chat post conditions(maximum number of characters, valid message etc.)
    if (!apiKey?.includes('sk-')) {
      alert('Please enter an API key.');
      return;
    }

    if (!content) {
      alert('Please enter your content.');
      return;
    }

    if (content.length > maxCodeLength) {
      alert(
        `Please enter content less than ${maxCodeLength} characters. You are currently at ${content.length} characters.`,
      );
      return;
    }

    if (!language) {
      alert('Please choose your language.');
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: TranslatorBody = {
      content,
      language,
      model,
      // *** Initializing apiKey with .env.local/ .env value :
      // just remove the `apiKey` variable below
      apiKey,
    };

    // -------------- Fetch --------------
    const response =  await fetch('/api/translatorAPI', {
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
  const handleContent = (Event: any) => {
    setContent(Event.target.value);
  };
  const handleLanguage = (Event: any) => {
    setLanguage(Event.target.value);
  };

  // Initializing apiKey with localStorage value
  // useEffect(() => {
  //   setApiKey(apiKeyApp);
  // }, [apiKey]);

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
            Content Details
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            Enter the content you want to translate
          </Text>
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
            placeholder="Type here the content..."
            _placeholder={placeholderColor}
            onChange={handleContent}
          />
          <FormLabel
            display="flex"
            ms="10px"
            htmlFor={'lang'}
            fontSize="md"
            color={textColor}
            letterSpacing="0px"
            fontWeight="bold"
            _hover={{ cursor: 'pointer' }}
          >
            Select the Language
          </FormLabel>
          <Select
            border="1px solid"
            borderRadius={'10px'}
            borderColor={borderColor}
            h="60px"
            id="lang"
            placeholder="Select language"
            _focus={{ borderColor: 'none' }}
            mb="28px"
            onChange={handleLanguage}
          >
            <option value="Arabic">Arabic</option>
            <option value="Chinese">Chinese</option>
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="Hindi">Hindi</option>
            <option value="Italian">Italian</option>
            <option value="Japanese">Japanese</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Romanian">Romanian</option>
            <option value="Russian">Russian</option>
            <option value="Spanish">Spanish</option>
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
            Translate your Content
          </Button>
        </Card>
        <Card maxW="100%" h="100%">
          <Text fontSize={'30px'} color={textColor} fontWeight="800" mb="10px">
            AI Output
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            Enjoy your new translated content!
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
