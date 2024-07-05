import { Box, Image, Text, Button, Flex, Icon, Stack, useColorModeValue } from '@chakra-ui/react';
import { EmailIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { FaStar } from 'react-icons/fa';

interface ContactCardProps {
  name: string;
  position: string;
  imageUrl: string;
  email: string;
  phoneNumber: string;
  rating: number;
}

const ContactCard: React.FC<ContactCardProps> = ({ name, position, imageUrl, email, phoneNumber, rating }) => {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  return (
    <Box 
      bg="white" 
      p={{ base: 4, md: 6 }} 
      shadow="md" 
      rounded="lg" 
      display="flex" 
      flexDirection={{ base: 'column', md: 'row' }} 
      alignItems="center" 
      gridGap={4}
    >
      <Image src={imageUrl} alt={name} boxSize="48px" borderRadius="full" />
      <Box textAlign={{ base: 'center', md: 'left' }}>
        <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold">{name}</Text>
        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">{position}</Text>
        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">Response time : 24H</Text>
        <Flex mt={1} justifyContent={{ base: 'center', md: 'flex-start' }}>
          {Array.from({ length: 5 }, (_, index) => (
            <Icon as={FaStar} key={index} color={index < rating ? 'yellow.400' : 'gray.300'} boxSize={4} />
          ))}
        </Flex>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={3} mt={5} alignItems={{ base: 'center', md: 'flex-start' }}>
          <Button
            leftIcon={<EmailIcon />}
            variant="chakraLinear"
            py="6px"
            px="12px"
            fontSize={{ base: 'xs', md: 'sm' }}
            borderRadius="45px"
            w={{ base: '100%', md: '99px' }}
            h={{ base: '32px', md: '40px' }}
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
          >
            Email
          </Button>
          <Button
            rightIcon={<ArrowForwardIcon />}
            variant="outline"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            fontSize={{ base: 'xs', md: 'sm' }}
            w={{ base: '100%', md: '200px' }}
            h={{ base: '32px', md: '40px' }}
          >
            Request a Callback
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ContactCard;
