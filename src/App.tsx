import RouterProvider from "./router/components/RouterProvider";
import Wom from "./pages/wom/Wom";
import { useEffect, useState } from "react";
import NotFound from "./pages/NotFound";
import { router } from "./core/constants";
import { ConfigCurrent, configCurrent } from "./core/runtime";
import Navigation from "./pages/navigation/NaviIndex";
import NaviBox from "./pages/navigation/NaviBox";
import Loading from "./pages/Loading";
import ConfigLoader from "./pages/ConfigLoader";

// disable the alt event (window menu in windows)
function disableAltEventHandler(event: KeyboardEvent) {
  if (event.altKey) {
    event.preventDefault();
  }
}

function App() {
  let [config, setConfig] = useState<ConfigCurrent | null>(null);
  useEffect(() => {
    window.addEventListener("keydown", disableAltEventHandler);

    configCurrent().then(cfg => setConfig(cfg)).catch(console.error);

    return () => {
      window.removeEventListener("keydown", disableAltEventHandler);
    }
  }, []);

  if (!config) return <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Loading></Loading>
  </div>;

  return <ConfigLoader config={config}><RouterProvider root={{
    nodeId: router.root,
    element: <Wom />,
    children: [
      {
        nodeId: router.navigation,
        element: <Navigation></Navigation>,
        children: [
          {
            nodeId: router.setting,
            element: <NaviBox><div>todo</div></NaviBox>,
          },
          {
            nodeId: router.config,
            element: <NaviBox><div>todo</div></NaviBox>,
          },
        ]
      },
    ]
  }} notfound={<NotFound />} /></ConfigLoader>
}

export default App;
