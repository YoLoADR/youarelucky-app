"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Box, Spinner, Text } from '@chakra-ui/react';
import useUserStore from '@/store/userStore';
import useAppointmentStore from '@/store/appointmentStore';

const VideoCall = () => {
  const { user } = useUserStore();
  const currentAppointment = useAppointmentStore((state) => state.currentAppointment);
  const [isReady, setIsReady] = useState(false);

  const userName = "DR Tony Dumont"; // Todo Replace with your user's name

  useEffect(() => {
    if (user && currentAppointment) {
      console.log("VIDEO CALL user :::", user);
      console.log("VIDEO CALL currentAppointment :::", currentAppointment);
      setIsReady(true); // Set isReady to true only when data is available
    }
  }, [user, currentAppointment]);

  let myMeeting = async (element) => {
    if (isReady) {
      const appID =947713347 
      const serverSecret =String(process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET); 
      const roomID = currentAppointment.roomID;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, user.uid, userName);

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Personal link',
            url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    }
  };

  if (!isReady) {
    // Display a loading spinner or a message while the data is being loaded
    return (
      <Box
        width="100%"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
        <Text ml={4}>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box
      ref={myMeeting}
      width="100%"
      height="100vh"
      maxWidth="100vw"
      maxHeight="100vh"
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding="15px"
    />
  );
};

export default VideoCall;
