'use client'

import { navigationLinks } from '@/constants/index'
import { cn, getInitials } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Session } from 'next-auth'

const Header = ({ session }: { session: Session }) => {

    const pathname = usePathname()
    return (
        <header className='my-10 flex justify-between gap-5'>
            <Link href={'/'}>
                <Image src={'/icons/logo.svg'} alt='Logo' width={40} height={40} />
            </Link>

            <ul className="flex flex-row items-center gap-8">
                {navigationLinks.map(({ label, href }) => (
                    <li key={label}>
                        <Link href={href} className={cn('text-base cursor-pointer capitalize', pathname === '/library' ? 'text-light-200' : 'text-light-100')}>{label}</Link>
                    </li>

                ))}
                <li>
                    <Link href='/my-profile'>
                        <Avatar>
                            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                            <AvatarFallback className='bg-amber-100'>{getInitials(session?.user?.name || '')}</AvatarFallback>
                        </Avatar>

                    </Link>
                </li>
            </ul>
        </header>
    )
}

export default Header