import { ChevronDownIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const formFields = [
  {
    id: "search",
    label: "Buscar",
    type: "input",
    placeholder: "Título ou autor da ideia",
    width: "w-[360px]",
  },
  {
    id: "category",
    label: "Categoria",
    type: "select",
    placeholder: "Selecionar categoria",
    width: "w-[263px]",
    options: [
      { value: "produto", label: "Produto" },
      { value: "processo", label: "Processo Interno" },
      { value: "atendimento", label: "Atendimento" },
      { value: "tecnologia", label: "Tecnologia" },
    ]
  },
  {
    id: "area",
    label: "Área da Caixa",
    type: "select",
    placeholder: "Selecionar área",
    width: "w-[263px]",
    options: [
      { value: "agencias", label: "Agências" },
      { value: "digital", label: "Canais Digitais" },
      { value: "credito", label: "Crédito" },
      { value: "habitacao", label: "Habitação" },
    ]
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    placeholder: "Todos",
    width: "w-[165px]",
    options: [
      { value: "triagem", label: "Em Triagem" },
      { value: "avaliacao", label: "Em Avaliação" },
      { value: "aprovada", label: "Aprovada" },
      { value: "implementada", label: "Implementada" },
    ]
  },
];

export const GroupWrapperSubsection = (): JSX.Element => {
  return (
    <section className="w-full max-w-[1140px] mx-auto h-[76px] relative">
      <div className="flex w-full items-center justify-between gap-6 px-4">
        {formFields.map((field) => (
          <div
            key={field.id}
            className={`flex flex-col items-start gap-3 ${field.width}`}
          >
            <Label className="font-semibold text-gray-800 text-sm leading-none">
              {field.label}
            </Label>

            <div className={`${field.width} h-[42px]`}>
              {field.type === "input" ? (
                <div className="relative w-full h-full flex items-center justify-between">
                  <Input
                    placeholder={field.placeholder}
                    className="flex-1 h-[42px] px-4 py-2 bg-white border border-gray-300 rounded-md font-normal italic text-gray-600 text-base placeholder:italic focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  />
                  <SearchIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
                </div>
              ) : (
                <Select>
                  <SelectTrigger
                    className={`w-full h-[42px] px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <SelectValue
                      placeholder={
                        <span className="font-normal italic text-gray-600 text-base">
                          {field.placeholder}
                        </span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};