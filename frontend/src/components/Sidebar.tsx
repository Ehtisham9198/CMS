import { ReactNode } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { GoFileDirectoryFill } from "react-icons/go";
import { NavLink, Outlet } from "react-router-dom";
import { IoIosPeople } from "react-icons/io";

export default function Sidebar() {
  return (
    <div className="lg:grid bg-gray-200 grid-cols-5 xl:grid-cols-6 min-h-screen">
      <div className="bg-white w-full lg:px-4 lg:py-4 shadow h-full border-r">
        <div className="text-xl hidden h-12 lg:mb-2 relative font-bold lg:flex gap-4 items-center">
          <img
            className=" h-full aspect-square object-contain"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzyDY48gRqe4FukmulHf9vbO-oKNuD3TskTA&s"
            alt=""
          />
          <span className="text-2xl text-rail-dark">Mo Files</span>
        </div>
        <hr />

        {/* DASHBOARD */}
        {/* <h5 className="hidden lg:block text-lg p-2 font-bold">Dashboard</h5> */}
        <ul className="grid grid-cols-4 lg:flex lg:flex-col gap-1 py-2 lg:py-4 w-full lg:w-auto justify-around">
          <SidebarLink href="/dashboard">
            <RiDashboardFill size={20} />
            <span className="text-xs lg:text-base">Dashboard</span>
          </SidebarLink>

          <SidebarLink href="/files">
            <GoFileDirectoryFill size={20} />
            <span className="text-xs lg:text-base">Files</span>
          </SidebarLink>

          <SidebarLink href="/users">
            <IoIosPeople size={20} />
            <span className="text-xs lg:text-base">Users</span>
          </SidebarLink>

          <SidebarLink href="/testimonials">
            {/* <AiFillFileText /> */}
            <span className="text-xs lg:text-base">Testimonials</span>
          </SidebarLink>
        </ul>

        <div>
            
        </div>
      </div>

      <main className="col-span-4 xl:col-span-5 bg-zinc-100">
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
            ? "text-black border-black"
            : "text-black/60 hover:border-rail-dark",
        ].join(" ")
      }
      to={href}
    >
      {children}
    </NavLink>
  );
};
