import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface CallContextType {
  inCall: boolean;
  setInCall: (value: boolean) => void;
}

export const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const [inCall, setInCall] = useState(false);
  return (
    <CallContext.Provider value={{ inCall, setInCall }}>
      {children}
    </CallContext.Provider>
  );
};
