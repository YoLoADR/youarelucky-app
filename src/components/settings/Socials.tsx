'use client';
// Chakra imports
import { Flex, FormControl, Text, useColorModeValue } from '@chakra-ui/react';
import Card from '@/components/card/Card';
import InputField from '@/components/fields/InputField';

export default function Settings() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';
  return (
    <FormControl>
      <Card mb="20px" pb="50px" h="100%">
        <Flex direction="column" mb="40px">
          <Text
            fontSize="xl"
            color={textColorPrimary}
            mb="6px"
            fontWeight="bold"
          >
            Social Profiles
          </Text>
          <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
            Here you can set user social profiles
          </Text>
        </Flex>
        <InputField
          mb="25px"
          id="twitter_username"
          label="Twitter Username"
          placeholder="Twitter Username"
        />
        <InputField
          mb="25px"
          id="facebook_username"
          label="Facebook Username"
          placeholder="Facebook Username"
        />
        <InputField
          mb="25px"
          id="github_username"
          label="Github Username"
          placeholder="Github Username"
        />
      </Card>
    </FormControl>
  );
}
