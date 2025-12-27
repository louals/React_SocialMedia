import { bottombarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "@/context/authContext";

const BottomBar = () => {
  const { pathname } = useLocation();
  const { user } = useUserContext();

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            to={link.route}
            key={link.label}
            className={` ${isActive && "bg-black/10 rounded-xl"} invert-white flex-center flex-col gap-1  transition p-4`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              className={`group-hover:invert-white ${isActive && "invert-white"}`}
              width={16}
              height={16}
            />
          </Link>
        );
      })}

      {/* Profile Icon added on the right */}
      <Link
        to={`/profile/${user.id}`}
        className={` ${pathname === `/profile/${user.id}` && "bg-black/10 rounded-xl"} flex-center flex-col gap-1 transition p-4`}
      >
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className="h-5 w-5 rounded-full object-cover"
        />
      </Link>
    </section>
  );
};

export default BottomBar;