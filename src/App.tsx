import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import constant from "./app/env";
import { refreshEnv, registerSwitch, setStyle, unregisterSwitch } from "./app/init";
import { listenEvents } from "./app/runtime";

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
    refreshEnv();
    setStyle();

    // register global shortcut by default
    registerSwitch();
    // register listen
    const unlisten = listenEvents(
      ['register', registerSwitch],
      ['unregister', unregisterSwitch],
    );

    return () => {
      unlisten();
    };
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
