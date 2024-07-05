'use client';

/*eslint-disable*/
import MessageBoxChat from '@/components/MessageBoxChat'; 
import Bg from '/public/img/ai-chat/bg-image.png'; 
import endent from 'endent'; 
import { useState  } from 'react';
import { MdAutoAwesome, MdEdit, MdPerson } from 'react-icons/md'; 
import { 
  Box,
  Button,
  Flex,
  Icon,Link, 
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
export default function Assistant() {
  // *** If you use .env.local variable for your API key, method which we recommend, use the apiKey variable commented below
  // Input States
  const [inputMessage, setInputMessage] = useState<string>(''); 
  const [submitMessage, setSubmitMessage] = useState<string>(''); 
  // Loading state
  const [loading, setLoading] = useState<boolean>(false); 
  const [assistant, setAssistant] = useState(Object);
  const [thread, setThread] = useState(Object);
  const [res_message, setResMessage] = useState(Object); const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white'); 
  const brandColor = useColorModeValue('brand.500', 'white'); 
  const gray = useColorModeValue('gray.500', 'white'); 
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  const createPrompt = (inputMessage: string) => {
    const data = (inputMessage: string) => {
      return endent` do me this: 
     ${inputMessage}
    `;
    };

    if (inputMessage) {
      return data(inputMessage);
    }
  }; 

  const getAssistant = async () => {
    const gptResponse = await fetch(
      'https://api.openai.com/v1/assistants/' +
        process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_KEY,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1',
        },
      },
    );
    const assistant = await gptResponse.json();
    return assistant;
  };

  const createThread = async () => {
    const gptResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1',
      },
    });
    const thread = await gptResponse.json();
    return thread;
  };

  const createMessage = async (thread_id: string) => {
    const prompt = createPrompt(inputMessage);
    const gptResponse = await fetch(
      'https://api.openai.com/v1/threads/' + thread_id + '/messages',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1',
        },
        body: JSON.stringify({
          role: 'user',
          // content: topic,
          content: prompt,
        }),
      },
    );

    const message = await gptResponse.json();
    return message;
  };

  const getMessage = async (thread_id: string, message_id: string) => {
    // https://api.openai.com/v1/threads/{thread_id}/messages/{message_id}

    const gptResponse = await fetch(
      'https://api.openai.com/v1/threads/' + thread_id + '/messages',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1',
        },
      },
    );

    const message = await gptResponse.json();
    console.log('I get the message.');
    console.log(message);
    return message;
  };

  const runAssistant = async (thread_id: string, assistant_id: string) => {
    const gptResponse = await fetch(
      'https://api.openai.com/v1/threads/' + thread_id + '/runs',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1',
        },
        body: JSON.stringify({
          assistant_id: assistant_id,
        }),
      },
    );

    const run_res = await gptResponse.json();
    return run_res;
  };

  const getRunAssistant = async (run_id: string, thread_id: string) => {
    const gptResponse = await fetch(
      'https://api.openai.com/v1/threads/' + thread_id + '/runs/' + run_id,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1',
        },
      },
    );

    const run_res = await gptResponse.json();
    console.log('I get the status.');
    console.log(run_res);
    return run_res;
  };

  const deleteThread = async (thread_id: string) => {
    if (thread === undefined) {
      return;
    }
    const gptResponse = await fetch(
      'https://api.openai.com/v1/threads/' + thread_id,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1',
        },
      },
    );
    const thread_res = await gptResponse.json();
    console.log(thread_res);
    return thread_res;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
 
    const assistant_res = await getAssistant();
    setAssistant(assistant_res);
    const thread_res = await createThread();
    setThread(thread_res);
    
    const message = await createMessage(thread_res.id);
    let runAssistantResponse = await runAssistant(
      thread_res.id,
      assistant_res.id,
    );
    console.log(runAssistantResponse);

    while (runAssistantResponse.status !== 'completed') {
      runAssistantResponse = await getRunAssistant(
        runAssistantResponse.id,
        thread_res.id,
      );

      if (runAssistantResponse.status === 'completed') {
        console.log('Message is : ');
        const call_response = await getMessage(thread_res.id, message.id);
        setResMessage(call_response);
        console.log(await deleteThread(thread_res.id));
      } else {
        // sleep for 2 second
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    console.log(assistant);
    console.log(thread);
    console.log(message);
    console.log(runAssistantResponse);

    setSubmitMessage(inputMessage)
    setLoading(false);
  };

  // -------------- Copy Response --------------
  // const copyToClipboard = (text: string) => {
  //   const el = document.createElement('textarea');
  //   el.value = text;
  //   document.body.appendChild(el);
  //   el.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(el);
  // };

  const handleChange = (Event: any) => {
    setInputMessage(Event.target.value);
  };

  return (  
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >  
      <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Model Change */}
        <Flex direction={'column'} w="100%" mb={res_message?.data?.[0]?.content?.[0].text?.value ? '20px' : 'auto'}> 
          <Text color={gray} fontWeight="500" mx="auto" fontSize="sm">
           Please make sure that you have set the enviromental variable for
            the Assistant Key .
          </Text>
        </Flex>
        {/* Main Box */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={res_message?.data?.[0]?.content?.[0].text?.value ? 'flex' : 'none'}
          mb={'auto'}
        >
          <Flex w="100%" align={'center'} mb="10px">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'transparent'}
              border="1px solid"
              borderColor={borderColor}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdPerson}
                width="20px"
                height="20px"
                color={brandColor}
              />
            </Flex>
            <Flex
              p="22px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              zIndex={'2'}
            >
              <Text
                color={textColor}
                fontWeight="600"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '24px', md: '26px' }}
              >
                 {submitMessage}
              </Text>
              <Icon
                cursor="pointer"
                as={MdEdit}
                ms="auto"
                width="20px"
                height="20px"
                color={gray}
              />
            </Flex>
          </Flex>
          <Flex w="100%">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdAutoAwesome}
                width="20px"
                height="20px"
                color="white"
              />
            </Flex>
            <MessageBoxChat  output={res_message?.data?.[0]?.content?.[0].text?.value} />
          </Flex>
        </Flex>
        {/* Chat Input */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            onChange={handleChange}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleSubmit}
            isLoading={loading ? true : false}
          >
            Submit
          </Button>
        </Flex>

        <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
          MAY is a model of AI language that can produce inaccurate or incomplete information about people, places or facts. Users must verify any information obtained before making decisions. YVEA is not responsible for any errors or omissions in the content provided by MAY.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
