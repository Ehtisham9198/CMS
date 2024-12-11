import CreateFile from './pages/CreateFile.tsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import CreateUser from './pages/CreateUser.tsx';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Outlet/>,
      children: [
        {
          index: true,
          element: <CreateUser/>
        },
        {
          path: "file",
          element: <CreateFile/>,
        },
      ]
    },
  ],
);

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
