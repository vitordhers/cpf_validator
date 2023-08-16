export interface CpfResponse {
  status: boolean;
  cpf: string;
  nome: string;
  nascimento: string;
  mae: string;
  genero: string;
  situacao?: string;
  risco?: Risk[];
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  uf?: string;
  ppe?: string[];
  pacoteUsado: number;
  consultaID: string;
  delay: number;
}

interface Risk {
  nivel: number;
  descricao: string;
  score: string;
}
