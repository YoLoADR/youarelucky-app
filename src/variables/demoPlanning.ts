// mockData.js
export const mockSlots = {
    0: [
      {
        id: 1,
        time: '10:00',
        patientId: 1,
        patientName: 'John Doe',
        patientAvatar: 'https://via.placeholder.com/50',
        practitioners: [
          { name: 'Dr. Smith', avatar: 'https://via.placeholder.com/50' },
          { name: 'Dr. Adams', avatar: 'https://via.placeholder.com/50' },
        ],
        consultationType: 'Suivi',
        details: 'Consultation de suivi',
        day: 'Lundi'
      },
      {
        id: 2,
        time: '11:00',
        patientId: 2,
        patientName: 'Jane Smith',
        patientAvatar: 'https://via.placeholder.com/50',
        practitioners: [
          { name: 'Dr. Brown', avatar: 'https://via.placeholder.com/50' },
        ],
        consultationType: 'Nouveau cas',
        details: 'Nouveau patient',
        day: 'Lundi'
      },
      // Plus de créneaux
    ],
    1: [
      {
        id: 3,
        time: '09:00',
        patientId: 3,
        patientName: 'Alice Johnson',
        patientAvatar: 'https://via.placeholder.com/50',
        practitioners: [
          { name: 'Dr. Clark', avatar: 'https://via.placeholder.com/50' },
        ],
        consultationType: 'Examen complémentaire',
        details: 'Consultation de routine',
        day: 'Mardi'
      },
      // Plus de créneaux
    ],
    '-1': [
      {
        id: 4,
        time: '14:00',
        patientId: 4,
        patientName: 'Bob Brown',
        patientAvatar: 'https://via.placeholder.com/50',
        practitioners: [
          { name: 'Dr. Davis', avatar: 'https://via.placeholder.com/50' },
        ],
        consultationType: 'Suivi',
        details: 'Consultation de suivi',
        day: 'Mercredi'
      },
      // Plus de créneaux
    ],
  };
  
  export const mockPatients = {
    1: { name: 'John Doe', age: 30, medicalHistory: 'Diabetes, Hypertension' },
    2: { name: 'Jane Smith', age: 25, medicalHistory: 'Asthma' },
    3: { name: 'Alice Johnson', age: 28, medicalHistory: 'Allergy' },
    4: { name: 'Bob Brown', age: 40, medicalHistory: 'High Cholesterol' },
    5: { name: 'Charlie Davis', age: 35, medicalHistory: 'Arthritis' },
    6: { name: 'Eve Evans', age: 32, medicalHistory: 'Pregnancy' },
    7: { name: 'John Smith', age: 45, medicalHistory: 'Heart Disease' },
    8: { name: 'Jane Doe', age: 50, medicalHistory: 'Cancer' },
    9: { name: 'Alice Brown', age: 38, medicalHistory: 'Thyroid Issues' },
    10: { name: 'Bob Johnson', age: 42, medicalHistory: 'Kidney Disease' },
    11: { name: 'Charlie Evans', age: 36, medicalHistory: 'Migraines' },
    12: { name: 'Eve Davis', age: 29, medicalHistory: 'Depression' },
    13: { name: 'John Brown', age: 33, medicalHistory: 'Back Pain' },
    14: { name: 'Jane Johnson', age: 41, medicalHistory: 'Liver Disease' },
    15: { name: 'Alice Smith', age: 39, medicalHistory: 'Anemia' },
    16: { name: 'Bob Doe', age: 46, medicalHistory: 'Arthritis' },
    17: { name: 'Charlie Brown', age: 37, medicalHistory: 'Diabetes' },
    18: { name: 'Eve Smith', age: 31, medicalHistory: 'Asthma' },
  };
  