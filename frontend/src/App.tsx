import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import CreateFile from "./pages/CreateFile.tsx";
import CreateUser from "./pages/CreateUser.tsx";
import Sidebar from "./components/Sidebar.tsx";
import LoginPage from "./pages/login.tsx";
import SessionProvider from "./context/Session.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import UsersPage from "./pages/Users.tsx";
import CreatedFiles from './pages/CreatedFiles.tsx'
import SignUp from "./pages/SignUP.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SessionProvider>
        <Outlet />
      </SessionProvider>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/",
        element: <Link to="/dashboard">Dashboard</Link>,
      },
      {
        path: "/",
        element: (
          <SessionProvider>
            <Sidebar />
          </SessionProvider>
        ),
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/files",
            element: <CreateFile />,
          },
          {
            path: "/users",
            element: <UsersPage />,
          },
          {
            path:'/createdFiles',
            element:<CreatedFiles/>
          }
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
