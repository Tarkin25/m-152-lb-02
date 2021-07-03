import React, { ReactNode } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import clsx from 'clsx';

export interface NavLinkProps {
    href: string;
    children: ReactNode;
}

const NavLink = (props: NavLinkProps) => {

    const { href, children } = props;
    const { asPath } = useRouter();
    const active = asPath === href;

    return (
        <Link href={href}>
            <a className={clsx("text-xl mx-2 hover:underline", {"underline": active})}>
                {children}
            </a>
        </Link>
    )
}

export default NavLink
