import RouterProvider from "./router/components/RouterProvider";
import Wom from "./pages/wom/Wom";
import { useEffect } from "react";
import NotFound from "./pages/NotFound";
import { router } from "./core/constants";
import Offspring from "./pages/Offspring";
import { isMain } from "./core/runtime";

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

  let inner = <RouterProvider root={{
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

  if (isMain()) {
    return inner;
  }
  return <Offspring>{inner}</Offspring>
}

export default App;
