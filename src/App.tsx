import RouterProvider from "./router/components/RouterProvider";
import Wom from "./pages/wom/Wom";
import { useEffect } from "react";
import NotFound from "./pages/NotFound";
import { router } from "./core/constants";
import Offspring from "./pages/Offspring";
import { isMain, listenEvents, registerSwitchDoAndUn } from "./core/runtime";
import Navigation from "./pages/navigation/NaviIndex";
import NaviBox from "./pages/navigation/NaviBox";

// disable the alt event (window menu in windows)
function disableAltEventHandler(event: KeyboardEvent) {
  if (event.altKey) {
    event.preventDefault();
  }
}

function App() {
  const ism = isMain();
  useEffect(() => {
    window.addEventListener("keydown", disableAltEventHandler);

    let unlisten = () => { }
    let unregister = () => { }
    if (ism) {
      // 在react严格模式下 useEffect 会执行两次 这里由于 await 时运行时会执行其他逻辑 导致函数整体非原子性 会连续注册两次
      const doun = registerSwitchDoAndUn("Shift+Space");
      let doregister = doun[0];
      unregister = doun[1];
      unlisten = listenEvents(
        ['do_global_shortcut', doregister],
        ['un_global_shortcut', unregister],
      )
      doregister();
    }

    return () => {
      window.removeEventListener("keydown", disableAltEventHandler);

      unlisten();
      unregister();
    }
  }, []);

  let inner = <RouterProvider root={{
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
  }} notfound={<NotFound />} />

  if (ism) {
    return inner;
  }
  return <Offspring>{inner}</Offspring>
}

export default App;
