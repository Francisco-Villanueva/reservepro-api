import { Inject, Injectable } from '@nestjs/common';
import { Appointment, AppointmentModel } from './schema/appointment.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENT_MODEL')
    private readonly appointmentModel: AppointmentModel,
  ) {}

  async getAll(): Promise<Appointment[]> {
    return this.appointmentModel.find();
  }
  async findById(id: string): Promise<Appointment> {
    return this.appointmentModel.findById({ _id: id });
  }
}
