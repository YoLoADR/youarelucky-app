'use client';
import React from 'react';
// Chakra imports
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import { useAppSelector } from '@/hooks';

import Info from '@/components/settings/Info';
import Password from '@/components/settings/Password';
import Profile from '@/components/settings/Profile';
import Socials from '@/components/settings/Socials';
import Delete from '@/components/settings/Delete';
import avatarEmpty from '../../public/img/avatars/avatar_empty.png';

export default function Settings() {
  const { user } = useAppSelector((state) => state.user);

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <SimpleGrid columns={{ sm: 1, lg: 2 }} spacing="20px" mb="20px">
        {/* Column Left */}
        <Flex direction="column">
          <Profile
            name={user?.first_name ? `${user.first_name} ${user.last_name && user.last_name}` : "Username"}
            avatar={user?.picture ? user?.picture : avatarEmpty} 
            banner={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
          />
          <Info />
        </Flex>
        {/* Column Right */}
        <Flex direction="column" gap="20px">
          <Socials />
          <Password />
        </Flex>
      </SimpleGrid>
      <Delete />
    </Box>
  );
}
