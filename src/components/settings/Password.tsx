'use client';
// Chakra imports
import { Flex, FormControl, Text, useColorModeValue, Select } from '@chakra-ui/react';
import Card from '@/components/card/Card';
import InputField from '@/components/fields/InputField';

export default function Settings() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';

  // Les options pour la région
  const regionOptions = [
    'France',
    'Ghana',
    'India',
    'Kenya',
    'Nigeria',
    'South Africa',
    'United States',
    'United Kingdom',
  ];

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
            Profesionnal Information
          </Text>
          <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
            Please provide your contact and professional details
          </Text>
        </Flex>
        <FormControl>
          <Flex flexDirection="column">
            <InputField
              mb="25px"
              id="phone_number"
              label="Phone Number"
              placeholder="Enter your phone number"
              type="tel"
            />

        <InputField id="adress" label="Work Adress" placeholder="Address" />
            <FormControl mb="25px">
              <Text mb="8px" color={textColorPrimary} fontWeight="500">
                Select Region
              </Text>
              <Select placeholder="Select your region" id="region">
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </Select>
            </FormControl>
            <InputField
              mb="25px"
              id="experience"
              label="Years of Experience"
              placeholder="Enter your years of experience"
              type="number"
            />
            <InputField
              mb="25px"
              id="working_time"
              label="Working Time"
              placeholder="e.g., Monday - Friday, 08.00 AM - 20.00 PM"
              type="text"
            />
            <InputField
              mb="25px"
              id="address"
              label="Address"
              placeholder="Enter your address"
              type="text"
            />
          </Flex>
        </FormControl>
      </Card>
    </FormControl>
  );
}
