import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { MembersService } from 'src/members/members.service';
import { AppointmentDTO, SlotAppointmentDTO } from './dto/appointment.dto';
import { getAvailableTimes } from './utlis';
import { IWorkhour } from 'src/common/workhours';
import { Appointment } from './schema/appointment.schema';
import { CustomerService } from 'src/customer/customer.service';
import { Customer } from 'src/customer/schema/customer.schema';
import { ICustomer } from 'src/customer/schema/customer.zod';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentService: AppointmentsService,
    private readonly memberService: MembersService,
    private readonly customerService: CustomerService,
  ) {}

  async getSlotsByDate(memberId: string, date: string) {
    const member = await this.memberService.getById(memberId);
    if (!member) {
      throw new UnauthorizedException('Member not found.');
    }
    const appointments = await this.appointmentService.getByMemberId(memberId);
    const selectedDate = new Date(date).getDay();
    const availableTimes = getAvailableTimes(member.workhours, selectedDate);

    const isAvaialable = (hs: string) => {
      if (appointments.filter((app) => app.time === hs).length === 0)
        return true;

      return !appointments
        .filter((app) => app.time === hs)
        .some((app) => !app.canceled);
    };
    const res = availableTimes.map((hs) => ({
      hs,
      availble: isAvaialable(hs),
    }));

    return res;
  }
  async validateAppointmentData(data: AppointmentDTO, workhours: IWorkhour[]) {
    const selectedWorkhours = workhours.find(
      (wh) => wh.day === new Date(data.date).getDay(),
    );
    if (!selectedWorkhours) {
      throw new UnauthorizedException('This day is not work day.');
    }
    for (const segment of selectedWorkhours.segments) {
      if (data.time >= segment.startime && data.time <= segment.endTime) {
        return true;
      }
    }

    throw new UnauthorizedException('This time is not avaialble.');
  }

  @Get()
  async getAll(@Query('availables') availables?: boolean) {
    try {
      return await this.appointmentService.getAll(availables);
    } catch (error) {
      return error;
    }
  }

  @Get('member-slots')
  async memberSlots(
    @Body()
    { memberId, date }: SlotAppointmentDTO,
  ) {
    try {
      return await this.getSlotsByDate(memberId, date);
    } catch (error) {
      return error;
    }
  }

  @Post()
  async create(@Body() data: AppointmentDTO) {
    try {
      const member = await this.memberService.getById(data.memberId);
      if (!member) {
        throw new UnauthorizedException('Member not found.');
      }
      if (member.companies.length == 0) {
        throw new UnauthorizedException('Member no tiene company');
      }

      await this.validateAppointmentData(data, member.workhours);

      const appointment = await this.appointmentService.findByAppointmentInfo({
        date: data.date,
        memberId: data.memberId,
        time: data.time,
      });

      if (appointment && !appointment.canceled) {
        throw new UnauthorizedException(
          'This appointment slot is not available.',
        );
      }

      const newAppointment = await this.appointmentService.create({
        ...data,
        member: member,
      });

      const customerInfo: ICustomer = {
        email: data.email,
        firstName: data.name,
        lastName: data.lastName,
        phone: data.phone,
      };

      const customer = await this.customerService.getByEmail(data.email);
      if (!customer) {
        const newCustomer = await this.customerService.create(customerInfo);
        await this.customerService.addAppointment(newAppointment, newCustomer);
      } else {
        await this.customerService.addAppointment(newAppointment, customer);
      }

      return newAppointment;
    } catch (error) {
      return error;
    }
  }

  @Post('cancel')
  async cancel(
    @Body()
    { appointmemntId }: { appointmemntId: Appointment['_id'] },
  ) {
    try {
      const appointment =
        await this.appointmentService.findById(appointmemntId);
      if (!appointment) {
        throw new UnauthorizedException('Appointment not found.');
      }
      const member = await this.memberService.getById(
        String(appointment.member._id),
      );
      if (!member) {
        throw new UnauthorizedException('Member not found.');
      }

      const customer = await this.customerService.getByEmail(appointment.email);
      await this.customerService.cancleAppointment(appointment, customer);
      await this.appointmentService.cancelAppointment(appointment, member);

      return 'Appointment cancelled successfully';
    } catch (error) {
      return error;
    }
  }
}
