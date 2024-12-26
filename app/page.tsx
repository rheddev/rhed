"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, ChevronDown } from "lucide-react"
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
  SidebarTrigger
} from "@/components/ui/sidebar"
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from '@/components/ui/collapsible'

interface Widget {
  href: string;
  name: string;
}

interface AppSidebarProps {
  widgets: Widget[];
  className: string | undefined;
}

function AppSidebar({ widgets, className }: AppSidebarProps) {
  return (
    <Sidebar className={className}>
      <SidebarHeader>
        <Link className="text-5xl" href="/">
          &lt;<span className="font-bold text-gradient-primary from-white">Rhed</span> /&gt;
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className='text-2xl space-y-3'>
            <Collapsible className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton><span className='text-2xl'>Widgets</span><ChevronDown /></SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {widgets.map((widget) => {
                      return <SidebarMenuSubItem className='py-3' key={widget.href}>{widget.name}</SidebarMenuSubItem>
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="https://github.com/rhamzthev/rhed" target="_blank" rel="noopener noreferrer"><span className='text-2xl'>GitHub</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Home() {

  const widgets = [
    { href: "/chat", name: "Chat" }
  ]

  return (
    <div className='min-h-screen md:flex md:flex-col w-full h-full'>
      {/* Header */}
      <header className='px-20 py-10 text-2xl hidden md:inline'>
        <div className="md:flex md:flex-row md:items-center md:justify-between">
          <Link className="text-3xl" href="/">
            &lt;<span className="font-bold text-gradient-primary from-white">Rhed</span> /&gt;
          </Link>
          <nav className='space-x-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='text-2xl' variant="ghost">Widgets</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {widgets.map(widget => <DropdownMenuItem key={widget.href}><Link className="text-2xl" href={widget.href}>{widget.name}</Link></DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="https://github.com/yourusername/your-repo" target="_blank" rel="noopener noreferrer">
              <Button className='text-2xl' variant="ghost">GitHub</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>
      {/* Landing Page */}
      <main className='px-5 md:px-20 md:flex-grow md:flex md:flex-col space-y-5'>
        <section className='md:flex-grow md:flex md:items-center md:justify-center'>
          <div className="flex flex-col md:flex-row items-center justify-around w-full h-full space-y-5">
            <div className='space-y-3 text-center md:text-left'>
              <h1 className="text-5xl">&lt;<span className='font-bold text-gradient-primary'>Rhed</span> /&gt;</h1>
              <p className='text-2xl'>Rhamsez Thevenin&apos;s Content Creation Brand</p>
            </div>
            <div className='w-full md:w-1/3 aspect-video'>
              <iframe
                src="https://player.twitch.tv/?channel=RhedDev&parent=rhed.rhamzthev.com&parent=localhost"
                className="rounded-2xl w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Other Content */}
        <section>
          <div className="text-center space-y-3">
            <h2 className='text-3xl font-bold text-primary_from'>Coming Soon</h2>
            <p className='text-xl'>
              This section will be populated with VODs and recent YouTube videos. Stay tuned!
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='px-20 py-10 hidden md:inline'>
        <div className="text-center">
          <p className='text-base'>&copy; 2025 Rhamsez Thevenin</p>
        </div>
      </footer>

      {/* Sidebar */}
      <SidebarTrigger className='absolute left-3 top-3 md:hidden inline'/>
      <AppSidebar className='md:hidden inline' widgets={widgets} />
    </div>
  )
}

