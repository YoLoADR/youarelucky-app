'use client';

// Chakra imports
import { useRouter } from 'next/navigation';
import Card from '@/components/card/Card';
import UpcomingBooking from '@/components/upcomingBooking';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue } from '@chakra-ui/react';
import { useEffect } from 'react';
import { db } from '@/firebase';

export default function Appointment() {
  const router = useRouter();
  const textColor = useColorModeValue('navy.700', 'white');
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const hoverButton = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.100' },
  );
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }} ml="25px">
      <Card w="100%" mb="20px">
        <Tabs isLazy>
          <TabList justifyContent="space-between">
            <Tab flex="1" textAlign="center">Upcoming</Tab>
            <Tab flex="1" textAlign="center">Completed</Tab>
            <Tab flex="1" textAlign="center">Cancelled</Tab>
          </TabList>
          <TabPanels>
            {/* initially mounted */}
            <TabPanel>
              <UpcomingBooking />
            </TabPanel>
            {/* initially not mounted */}
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            {/* initially not mounted */}
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
    </Box>
  );
}
