import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Tauri from "./page/Default";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Tauri /> }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
