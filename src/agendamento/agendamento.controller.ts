import { Controller, Get, Post, Body, Param, Query, BadRequestException, Delete } from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';

@Controller('agendamento')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Post()
  async create(@Body() createAgendamentoDto: CreateAgendamentoDto) {
    try {
      return await this.agendamentoService.create(createAgendamentoDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Body('who') who: string
  ) {
    await this.agendamentoService.delete(id, who);
    return { message: 'Agendamento removido com sucesso.' };
  }

  @Get()
  findAll() {
    return this.agendamentoService.findAll();
  }

  @Get('disponiveis')
  async getMedicosDisponiveis(
    @Query('data') data: string,
    @Query('hora') hora: string,
  ) {
    if (!data || !hora) {
      throw new BadRequestException('Informe data e hora para buscar médicos disponíveis.');
    }
    return this.agendamentoService.getMedicosDisponiveis(data, hora);
  }

  @Get('filtro')
  async findByUserOrMedico(
    @Query('pacienteId') pacienteId?: string,
    @Query('medicoId') medicoId?: string,
  ) {
    const pacienteNum = pacienteId ? Number(pacienteId) : undefined;
    const medicoNum = medicoId ? Number(medicoId) : undefined;

    return this.agendamentoService.findByUserOrMedico(pacienteNum, medicoNum);
  }
}
