import React, { useState } from 'react';
import { Mail, Lock, User, Image, Eye, EyeOff, Apple, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
interface LoginData {
  email: string;
  clave: string;
}

interface RegisterData {
  email: string;
  clave: string;
  nombre: string;
  avatar: string;
}

interface Errors {
  email: string;
  clave: string;
  nombre: string;
  general: string;
}

const LoginPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    clave: ''
  });
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    clave: '',
    nombre: '',
    avatar: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCustomAvatar, setShowCustomAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({
    email: '',
    clave: '',
    nombre: '',
    general: ''
  });
 
 const navigate = useNavigate()


  // Validaciones
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {
      email: '',
      clave: '',
      nombre: '',
      general: ''
    };
    
    if (isSignIn) {
      if (!loginData.email) {
        newErrors.email = 'El email es requerido';
      } else if (!validateEmail(loginData.email)) {
        newErrors.email = 'Email inválido';
      }
      
      if (!loginData.clave) {
        newErrors.clave = 'La contraseña es requerida';
      }
    } else {
      if (!registerData.email) {
        newErrors.email = 'El email es requerido';
      } else if (!validateEmail(registerData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!registerData.clave) {
        newErrors.clave = 'La contraseña es requerida';
      } else if (registerData.clave.length < 6) {
        newErrors.clave = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (!registerData.nombre) {
        newErrors.nombre = 'El nombre es requerido';
      }
    }
    setErrors(newErrors)
    return !newErrors.email && !newErrors.clave && !newErrors.nombre && !newErrors.general;
  };


  const handleLoginChange = (field: keyof LoginData, value: string) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'email' || field === 'clave') {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRegisterChange = (field: keyof RegisterData, value: string) => {
    setRegisterData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'email' || field === 'clave' || field === 'nombre') {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignIn) {
        const response = await fetch('http://localhost:8080/api/usuarios/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData)
        });
        if (response.ok) {
          const usuario = await response.json();
          localStorage.setItem('authToken', JSON.stringify(usuario))
          navigate('/principal')
        } else {
          setErrors(prev => ({ ...prev, general: 'Credenciales inválidas' }));
        }
      } else {

        const response = await fetch('http://localhost:8080/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData)
        });
        
        console.log('Datos de registro:', registerData);
        if (response.ok) {
          const usuario = await response.json();
          console.log('Usuario registrado:', usuario);
         
          setIsSignIn(true);
          setLoginData({
            email: registerData.email,
            clave: registerData.clave
          });
         
          setRegisterData({
            email: '',
            clave: '',
            nombre: '',
            avatar: ''
          });
       
          setErrors(prev => ({ 
            ...prev, 
            general: 'Usuario registrado exitosamente. Por favor inicia sesión.' 
          }));
        } else {
          const error = await response.json();
          setErrors(prev => ({ ...prev, general: error.message || 'Error al registrar usuario' }));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors(prev => ({ ...prev, general: 'Error al conectar con el servidor' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Login con:', provider);
  };

  
  const handleTabChange = (signIn: boolean) => {
    setIsSignIn(signIn);
    setErrors({
      email: '',
      clave: '',
      nombre: '',
      general: ''
    });
    setShowPassword(false);
    setShowCustomAvatar(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl flex overflow-hidden max-w-6xl w-full">
        {/* Sección izquierda - Formulario */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center mb-10">
            <div className="w-8 h-8 bg-black rounded-lg mr-3 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">Sistema de Turnos</span>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold mb-2">
            {isSignIn ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h1>
          <p className="text-gray-500 mb-8">
            {isSignIn 
              ? 'Por favor ingresa tus credenciales' 
              : 'Completa los datos para registrarte'}
          </p>

          {/* Tabs */}
          <div className="flex mb-8">
            <button
              onClick={() => handleTabChange(true)}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                isSignIn 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-400 border-b-2 border-transparent'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                !isSignIn 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-400 border-b-2 border-transparent'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              errors.general.includes('exitosamente') 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {errors.general}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignIn ? (
              <>
                {/* Login Form */}
                {/* Email */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => handleLoginChange('email', e.target.value)}
                      placeholder="Email"
                      className={`w-full pl-12 pr-4 py-4 border rounded-lg focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.clave}
                      onChange={(e) => handleLoginChange('clave', e.target.value)}
                      placeholder="Contraseña"
                      className={`w-full pl-12 pr-12 py-4 border rounded-lg focus:outline-none transition-colors ${
                        errors.clave ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.clave && (
                    <p className="mt-1 text-sm text-red-500">{errors.clave}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Register Form */}
                {/* Nombre */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={registerData.nombre}
                      onChange={(e) => handleRegisterChange('nombre', e.target.value)}
                      placeholder="Nombre completo"
                      className={`w-full pl-12 pr-4 py-4 border rounded-lg focus:outline-none transition-colors ${
                        errors.nombre ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => handleRegisterChange('email', e.target.value)}
                      placeholder="Email"
                      className={`w-full pl-12 pr-4 py-4 border rounded-lg focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.clave}
                      onChange={(e) => handleRegisterChange('clave', e.target.value)}
                      placeholder="Contraseña (mínimo 6 caracteres)"
                      className={`w-full pl-12 pr-12 py-4 border rounded-lg focus:outline-none transition-colors ${
                        errors.clave ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.clave && (
                    <p className="mt-1 text-sm text-red-500">{errors.clave}</p>
                  )}
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona un avatar (opcional)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-1.webp',
                      'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-2.webp',
                      'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-3.webp',
                      'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-4.webp',
                      'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-5.webp',
                      'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-10.webp',
                    ].map((avatarUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleRegisterChange('avatar', avatarUrl)}
                        className={`relative rounded-lg overflow-hidden transition-all ${
                          registerData.avatar === avatarUrl
                            ? 'ring-4 ring-blue-500 ring-offset-2'
                            : 'hover:ring-2 hover:ring-gray-300'
                        }`}
                      >
                        <img
                          src={avatarUrl}
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        {registerData.avatar === avatarUrl && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <div className="bg-blue-500 rounded-full p-1">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {/* Opción para URL personalizada */}
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setShowCustomAvatar(!showCustomAvatar)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showCustomAvatar ? 'Usar avatares predefinidos' : 'Usar URL personalizada'}
                    </button>
                  </div>
                  {showCustomAvatar && (
                    <div className="mt-2">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Image className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={registerData.avatar}
                          onChange={(e) => handleRegisterChange('avatar', e.target.value)}
                          placeholder="URL del avatar personalizado"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-medium transition-all ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Procesando...' : (isSignIn ? 'Iniciar Sesión' : 'Registrarse')}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-sm">O continuar con</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Apple className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-5 h-5 text-white" fill="white" />
            </button>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
            {isSignIn 
              ? 'Únete a millones de usuarios que confían en nosotros para resolver problemas.'
              : 'Al registrarte, aceptas nuestros términos de servicio y política de privacidad.'}
          </p>
        </div>

     
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-100 to-blue-300 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
        
            <div className="relative transform rotate-12">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-2xl relative">
               
                <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
                
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full shadow-inner relative">
                    <div className="absolute inset-2 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                   
                      <div className="relative w-20 h-20">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-16 bg-gray-600 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-16 h-1 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
               
                <div className="absolute -right-4 top-4 bottom-4 w-8 bg-gradient-to-l from-blue-700 to-blue-600 transform skew-y-12"></div>
                
                <div className="absolute -bottom-4 left-4 right-4 h-8 bg-gradient-to-t from-blue-700 to-blue-600 transform skew-x-12"></div>
              </div>
            </div>
          </div>
        
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/30 rounded-full blur-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;