import { createContext, useContext, useState } from "react";

const RecordingContext = createContext();

export function RecordingProvider({ children }) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <RecordingContext.Provider value={{ isRecording, setIsRecording }}>
      {children}
    </RecordingContext.Provider>
  );
}

export function useRecording() {
  return useContext(RecordingContext);
}
