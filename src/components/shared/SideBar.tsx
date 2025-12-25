import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/authContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/Types";

const SideBar = () => {
  const { user: currentUser } = useUserContext();
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();
  console.log(user);
  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess]);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            width={150}
            height={36}
          />
        </Link>
        

        <ul className="flex flex-col gap-6">
  {sidebarLinks.map((link: INavLink) => {
    const isActive = pathname === link.route;
    return (
      <li key={link.label} className="leftsidebar-link font-thin group">
        <NavLink
          to={link.route}
          className="flex gap-4 items-center p-4"
        >
          <img
            src={link.imgURL}
            alt={link.label}
            className={`invert-white ${isActive ? "" : ""}`}
          />
          <span className={`${isActive ? "font-extrabold" : "font-medium"}`}>
            {link.label}
          </span>
        </NavLink>
      </li>
    );
  })}
</ul>
        
      </div>
   {/* Current User Profile */}
        <div className="p-4 flex items-center justify-between">
        <Link
          to={`/profile/${currentUser.id}`}
          className="flex items-center gap-3 flex-1"
        >
          <img
            src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-8 w-8 rounded-full object-cover border border-dark-4"
          />
          <div className="flex flex-col flex-1">
            <span
              className={`${
                pathname.includes("/profile") ? "font-extrabold" : "font-medium"
              }`}
            >
              Profile
            </span>
          </div>
        </Link>
      </div>
   

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout"  className="invert-white"/>
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};
 
export default SideBar;
