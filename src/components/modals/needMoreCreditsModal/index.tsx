import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, Link, Text, useDisclosure, useColorModeValue, Card, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { setUser } from '@/store/userSlice';
import { auth } from '@/firebase';
import { useAppDispatch } from '@/hooks';

export default function NeedMoreCreditsModal() {
  const textColor = useColorModeValue('navy.700', 'white');
  const grayColor = useColorModeValue('gray.500', 'gray.500');
  const link = useColorModeValue('brand.500', 'white');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleContactSupport = () => {
    router.push('https://calendly.com/moamen-elmasry/meet');
  };

  const logout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out successfully");
      dispatch(setUser(null));
      router.push('/sign-in');
      localStorage.setItem('token', '');
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };


  return (
    <Modal blockScrollOnMount={false} isOpen={true} onClose={() => router.push('https://youarelucky.ai')}>
      <ModalOverlay />
      <ModalContent bg="none" boxShadow="none">
        <Card textAlign={'center'}>
          <ModalHeader
            fontSize="22px"
            fontWeight={'700'}
            mx="auto"
            textAlign={'center'}
            color={textColor}
          >
            Need More Credits?
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: 'none' }} />
          <ModalBody p="0px">
            <Text
              color={grayColor}
              fontWeight="500"
              fontSize="md"
              lineHeight="28px"
              mb="22px"
            >
              You have exceeded your monthly token limit. Contact support for a personalized offer with more credits.
            </Text>
            <Flex justifyContent="center" mb="20px">
              <Button
                variant="chakraLinear"
                py="20px"
                px="16px"
                fontSize="sm"
                borderRadius="45px"
                mb={{ base: '20px', md: '0px' }}
                w={{ base: '300px', md: '180px' }}
                h="54px"
                onClick={handleContactSupport}
              >
                Contact Support
              </Button>
            </Flex>
            <Link
              color={link}
              fontSize="sm"
              href="https://calendly.com/moamen-elmasry/meet"
              textDecoration="underline !important"
              fontWeight="600"
            >
              Get your customized offer by contacting support
            </Link>
            <Text
              color={grayColor}
              fontWeight="500"
              fontSize="sm"
              mt="10px"
              mb="42px"
              mx="30px"
            >
              * The app will connect to OpenAI API server to check if your API Key is working properly.
            </Text>
          </ModalBody>
        </Card>
      </ModalContent>
    </Modal>
  );
}
