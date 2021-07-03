import React, { ReactNode } from 'react'
import NextLink from 'next/link';

export interface LinkProps {
    href: string;
    children: ReactNode;
}

const Link = (props: LinkProps) => {

    const { href, children } = props;

    return (
        <NextLink href={href}>
            <a className="text-blue-700 underline">
                {children}
            </a>
        </NextLink>
    )
}

export default Link
