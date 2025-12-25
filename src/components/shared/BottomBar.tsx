import { bottombarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";

const BottomBar = () => {
  const { pathname } = useLocation();
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
    className={`group-hover:invert-white ${
      isActive && "invert-white"
    }`}
    width={16}
    height={16}
  />
 
</Link>
        );
      })}
    </section>
  );
};

export default BottomBar;
