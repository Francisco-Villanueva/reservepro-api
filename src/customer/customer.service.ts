import { Inject, Injectable } from '@nestjs/common';
import {
  APPOINTMENT_MODEL,
  CUSTOMER_MODEL,
} from 'src/common/providers/constants';
import { Customer, CustomerModel } from './schema/customer.schema';
import { CreateCustomerDTO } from './dto/customer.dto';
import {
  Appointment,
  AppointmentModel,
} from 'src/appointments/schema/appointment.schema';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_MODEL) private readonly customerModel: CustomerModel,
    @Inject(APPOINTMENT_MODEL)
    private readonly appointmentModel: AppointmentModel,
  ) {}

  private async getAppointment(id: string) {
    return await this.appointmentModel.findById(id);
  }
  async getAll(): Promise<Customer[]> {
    return this.customerModel.find().populate('apointments').exec();
  }
  async getById(id: string): Promise<Customer> {
    return this.customerModel.findById(id);
  }
  async getByEmail(email: string): Promise<Customer> {
    return this.customerModel.findOne({
      email,
    });
  }
  async create(data: CreateCustomerDTO) {
    return await this.customerModel.create(data);
  }
  async delete(id: string) {
    return await this.customerModel.findByIdAndDelete(id);
  }

  async addAppointment(appointment: Appointment, customer: Customer) {
    await this.appointmentModel.findById(appointment._id);
    customer.apointments.push(appointment);
    await customer.save();

    return customer;
  }
  async cancleAppointment(appointment: Appointment, customer: Customer) {
    customer.apointments.find(
      (app) => String(app._id) === String(appointment._id),
    ).canceled = true;
    const appointmentCanceled = customer.apointments.find(
      (app) => String(app._id) === String(appointment._id),
    );

    const restOfAppointments = customer.apointments.filter(
      (app) => String(app._id) !== String(appointment._id),
    );

    const newAppointments = [...restOfAppointments, appointmentCanceled];
    await this.customerModel.updateOne(
      {
        _id: customer._id,
      },
      {
        apointments: newAppointments,
      },
    );

    return customer;
  }
}
