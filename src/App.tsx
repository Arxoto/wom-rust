import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";

import constant from "./constant";
import { registerSwitch, unregisterSwitch } from "./appInit";
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
    // register global shortcut by default
    registerSwitch();
    // register listen
    const unlistenRegister = listen('register', registerSwitch);
    const unlistenUnregister = listen('unregister', unregisterSwitch);

    return () => {
      unlistenRegister.then(f => f());
      unlistenUnregister.then(f => f());
    };
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
