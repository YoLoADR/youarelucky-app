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
      <Card>
        <Flex direction="column" mb="40px">
          <Text
            fontSize="xl"
            color={textColorPrimary}
            mb="6px"
            fontWeight="bold"
          >
            Change password
          </Text>
          <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
            Here you can set your new password
          </Text>
        </Flex>
        <FormControl>
          <Flex flexDirection="column">
            <InputField
              mb="25px"
              id="old"
              label="Old Password"
              placeholder="Old Password"
            />
            <InputField
              mb="25px"
              id="new"
              label="New Password"
              placeholder="New Password"
            />
            <InputField
              mb="25px"
              id="confirm"
              label="New Password Confirmation"
              placeholder="Confirm New Password"
            />
          </Flex>
        </FormControl>
      </Card>
    </FormControl>
  );
}
