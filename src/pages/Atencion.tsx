import React,{useState,useEffect}from "react";
import  {URI}  from "../config/conf"
import  type { TurnosPendInterface } from "../config/conf";


type ColumnType = "PENDIENTE" | "EN_ATENCION" | "CANCELADO" | "COMPLETADO";

const columns: { id: ColumnType; title: string; count: number; color: string; bgColor: string }[] = [
  { id: "PENDIENTE", title: "En cola", count: 3, color: "text-blue-600", bgColor: "bg-blue-50" },
  { id: "EN_ATENCION", title: "En progreso", count: 2, color: "text-orange-600", bgColor: "bg-orange-50" },
  { id: "CANCELADO", title: "Abandonado", count: 0, color: "text-red-600", bgColor: "bg-red-50" },
  { id: "COMPLETADO", title: "Finalizado", count: 1, color: "text-green-600", bgColor: "bg-green-50" },
];

const Atencion: React.FC = () => {
  const [datos, setdata] = useState<TurnosPendInterface[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TurnosPendInterface | null>(null);
  const [resolucion, setResolucion] = useState<string>("");

  const modalState = {
    isOpen,
    onClose: () => {
      setIsOpen(false);
      setSelectedTask(null);
      setResolucion("");
    },
  };

  useEffect(() => {
    LoadTurnos();
  }, []);

  const LoadTurnos = async () => {
    const uri = URI + 'turnos';
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Error al cargar los tickets');
      }
      const data = await response.json();
      setdata(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const finalizarTicket = () => {
    if (!selectedTask) return;
    console.log("Finalizar ticket:", selectedTask.id);
    console.log("Resolución:", resolucion);
    // Aquí puedes llamar a tu API para actualizar el ticket
    modalState.onClose();
  };

  return (
    <div>
      <div className="bg-white rounded-3xl p-8 mx-6 my-6" style={{ minHeight: 'calc(100vh - 48px)' }}>
        <div className="p-6 bg-white-50 min-h-screen">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Tareas</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <div key={column.id} className={`rounded-xl shadow-sm border border-gray-200 ${column.bgColor} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-sm font-semibold ${column.color}`}>{column.title}</h2>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${column.color} bg-white`}>
                      {datos.filter(task => task.estado === column.id).length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {datos
                    .filter((task) => task.estado === column.id)
                    .map((task) => (
                      <div
                        onClick={() => {
                          setSelectedTask(task);
                          setIsOpen(true);
                        }}
                        key={task.id}
                        className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${column.color} ${column.bgColor}`} />
                            <div className="text-xs text-gray-500 font-medium">#{task.id}</div>
                          </div>
                        </div>

                        <h3 className="text-sm font-semibold text-gray-800 mb-3 leading-relaxed group-hover:text-blue-600 transition-colors">
                          {task.tipoServicio}
                        </h3>

                        <div className="space-y-2 mb-4">
                          {task.comentario && (
                            <div className="bg-gray-50 rounded-lg p-2 border-l-3">
                              <div className="flex flex-col items-start gap-1">
                                <span className="font-mono ml-5"><strong>DPI:</strong> {task.dpicliente}</span>
                                <span className="font-mono ml-5"><strong>COMENTARIO:</strong> {task.comentario}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <span className="inline-block px-2 py-0.5 bg-orange-200 text-red-800 text-xs font-medium rounded-full">
                                {task.fechaCreacion}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center -space-x-1">
                            <img
                              src="https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-5.webp"
                              alt="Cliente"
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalState.isOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40" onClick={modalState.onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[100%] sm:w-[80%] md:w-[60%] lg:w-[40%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${modalState.isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Detalles del Ticket</h2>
          <button onClick={modalState.onClose} className="text-gray-600 hover:text-black text-xl">
            &times;
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-2 border-l-4 border-orange-500">
                <p className="font-mono"><strong>DPI:</strong> {selectedTask.dpicliente}</p>
                {selectedTask.comentario && (
                  <p className="font-mono"><strong>Comentario:</strong> {selectedTask.comentario}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolución</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Escribe cómo se resolvió el ticket..."
                  value={resolucion}
                  onChange={(e) => setResolucion(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={finalizarTicket}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Finalizar Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Atencion;
