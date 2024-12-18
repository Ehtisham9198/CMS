import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import MyDrafts from "./pages/MyDrafts.tsx";
import Sidebar from "./components/Sidebar.tsx";
import LoginPage from "./pages/login.tsx";
import SessionProvider from "./context/Session.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import UsersPage from "./pages/Users.tsx";
import SignUp from "./pages/SignUP.tsx";
import ViewFilePage from "./pages/ViewFilePage.tsx";
import Action from "./components/action.tsx";
import InitiateFilePage from "./pages/InitiateFilePage.tsx";
import Forward from "./components/forward.tsx"

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
        path: "/forward",
        element: <Forward/>,
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
            element: <MyDrafts />,
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
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
