'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-condensed font-bold text-dark-blue mb-6 text-center">
        Iniciar Sesión <span className="text-primary-orange">CentroMundoX</span>
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red/10 border border-red text-red rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-dark-blue">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-dark-blue">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
            placeholder="••••••••"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary-orange text-white font-condensed font-bold rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-medium-gray">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-primary-orange hover:underline font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
} 