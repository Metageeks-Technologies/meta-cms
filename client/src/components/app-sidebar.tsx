'use client';
import { ChevronRight, } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react";
import { items } from "@/constant/sidebar";
import { MenuItem } from "@/types";
import { useUserContext } from "@/context/userContext";
import { userRoles } from "@/constant/user";



export function AppSidebar() {

  const router = useRouter();

  const [postSubMenu, setPostSubMenu] = useState(false);

  const {user} = useUserContext();

  const getFilteredMenuItems = (userRole: string): MenuItem[] => {
    return items
      .filter((item) => {
        if (userRole === userRoles.SUPERADMIN) {
          // Superadmin sees all menu items
          return true;
        }

        if (userRole === userRoles.MODERATOR) {
          // Moderator hides "User", "Contributor", and "Moderator"
          return !["Subscribers", "Contributor", "Moderator"].includes(item.title);
        }

        if (userRole === userRoles.CONTRIBUTOR) {
          // Contributor hides "User", "Contributor", "Moderator", "Category", and "Tags"
          return !["Subscribers", "Contributor", "Moderator", "Category"].includes(item.title);
        }

        // Default: Hide restricted items for other roles
        return false;
      })
      .map((item) => {
        // Filter subMenu items if applicable
        if (item.subMenu) {
          return {
            ...item,
            subMenu: item.subMenu.filter((subItem) => {
              if (userRole === userRoles.CONTRIBUTOR) {
                // Contributor hides "Category" and "Tags" in subMenu
                return !["Category"].includes(subItem.title);
              }
              return true; // Keep all submenus for other roles
            }),
          };
        }
        return item;
      });
  };


  const filteredItems = getFilteredMenuItems(user.role);




  return (
    <Sidebar className="border-gray-800">
      <SidebarContent className="bg-[#06040B] text-gray-200">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel onClick={() => router.push('/dashboard')} className="h-16 -my-[0.5px] ml-2 text-3xl md:text-5xl text-gray-200 font-bold cursor-pointer">CMS</SidebarGroupLabel>
          <Separator className="bg-gray-800" />
          <SidebarGroupContent className="p-2">
            <SidebarMenu>
              {filteredItems.map((item, index) => (
                <div key={index}>
                  {
                    item.title == "Post" ?
                      <div>

                        <Collapsible className="group/collapsible">
                          <SidebarMenuItem>

                            <CollapsibleTrigger onClick={() => setPostSubMenu(!postSubMenu)} asChild className="cursor-pointer hover:bg-white rounded-lg hover:text-black">
                              <div className="w-full p-2 py-3 flex flex-row justify-between items-center">
                                <span className="flex flex-row items-center gap-2">
                                  <item.icon className="w-4 h-4" />
                                  <span className="text-base">{item.title}</span>
                                </span>

                                <ChevronRight className={`w-4 h-4 duration-300 ${postSubMenu ? "rotate-[450deg]" : ""}`} />
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

                      </div>

                      : <div>
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            onClick={(e) => { e.preventDefault(); router.push(item.url!) }} className="py-6 cursor-pointer text-base"
                          >
                            <div>
                              <item.icon />
                              <span>{item.title}</span>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </div>
                  }
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
