import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const GroupSubsection = (): JSX.Element => {
  const steps = [
    {
      title: "Em Triagem",
      icon: "/vote-yea-solid.svg",
      isActive: true,
      bgColor: "bg-blue-50",
      textColor: "text-blue-900",
      fontClass: "font-semibold text-lg",
      description: "Ideias sendo analisadas pela IA",
      borderColor: "border-blue-200"
    },
    {
      title: "Em Avaliação",
      icon: "/check-circle-8.svg",
      isActive: false,
      bgColor: "bg-white",
      textColor: "text-gray-700",
      fontClass: "font-medium text-lg",
      description: "Aguardando análise humana",
      borderColor: "border-gray-200"
    },
    {
      title: "Implementadas",
      icon: "/times-circle-solid.svg",
      isActive: false,
      bgColor: "bg-white",
      textColor: "text-gray-700",
      fontClass: "font-medium text-lg",
      description: "Ideias já colocadas em prática",
      borderColor: "border-gray-200"
    },
  ];

  return (
    <section className="w-full max-w-[1140px] mx-auto">
      <style>{`
        @keyframes pulse-blue {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        
        .step-card {
          transition: all 0.3s ease;
          cursor: pointer;
          height: 100%;
          position: relative;
        }
        
        .step-card:hover {
          transform: translateY(-5px);
        }
        
        .step-card.active:hover {
          animation: pulse-blue 1.5s infinite;
        }
      `}</style>
      
      <div className="grid grid-cols-3 gap-6 h-[120px] mb-4">
        {steps.map((step, index) => (
          <Card
            key={index}
            className={`step-card ${step.isActive ? 'active' : ''} ${step.bgColor} ${step.borderColor} border-2 rounded-lg h-full shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <CardContent className="relative h-full p-6 flex flex-col items-center justify-center">
              <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center ${
                step.isActive 
                  ? "bg-blue-600 shadow-lg" 
                  : "bg-gray-100 border-2 border-gray-300"
              }`}>
                <span className={`font-bold text-lg ${
                  step.isActive ? "text-white" : "text-gray-600"
                }`}>
                  {index + 1}
                </span>
              </div>
              
              <div className={`${step.textColor} ${step.fontClass} text-center w-full mb-2 leading-tight`}>
                {step.title}
              </div>
              
              <div className={`text-sm text-center leading-relaxed ${
                step.isActive ? "text-blue-700" : "text-gray-500"
              }`}>
                {step.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 h-1">
        {steps.map((step, index) => (
          <div
            key={`progress-${index}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              step.isActive 
                ? "bg-blue-600 shadow-sm" 
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
};