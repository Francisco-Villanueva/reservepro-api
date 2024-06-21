interface Company {
  name: string;
  tenantName: string;
  image?: string;
  category: string[];
  address: string;
  coin: string;
  status: boolean;
  services: string[];
}
interface Member {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  status: boolean;
  isAdmin: boolean;
  role: 'admin' | 'employee';
  companyId: string; // esto puede ser para ubicar a que sucursar corresponde
}

interface Appointment {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  time: string;
  date: string;
  userId: string[];
  address: string;
  coin: string;
  status: boolean;
}
interface AppointmentSlots {
  appointmentId: string;
  userId: string;
  time: string;
  date: string;
  status: boolean;
}
