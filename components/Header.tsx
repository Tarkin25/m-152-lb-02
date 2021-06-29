import React, { ReactNode } from "react";
import Link from "next/link";

export interface HeaderProps {
  children?: ReactNode;
}

const Header = (props: HeaderProps) => {
  const { children } = props;

  return (
    <header className="bg-gray-900 p-4 text-gray-200 flex flex-row justify-between items-center">
      <Link href="/">
        <a>
          <h2 className="text-4xl">LB 02</h2>
        </a>
      </Link>
      <div>
          {children}
      </div>
    </header>
  );
};

export default Header;
