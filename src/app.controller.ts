import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  health(@Res() res: Response) {
    res.status(HttpStatus.OK).send();
  }

  @Get('validate')
  async validate(@Headers('pass') pass: string, @Query('cpf') cpf: string) {
    const auth = this.appService.authTypebot(pass);
    if (!auth) {
      throw new BadRequestException('wrong password');
    }

    try {
      const result = await this.appService.validateCpf(cpf);
      return result;
    } catch (error) {
      console.log('@ error', error);
    }
  }
}
