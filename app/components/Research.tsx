import React from 'react';
import Link from 'next/link';

const researchAreas = [
  {
    title: 'Interacciones Sociales en Entornos Virtuales',
    description: 'Investigamos cómo las interacciones sociales cambian y evolucionan en espacios virtuales compartidos.',
    color: 'bg-dark-blue'
  },
  {
    title: 'Economías Digitales y Tokens No Fungibles',
    description: 'Analizamos las oportunidades y desafíos de las nuevas economías digitales basadas en blockchain.',
    color: 'bg-primary-orange'
  },
  {
    title: 'Interfaces Cerebro-Computadora',
    description: 'Exploramos nuevas formas de interacción entre humanos y entornos virtuales a través de interfaces neuronales.',
    color: 'bg-light-blue'
  },
  {
    title: 'Identidad Digital y Avatares',
    description: 'Estudiamos cómo las personas construyen y proyectan sus identidades en el metaverso.',
    color: 'bg-wine'
  }
];

export function Research() {
  return (
    <section id="investigacion" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">
            Líneas de <span className="text-primary-orange">Investigación</span>
          </h2>
          <p className="text-medium-gray max-w-2xl mx-auto">
            Nuestros equipos de investigación trabajan en diversas áreas de vanguardia
            relacionadas con el metaverso y sus aplicaciones.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {researchAreas.map((area, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg group">
              <div className={`${area.color} h-3 w-full`}></div>
              <div className="p-8">
                <h3 className="text-xl font-condensed font-bold text-dark-blue mb-3">{area.title}</h3>
                <p className="text-medium-gray mb-4">{area.description}</p>
                <Link 
                  href="#"
                  className="flex items-center font-medium text-primary-orange group-hover:translate-x-2 transition-transform"
                >
                  <span>Saber más</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Link
            href="#"
            className="px-8 py-3 border-2 border-primary-orange text-primary-orange font-condensed font-bold rounded-md hover:bg-primary-orange hover:text-white transition-colors text-center"
          >
            Ver todas las investigaciones
          </Link>
        </div>
      </div>
    </section>
  );
} 