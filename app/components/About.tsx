import React from 'react';

export function About() {
  return (
    <section id="acerca" className="py-20 bg-dark-blue text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Acerca del <span className="text-primary-orange">CentroMundoX</span>
            </h2>
            
            <p className="mb-6 text-light-gray">
              El Centro de Investigación de Metaverso (CentroMundoX) de la Universidad Metropolitana 
              nace como respuesta a la creciente importancia de los entornos virtuales inmersivos y 
              su impacto en diversos sectores de la sociedad.
            </p>
            
            <p className="mb-6 text-light-gray">
              Fundado en 2023, nuestro centro reúne a investigadores multidisciplinarios, desarrolladores, 
              diseñadores y expertos en diversas áreas para explorar y dar forma al futuro del metaverso.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-10">
              <div>
                <h3 className="text-xl font-condensed font-bold text-primary-orange mb-3">Misión</h3>
                <p className="text-light-gray">
                  Investigar, desarrollar y promover tecnologías y aplicaciones del metaverso 
                  que beneficien a la educación, cultura y desarrollo económico de Venezuela y la región.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-condensed font-bold text-primary-orange mb-3">Visión</h3>
                <p className="text-light-gray">
                  Ser el centro de referencia en Latinoamérica para la investigación, desarrollo y 
                  formación en tecnologías del metaverso y sus aplicaciones.
                </p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="col-span-2 bg-light-blue/20 rounded-lg p-6 flex flex-col justify-center">
                <h3 className="text-xl font-condensed font-bold mb-2">Nuestros Valores</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary-orange rounded-full mr-2"></div>
                    <span>Innovación constante</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary-orange rounded-full mr-2"></div>
                    <span>Colaboración multidisciplinaria</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary-orange rounded-full mr-2"></div>
                    <span>Ética y responsabilidad</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary-orange rounded-full mr-2"></div>
                    <span>Excelencia académica</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-wine/20 rounded-lg p-6">
                <h3 className="text-xl font-condensed font-bold mb-2">Equipo</h3>
                <p>
                  Investigadores, desarrolladores y diseñadores multidisciplinarios.
                </p>
              </div>
              
              <div className="bg-primary-orange/20 rounded-lg p-6">
                <h3 className="text-xl font-condensed font-bold mb-2">Alianzas</h3>
                <p>
                  Colaboraciones con universidades e instituciones internacionales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 