import React from "react";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { FrameSubsection } from "./components/FrameSubsection/FrameSubsection";
import { GroupSubsection } from "./components/GroupSubsection/GroupSubsection";
import { GroupWrapperSubsection } from "./components/GroupWrapperSubsection/GroupWrapperSubsection";

export const IdeiasEmVotao = (): React.ReactElement => {
  const navigate = useNavigate();

  const handleNovaIdeia = () => {
    navigate('/nova-ideia');
  };

  return (
    <div className="bg-white flex flex-col items-center w-full min-h-screen">
      <div className="bg-white w-full max-w-[1440px] flex flex-col relative">
        <header className="px-[150px] pb-8 flex items-center justify-between">
          <h1 className="font-light text-4xl text-gray-800">
            Portal de Ideias Caixa
          </h1>
          <Button 
            onClick={handleNovaIdeia}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Nova Ideia
          </Button>
        </header>
        <div className="flex flex-col items-center justify-center gap-8 px-[150px]">
          <GroupSubsection />
          <GroupWrapperSubsection />
          <FrameSubsection />
        </div>
      </div>
    </div>
  );
};