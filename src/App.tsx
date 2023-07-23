import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Wom from "./page/Wom";
import Layout from "./page/Layout";
import Default from "./page/Default";

const router = createBrowserRouter([
  {
    path: '/',
    // element: <Wom />
    element: <Layout />,
    children: [
      { index: true, element: <Wom /> }
    ]
  },
  {
    path: 'navigation',
    element: <Layout />,
    children: [
      { index: true, element: <Default /> }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
