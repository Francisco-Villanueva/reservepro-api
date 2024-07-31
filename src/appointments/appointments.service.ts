import { Inject, Injectable } from '@nestjs/common';
import { Appointment, AppointmentModel } from './schema/appointment.schema';
import { AppointmentDTO } from './dto/appointment.dto';
import { MemberModel } from 'src/members/schema/member.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENT_MODEL')
    private readonly appointmentModel: AppointmentModel,
    @Inject('MEMBER_MODEL') private readonly memberModel: MemberModel,
  ) {}

  async getAll(availables: boolean): Promise<Appointment[]> {
    if (availables) {
      return await this.appointmentModel.find({ canceled: !availables });
    }
    return await this.appointmentModel.find();
  }
  async findById(_id: Appointment['_id']): Promise<Appointment> {
    return await this.appointmentModel.findById({ _id });
  }
  async create(data: AppointmentDTO): Promise<Appointment> {
    const newAppointment = await this.appointmentModel.create(data);

    await this.addMemberToAppointment({
      appointmentId: newAppointment._id,
      memberId: data.memberId,
    });

    return newAppointment;
  }
  async findByAppointmentInfo(data: {
    memberId: string;
    time: string;
    date: string;
  }) {
    return this.appointmentModel.findOne({
      memberId: data.memberId,
      time: data.time,
      date: data.date,
      canceled: false,
    });
  }

  async getByMemberId(memberId: string): Promise<Appointment[]> {
    return this.appointmentModel.find({ memberId });
  }

  async cancelAppointment(appointmentId: Appointment['_id'], memberId: string) {
    const appointment = await this.findById(appointmentId);
    appointment.canceled = true;
    await appointment.save();

    const member = await this.memberModel.findById(memberId);
    member.appointments = member.appointments.filter(
      (appId) => appId.toString() !== appointment._id.toString(),
    );

    await member.save();
    return appointment;
  }
  async addMemberToAppointment({
    appointmentId,
    memberId,
  }: {
    appointmentId: Appointment['_id'];
    memberId: string;
  }) {
    const appointment = await this.findById(appointmentId);
    const member = await this.memberModel.findById(memberId);

    if (!appointment || !member) {
      throw new Error('Data error, memberId or CompanyId are not ok.');
    }
    if (appointment && member) {
      appointment.memberId = member._id;
      await appointment.save();

      member.appointments.push(appointment._id);
      await member.save();
    }
  }
}
