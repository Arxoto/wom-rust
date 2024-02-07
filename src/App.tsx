import RouterProvider from "./router/components/RouterProvider";
import Wom from "./pages/wom/Wom";
import { useEffect } from "react";
import NotFound from "./pages/NotFound";
import { router } from "./core/constants";

// disable the alt event (window menu in windows)
function disableAltEventHandler(event: KeyboardEvent) {
  if (event.altKey) {
    event.preventDefault();
  }
}

function App() {
  useEffect(() => {
    window.addEventListener("keydown", disableAltEventHandler)
    return () => {
      window.removeEventListener("keydown", disableAltEventHandler)
    }
  }, []);

  return <RouterProvider root={{
    nodeId: router.root,
    element: <Wom />,
    children: [
      {
        nodeId: router.navigation,
        element: <div></div>,
        children: [
          {
            nodeId: router.setting,
            element: <div></div>,
          },
          {
            nodeId: router.config,
            element: <div></div>,
          },
        ]
      },
    ]
  }} notfound={<NotFound />} />
}

export default App;
