import "./App.css";

import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import { Login } from "./pages/Login/Login";
import { ImagesList } from "./pages/Home/ImagesList";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <div>{!session ? <Login /> : <ImagesList />}</div>;
}

export default App;
