"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, ChevronDown, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
  widgets: { href: string; name: string }[];
}

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rhed-button h-10 w-10 p-0 flex items-center justify-center"
          size="icon"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="dropdown navbar-dropdown-animation"
        align="center"
      >
        <DropdownMenuItem
          className="hover:font-bold transition-all ease-in-out hover:text-red-300 px-4 py-2.5"
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:font-bold transition-all ease-in-out hover:text-red-300 px-4 py-2.5"
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:font-bold transition-all ease-in-out hover:text-red-300 px-4 py-2.5"
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header({ widgets }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 px-6 sm:px-8 py-4 red-glass border-b border-red-500/20 hidden md:flex md:items-center md:justify-between">
      <Link
        className="text-3xl transition-all duration-300 hover:scale-105"
        href="/"
      >
        &lt;
        <span className="font-black font-playwrite text-primary-800 text-glow">
          Rhed
        </span>{" "}
        /&gt;
      </Link>

      <nav className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="text-xl rhed-button h-10 px-4 flex items-center justify-center gap-2"
              variant="ghost"
            >
              Widgets
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="navbar-dropdown-animation w-32 dropdown">
            {widgets.map((widget) => (
              <DropdownMenuItem
                className="hover:text-red-300 transition-colors py-2.5 px-4"
                key={widget.href}
              >
                <Link href={widget.href} className="w-full">
                  {widget.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="https://github.com/rhamzthev/rhed"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className="text-xl rhed-button h-10 px-4 flex items-center justify-center gap-2"
            variant="ghost"
          >
            GitHub
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
        <ModeToggle />
      </nav>
    </header>
  );
} 