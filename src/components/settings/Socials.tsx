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
            Consultation Fees
          </Text>
          <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
            Please enter your consultation fees for each service.
          </Text>
        </Flex>
        <InputField
          mb="25px"
          id="fee_messaging"
          label="Messaging Fee"
          placeholder="Enter fee for messaging consultation"
          type="number"
        />
        <InputField
          mb="25px"
          id="fee_voice_call"
          label="Voice Call Fee"
          placeholder="Enter fee for voice call consultation"
          type="number"
        />
        <InputField
          mb="25px"
          id="fee_video_call"
          label="Video Call Fee"
          placeholder="Enter fee for video call consultation"
          type="number"
        />
        <InputField
          mb="25px"
          id="fee_in_person"
          label="In-Person Consultation Fee"
          placeholder="Enter fee for in-person consultation"
          type="number"
        />
        <InputField
          mb="25px"
          id="fee_third_party"
          label="Third-Party Consultation Fee"
          placeholder="Enter fee for consultation with third-party assistance (e.g., interpreter or nurse)"
          type="number"
        />
      </Card>
    </FormControl>
  );
}
