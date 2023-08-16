import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CpfCnpjPacket } from './enums/cpf-cnpj-packets.enum';
import { firstValueFrom } from 'rxjs';
import { CpfResponse } from './models/cpf-response.model';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  private typebotPass: string = this.configService.get<string>('TYPE_BOT_PASS');
  private cpfCnpjToken = this.configService.get<string>('CPFCNPJ_TOKEN');
  private cpfRegex = new RegExp(
    /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/,
  );

  constructor(
    private configService: ConfigService,
    private http: HttpService,
  ) {}

  authTypebot(password: string) {
    return password === this.typebotPass;
  }

  async validateCpf(cpf_input: string) {
    const cpf = cpf_input.replace(/[^\w]/g, '');
    let isValidCpf = false;
    if (
      cpf.length != 11 ||
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999'
    ) {
      isValidCpf = false;
    }
    isValidCpf = this.cpfRegex.test(cpf);

    if (!isValidCpf) {
      throw new BadRequestException('invalid cpf!');
    }

    const requestUrl = this.construct_query_endpoint(CpfCnpjPacket.CPF_C, cpf);
    try {
      const result = await firstValueFrom(
        this.http.get<CpfResponse>(requestUrl),
      );
      const data = (result as unknown as AxiosResponse<CpfResponse>).data;
      return data;
    } catch (error) {
      throw new InternalServerErrorException('bad request!');
    }
  }

  construct_query_endpoint(packet: CpfCnpjPacket, cpf: string) {
    return `https://api.cpfcnpj.com.br/${this.cpfCnpjToken}/${packet}/${cpf}`;
  }
}
