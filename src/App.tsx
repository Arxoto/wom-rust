import RouterProvider from "./router/components/RouterProvider";
import Wom from "./pages/wom/Wom";
import { useEffect } from "react";
import NotFound from "./pages/NotFound";
import { router } from "./core/constants";
import Offspring from "./pages/Offspring";
import { configCurrent, isMain, listenEvents, registerSwitchDoAndUn } from "./core/runtime";
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

    let logout: Promise<() => void> = new Promise(() => { });
    if (ism) {
      logout = configCurrent()
        .then(config => {
          const gsc = config.global_shortcut;

          // 在react严格模式下 useEffect 会执行两次 这里由于 await 时运行时会执行其他逻辑 导致函数整体非原子性 会连续注册两次
          let [doregister, unregister] = registerSwitchDoAndUn(gsc);
          let unlisten = listenEvents(
            ['do_global_shortcut', doregister],
            ['un_global_shortcut', unregister],
          )
          doregister();
          return () => {
            unlisten();
            unregister();
          }
        });

    }

    return () => {
      window.removeEventListener("keydown", disableAltEventHandler);

      logout.then(fn => fn());
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
