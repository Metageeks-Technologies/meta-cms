'use client'
import React, { useState } from 'react'
import {
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
  } from "@/components/ui/sidebar"
  
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'


const SidebarSubmenu = ({item}: any) => {

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false)


  return (
    <Collapsible className="group/collapsible">
    <SidebarMenuItem>

      <CollapsibleTrigger onClick={() => setIsOpen(!isOpen)} asChild className="cursor-pointer hover:bg-white rounded-lg hover:text-black">
        <div className="w-full p-2 py-3 flex flex-row justify-between items-center">
          <span className="flex flex-row items-center gap-2">
            <item.icon className="w-4 h-4" />
            <span className="text-base">{item.title}</span>
          </span>

          <ChevronRight className={`w-4 h-4 duration-300 ${isOpen ? "rotate-[450deg]" : ""}`} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {
          item.subMenu?.map((subMenu: any, index: any) => (
            <SidebarMenuSub key={index} onClick={(e) => { e.preventDefault(); router.push(subMenu.url!) }} className="border-none">
              <SidebarMenuSubItem className="my-1 p-2 rounded-lg hover:bg-white hover:text-black cursor-pointer flex items-center gap-2">
                <subMenu.icon className="w-5 h-5 text-5xl" />
                <span className="text-sm">{subMenu.title}</span>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          ))
        }
      </CollapsibleContent>

    </SidebarMenuItem>
  </Collapsible>
  )
}

export default SidebarSubmenu