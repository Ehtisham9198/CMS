import { ReactNode, useContext, useEffect, useState } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { GoFileDirectoryFill } from "react-icons/go";
import { SiQuicklook } from "react-icons/si";
import { NavLink, Outlet } from "react-router-dom";
import { sessionContext } from "../context/Session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { IoEllipsisVertical } from "react-icons/io5";
import { logout, SERVER_URL } from "../hooks/requests";
import LoginPage from "../pages/login";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getMyDesignations } from "@/hooks/user";

export default function Sidebar() {
  const { session, revalidate } = useContext(sessionContext);
  const [myDesignations, setMyDesignations] = useState([session?.user?.designation]);

  async function handleLogout() {
    const err = await logout();
    if (err) {
      console.log(err);
      return;
    }

    revalidate();
  }

  async function handleDesignationChange(designation: string) {
    try {
      const response = await fetch(SERVER_URL + "/api/auth/change-designation", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({designation}),
        credentials: "include"
      });

      if(response.ok) {
        await revalidate();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(!session?.user?.username) return;

    getMyDesignations(session.user?.designation)
    .then(setMyDesignations);
  
  }, [session?.user?.username]);

  if (!session?.user?.username) {
    return <LoginPage />;
  }

  return (
    <div className="lg:grid grid-cols-5 xl:grid-cols-6 min-h-screen">
      <div className="bg-white w-full h-full border-r">
        <div className="text-xl h-12 m-1 lg:m-2 relative font-bold flex gap-4 items-center">
          <img
            className="h-full aspect-square object-contain"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzyDY48gRqe4FukmulHf9vbO-oKNuD3TskTA&s"
            alt=""
          />
          <span className="text-2xl text-rail-dark">IIIT Flow</span>
        </div>

        <hr />

        <div className="flex items-center gap-2 m-2">
          <img
            className="size-12 rounded"
            src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
            alt=""
          />
          <h3>
            {session.user.username}{" "}
            <span className="text-xs text-muted-foreground">
              {" "}
              {session.user.designation}
            </span>
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto mr-2">
              <IoEllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="m-2 space-y-1">
          <h3 className="px-2 text-sm">Signed in as: </h3>
          <Select value={session.user.designation} onValueChange={handleDesignationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent>
              {myDesignations.map(desig => (
                <SelectItem key={desig} value={desig!}>{desig}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* DASHBOARD */}
        {/* <h5 className="hidden lg:block text-lg p-2 font-bold">Dashboard</h5> */}
        <ul className="grid grid-cols-4 lg:flex lg:flex-col gap-1 lg:px-2 w-full lg:w-auto justify-around border lg:border-none">
          <SidebarLink href="/dashboard">
            <RiDashboardFill size={20} />
            <span className="text-xs lg:text-base">Dashboard</span>
          </SidebarLink>

          <SidebarLink href="/track">
            <SiQuicklook size={20} />
            <span className="text-xs lg:text-base">Track Files</span>
          </SidebarLink>

          <SidebarLink href="/files">
            <GoFileDirectoryFill size={20} />
            <span className="text-xs lg:text-base">My Drafts</span>
          </SidebarLink>
        </ul>
      </div>

      <main className="col-span-4 xl:col-span-5">
        <Outlet />
      </main>
    </div>
  );
}

const SidebarLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  return (
    <NavLink
      className={({ isActive }) =>
        [
          "flex font-semibold lg:flex-row p-2 lg:border flex-col lg:gap-2 items-center lg:px-5 lg:py-3 rounded ",
          isActive
            ? "text-primary border-primary bg-primary/5"
            : "text-primary/60",
        ].join(" ")
      }
      to={href}
    >
      {children}
    </NavLink>
  );
};
