import React from "react";

export const FooterSubsection = (): JSX.Element => {
  const contactInfo = [
    {
      text: "Caixa Econômica Federal - Setor Bancário Sul, Quadra 4, Lotes 3/4",
    },
    {
      text: "CEP: 70.092-900 - Brasília - DF",
    },
    {
      text: "(61) 3206-9000 | 0800 726 0101",
    },
  ];

  const footerLinks = [
    {
      text: "© 2024 Caixa",
      className: "w-[100px]",
    },
    {
      text: "Portal Interno",
      className: "w-[120px]",
    },
    {
      text: "Suporte Técnico",
      className: "w-[140px]",
    },
  ];

  return (
    <footer className="relative w-full h-[200px] bg-blue-600 mt-16">
      <div className="relative w-full h-[200px] flex items-center justify-between px-[150px]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-2xl">C</span>
          </div>
          <div>
            <h3 className="text-white text-xl font-bold">Caixa Econômica Federal</h3>
            <p className="text-blue-100 text-sm">Portal de Inovação</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="text-white text-sm text-right"
            >
              {info.text}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-blue-800 flex items-center justify-center">
        <div className="flex gap-8">
          {footerLinks.map((link, index) => (
            <div
              key={index}
              className="text-blue-100 text-sm hover:text-white cursor-pointer transition-colors"
            >
              {link.text}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};