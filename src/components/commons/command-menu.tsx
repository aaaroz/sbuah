"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTheme } from "next-themes";
import { useSearch } from "@/lib/contexts/search-provider";
import { sidebarData } from "../layouts/data/sidebar-data";
import { ScrollArea } from "../ui/scroll-area";

export function CommandMenu() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  const handleNavigate = (url: string) => {
    runCommand(() => router.push(url));
  };

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pe-1">
          <CommandEmpty>No results found.</CommandEmpty>

          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) =>
                navItem.url ? (
                  <CommandItem
                    key={`${navItem.url}-${i}`}
                    value={navItem.title}
                    onSelect={() => handleNavigate(navItem.url)}
                  >
                    <div className="flex size-4 items-center justify-center">
                      <ArrowRight className="size-2 text-muted-foreground/80" />
                    </div>
                    {navItem.title}
                  </CommandItem>
                ) : (
                  navItem.items?.map((subItem, j) => (
                    <CommandItem
                      key={`${navItem.title}-${subItem.url}-${j}`}
                      value={`${navItem.title}-${subItem.url}`}
                      onSelect={() => handleNavigate(subItem.url)}
                    >
                      <div className="flex size-4 items-center justify-center">
                        <ArrowRight className="size-2 text-muted-foreground/80" />
                      </div>
                      {navItem.title} <ChevronRight /> {subItem.title}
                    </CommandItem>
                  ))
                ),
              )}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="scale-90" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
