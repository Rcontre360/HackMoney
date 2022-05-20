import Link from "next/link";
import { MENU_ITEMS } from '../../../constants';

const Navbar = () => {
  return (
    <div className="navbar bg-neutral text-neutral-content px-10 sticky top-0 z-50">
      <div className="text-xl flex-1 text-color1 f-24">
        <Link className="" href="/">
          ChainScore
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          {MENU_ITEMS.map((k, i) => 
            <li key={i} className="text-color1">
              <Link href={k.url}>{k.title}</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
