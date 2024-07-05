'use client';
/*eslint-disable*/

import Card from '@/components/card/Card';
import MessageBox from '@/components/MessageBox';
import { BusinessGeneratorBody, OpenAIModel } from '@/types/types';
import {
  Button,
  Flex,
  FormLabel,
  Select,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function Home() {
  // *** If you use .env.local variable for your API key, method which we recommend, use the apiKey variable commented below
  // Input States
  const [topic, setTopic] = useState<
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
    | 'Travel & Hospitality'
  >('');
  const [productType, setProductType] = useState<
    '' | 'Physical' | 'Digital' | 'Service'
  >('');
  const [budget, setBudget] = useState<
    | ''
    | 'Under $500'
    | '$500-$1000'
    | '$1000-$5000'
    | '$5000-$20,000'
    | '$20,000+'
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

    if (!topic) {
      alert('Please enter your subject.');
      return;
    }

    if (!productType) {
      alert('Please enter your productType.');
      return;
    }

    if (!budget) {
      alert('Please choose your budget.');
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: BusinessGeneratorBody = {
      topic,
      productType,
      budget,
      model,
      // *** Initializing apiKey with .env.local/ .env value :
      // just remove the `apiKey` variable below
      apiKey,
    };

    // -------------- Fetch --------------
    const response =  await fetch('/api/businessAPI', {
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
  const handleProductType = (Event: any) => {
    setProductType(Event.target.value);
  };
  const handleBudget = (Event: any) => {
    setBudget(Event.target.value);
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
            Idea Preferences
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            Select your Business Idea preferences!
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
            Select the Topic
          </FormLabel>
          <Select
            border="1px solid"
            borderRadius={'10px'}
            borderColor={borderColor}
            h="60px"
            id="topic"
            placeholder="Select the topic"
            _focus={{ borderColor: 'none' }}
            mb="28px"
            onChange={handleTopic}
          >
            <option value="Art and Entertainment">Art and Entertainment</option>
            <option value="Business Equipment and Supplies">
              Business Equipment and Supplies
            </option>
            <option value="Clothing and Accessories">
              Clothing and Accessories
            </option>
            <option value="Food and Drink">Food and Drink</option>
            <option value="Hardware and Automotive">
              Hardware and Automotive
            </option>
            <option value="Health and Beauty">Health and Beauty</option>
            <option value="Home and Garden">Home and Garden</option>
            <option value="Internet and Technology">
              Internet and Technology
            </option>
            <option value="Pet supplies">Pet supplies</option>
            <option value="Sports and Recreation">Sports and Recreation</option>
            <option value="Toys and Games">Toys and Games</option>
            <option value="Travel & Hospitality">Travel & Hospitality</option>
          </Select>
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
            Select Product's Type
          </FormLabel>
          <Select
            border="1px solid"
            borderRadius={'10px'}
            borderColor={borderColor}
            h="60px"
            id="topic"
            placeholder="Select product type"
            _focus={{ borderColor: 'none' }}
            mb="28px"
            onChange={handleProductType}
          >
            <option value="Physical">Physical</option>
            <option value="Digital">Digital</option>
            <option value="Service">Service</option>
          </Select>
          <FormLabel
            display="flex"
            ms="10px"
            htmlFor={'budget'}
            fontSize="md"
            color={textColor}
            letterSpacing="0px"
            fontWeight="bold"
            _hover={{ cursor: 'pointer' }}
          >
            Select the Budget
          </FormLabel>
          <Select
            border="1px solid"
            borderRadius={'10px'}
            borderColor={borderColor}
            h="60px"
            id="budget"
            placeholder="Select budget"
            _focus={{ borderColor: 'none' }}
            mb="28px"
            onChange={handleBudget}
          >
            <option value="Under $500">Under $500</option>
            <option value="$500-$1000">$500-$1000</option>
            <option value="$1000-$5000">$1000-$5000</option>
            <option value="$5000-$20,000">$5000-$20,000</option>
            <option value="$20,000+">$20,000+</option>
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
            Generate Business Idea
          </Button>
        </Card>
        <Card maxW="100%" h="100%">
          <Text fontSize={'30px'} color={textColor} fontWeight="800" mb="10px">
            AI Output
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            Enjoy your new business idea!
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
