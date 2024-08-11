'use client';

import React, { useState, useEffect } from 'react';
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
import { faker } from '@faker-js/faker';

const daysOfWeek = [
  { name: 'SUN', label: 'Sunday' },
  { name: 'MON', label: 'Monday' },
  { name: 'TUE', label: 'Tuesday' },
  { name: 'WED', label: 'Wednesday' },
  { name: 'THU', label: 'Thursday' },
  { name: 'FRI', label: 'Friday' },
  { name: 'SAT', label: 'Saturday' },
];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, '0');
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minutes}`;
});

export default function WeeklyHoursCard({ onScheduleChange }) {
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day.name]: { checked: false, slots: [{ morning: '', afternoon: '' }] },
      }),
      {}
    )
  );

  useEffect(() => {
    const simplifiedSchedule = daysOfWeek.reduce((acc, day) => {
      if (schedule[day.name].checked) {
        acc[day.name] = schedule[day.name].slots.filter(
          (slot) => slot.morning || slot.afternoon
        );
      }
      return acc;
    }, {});

    onScheduleChange(simplifiedSchedule);
  }, [schedule, onScheduleChange]);

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
    if (schedule[day].slots.length < 4) {
      setSchedule((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          slots: [...prev[day].slots, { morning: '', afternoon: '' }],
        },
      }));
    }
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

  // Function to generate all time slots within a time range (30-minute intervals)
  const generateTimeRange = (start, end) => {
    const times = [];
    let currentTime = start;
    const endTime = end;

    while (currentTime <= endTime) {
      times.push({ startTime: currentTime, available: true });

      // Calculate the next time slot (30 minutes later)
      let [hour, minute] = currentTime.split(':').map(Number);
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }
      currentTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    return times;
  };

  // Function to generate the final schedule in the desired format
  const generateFinalSchedule = () => {
    const finalSchedule = [];
    daysOfWeek.forEach((day) => {
      if (schedule[day.name].checked) {
        const availableTimes = schedule[day.name].slots.flatMap((slot) => {
          let times = [];
          if (slot.morning && slot.afternoon) {
            times = generateTimeRange(slot.morning, slot.afternoon);
          } else if (slot.morning) {
            times.push({ startTime: slot.morning, available: true });
          } else if (slot.afternoon) {
            times.push({ startTime: slot.afternoon, available: true });
          }
          return times;
        });
        if (availableTimes.length > 0) {
          finalSchedule.push({
            id: faker.datatype.uuid(),
            doctorId: faker.datatype.uuid(),
            date: new Date().toISOString().split('T')[0],
            availableTimes: availableTimes,
          });
        }
      }
    });
    return finalSchedule;
  };

  // Function to download the generated schedule as a JSON file
  const downloadScheduleAsJson = () => {
    const finalSchedule = generateFinalSchedule();
    const dataStr = JSON.stringify(finalSchedule, null, 4);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'schedule.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
              {schedule[day.name].slots.length < 4 && (
                <Button
                  onClick={() => addSlot(day.name)}
                  variant="outline"
                  size="sm"
                  colorScheme="teal"
                >
                  + Add Slot
                </Button>
              )}
            </Flex>
          ) : (
            <Text color="gray.500">Unavailable</Text>
          )}
        </Flex>
      ))}
      <Button onClick={downloadScheduleAsJson} mt={4} colorScheme="blue">
        Download Schedule as JSON
      </Button>
    </Card>
  );
}
