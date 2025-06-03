import React, { useState,useEffect } from 'react';
import { 
  Home, 
  Ticket, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Plus,
  Filter,
  MoreVertical,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  TrendingUp,
  Activity,
  LogOut,
  BarChart3,
  MessageCircle,
  Hash,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import type { LoginInterface,EstadisticaInterface,UsuariosInterface } from './config/conf';
import { URI } from './config/conf';
import StatCard from './component/StatCard';
import CrearTiket from './pages/CrearTiket';
import Atencion from './pages/Atencion';
const TicketAdminTemplate = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
   const navigate = useNavigate()
   const [Login, userLogin] = useState<LoginInterface>()
   const [Estadistica, setEstadistica] = useState<EstadisticaInterface>()
   const [usuarios, setUsuarios] = useState<UsuariosInterface[]>([])


 useEffect(() => {
    const token = localStorage.getItem('authToken')
    userLogin(JSON.parse(token || '{}') as LoginInterface)
    getMetrica()
    getTopPerformers()
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

const formatDate = (date: Date = new Date()): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  return `${day}-${month} ${monthName}`;
};

const getMetrica=async()=>{
const url=URI+'turnos/estadisticas'
 const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const dtest = await response.json();
          setEstadistica(dtest)
        } else {
          
        }
}

const getTopPerformers = async () => {
  const url=URI + "usuarios";
  const response=await fetch(url,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    const data = await response.json();
    setUsuarios(data);
  } else {
    console.error('Error fetching top performers:', response.statusText);
    return [];
  }
}

  const Sidebar = () => (
    <div className="bg-gradient-to-r  from-orange-100 to-orange-50 h-screen fixed left-0 top-0 rounded-r-lg">
      <div className="p-15">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md"></div>
          <h1 className="text-lg font-bold text-gray-900">Tiket</h1>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full mb-3 overflow-hidden">
            <img 
              src={Login?.avatar || 'https://cdn-icons-png.flaticon.com/512/13434/13434998.png'}
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="font-bold text-gray-900">{Login?.nombre}</h2>
          <p className="text-sm text-gray-500">Atencion al cliente</p>
        </div>
      </div>
      
      <nav className="px-4">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'insights', label: 'Tikets', icon: BarChart3 },
          { id: 'tickets', label: 'Crear Tiket', icon: Ticket },
          //{ id: 'comments', label: 'Comments', icon: MessageCircle },
          //{ id: 'channels', label: 'Channels', icon: Hash }
        ].map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-4 py-3 text-left rounded-xl mb-2 transition-all ${
              activeTab === item.id 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
            {index === 0 && activeTab === 'dashboard' && (
              <div className="ml-auto w-2 h-2 bg-red-300 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-6">
        <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="bg-white rounded-3xl p-8 mx-6 my-6" style={{ minHeight: 'calc(100vh - 48px)' }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Settings className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold">?</span>
            </div>
          </div>
          
          {/* Upgrade Card */}
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-4 flex items-center space-x-4">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">
                <span className="text-red-500">By Javier</span> Gomez
              </h3>
              <p className="text-xs text-gray-600">Carnet 1990-07-12940</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">UMG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <StatCard
          title="Pendientes"
          value={Estadistica?.clientesEnColaActual?.toString() || "0"}
          info="i"
          color="bg-blue-500"
        />
        <StatCard
          title="Cancelados"
          value={Estadistica?.turnosCancelados?.toString() || "0"}
          info="i"
          color="bg-red-500"
        />
        <StatCard
          title="Atendidos"
          value={Estadistica?.turnosCompletados?.toString() || "0"}
          info="i"
          color="bg-blue-600"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Actividades</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Los datos se actualizan cada 3 horas</span>
              <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm">
                <option>{formatDate()}</option>
              </select>
            </div>
          </div>
          
          <div className="relative h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
              <span>40k</span>
              <span>30k</span>
              <span>20k</span>
              <span>10k</span>
              <span>0 k</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-8 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="absolute w-full border-t border-gray-100"
                    style={{ top: `${i * 25}%` }}
                  />
                ))}
              </div>
              
              {/* Chart line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 0,80 Q 15,60 20,65 Q 35,50 40,55 Q 55,40 60,45 Q 75,30 80,35 Q 95,25 100,30"
                  stroke="#F59E0B"
                  strokeWidth="0.5"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              
              {/* Data point */}
              <div className="absolute top-8 right-4 bg-gray-100 rounded-lg px-3 py-2">
                <span className="text-sm font-bold text-gray-900">32,210</span>
                <span className="text-xs text-gray-500 ml-1">Visitas / dia</span>
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-400">
              {['01', '02', '03', '04', '05', '06', '07'].map(day => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Empleado */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Los de mejores desempeño</h3>
          <div className="space-y-4">
            {usuarios.map((performer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                 <img
                  src={performer.avatar || 'https://cdn-icons-png.flaticon.com/512/13434/13434998.png'}
                  className="size-12 flex-none rounded-full bg-gray-50"
                />
                  <div>
                    <p className="font-semibold text-gray-900">{performer.nombre}</p>
                    <p className="text-sm text-gray-500">{performer.email}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">{"0%"}</span>
              </div>
            ))}
          </div>
          <button className="text-sm text-gray-600 hover:text-gray-900 mt-4 flex items-center">
            Ver Todos <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Channels Section */}
      <div className="mt-12">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Canales</h3>
            <p className="text-sm text-gray-500">Estadistica de atenciones <strong>de 1 mes</strong> mes actual.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {/* Dribbble */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl mb-4">
              <div className="w-6 h-6 bg-pink-500 rounded-full"></div>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Caja</h4>
            <p className="text-sm text-gray-500 mb-4"></p>
            <div className="text-xl font-bold text-gray-900">0</div>
          </div>

          {/* Behance */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">Be</span>
              </div>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Informacion</h4>
            
            <div className="text-xl font-bold text-gray-900">0</div>
          </div>

          {/* Instagram */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg"></div>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Reclamos</h4>
            <p className="text-sm text-gray-500 mb-4"></p>
            <div className="text-xl font-bold text-gray-900">0</div>
          </div>

          {/* Pinterest */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">P</span>
              </div>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Servicio al cliente</h4>
            <p className="text-sm text-gray-500 mb-4"></p>
            <div className="text-xl font-bold text-gray-900">0</div>
          </div>

          {/* Full Stats */}
          <div className="bg-blue-400 rounded-2xl p-4 flex flex-col justify-between">
            <h4 className="text-white font-bold text-lg">Descargar todos</h4>
            <div className="flex justify-end">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tickets':
        return <CrearTiket />;
      case 'insights':
        return (
         <Atencion />
        );
      case 'comments':
        return (
          <Atencion />
        );
      case 'channels':
        return (
          <div className="bg-white rounded-3xl p-8 mx-6 my-6 text-center" style={{ minHeight: 'calc(100vh - 48px)' }}>
            <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Channels</h3>
            <p className="text-gray-600">Configuración de canales</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Sidebar />
      <main className="ml-48">
        {renderContent()}
      </main>
    </div>
  );
};

export default TicketAdminTemplate;