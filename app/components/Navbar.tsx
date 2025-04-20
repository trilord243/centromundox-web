import React from 'react';
import Link from 'next/link';
import { Logo } from './ui/Logo';

export function Navbar() {
  return (
    <header className="w-full py-4 border-b border-light-gray">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo />
        
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="font-condensed font-medium hover:text-primary-orange transition-colors">
            Inicio
          </Link>
          <Link href="#servicios" className="font-condensed font-medium hover:text-primary-orange transition-colors">
            Servicios
          </Link>
          <Link href="#investigacion" className="font-condensed font-medium hover:text-primary-orange transition-colors">
            Investigación
          </Link>
          <Link href="#acerca" className="font-condensed font-medium hover:text-primary-orange transition-colors">
            Acerca de
          </Link>
          <Link href="#contacto" className="font-condensed font-medium hover:text-primary-orange transition-colors">
            Contacto
          </Link>
        </nav>
        
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="font-condensed font-medium text-dark-blue hover:text-primary-orange transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/registro" 
            className="font-condensed font-medium px-4 py-2 bg-primary-orange text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Registro
          </Link>
        </div>
        
        <button className="md:hidden text-2xl">
          ☰
        </button>
      </div>
    </header>
  );
} 