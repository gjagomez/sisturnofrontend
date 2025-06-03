
export const URI = 'http://localhost:8080/api/';

export  interface LoginInterface {
  id: string;
  email: string;
  nombre: string;
  avatar: string;
}

export  interface StatCardProps {
  title: string;
  value: string;
  info: string;
  color: string;
}

export interface EstadisticaInterface {
  clientesEnColaActual: number;
  tiempoPromedioEspera: number;
  tiempoPromedioFormateado: string;
  turnosCancelados: number;
  turnosCompletados: number;
  turnosEnAtencion:number;
  turnosPendientes: number;
}

export interface UsuariosInterface {
   id:number;
   email:string;
   nombre:string;
   clave:string;
   avatar:string;
}

export interface DrawerTiketProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface TurnoInterface{
  id: number;
  codigo: string;
  tipoServicio: string;
  estado: string;
  fechaCreacion: string;
  prioridad: string;
} 

export interface TurnosPendInterface {
  id: number;
  codigo: string;
  tipoServicio: string;
  estado: string;
  fechaCreacion: string;
  fechaAtencion: string;
  prioridad: string;
  tiempoEspera: number;
  comentario: string;
  dpicliente: string;
}