"use client";

import { FC, ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: FC<TooltipProps> & {
  Button: FC<{ children: ReactNode }>;
} = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute z-10 ${positionClasses[position]}`}>
          <div className="bg-gray-900 text-white text-sm rounded-lg shadow-lg p-3 max-w-xs">
            {content}
          </div>
          <div
            className={`
            absolute w-3 h-3 bg-gray-900 transform rotate-45
            ${
              position === "top"
                ? "bottom-[-6px] left-1/2 -translate-x-1/2"
                : ""
            }
            ${
              position === "bottom"
                ? "top-[-6px] left-1/2 -translate-x-1/2"
                : ""
            }
            ${
              position === "left" ? "right-[-6px] top-1/2 -translate-y-1/2" : ""
            }
            ${
              position === "right" ? "left-[-6px] top-1/2 -translate-y-1/2" : ""
            }
          `}
          ></div>
        </div>
      )}
    </div>
  );
};

Tooltip.Button = ({ children, ...props }: { children: ReactNode }) => (
  <div {...props}>{children}</div>
);
Tooltip.Button.displayName = "Tooltip.Button";

export default Tooltip;
