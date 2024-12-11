import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'
import CreateFile from './pages/CreateFile.tsx'
import CreateUser from './pages/CreateUser.tsx';
import Sidebar from './components/Sidebar.tsx';
import LoginPage from './pages/login.tsx';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Link to="/dashboard">Dashboard</Link>
    },
    {
      path: "/login",
      element: <LoginPage/>
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
