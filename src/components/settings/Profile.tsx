'use client';
// Chakra imports
import { Flex, Select, Text, useColorModeValue, SimpleGrid, Box, Input } from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { NextAvatar } from '@/components/image/Avatar';
import React, { useState } from 'react';

export default function Settings(props: { name: string; avatar?: any; banner: string; }) {
  const { name, avatar, banner } = props;

  // New State Variables for Specialty, Experience, and Address
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState<number | ''>('');
  const [address, setAddress] = useState('');

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';

  return (
    <Flex direction="column" gap="30px">
      <Card mb="20px" alignItems="center">
        <Flex bg={banner} w="100%" h="129px" borderRadius="16px" />
        <NextAvatar mx="auto" src={avatar} h="87px" w="87px" mt="-43px" mb="15px" />
        <Text fontSize="2xl" textColor={textColorPrimary} fontWeight="700" mb="4px">
          {name}
        </Text>
        <Flex align="center" mx="auto" px="14px" mb="20px">
          <Text color={textColorSecondary} fontSize="sm" fontWeight="500" lineHeight="100%">
           Select Specialty :
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
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            defaultValue="Generalist"
          >
            <option value="Generalist">Generalist</option>
            <option value="Ophthalmo">Ophthalmo</option>
            <option value="Nutritionist">Nutritionist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Pediatric">Pediatric</option>
            <option value="Radiologist">Radiologist</option>
            <option value="Others">Others</option>
          </Select>
        </Flex>
      </Card>
    </Flex>
  );
}
