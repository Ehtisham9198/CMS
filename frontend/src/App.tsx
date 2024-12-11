import CreateFile from './pages/CreateFile.tsx'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'
import CreateUser from './pages/CreateUser.tsx';
import Sidebar from './components/Sidebar.tsx';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Link to="/dashboard">Dashboard</Link>
    },
    {
      path: "/",
      element: <Sidebar />,
      children: [
        {
          path: 'dashboard',
          element: <CreateUser/>
        },
        {
          path: "files",
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
