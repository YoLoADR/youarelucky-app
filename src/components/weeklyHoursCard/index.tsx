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
import useUserStore from '@/store/userStore';
import { db } from '@/firebase';

// Définition des jours de la semaine
const daysOfWeek = [
  { name: 'SUN', label: 'Sunday' },
  { name: 'MON', label: 'Monday' },
  { name: 'TUE', label: 'Tuesday' },
  { name: 'WED', label: 'Wednesday' },
  { name: 'THU', label: 'Thursday' },
  { name: 'FRI', label: 'Friday' },
  { name: 'SAT', label: 'Saturday' },
];

// Génération des options horaires à intervalles de 30 minutes
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, '0');
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minutes}`;
});

export default function WeeklyHoursCard({ onScheduleChange }) {
  const { user } = useUserStore();

  // Initialisation de l'état du planning pour chaque jour de la semaine
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day.name]: { checked: false, slots: [{ morning: '', afternoon: '' }] },
      }),
      {}
    )
  );

  // Mise à jour du planning simplifié lorsque le planning est modifié
  useEffect(() => {
    const simplifiedSchedule = daysOfWeek.reduce((acc, day) => {
      if (schedule[day.name].checked) {
        acc[day.name] = schedule[day.name].slots.filter(
          (slot) => slot.morning || slot.afternoon
        );
      }
      return acc;
    }, {});

    // Envoi du planning simplifié au parent via la fonction onScheduleChange
    onScheduleChange(simplifiedSchedule);
  }, [schedule, onScheduleChange]);

  // Gère la sélection ou la désélection d'un jour de la semaine
  const handleDayChange = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        checked: !prev[day].checked,
      },
    }));
  };

  // Gère les modifications d'heures pour un créneau donné (matin ou après-midi)
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

  // Ajoute un créneau supplémentaire pour un jour donné
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

  // Supprime un créneau pour un jour donné
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

  // Génère tous les créneaux horaires disponibles à intervalles de 30 minutes pour une plage donnée
  const generateTimeRange = (start, end) => {
    const times = [];
    let currentTime = start;
    const endTime = end;

    // Boucle pour ajouter chaque créneau de 30 minutes à la liste des horaires disponibles
    while (currentTime <= endTime) {
      times.push({ startTime: currentTime, available: true });

      // Calcul du créneau suivant (ajout de 30 minutes)
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

  // Fonction pour obtenir les 3 prochaines dates spécifiques pour un jour donné
  const getNextThreeDates = (dayName) => {
    const dates = [];
    const today = new Date();
    const dayIndex = daysOfWeek.findIndex(day => day.name === dayName);
    
    let currentDay = today.getDay();
    let dayOffset = (dayIndex + 7 - currentDay) % 7;
    if (dayOffset === 0) {
      dayOffset = 7; // Passe à la semaine suivante si c'est le jour même
    }
    
    for (let i = 0; i < 3; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + dayOffset + (i * 7));
      dates.push(nextDate.toISOString().split('T')[0]);
    }

    return dates;
  };

  // Génère le planning final sous le format souhaité pour les trois prochaines occurrences du jour sélectionné
  const generateFinalSchedule = async () => {
    const finalSchedule = [];
    daysOfWeek.forEach(async (day) => {
      if (schedule[day.name].checked) {
        const nextDates = getNextThreeDates(day.name);
        nextDates.forEach(async date => {
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
            const scheduleData = {
              id: faker.datatype.uuid(), // Génération d'un identifiant unique
              doctorId: user.uid, // Utilisation de l'identifiant réel du médecin
              date: date, // Utilisation de la date calculée
              availableTimes: availableTimes, // Liste des créneaux horaires disponibles
            };

            // Ajout du planning dans Firestore
            await db.collection('doctors-availabilities').doc(scheduleData.id).set(scheduleData);

            finalSchedule.push(scheduleData);
          }
        });
      }
    });
    return finalSchedule;
  };

  return (
    <Card p={6}>
      <Text fontSize="xl" mb={4} fontWeight="bold">
        Weekly hours
      </Text>
      {daysOfWeek.map((day) => (
        <Flex key={day.name} align="center" mb={4}>
          {/* Checkbox pour sélectionner le jour de la semaine */}
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
                  {/* Sélection de l'heure de début (matin) */}
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
                  {/* Sélection de l'heure de fin (après-midi) */}
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
      <Button onClick={generateFinalSchedule} mt={4} colorScheme="blue">
        Save Schedule
      </Button>
    </Card>
  );
}
