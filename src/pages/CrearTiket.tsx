import React, { useState, useEffect } from 'react';
import {  
  Plus,
  Filter,
  MoreVertical,
  Calendar,
  Search,
  ChevronDown,
  Edit2,
} from 'lucide-react';
import DrawerTiket from '../component/DrawerTiket';
import { URI } from '../config/conf';
import type { TurnoInterface } from '../config/conf';

const CrearTiket = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [Tiket, setTiket] = useState<TurnoInterface[]>([]);
  const [activeTab, setActiveTab] = useState('Todos');
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // tickets por página
  
  useEffect(() => {
    LoadTurnos();
  }, []);

  // Resetear página cuando cambie el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const LoadTurnos = async () => {
    const uri = URI + 'turnos';
    try {
      const response = await fetch(uri); 
      if (!response.ok) {
        throw new Error('Error al cargar los tickets');
      }
      const data = await response.json();
      console.log(JSON.stringify(data));
      setTiket(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para obtener el color del estado
  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'en_atencion':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Función para generar avatar con iniciales
  const getInitials = (name: any) => {
    if (!name) return 'TK';
    return name.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  // Función para contar tickets por estado
  const getTicketCountByStatus = (status: any) => {
    return Tiket.filter(ticket => 
      ticket.estado?.toLowerCase() === status.toLowerCase()
    ).length;
  };

  // Función para filtrar tickets por estado
  const getFilteredTickets = () => {
    if (activeTab === 'Todos') return Tiket;
    return Tiket.filter(ticket => 
      ticket.estado?.toLowerCase() === activeTab.toLowerCase()
    );
  };

  // Pestañas de estado con conteo real
  const tabs = [
    { name: 'Todos', count: Tiket.length },
    { name: 'PENDIENTE', count: getTicketCountByStatus('pendiente') },
    { name: 'EN_ATENCION', count: getTicketCountByStatus('en_atencion') },
    { name: 'COMPLETADO', count: getTicketCountByStatus('completado') },
    { name: 'CANCELADO', count: getTicketCountByStatus('cancelado') },
  ];

  // Cálculos para paginación con filtros
  const filteredTickets = getFilteredTickets();
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="bg-white rounded-3xl p-8 mx-6 my-6" style={{ minHeight: 'calc(100vh - 48px)' }}>
        {/* Pestañas de estado */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.name 
                    ? 'bg-orange-100 text-black-600 border border-red-400' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{tab.name}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  tab.name === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-600' :
                  tab.name === 'EN_ATENCION' ? 'bg-blue-100 text-blue-600' :
                  tab.name === 'COMPLETADO' ? 'bg-green-100 text-green-600' :
                  tab.name === 'CANCELADO' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Header con controles */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm bg-white">
                <option>Role</option>
                <option>Admin</option>
                <option>User</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsDrawerOpen(true)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nuevo Ticket</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
          <div className="overflow-x-auto">
           <table className="w-full">
  <thead className="bg-orange-100">
    <tr>
      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
        <input type="checkbox" className="rounded border-gray-300" />
      </th>
      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
        <div className="flex items-center space-x-1">
          <span>TIKET</span>
          <span className="text-xs">↑</span>
        </div>
      </th>
      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">SERVICIO</th>
      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ESTADO</th>
      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">PRIORIDAD</th>
      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ACCION</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {currentTickets.map((ticket, index) => (
      <tr
        key={ticket.id}
        className={`transition-colors hover:bg-orange-100 ${
          index % 2 === 0 ? 'bg-orange-50' : 'bg-orange-75'
        }`}
      >
        <td className="py-3 px-4">
          <input type="checkbox" className="rounded border-gray-300" />
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {getInitials(ticket.codigo)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{ticket.codigo}</p>
              <p className="text-xs text-gray-500">{ticket.estado}</p>
            </div>
          </div>
        </td>
        <td className="py-3 px-4">
          <span className="text-sm text-orange-600 font-medium">{ticket.tipoServicio}</span>
        </td>
        <td className="py-3 px-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.estado)}`}>
            {ticket.estado}
          </span>
        </td>
        <td className="py-3 px-4">
          <span className="text-sm text-gray-900">{ticket.prioridad}</span>
        </td>
        <td className="py-3 px-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          </div>

          {/* Footer con paginación */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="flex items-center space-x-2">
             
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Pagina: 
                <select className="ml-2 border-none bg-transparent font-medium">
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                </select>
              </div>
              
              <span className="text-sm text-gray-600">
                {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTickets.length)} of {filteredTickets.length}
              </span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        <DrawerTiket
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </div>
  );
};

export default CrearTiket;