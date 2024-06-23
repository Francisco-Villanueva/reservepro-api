import { IWorkhour } from 'src/common/workhours';

const formatTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
// Función para obtener las opciones de horarios disponibles según el día seleccionado
export const getAvailableTimes = (
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
};
