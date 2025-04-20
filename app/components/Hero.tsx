import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="py-20 bg-gradient-to-br from-light-gray/30 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-blue mb-6">
              Explorando el futuro del <span className="text-primary-orange">Metaverso</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-medium-gray max-w-xl">
              El Centro de Investigación de Metaverso de UNIMET lidera la innovación 
              en tecnologías inmersivas, realidad virtual y experiencias digitales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/registro" 
                className="px-8 py-3 bg-primary-orange text-white font-condensed font-bold rounded-md hover:bg-opacity-90 transition-colors text-center"
              >
                Únete al Centro
              </Link>
              <Link 
                href="#investigacion" 
                className="px-8 py-3 border-2 border-dark-blue text-dark-blue font-condensed font-bold rounded-md hover:bg-dark-blue hover:text-white transition-colors text-center"
              >
                Conoce nuestras investigaciones
              </Link>
            </div>
            
            <div className="mt-10 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-dark-blue">25+</p>
                <p className="text-medium-gray">Investigadores</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-dark-blue">10+</p>
                <p className="text-medium-gray">Proyectos Activos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-dark-blue">5+</p>
                <p className="text-medium-gray">Alianzas Globales</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-dark-blue rounded-full opacity-20 blur-3xl transform -translate-x-10"></div>
              <div className="absolute inset-0 bg-primary-orange rounded-full opacity-20 blur-3xl transform translate-x-10"></div>
              
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-white shadow-xl flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-8 border-primary-orange flex items-center justify-center">
                    <div className="text-5xl font-bold font-condensed text-dark-blue">
                      META<span className="text-primary-orange">X</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 