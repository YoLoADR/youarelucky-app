import { useState } from 'react';
import { db } from '@/firebase'; // Assurez-vous d'importer correctement la configuration Firebase
import firebase from 'firebase/compat/app';

const useManageAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addAppointmentAndMarkDoctorBusy = async (selectedDoctor, selectedDate, selectedHour, patientDetails, user, selectedPackage) => {
    setIsLoading(true);
    setError(null);

    try {
      const availabilitySnapshot = await db
        .collection("doctors-availabilities")
        .where("doctorId", "==", selectedDoctor.id)
        .where("date", "==", selectedDate)
        .get();

      if (availabilitySnapshot.empty) {
        setError("No available slot found for the specified time");
        setIsLoading(false);
        return;
      }

      const availableTimesDoc = availabilitySnapshot.docs[0];
      const availableTimesData = availableTimesDoc.data();
      const availableTimes = availableTimesData.availableTimes;

      const selectedTimeSlot = availableTimes.find(
        (timeSlot) => timeSlot.startTime === selectedHour && timeSlot.available
      );

      if (!selectedTimeSlot) {
        setError("The selected time slot is not available");
        setIsLoading(false);
        return;
      }

      selectedTimeSlot.available = false;

      const appointment = {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        status: "Scheduled",
        appointmentType: selectedPackage.title,
        doctor: selectedDoctor.fullName,
        image: selectedDoctor.photoURL,
        fee: selectedPackage.price,
        time: selectedHour,
        userId: user.uid,
        patient: {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          bookingFor: patientDetails.bookingFor,
          age: patientDetails.age,
          gender: patientDetails.gender,
          purpose: patientDetails.problem,
          visitReason: patientDetails.visitReason
        },
        hasRemindMe: true,
        package: selectedPackage.title,
        address: user.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const appointmentRef = await db.collection("appointments").add(appointment);
      await availableTimesDoc.ref.update({ availableTimes });

      setIsLoading(false);
      return { ...appointment, id: appointmentRef.id }; // Return the created appointment with id
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const cancelAppointmentAndMarkDoctorAvailable = async (appointmentId, doctorId, date, time) => {
    setIsLoading(true);
    setError(null);

    try {
      // Récupération du document d'appointment par son ID
      const appointmentDoc = db.collection("appointments").doc(appointmentId);
      const appointmentData = (await appointmentDoc.get()).data();

      if (!appointmentData) {
        setError("Appointment not found");
        setIsLoading(false);
        return;
      }

      // Récupération de la disponibilité du docteur
      const availabilitySnapshot = await db
        .collection("doctors-availabilities")
        .where("doctorId", "==", doctorId)
        .where("date", "==", date)
        .get();

      if (availabilitySnapshot.empty) {
        setError("No availability found for the specified date");
        setIsLoading(false);
        return;
      }

      const availableTimesDoc = availabilitySnapshot.docs[0];
      const availableTimesData = availableTimesDoc.data();
      const availableTimes = availableTimesData.availableTimes;

      // Mise à jour de la disponibilité du créneau horaire
      const selectedTimeSlot = availableTimes.find(
        (timeSlot) => timeSlot.startTime === time && !timeSlot.available
      );

      if (!selectedTimeSlot) {
        setError("The selected time slot is already available");
        setIsLoading(false);
        return;
      }

      selectedTimeSlot.available = true;

      // Mise à jour de l'état de l'appointment à "Cancelled"
      await appointmentDoc.update({
        status: "Cancelled",
        updatedAt: new Date().toISOString(),
      });

      // Mise à jour de la disponibilité du docteur
      await availableTimesDoc.ref.update({ availableTimes });

      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      return false;
    }
  };

  const rescheduleAppointment = async (doctorId, oldDate, oldTime, newDate, newTime, selectedDoctor, selectedPackage, user, patientDetails) => {
    setIsLoading(true);
    setError(null);

    try {
      const cancelSuccess = await cancelAppointmentAndMarkDoctorAvailable(doctorId, oldDate, oldTime);
      if (!cancelSuccess) {
        setIsLoading(false);
        return null;
      }

      return await addAppointmentAndMarkDoctorBusy(selectedDoctor, newDate, newTime, patientDetails, user, selectedPackage);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      return null;
    }
  };

  const getUserAppointments = async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      const userAppointmentsSnapshot = await db
        .collection("appointments")
        .where("userId", "==", userId)
        .get();

      const userAppointments = userAppointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setIsLoading(false);
      return userAppointments;
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      return [];
    }
  };

  return { addAppointmentAndMarkDoctorBusy, cancelAppointmentAndMarkDoctorAvailable, rescheduleAppointment, getUserAppointments, isLoading, error };
};

export default useManageAppointment;
