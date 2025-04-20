'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '../lib/auth';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    cedula: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      // Excluir confirmPassword del envío
      const { confirmPassword, ...registerData } = formData;
      await registerUser(registerData);
      
      // Redirigir al login después de un registro exitoso
      router.push('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-condensed font-bold text-dark-blue mb-6 text-center">
        Registro <span className="text-primary-orange">CentroMundoX</span>
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red/10 border border-red text-red rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-dark-blue">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="Tu nombre"
            required
          />
        </div>
        
        {/* Apellido */}
        <div>
          <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-dark-blue">
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-3 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="Tu apellido"
            required
          />
        </div>
        
        {/* Correo Electrónico */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-dark-blue">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
        
        {/* Cédula */}
        <div>
          <label htmlFor="cedula" className="block mb-2 text-sm font-medium text-dark-blue">
            Cédula
          </label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className="w-full p-3 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="12345678"
            required
          />
        </div>
        
        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-dark-blue">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="••••••••"
            required
          />
        </div>
        
        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-dark-blue">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="••••••••"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary-orange text-white font-condensed font-bold rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? 'Procesando...' : 'Registrarse'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-medium-gray">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-primary-orange hover:underline font-medium">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
} 