import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { MembersService } from 'src/members/members.service';
import { AppointmentDTO, SlotAppointmentDTO } from './dto/appointment.dto';
import { getAvailableTimes } from './utlis';
import { IWorkhour } from 'src/common/workhours';
import { Appointment } from './schema/appointment.schema';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentService: AppointmentsService,
    private readonly memberService: MembersService,
  ) {}

  async getSlotsByDate(memberId: string, date: string) {
    const member = await this.memberService.getById(memberId);
    if (!member) {
      throw new UnauthorizedException('Member not found.');
    }
    const appointments = await this.appointmentService.getByMemberId(memberId);
    const selectedDate = new Date(date).getDay();
    const availableTimes = getAvailableTimes(member.workhours, selectedDate);
    const res = availableTimes.map((hs) => ({
      hs,
      availble: appointments.filter((app) => app.time === hs).length === 0,
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
  async getAll() {
    try {
      return await this.appointmentService.getAll();
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

      return await this.appointmentService.create(data);
    } catch (error) {
      return error;
    }
  }

  @Post('cancel')
  async cancel(
    @Body()
    {
      appointmemntId,
      memberId,
    }: {
      appointmemntId: Appointment['_id'];
      memberId: string;
    },
  ) {
    try {
      const member = await this.memberService.getById(memberId);
      if (!member) {
        throw new UnauthorizedException('Member not found.');
      }
      const appointment =
        await this.appointmentService.findById(appointmemntId);
      if (!appointment) {
        throw new UnauthorizedException('Appointment not found.');
      }

      return await this.appointmentService.cancelAppointment(
        appointmemntId,
        memberId,
      );
    } catch (error) {
      return error;
    }
  }
}
