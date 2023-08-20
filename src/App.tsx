import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { UnlistenFn, listen } from "@tauri-apps/api/event";

import constant from "./constant";
import { registerSwitch, setStyle, unregisterSwitch } from "./appInit";
import Error from "./page/Error";
import Wom from "./page/wom/Wom";
import Navigation from "./page/navigation/Navigation";
import Default from "./page/Default";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Wom />,
    errorElement: <Error />
  },
  {
    path: constant.router_navigation,
    element: <Navigation />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Default /> }
    ]
  }
])

function App() {
  useEffect(() => {
    const unlistens: UnlistenFn[] = [];
    const addListen = (puf: Promise<UnlistenFn>) => {
      puf.then(ulf => {
        unlistens.push(ulf);
      }).catch(e => console.error(e));
    }

    setStyle();

    // register global shortcut by default
    registerSwitch();
    // register listen
    addListen(listen('register', registerSwitch));
    addListen(listen('unregister', unregisterSwitch));

    return () => {
      unlistens.forEach(fn => fn());
    };
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
