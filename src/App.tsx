import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { constants } from "./app/env";
import { refreshEnv, registerSwitch, setStyle, unregisterSwitch } from "./app/init";
import { listenEvents } from "./app/runtime";

import Error from "./page/Error";
import Wom from "./page/wom/Wom";
import Navigation from "./page/navigation/Navigation";
import Default from "./page/Default";
import { dbInit } from "./app/persistence";
import { itemsInit } from "./app/womInputer";
import NavIndex from "./page/navigation/NavIndex";
import Setting from "./page/navigation/setting/Setting";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Wom />,
    errorElement: <Error />
  },
  {
    path: constants.router_navigation,
    element: <Navigation />,
    errorElement: <Error />,
    children: [
      { index: true, element: <NavIndex /> },
      { path: constants.router_setting_name, element: <Setting /> },
    ]
  }
])

function App() {
  useEffect(() => {
    dbInit().then(() => {
      refreshEnv();
      setStyle();

      itemsInit();

      // register global shortcut by default
      registerSwitch();

    }).catch(console.error);

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
