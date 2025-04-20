import React from 'react';
import Link from 'next/link';
import { Logo } from './ui/Logo';

export function Footer() {
  return (
    <footer className="bg-dark-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <Logo className="text-white mb-6" />
            <p className="text-light-gray text-sm mt-4">
              Explorando y desarrollando el futuro del metaverso y las tecnologías inmersivas.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-condensed font-bold mb-6 text-primary-orange">Enlaces</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-light-gray hover:text-primary-orange transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#servicios" className="text-light-gray hover:text-primary-orange transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="#investigacion" className="text-light-gray hover:text-primary-orange transition-colors">
                  Investigación
                </Link>
              </li>
              <li>
                <Link href="#acerca" className="text-light-gray hover:text-primary-orange transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="#contacto" className="text-light-gray hover:text-primary-orange transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-condensed font-bold mb-6 text-primary-orange">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-light-gray hover:text-primary-orange transition-colors">
                  Publicaciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-light-gray hover:text-primary-orange transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-light-gray hover:text-primary-orange transition-colors">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-light-gray hover:text-primary-orange transition-colors">
                  Biblioteca
                </Link>
              </li>
              <li>
                <Link href="#" className="text-light-gray hover:text-primary-orange transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-condensed font-bold mb-6 text-primary-orange">Boletín</h3>
            <p className="text-light-gray text-sm mb-4">
              Suscríbete a nuestro boletín para recibir las últimas noticias y actualizaciones.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="flex-grow p-2 rounded-l-md text-dark-blue focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary-orange px-4 rounded-r-md hover:bg-opacity-90 transition-colors"
              >
                →
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-light-blue/20 pt-8 mt-10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-light-gray text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CentroMundoX - Universidad Metropolitana. Todos los derechos reservados.
          </p>
          
          <div className="flex space-x-4">
            <Link href="#" className="text-light-gray hover:text-primary-orange transition-colors text-sm">
              Política de Privacidad
            </Link>
            <Link href="#" className="text-light-gray hover:text-primary-orange transition-colors text-sm">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 