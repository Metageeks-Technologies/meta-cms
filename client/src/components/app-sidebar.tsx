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
import SidebarSubmenu from "./sidebar-submenu";
import { StoreRole } from "@/constant/store";



export function AppSidebar() {

  const router = useRouter();

  const [postSubMenu, setPostSubMenu] = useState(false);

  const { user } = useUserContext();

  const getFilteredMenuItems = (userRole: string, userStoreRole: string): MenuItem[] => {
    return items
      .filter((item) => {
        if (userRole === userRoles.SUPERADMIN || userStoreRole === StoreRole.SUPERADMIN) {
          return true; // Superadmin sees all items
        }

        const includedItems = new Set<string>();

        // Collect all exclusions for MODERATOR
        if (userRole === userRoles.MODERATOR) {
          ["Dashboard", "Post", "Comments", "Media", "Notification", "Settings"].forEach((title) => includedItems.add(title));
        }

        // Collect all exclusions for STORE MODERATOR
        if (userStoreRole === StoreRole.STOREMODERATOR) {
          ["Dashboard", "Product", "Notification", "Settings"].forEach((title) => includedItems.add(title));
        }

        // Collect all exclusions for CONTRIBUTOR
        if (userRole === userRoles.CONTRIBUTOR) {
          ["Dashboard", "Post", "Comments", "Media", "Notification", "Settings"].forEach((title) => includedItems.add(title));
        }

        // Collect all exclusions for VENDOR
        if (userStoreRole === StoreRole.VENDOR) {
          ["Dashboard", "Product", "Notification", "Settings"].forEach((title) => includedItems.add(title));
        }
        return includedItems.has(item.title);
      })
      .map((item) => {
        if (item.subMenu) {
          return {
            ...item,
            subMenu: item.subMenu.filter((subItem) => {
              const includedSubItems = new Set<string>();

              if (userRole === userRoles.SUPERADMIN || userStoreRole === StoreRole.SUPERADMIN) {
                return true; // Superadmin sees all items
              }

              // Collect all exclusions for MODERATOR
              if (userRole === userRoles.MODERATOR) {
                ["New Post", "All Post", "Category", "Tags"].forEach((title) => includedSubItems.add(title));
              }

              // Collect all exclusions for STORE MODERATOR
              if (userStoreRole === StoreRole.STOREMODERATOR) {
                ["New Product", "All Product", "Product Category","Orders"].forEach((title) => includedSubItems.add(title));
              }

              // Collect all exclusions for CONTRIBUTOR
              if (userRole === userRoles.CONTRIBUTOR) {
                ["New Post", "All Post", "Tags"].forEach((title) => includedSubItems.add(title));
              }

              // Collect all exclusions for VENDOR
              if (userStoreRole === StoreRole.VENDOR) {
                ["New Product", "All Product","Orders"].forEach((title) => includedSubItems.add(title));
              }

              return includedSubItems.has(subItem.title);
            }),
          };
        }
        return item;
      });
  };



  const filteredItems = getFilteredMenuItems(user.role, user?.storeRole);




  return (
    <Sidebar className="border-gray-800">
      <SidebarContent className="bg-[#06040B] text-gray-200 styledScrollable">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel
            onClick={() => router.push('/dashboard')}
            className="h-16 -my-[0.5px] ml-2 text-2xl md:text-2xl text-gray-200 font-bold cursor-pointer"
          >
            <div>
              CMS
              <p className="text-sm font-thin">Content Management System</p>
            </div>
          </SidebarGroupLabel>
          <Separator className="bg-gray-800" />
          <SidebarGroupContent className="p-2 mb-20">
            <SidebarMenu>
              {filteredItems.map((item, index) => (
                <div key={index}>
                  {
                    item.title == "Post" || item.title == "Page" || item.title == "Product" ?
                      <SidebarSubmenu item={item} />

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
