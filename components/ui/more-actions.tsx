"use client";

import { useRef, useState, RefObject } from "react";
import useOnClickOutside from "@/lib/custom-hooks";

interface MoreActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children?: React.ReactNode;
}

const MoreActions = (({ label, children, ...props }: MoreActionsProps) => {
  const refMoreActions = useRef<HTMLDivElement>(null);
  const [openMoreActions, setOpenMoreActions] = useState(false);
  useOnClickOutside(refMoreActions, () => {
    setOpenMoreActions(false);
  });

  return (
    <div className="relative actions ml-auto" ref={refMoreActions} {...props}>
      <div className="button cursor-pointer bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-3 py-2 rounded-md" onClick={() => setOpenMoreActions(!openMoreActions)}>
        {label || "..."}
      </div>
      <div className={`absolute border text-sm shadow rounded-md ${openMoreActions ? "block" : "hidden"}`}>
        {children}
      </div>
    </div>
  )
});

export default MoreActions;