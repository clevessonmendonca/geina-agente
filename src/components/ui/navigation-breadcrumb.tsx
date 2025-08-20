import { ChevronRightIcon, HomeIcon } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./breadcrumb";

export interface BreadcrumbItem {
  label: string;
  hasIcon?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  items,
  className = "",
}) => {
  return (
    <nav className={`flex items-center gap-3 px-[150px] pb-6 ${className}`}>
      <HomeIcon className="w-4 h-4 text-gray-600" />
      <ChevronRightIcon className="w-4 h-4 text-gray-600" />

      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-3">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={item.onClick}
                  className={`font-medium text-base cursor-pointer ${
                    item.isActive
                      ? 'font-bold text-gray-800 text-xl'
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {item.hasIcon && (
                <BreadcrumbSeparator>
                  <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
};
