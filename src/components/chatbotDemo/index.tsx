'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChatDemo from '@/components/MessageBoxChatDemo';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Img,
  Input,
  Text,
  useColorModeValue,
  Stack,
  Heading,
  Checkbox,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdMic } from 'react-icons/md';
import { demoQuestions } from '@/variables/demoQuestion';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { setUser } from '@/store/userSlice';

// Mocked data
const patientDetails = {
  name: 'John Doe',
  age: 45,
  medicalHistory: 'Hypertension, Diabetes',
  recentDiagnoses: 'Mild COVID-19',
  previousNotes: 'Patient is responding well to treatment.',
  allergies: 'Penicillin',
  criticalMedications: 'Insulin',
};

const checklistItems = [
  'Vérifier les résultats des derniers tests',
  'Discuter des symptômes actuels',
  'Réviser les prescriptions actuelles',
  'Confirmer les prochaines étapes du traitement',
  'Discuter des recommandations de style de vie'
];

const ChatComponent = () => {
  const dispatch = useAppDispatch();
  const { user, isTrialExpired, needMoreCredits, isSubActive, isTrialActive } = useAppSelector((state) => state.user);

  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [selectedDemo, setSelectedDemo] = useState<number>(0);
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  const handleTranslate = async () => {
    setInputOnSubmit(inputCode);
    if (isSubActive || isTrialActive) {
      setOutputCode("You are on the demo page, you click on the chat page if you wish to interact with the May AI");
    } else {
      setOutputCode("Please log in to access the answer.");
    }
    setLoading(false);
  };

  const handleVoiceCommand = () => {
    // Code to start voice command (you'll need to integrate with a voice recognition library or service here)
    console.log('Voice command initiated');
  };

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  const handleDemo = (demoNumber: number) => {
    console.log(demoNumber);
    setInputOnSubmit(demoQuestions[demoNumber - 1].question);
    setSelectedDemo(demoNumber);
    setOutputCode('');
    setLoading(true);

    const randomDelay = Math.random() * 1000 + 3000;

    setTimeout(() => {
      setLoading(false);
      const message = demoQuestions[demoNumber - 1].answer;
      let index = 0;

      const typeCharacter = () => {
        if (index < message.length) {
          setOutputCode((prev) => prev + message.charAt(index - 1));
          index++;
          setTimeout(typeCharacter, 30);
        }
      };

      typeCharacter();
    }, randomDelay);
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
          <Accordion color={gray} allowToggle w="100%" my="0px" mx="auto">
            <AccordionItem border="none">
              <AccordionButton
                borderBottom="0px solid"
                maxW="max-content"
                mx="auto"
                _hover={{ border: '0px solid', bg: 'none' }}
                _focus={{ border: '0px solid', bg: 'none' }}
              >
                <Box flex="1">
                  View resume
                </Box>
                <AccordionIcon color={gray} />
              </AccordionButton>
              <AccordionPanel p="0px 0px 10px 0px">
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  w="100%"
                  justify="space-between"
                >
                  <Stack spacing={4} w={{ base: '100%', md: '50%' }}>
                    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
                      <Heading size="md" mb={2}>Résumé IA Personnalisé</Heading>
                      <Text><strong>Nom du patient:</strong> {patientDetails.name}</Text>
                      <Text><strong>Âge:</strong> {patientDetails.age}</Text>
                      <Text><strong>Antécédents médicaux:</strong> {patientDetails.medicalHistory}</Text>
                      <Text><strong>Diagnostiques récents:</strong> {patientDetails.recentDiagnoses}</Text>
                      <Text><strong>Notes précédentes:</strong> {patientDetails.previousNotes}</Text>
                    </Box>
                    <Box p={4} borderWidth="1px" borderRadius="lg" bg="red.50" boxShadow="sm">
                      <Heading size="md" mb={2}>Alerte</Heading>
                      <Text><strong>Allergies:</strong> {patientDetails.allergies}</Text>
                      <Text><strong>Médicaments critiques:</strong> {patientDetails.criticalMedications}</Text>
                    </Box>
                  </Stack>
                  <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm" w={{ base: '100%', md: '45%' }} mt={{ base: '20px', md: '0' }}>
                    <Heading size="md" mb={2}>Checklist Interactive</Heading>
                    {checklistItems.map((item, index) => (
                      <Checkbox key={index} mb={2} colorScheme="green">
                        {item}
                      </Checkbox>
                    ))}
                  </Box>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>

        <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb="4" zIndex="1">
          {demoQuestions.map((card) => (
            <Box as="button" onClick={() => handleDemo(card.id)} key={card.id} width={{ base: '100%', md: '48%' }} p="4" borderWidth="1px" borderRadius="lg" overflow="hidden" mb="4" bg="rgba(128, 90, 213, 0.1)" _hover={{ bg: "rgba(128, 90, 213, 0.3)" }} textAlign="left">
              <Text fontSize="sm" mb="1">{card.question}</Text>
              <Text fontSize="xs" color="purple.700">{card.action}</Text>
            </Box>
          ))}
        </Box>

        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
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
                {inputOnSubmit}
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
            <MessageBoxChatDemo output={outputCode} demoNumber={selectedDemo} />
          </Flex>
        </Flex>

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
          <IconButton
            aria-label="Start voice command"
            icon={<MdMic />}
            onClick={handleVoiceCommand}
            size="lg"
            isRound
            colorScheme="teal"
            bg="white"
            color="black"
            _hover={{ bg: "gray.200" }}
            _active={{ bg: "gray.300" }}
            fontSize="2xl"
            p="24px"
            minW="60px"
            minH="60px"
            me="10px"
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
            onClick={handleTranslate}
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
};

export default ChatComponent;
