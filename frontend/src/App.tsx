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
import ViewFilePage from "./pages/ViewFilePage.tsx";
import Action from "./components/action.tsx";
import InitiateFilePage from "./pages/InitiateFilePage.tsx";

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
        path: "/action",
        element: <Action/>,
      },
      {
        path: "/",
        element: (
            <Sidebar />
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
            path: "/files/create",
            element: <InitiateFilePage />,
          },
          {
            path: "/file/:file_id",
            element: <ViewFilePage />,
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
