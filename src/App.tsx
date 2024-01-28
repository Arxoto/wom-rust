import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { getCurrent } from "@tauri-apps/api/window";
import { listenEvents, registerSwitch, unregisterSwitch } from "./core/runtime";

function App() {
  useEffect(() => {
    console.log(getCurrent().label)

    invoke('config_ruler')
      .then((res) => console.log('config_ruler: ', res))
      .catch((e) => console.error(e))
    invoke('config_current')
      .then((res) => console.log('config_current: ', res))
      .catch((e) => console.error(e))
    // todo reset window size and center
    invoke('search_item', { keyword: "wt", hasArgs: false })
      .then((res) => console.log('search_item: ', res))
      .catch((e) => console.error(e))

    const unlisten = listenEvents(
      ['do_global_shortcut', registerSwitch("Alt+Space")],
      ['un_global_shortcut', unregisterSwitch("Alt+Space")],
    )
    registerSwitch("Alt+Space")();

    return () => {
      unlisten();
    }
  }, []);

  const [greetMsg, setGreetMsg] = useState("");

  return (
    <div >
      <input
        placeholder="Enter ..."
        onInput={(event) => { setGreetMsg(event.currentTarget.value) }}
      />

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
