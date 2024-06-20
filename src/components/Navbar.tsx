'use client'

import { cn } from '@/lib/utils'
import { LinkIcon, Menu, MoveDown, MoveRight, UserIcon, Users, View } from 'lucide-react'
import { User } from 'next-auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { ModeToggle } from './global/ModeToggle'
import UserAvatar from './global/UserAvatar'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  

type Props = {
    user: User,
}

const navItems = [
    {
        name: 'Profile',
        href: '/editor',
        icon: UserIcon
    },
    {
        name: 'Links',
        href: '/editor/links',
        icon: LinkIcon
    },
    {
        name: 'Socials',
        href: '/editor/socials',
        icon: Users
    },
    {
        name: 'Preview',
        href: '/editor/preview',
        icon: View
    }
]
const Navbar = ({user}: Props) => {
    const pathname = usePathname()
  return (
    <div className='w-full h-auto justify-between items-center gap-3 flex'>
        <section className='justify-start items-center gap-5 md:flex hidden'>
            {
                navItems.map((item, index) => (
                    <div key={index} className='flex lg:gap-5 gap-3 lg:px-2 justify-center items-center text-sm lg:text-xl group'>
                    <Link href={item.href} className={cn('text-muted-foreground group-hover:text-foreground flex justify-center items-center gap-3' , pathname == item.href && 'text-foreground')}>
                        <item.icon className={cn('rounded-full p-2 border-2 border-muted bg-muted group-hover:bg-primary group-hover:text-primary-foreground h-10 w-10', pathname === item.href && 'bg-primary text-primary-foreground')} />
                        {item.name}
                    </Link>
                    <MoveRight size={24} className={cn(item.name === 'Preview' && 'hidden')} />
                    </div>
                ))
            }
        </section>
        <section className='flex md:hidden'>
            <MobileNavbar user={user} />
        </section>
        <section className='flex gap-3'>
            <ModeToggle />
            <UserAvatar user={user} />
        </section>
    </div>
  )
}

const MobileNavbar = ({user}: Props) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()
    return (
        <Sheet open={isOpen} onOpenChange={() => setIsOpen(!isOpen)} >
            <SheetTrigger onClick={() => setIsOpen(true)} >
                <Menu size={24} className='text-foreground' />
            </SheetTrigger>
            <SheetContent className='flex flex-col gap-5' >  
                <SheetHeader>
                    <SheetTitle>
                        Your Flow To Create LinkFolio
                    </SheetTitle>
                    <SheetDescription>
                        Get started by creating your profile, adding links and socials
                        
                    </SheetDescription>
                </SheetHeader>
                    
                <section className='flex flex-col gap-3'>
                    {
                        navItems.map((item, index) => (
                            <div key={index} className='flex flex-col lg:gap-5 gap-3 lg:px-2 justify-center items-center text-sm lg:text-xl group'>

                            <Link href={item.href} className={cn('text-muted-foreground group-hover:text-foreground flex justify-center items-center gap-3' , pathname == item.href && 'text-foreground')} onClick={() => setIsOpen(false)} >
                                <item.icon className={cn('rounded-full p-2 border-2 border-muted bg-muted group-hover:bg-primary group-hover:text-primary-foreground h-10 w-10', pathname === item.href && 'bg-primary text-primary-foreground')} />
                                {item.name}
                            </Link>
                    <MoveDown size={24} className={cn(item.name === 'Preview' && 'hidden')} />
                            </div>
                        ))
                    }
                </section>
            </SheetContent>
        </Sheet>
    )
}

export default Navbar