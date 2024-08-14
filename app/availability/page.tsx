'use client';
/*eslint-disable*/

import {
  Flex,
} from '@chakra-ui/react';
import WeeklyHoursCard from '@/components/weeklyHoursCard';

export default function Availability() {

    const handleScheduleChange = (simplifiedSchedule) => {
        // Utilise le planning simplifié ici
        console.log(simplifiedSchedule);
    };

  return (
    <Flex direction="column" pl="25px">
        <WeeklyHoursCard onScheduleChange={handleScheduleChange} />;
    </Flex>
  );
};
