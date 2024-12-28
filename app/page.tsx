"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, ChevronDown, Menu } from "lucide-react"
import { useTheme } from 'next-themes'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar"
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from '@/components/ui/collapsible'
import { useState, useEffect } from 'react'

interface Widget {
  href: string;
  name: string;
}

interface AppSidebarProps {
  widgets: Widget[];
  className: string | undefined;
}

interface TwitchVideo {
  id: string;
  title: string;
  thumbnail_url: string;
  duration: string;
}

function AppSidebar({ widgets, className }: AppSidebarProps) {
  const { setTheme } = useTheme()

  return (
    <Sidebar className={className} collapsible="offcanvas">
      <SidebarHeader className='p-3 '>
        <Link className="text-5xl text-center" href="/">
          &lt;<span className="font-playwrite font-black text-gradient-primary from-white">Rhed</span> /&gt;
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className='text-xl space-y-3'>
            <Collapsible className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton><span className='text-xl'>Widgets</span><ChevronDown /></SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className='sidebar-dropdown-animation'>
                  <SidebarMenuSub>
                    {widgets.map((widget) => {
                      return <SidebarMenuSubItem className='py-3' key={widget.href}><Link href={widget.href}>{widget.name}</Link></SidebarMenuSubItem>
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="https://github.com/rhamzthev/rhed" target="_blank" rel="noopener noreferrer"><span className='text-xl'>GitHub</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Collapsible className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className='hover:scale-[105%] flex items-center justify-center' variant="outline" size="default">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className='sidebar-dropdown-animation'>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem onClick={() => setTheme("light")}>
                      Light
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem onClick={() => setTheme("dark")}>
                      Dark
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem onClick={() => setTheme("system")}>
                      System
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className='text-center text-base p-3'>&copy; 2025 Rhamsez Thevenin</p>
      </SidebarFooter>
    </Sidebar>
  )
}

function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='hover:scale-[105%]' variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='navbar-dropdown-animation bg-sidebar text-2xl' align="center">
        <DropdownMenuItem className='hover:font-bold transition-all ease-in-out' onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem className='hover:font-bold transition-all ease-in-out' onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem className='hover:font-bold transition-all ease-in-out' onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Home() {

  const { toggleSidebar } = useSidebar()
  const [videos, setVideos] = useState<TwitchVideo[]>([]);
  
  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch(
          `https://api.twitch.tv/helix/videos?user_id=${process.env.NEXT_PUBLIC_TWITCH_USER_ID}&first=3`,
          {
            headers: {
              'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TWITCH_OAUTH_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        setVideos(data.data || []);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    }
    
    fetchVideos();
  }, []);
  
  const widgets = [
    { href: "/chat", name: "Chat" },
    { href: "/events", name: "Events"},
    { href: "/now-playing", name: "Now Playing"},
  ]

  return (
    <div className='md:flex md:flex-col w-full h-full'>
      {/* Header */}
      <header className='px-8 py-5 text-2xl hidden md:inline bg-gradient-to-b from-[rgba(0,0,0,0.34)] to-transparent'>
        <div className="md:flex md:flex-row md:items-center md:justify-between">
          <Link className="text-3xl" href="/">
            &lt;<span className="font-playwrite font-black text-gradient-primary from-white">Rhed</span> /&gt;
          </Link>
          <nav className='space-x-5'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='text-2xl hover:scale-[105%] transition ease-in-out' variant="ghost"><span className='text-2xl'>Widgets</span><ChevronDown /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='navbar-dropdown-animation bg-sidebar w-36'>
                {widgets.map(widget => <DropdownMenuItem className='hover:font-bold transition-all ease-in-out' key={widget.href}><Link href={widget.href}>{widget.name}</Link></DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="https://github.com/rhamzthev/rhed" target="_blank" rel="noopener noreferrer">
              <Button className='text-2xl hover:scale-[105%] transition ease-in-out' variant="ghost">GitHub</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>
      {/* Landing Page */}
      <main className='px-5 md:px-20 md:flex-grow md:flex md:flex-col space-y-5'>
        <section className='md:flex-grow md:flex md:items-center md:justify-center'>
          <div className="flex flex-col landscape:flex-row items-center justify-around w-full h-full space-y-5">
            <div className='py-8 landscape:py-4 space-y-3 text-center landscape:text-left'>
              <h1 className="text-5xl">&lt;<span className='font-playwrite font-black text-gradient-primary'>Rhed</span> /&gt;</h1>
              <p className='text-2xl'>Rhamsez Thevenin&apos;s Content Creator Arc</p>
            </div>
            <div className='w-full landscape:w-1/2 aspect-video'>
              <iframe
                src={`https://player.twitch.tv/?channel=RhedDev&parent=${window.location.hostname}`}
                className="rounded-2xl w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Other Content */}
        <section className="py-8 md:py-4">
          <h2 className='text-3xl font-bold text-primary_from text-center mb-8'>Recent Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="space-y-3">
                <iframe
                  src={`https://player.twitch.tv/?video=${video.id}&parent=${window.location.hostname}&autoplay=false`}
                  className="w-full aspect-video rounded-lg"
                  allowFullScreen
                />
                <h3 className="text-lg font-semibold line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.duration}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='px-5 py-3 hidden md:inline bg-gradient-to-t from-[rgba(0,0,0,0.76)] to-transparent'>
        <div className="text-center">
          <p className='text-base'>&copy; 2025 Rhamsez Thevenin</p>
        </div>
      </footer>

      {/* Sidebar */}
      <Button onClick={toggleSidebar} className='absolute left-3 top-3 md:hidden'>
        <Menu />
      </Button>
      <AppSidebar className='md:hidden' widgets={widgets} />
    </div>
  )
}

