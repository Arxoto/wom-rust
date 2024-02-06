import RouterProvider from "./router/components/RouterProvider";
import Wom from "./pages/wom/Wom";
import { useEffect } from "react";

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

  return <RouterProvider router={[
    {
      path: '/',
      element: <Wom />
    },
  ]} notfound={'error_path'} />
}

export default App;
