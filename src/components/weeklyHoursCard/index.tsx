'use client';

import React, { useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Text,
  Button,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';

const daysOfWeek = [
  { name: 'SUN', label: 'Sunday' },
  { name: 'MON', label: 'Monday' },
  { name: 'TUE', label: 'Tuesday' },
  { name: 'WED', label: 'Wednesday' },
  { name: 'THU', label: 'Thursday' },
  { name: 'FRI', label: 'Friday' },
  { name: 'SAT', label: 'Saturday' },
];

const timeOptions = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

export default function WeeklyHoursCard() {
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day.name]: { checked: false, slots: [{ morning: '', afternoon: '' }] },
      }),
      {}
    )
  );

  const handleDayChange = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        checked: !prev[day].checked,
      },
    }));
  };

  const handleSlotChange = (day, index, time, value) => {
    const updatedSlots = [...schedule[day].slots];
    updatedSlots[index][time] = value;

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: updatedSlots,
      },
    }));
  };

  const addSlot = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { morning: '', afternoon: '' }],
      },
    }));
  };

  const removeSlot = (day, index) => {
    const updatedSlots = schedule[day].slots.filter((_, i) => i !== index);
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: updatedSlots,
      },
    }));
  };

  return (
    <Card p={6}>
      <Text fontSize="xl" mb={4} fontWeight="bold">
        Weekly hours
      </Text>
      {daysOfWeek.map((day) => (
        <Flex key={day.name} align="center" mb={4}>
          <Checkbox
            isChecked={schedule[day.name].checked}
            onChange={() => handleDayChange(day.name)}
            mr={4}
          >
            {day.label}
          </Checkbox>
          {schedule[day.name].checked ? (
            <Flex flexDirection="column" w="100%">
              {schedule[day.name].slots.map((slot, index) => (
                <Flex align="center" mb={2} key={index}>
                  <Select
                    placeholder="Select morning time"
                    value={slot.morning}
                    onChange={(e) =>
                      handleSlotChange(day.name, index, 'morning', e.target.value)
                    }
                    mr={2}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Select>
                  <Text mx={2}>-</Text>
                  <Select
                    placeholder="Select afternoon time"
                    value={slot.afternoon}
                    onChange={(e) =>
                      handleSlotChange(day.name, index, 'afternoon', e.target.value)
                    }
                    mr={2}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Select>
                  <Button
                    onClick={() => removeSlot(day.name, index)}
                    variant="ghost"
                    colorScheme="red"
                    ml={2}
                  >
                    ×
                  </Button>
                </Flex>
              ))}
              <Button
                onClick={() => addSlot(day.name)}
                variant="outline"
                size="sm"
                colorScheme="teal"
              >
                + Add Slot
              </Button>
            </Flex>
          ) : (
            <Text color="gray.500">Unavailable</Text>
          )}
        </Flex>
      ))}
    </Card>
  );
}
