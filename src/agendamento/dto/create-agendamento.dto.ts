export class CreateAgendamentoDto {
  pacienteId: number;
  medicoId: number;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  sala: string;
  telefone: string;
  who?: string;
}
