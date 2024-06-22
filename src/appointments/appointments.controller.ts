import { Controller, Get } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Get()
  async getAll() {
    try {
      return await this.appointmentService.getAll();
    } catch (error) {
      return error;
    }
  }
}
