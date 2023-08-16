import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { isRegistered, register, unregister } from "@tauri-apps/api/globalShortcut";
import { WebviewWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";

import constant from "./constant";
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
    // register global shortcut
    const registerSwitch = async () => {
      if (await isRegistered(constant.globalShortcutKey)) return;
      await register(constant.globalShortcutKey, async () => {
        const mainWindow = WebviewWindow.getByLabel('main');
        if (mainWindow === null) {
          console.error('mainWindow is null');
          return;
        }
        if (await mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.setFocus();
        }
      }); // todo 检查报错
    };
    // register default
    registerSwitch();
    // register listen
    const unlistenRegister = listen('register', registerSwitch);
    const unlistenUnregister = listen('unregister', async () => {
      await unregister(constant.globalShortcutKey);
    });


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
