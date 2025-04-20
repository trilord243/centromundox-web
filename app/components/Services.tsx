import React from 'react';

const services = [
  {
    icon: '🔍',
    title: 'Investigación Aplicada',
    description: 'Desarrollamos proyectos de investigación aplicada en metaverso y entornos virtuales con enfoque en casos reales.'
  },
  {
    icon: '🎓',
    title: 'Formación Especializada',
    description: 'Ofrecemos programas de formación en tecnologías inmersivas, desarrollo 3D y fundamentos del metaverso.'
  },
  {
    icon: '🤝',
    title: 'Consultoría',
    description: 'Brindamos asesoría a empresas e instituciones sobre implementación y estrategias en el metaverso.'
  },
  {
    icon: '🚀',
    title: 'Desarrollo de Prototipos',
    description: 'Creamos entornos virtuales personalizados y prototipos de experiencias inmersivas para diversos sectores.'
  },
  {
    icon: '🌐',
    title: 'Alianzas Estratégicas',
    description: 'Establecemos colaboraciones con instituciones globales para compartir conocimiento e impulsar la innovación.'
  },
  {
    icon: '📊',
    title: 'Análisis de Tendencias',
    description: 'Estudiamos y reportamos las últimas tendencias y avances en el campo del metaverso y tecnologías inmersivas.'
  }
];

export function Services() {
  return (
    <section id="servicios" className="py-20 bg-light-gray/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">
            Nuestros <span className="text-primary-orange">Servicios</span>
          </h2>
          <p className="text-medium-gray max-w-2xl mx-auto">
            El CentroMundoX ofrece un amplio catálogo de servicios especializados
            en tecnologías del metaverso e investigación aplicada.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-light-gray hover:border-primary-orange"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-condensed font-bold text-dark-blue mb-3">{service.title}</h3>
              <p className="text-medium-gray">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 