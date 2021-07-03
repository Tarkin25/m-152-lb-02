import Link from "next/link";
import React from "react";
import NavLink from "./NavLink";

const Header = () => {

  return (
    <header className="bg-gray-900 p-4 text-gray-200 flex flex-row items-end">
      <Link href="/">
        <a>
          <h2 className="text-4xl mr-2">LB 02</h2>
        </a>
      </Link>
      <div>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/reflection">Reflection</NavLink>
          <NavLink href="/impressum">Impressum</NavLink>
      </div>
    </header>
  );
};

export default Header;
