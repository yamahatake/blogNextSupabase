"use client";

import { useRef, useState } from "react";
import useOnClickOutside from "@/lib/custom-hooks";

const MoreActions = (({ children, ...props }) => {
  const refMoreActions = useRef(null);
  const [openMoreActions, setOpenMoreActions] = useState(false);
  useOnClickOutside(refMoreActions, () => {
    setOpenMoreActions(false);
  });

  return (
    <div className="relative actions ml-auto" ref={refMoreActions} {...props}>
      <div className="button cursor-pointer bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-3 py-2 rounded-md" onClick={() => setOpenMoreActions(!openMoreActions)}>
        ...
      </div>
      <div className={`absolute border text-sm shadow rounded-md ${openMoreActions ? "block" : "hidden"}`}>
        {children}
      </div>
    </div>
  )
});

export default MoreActions;