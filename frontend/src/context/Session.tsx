import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  username: string;
  name?: string;
  department?: string;
} | null;

export const sessionContext = createContext<{
  session: { user?: User } | null;
  revalidate: () => Promise<void>;
}>({ session: null, revalidate: async () => {} });

export const useSession = () => useContext(sessionContext).session;

function SessionProvider({ children }: { children: React.JSX.Element }) {
  const [session, setSession] = useState(null);

  async function getSession() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/get-session",
        { credentials: "include" }
      );

      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        console.log(data.session);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSession();
  }, []);

  return (
    <sessionContext.Provider value={{ session, revalidate: getSession }}>
      {children}
    </sessionContext.Provider>
  );
}

export default SessionProvider;
