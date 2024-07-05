'use client';

// Chakra imports
import React from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
// Custom components
import avatarEmpty from '/public/img/avatars/avatar_empty.png';
import { NextAvatar } from '@/components/image/Avatar';
import Brand from '@/components/sidebar/components/Brand';
// TODO : On utilise la version DEMO "sidebarDemo"
import Links from '@/components/sidebarDemo/components/Links';
import SidebarDemo from '@/components/sidebarDemo/components/SidebarCard';
import SidebarDocs from '@/components/sidebar/components/SidebarCard';
import { RoundedChart } from '@/components/icons/Icons';
import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import { IoMdPerson } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { LuHistory } from 'react-icons/lu';
import { MdOutlineManageAccounts, MdOutlineSettings } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { auth } from '@/firebase';
import { setUser } from '@/store/userSlice';
import routes from '@/routes';
import routesDemo from '@/routesDemo';

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(12, 44, 55, 0.18)',
  );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue(
    '4px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'none',
  );
  const gray = useColorModeValue('gray.500', 'white');

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isTrialExpired, needMoreCredits, isSubActive, isTrialActive, isNewComer } = useAppSelector((state) => state.user);

  const logout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out successfully");
      dispatch(setUser(null));
      router.push('/sign-in');
      localStorage.setItem('token', '');
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  // SIDEBAR
  return (
    <Flex
      direction="column"
      height="100%"
      pt="20px"
      pb="26px"
      borderRadius="30px"
      maxW="285px"
      px="20px"
    >
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="0px" pe={{ md: '0px', '2xl': '0px' }}>
          <Links isSubActive={isSubActive} isTrialActive={isTrialActive} routes={(isSubActive || isTrialActive) ? routes : routesDemo} />
        </Box>
      </Stack>
      {!isSubActive && 
      <Box mt="60px" width={'100%'} display={'flex'} justifyContent={'center'}>
        <SidebarDemo />
      </Box>}
      {/* "TODO : Graph de la consomation de l'utilisateur" */}
      {/* { isSubActive && <SidebarDocs /> } */}
      {/* <APIModal setApiKey={setApiKey} sidebar={true} /> */}
      <Flex
        mt="8px"
        justifyContent="center"
        alignItems="center"
        boxShadow={shadowPillBar}
        borderRadius="30px"
        p="14px"
      >
        <NextAvatar h="34px" w="34px" src={user?.photoURL ? user?.photoURL : avatarEmpty} me="10px" />
        <Text color={textColor} fontSize="xs" fontWeight="600" me="10px">
          {user?.displayName ? user.displayName : "Username"}
        </Text>
        <Menu>
          <MenuButton
            as={Button}
            variant="transparent"
            aria-label=""
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            px="0px"
            p="0px"
            minW="34px"
            me="10px"
            justifyContent={'center'}
            alignItems="center"
            color={iconColor}
          >
            <Flex align="center" justifyContent="center">
              <Icon
                as={MdOutlineSettings}
                width="18px"
                height="18px"
                color="inherit"
              />
            </Flex>
          </MenuButton>
          <MenuList
            ms="-20px"
            py="25px"
            ps="20px"
            pe="80px"
            w="246px"
            borderRadius="16px"
            transform="translate(-19px, -62px)!important"
            border="0px"
            boxShadow={shadow}
            bg={bgColor}
          >
            <Box mb="30px">
              <NavLink href="/settings">
                <Flex align="center">
                  <Icon
                    as={MdOutlineManageAccounts}
                    width="24px"
                    height="24px"
                    color={gray}
                    me="12px"
                  />
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    Profile Settings
                  </Text>
                </Flex>
              </NavLink>
            </Box>
            <Box mb="30px">
              <NavLink href="/history">
                <Flex align="center">
                  <Icon
                    as={LuHistory}
                    width="24px"
                    height="24px"
                    color={gray}
                    me="12px"
                  />
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    History
                  </Text>
                </Flex>
              </NavLink>
            </Box>
            <Box mb="30px">
              <NavLink href="/usage">
                <Flex align="center">
                  <Icon
                    as={RoundedChart}
                    width="24px"
                    height="24px"
                    color={gray}
                    me="12px"
                  />
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    Usage
                  </Text>
                </Flex>
              </NavLink>
            </Box>
            <Box>
              <NavLink href="/my-plan">
                <Flex align="center">
                  <Icon
                    as={IoMdPerson}
                    width="24px"
                    height="24px"
                    color={gray}
                    me="12px"
                  />
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    My Plan
                  </Text>
                </Flex>
              </NavLink>
            </Box>
          </MenuList>
        </Menu>
        <Button
          variant="transparent"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="full"
          w="34px"
          h="34px"
          px="0px"
          minW="34px"
          justifyContent={'center'}
          alignItems="center"
          onClick={logout}
        >
          <Icon as={FiLogOut} width="16px" height="16px" color="inherit" />
        </Button>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
