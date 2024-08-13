import { create } from 'zustand';

interface AppointmentState {
  currentAppointment: any; // Remplacez `any` par le type approprié pour votre `appointment`
  setCurrentAppointment: (appointment: any) => void; // Idem ici
}

const useAppointmentStore = create<AppointmentState>((set) => ({
  currentAppointment: null,
  setCurrentAppointment: (appointment) => set({ currentAppointment: appointment }),
}));

export default useAppointmentStore;
