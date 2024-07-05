'use client';
// Chakra imports
import { Flex, Select, Text, useColorModeValue } from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { NextAvatar } from '@/components/image/Avatar';
// import { Image } from '@/components/image/Image';

export default function Settings(props: {
  name: string;
  avatar?: any;
  banner: string;
}) {
  const { name, avatar, banner } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';
  return (
    <Card mb="20px" alignItems="center">
      <Flex bg={banner} w="100%" h="129px" borderRadius="16px" />
      {/* <Img src={banner} w="100%" maxH="129px" borderRadius="16px" /> */}
      <NextAvatar
        mx="auto"
        src={avatar}
        h="87px"
        w="87px"
        mt="-43px"
        mb="15px"
      />
      <Text
        fontSize="2xl"
        textColor={textColorPrimary}
        fontWeight="700"
        mb="4px"
      >
        {name}
      </Text>
      <Flex align="center" mx="auto" px="14px" mb="20px">
        <Text
          color={textColorSecondary}
          fontSize="sm"
          fontWeight="500"
          lineHeight="100%"
        >
          Account type:
        </Text>
        <Select
          ms="-4px"
          id="user_type"
          w="unset"
          h="100%"
          variant="transparent"
          display="flex"
          textColor={textColorPrimary}
          color={textColorPrimary}
          alignItems="center"
          defaultValue="Administrator"
        >
          <option value="Administrator">Administrator</option>
          <option value="Member">Member</option>
        </Select>
      </Flex>
    </Card>
  );
}
