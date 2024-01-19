import { useEffect, useState } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { constants, router } from "./app/env";
import { dbInit } from "./app/persistence";
import { isMain, listenEvents } from "./app/runtime";
import { itemsInit } from "./app/womInputer";
import { disableAltEvent, refreshEnv, registerSwitch, setStyle, unregisterSwitch } from "./app/init";

import Error from "./page/Error";
import Wom from "./page/wom/Wom";
import Navigation from "./page/navigation/Navigation";
import NavIndex from "./page/navigation/NavIndex";
import Setting from "./page/navigation/setting/Setting";
import Loading from "./page/Loading";

const womRouter = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Wom /> },
      {
        path: router.navigation_name,
        element: <Navigation />,
        children: [
          { index: true, element: <NavIndex /> },
          { path: router.setting_name, element: <Setting /> },
        ]
      },
    ]
  }
])

function App() {
  const ismain = isMain();
  const [started, setStarted] = useState(false);
  useEffect(() => {
    dbInit()
      .then(refreshEnv)
      .then(setStyle)
      .then(itemsInit)
      .then(disableAltEvent)
      .then(() => { ismain && registerSwitch() }) // register global shortcut by default
      .then(() => setTimeout(() => {
        setStarted(true);
      }, constants.app_loading_delay))
      .catch(console.error);

    // register listen
    let unlisten: () => void;
    if (ismain) {
      unlisten = listenEvents(
        ['register', registerSwitch],
        ['unregister', unregisterSwitch],
      );
    } else {
      unlisten = () => { };
    }

    return () => {
      unlisten();
    };
  }, []);

  if (!started) {
    return <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}><Loading /></div>
  }

  return <RouterProvider router={womRouter} />
}

export default App;
