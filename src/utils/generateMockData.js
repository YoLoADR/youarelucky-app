// node src/utils/generateMockData.js
import { faker } from '@faker-js/faker';
import fs from 'fs';

const consultationTypes = ['1er visite', 'nouveau cas', 'examen complémentaire', 'suivi'];
const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

const generatePractitioners = () => {
  const numPractitioners = faker.number.int({ min: 1, max: 3 });
  return Array.from({ length: numPractitioners }, () => ({
    name: `Dr. ${faker.person.lastName()}`,
    avatar: faker.image.avatar(),
  }));
};

const generateSlots = (weekOffset) => {
  const slots = [];
  let slotId = 1;

  for (let i = 0; i < 5; i++) {
    const numSlots = faker.number.int({ min: 2, max: 5 });

    for (let j = 0; j < numSlots; j++) {
      const patientId = slotId;
      slots.push({
        id: slotId,
        time: faker.date.between({ from: '2022-01-01T08:00:00.000Z', to: '2022-01-01T17:00:00.000Z' }).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        patientId: patientId,
        patientName: faker.person.fullName(),
        patientAvatar: faker.image.avatar(),
        practitioners: generatePractitioners(),
        consultationType: consultationTypes[faker.number.int({ min: 0, max: consultationTypes.length - 1 })],
        details: faker.lorem.sentence(),
        day: daysOfWeek[i],
      });
      slotId++;
    }
  }

  return slots;
};

const mockSlots = {
  0: generateSlots(0),
  1: generateSlots(1),
  '-1': generateSlots(-1),
};

const mockPatients = {};
mockSlots[0].concat(mockSlots[1], mockSlots['-1']).forEach(slot => {
  mockPatients[slot.patientId] = {
    name: slot.patientName,
    age: faker.number.int({ min: 18, max: 90 }),
    medicalHistory: faker.lorem.sentence(),
  };
});

const saveDataToFile = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};

saveDataToFile('src/utils/mockSlots.json', mockSlots);
saveDataToFile('src/utils/mockPatients.json', mockPatients);

console.log('Mock data generated and saved to src/utils/mockSlots.json');
console.log('Mock patients generated and saved to src/utils/mockPatients.json');
