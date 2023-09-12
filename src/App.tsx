import { useEffect, useState } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { router } from "./app/env";
import { dbInit } from "./app/persistence";
import { isMain, listenEvents } from "./app/runtime";
import { itemsInit } from "./app/womInputer";
import { refreshEnv, registerSwitch, setStyle, unregisterSwitch } from "./app/init";

import Error from "./page/Error";
import Wom from "./page/wom/Wom";
import Navigation from "./page/navigation/Navigation";
import NavIndex from "./page/navigation/NavIndex";
import Setting from "./page/navigation/setting/Setting";
import Offspring from "./page/offspring/Offspring";
import Loading from "./page/Loading";

const naviFamily = {
  path: router.navigation_name,
  element: <Navigation />,
  children: [
    { index: true, element: <NavIndex /> },
    { path: router.setting_name, element: <Setting /> },
  ]
};

const womRouter = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Wom /> },
      naviFamily,
    ]
  }
])

const offspringRouter = createBrowserRouter([
  {
    path: '/',
    element: <Offspring />,
    errorElement: <Error />,
    children: [
      { index: true, element: <h1>nothing</h1> },
      naviFamily,
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
      .then(() => { ismain && registerSwitch() }) // register global shortcut by default
      .then(() => setStarted(true))
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

  if (ismain) {
    return <RouterProvider router={womRouter} />
  }

  return <RouterProvider router={offspringRouter} />
}

export default App;
