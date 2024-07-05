'use client';
// Chakra imports
import {
  Flex,
  FormControl,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import InputField from '@/components/fields/InputField';
import TextField from '@/components/fields/TextField';

export default function Settings() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';
  return (
    <FormControl>
      <Card>
        <Flex direction="column" mb="40px">
          <Text
            fontSize="xl"
            color={textColorPrimary}
            mb="6px"
            fontWeight="bold"
          >
            Account Settings
          </Text>
          <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
            Here you can change user account information
          </Text>
        </Flex>
        <SimpleGrid
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: '20px', xl: '20px' }}
        >
          <InputField
            mb="10px"
            me="30px"
            id="username"
            label="Username"
            placeholder="@parkson.adela"
          />
          <InputField
            mb="10px"
            id="email"
            label="Email Address"
            placeholder="hello@youarelucky.ai"
          />
          <InputField
            mb="10px"
            me="30px"
            id="first_name"
            label="First Name"
            placeholder="Adela"
          />
          <InputField
            mb="20px"
            id="last_name"
            label="Last Name"
            placeholder="Parkson"
          />
        </SimpleGrid>
        <InputField id="job" label="Job" placeholder="Web Developer" />
        <TextField
          id="about"
          label="About Me"
          minH="150px"
          placeholder="Tell something about yourself in 150 characters!"
        />
      </Card>
    </FormControl>
  );
}
