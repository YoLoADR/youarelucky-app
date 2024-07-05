'use client';
// Chakra imports
import { Flex, useColorModeValue, Img } from '@chakra-ui/react';
import { HSeparator } from '@/components/separator/Separator';
import logoYouAreLucky from '../../../../public/img/layout/logoYouAreLucky.png';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      <Img src={logoYouAreLucky.src} w="100px" h="50px" />
      <HSeparator mb="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
