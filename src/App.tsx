import { RouterProvider, createBrowserRouter } from "react-router-dom";
import constant from "./constant";
import Error from "./page/Error";
import Wom from "./page/Wom";
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
  return (
    <RouterProvider router={router} />
  );
}

export default App;
