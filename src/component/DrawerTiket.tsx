import React, { useState } from 'react';
import { Fingerprint, ClipboardList, MessageSquare } from 'lucide-react';
import { URI } from '../config/conf';

const DrawerTiket = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    tipoServicio: '',
    prioridad: '',
    dpicliente: '',
    comentario: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

 const handleChange = (field: string, value: string | number) => {
  setFormData(prev => ({
    ...prev,
    [field]: value,
  }));
};

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.dpicliente) newErrors.dpicliente = 'El dpicliente es requerido';
    if (!formData.tipoServicio) newErrors.tipoServicio = 'Selecciona un servicio';
    if (!formData.comentario) newErrors.comentario = 'Agrega un comentario';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
     const uri=URI+ 'turnosmq';
     console.log(JSON.stringify(formData));
     const response = await fetch(uri, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
       
        if (response.ok) {
           onClose();
          //const usuario = await response.json();
         
          //console.log(usuario)
        } else {
          setErrors(prev => ({ ...prev, general: 'Credenciales inválidas' }));
        }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[100%] sm:w-[80%] md:w-[60%] lg:w-[40%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Detalles del Ticket</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">
            &times;
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          <form className="space-y-5" onSubmit={handleSubmit}>
           {/* Tipo de servicio */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <ClipboardList className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  value={formData.tipoServicio}
                  onChange={(e) => handleChange('tipoServicio', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border rounded-lg focus:outline-none transition-colors ${
                    errors.tipoServicio ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="CAJA">Cajas o Pagos</option>
                  <option value="INFORMACION">Informacion</option>
                  <option value="RECLAMOS">Reclamos</option>
                  <option value="SERVICIO_CLIENTE">Soporte Técnico</option>
                </select>
              </div>
              {errors.tipoServicio && (
                <p className="mt-1 text-sm text-red-500">{errors.tipoServicio}</p>
              )}
            </div>
             {/* Prioridad */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <ClipboardList className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  value={formData.prioridad}
                  onChange={(e) => handleChange('prioridad', Number(e.target.value))}
                  className={`w-full pl-12 pr-4 py-4 border rounded-lg focus:outline-none transition-colors ${
                    errors.prioridad ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                >
                  <option value="">Selecciona un prioridad</option>
                  <option value="1">Alta</option>
                  <option value="2">Baja</option>
                  <option value="3">Medio</option>
                </select>
              </div>
              {errors.prioridad && (
                <p className="mt-1 text-sm text-red-500">{errors.prioridad}</p>
              )}
            </div>
            {/* dpicliente */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Fingerprint className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.dpicliente}
                  onChange={(e) => handleChange('dpicliente', e.target.value)}
                  placeholder="dpicliente"
                  className={`w-full pl-12 pr-4 py-4 border rounded-lg focus:outline-none transition-colors ${
                    errors.dpicliente ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.dpicliente && <p className="mt-1 text-sm text-red-500">{errors.dpicliente}</p>}
            </div>

          
       
          
            {/* Comentario */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-3">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  value={formData.comentario}
                  onChange={(e) => handleChange('comentario', e.target.value)}
                  placeholder="Comentario adicional"
                  rows={4}
                  className={`w-full pl-12 pr-4 py-4 border rounded-lg focus:outline-none transition-colors resize-none ${
                    errors.comentario ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.comentario && (
                <p className="mt-1 text-sm text-red-500">{errors.comentario}</p>
              )}
            </div>

            {/* Botón enviar */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DrawerTiket;
