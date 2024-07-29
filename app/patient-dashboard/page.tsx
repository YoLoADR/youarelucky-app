'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db, auth } from '@/firebase';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUser } from '@/store/userSlice';
import { setActiveProject } from '@/store/activeProjectSlice';
import ProjectPaperworks from '@/components/projectPaperworks';
import {
  Box, Button, Input, Stack, Text, IconButton, Tabs, TabList, Tab, TabPanels, TabPanel,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import AppointmentPreparationTab from '@/components/AppointmentPreparationTab'
import AppointmentHistoryTab from '@/components/AppointmentHistoryTab'
import ChatComponent from '@/components/chatbotDemo'

export default function PatientDashboard() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }} ml="25px">
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList>
          <Tab>Quick Overview </Tab>
          <Tab>Historique</Tab>
          <Tab>Examen</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ChatComponent></ChatComponent>
          </TabPanel>
          <TabPanel>
            <AppointmentHistoryTab></AppointmentHistoryTab>
          </TabPanel>
          <TabPanel>
            <AppointmentPreparationTab></AppointmentPreparationTab>
          </TabPanel>
        </TabPanels>
      </Tabs>
</Box>
  );
}
