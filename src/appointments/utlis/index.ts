import { IWorkhour } from 'src/common/workhours';
import { Appointment } from '../schema/appointment.schema';

const formatTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
// Función para obtener las opciones de horarios disponibles según el día seleccionado
/*export const getAvailableTimes = (
  workhours: IWorkhour[],
  selectedDay: number,
): string[] => {
  const selectedWorkhours = workhours.find((wh) => wh.day === selectedDay);
  if (!selectedWorkhours) return [];

  const listOfHours = selectedWorkhours.segments.map(
    ({ startime, endTime, duration }) => {
      const availableTimes: string[] = [];
      let currentTime = startime;
      while (currentTime <= endTime) {
        availableTimes.push(currentTime);
        const [hours, minutes] = currentTime.split(':');
        const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
        currentTime = formatTime(totalMinutes + duration);
      }

      return availableTimes;
    },
  );

  return listOfHours.join().split(',');
};*/

const isTimeSlotAvailable = (startTime, duration, appointments) => {
  const [startHours, startMinutes] = startTime.split(':');
  const startTotalMinutes = parseInt(startHours) * 60 + parseInt(startMinutes);
  const endTotalMinutes = startTotalMinutes + duration;

  return appointments.every((app) => {
    if (app.canceled) return true;

    const [appHours, appMinutes] = app.time.split(':');
    const appStartTotalMinutes = parseInt(appHours) * 60 + parseInt(appMinutes);
    const appEndTotalMinutes = appStartTotalMinutes + app.duration;

    // Check if the appointment conflicts with the current time slot
    return (
      endTotalMinutes <= appStartTotalMinutes ||
      startTotalMinutes >= appEndTotalMinutes
    );
  });
};
export const getAvailableTimes = (
  workhours: IWorkhour[],
  selectedDay: number,
  duration: number,
  appointments: Appointment[],
) => {
  const selectedWorkhours = workhours.find((wh) => wh.day === selectedDay);
  if (!selectedWorkhours) return [];

  const availableTimes = [];

  selectedWorkhours.segments.forEach(({ startime, endTime }) => {
    let currentTime = startime;
    while (currentTime <= endTime) {
      const [hours, minutes] = currentTime.split(':');
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
      const endOfService = formatTime(totalMinutes + duration);

      // Verifica si el servicio cabe dentro del horario segmentado
      if (
        endOfService <= endTime &&
        isTimeSlotAvailable(currentTime, duration, appointments)
      ) {
        availableTimes.push(currentTime);
      }

      currentTime = formatTime(totalMinutes + duration);
    }
  });

  return availableTimes;
};
