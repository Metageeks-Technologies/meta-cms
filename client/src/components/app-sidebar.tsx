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
import { items, PermissionEnum } from "@/constant/sidebar";
import { MenuItem } from "@/types";
import { useUserContext } from "@/context/userContext";
import { userRoles } from "@/constant/user";
import SidebarSubmenu from "./sidebar-submenu";
import { StoreRole } from "@/constant/store";



export function AppSidebar() {

  const router = useRouter();
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const { user } = useUserContext();

  const getFilteredMenuItems = (user: any): any => {
    if (!user) return [];
  
    const userRole = user?.role;
    const userStoreRole = user?.storeRole;
  
    return items
      .filter((item) => {
        if (userRole === userRoles.SUPERADMIN) {
          return true;
        }
  
        const includedItems = new Set<string>(["Dashboard", "Notification", "Settings"]);
  
        if (userRole === userRoles.ADMIN) {
          if (user.website?.permissions?.includes(PermissionEnum.BLOG)) {
            ["Post", "Comments", "Media"].forEach((title) => includedItems.add(title));
          }
          if (user.website?.permissions?.includes(PermissionEnum.PAGE)) {
            ["Page"].forEach((title) => includedItems.add(title));
          }
          if (user.website?.permissions?.includes(PermissionEnum.STORE)) {
            ["Product"].forEach((title) => includedItems.add(title));
          }
          ["Moderator", "Contributor"].forEach((title) => includedItems.add(title));
        }
  
        if (userRole === userRoles.MODERATOR) {
          if (user.website?.permissions?.includes(PermissionEnum.BLOG)) {
            ["Post", "Comments", "Media"].forEach((title) => includedItems.add(title));
          }
          if (user.website?.permissions?.includes(PermissionEnum.STORE)) {
            ["Product"].forEach((title) => includedItems.add(title));
          }
        }
  
        if (userRole === userRoles.CONTRIBUTOR) {
          if (user.website?.permissions?.includes(PermissionEnum.BLOG)) {
            ["Post", "Media"].forEach((title) => includedItems.add(title));
          }
          if (user.website?.permissions?.includes(PermissionEnum.STORE)) {
            ["Product"].forEach((title) => includedItems.add(title));
          }
        }
  
        return includedItems.has(item.title);
      })
      .map((item) => {
        if (item.subMenu) {
          const filteredSubMenu = item.subMenu.filter((subItem) => {
            const includedSubItems = new Set<string>();
  
            if (userRole === userRoles.SUPERADMIN || userStoreRole === StoreRole.SUPERADMIN) {
              return true;
            }
  
            if (userRole === userRoles.ADMIN) {
              if (user.website?.permissions?.includes(PermissionEnum.BLOG)) {
                ["New Post", "All Post", "Category", "Tags"].forEach((title) => includedSubItems.add(title));
              }
              if (user.website?.permissions?.includes(PermissionEnum.PAGE)) {
                ["New Page", "All Page"].forEach((title) => includedSubItems.add(title));
              }
              if (user.website?.permissions?.includes(PermissionEnum.STORE)) {
                ["New Product", "All Product", "Product Category", "Orders"].forEach((title) => includedSubItems.add(title));
              }
            }
  
            if (userRole === userRoles.MODERATOR) {
              if (user.website?.permissions?.includes(PermissionEnum.BLOG)) {
                ["New Post", "All Post", "Category", "Tags"].forEach((title) => includedSubItems.add(title));
              }
              if (user.website?.permissions?.includes(PermissionEnum.STORE)) {
                ["New Product", "All Product", "Product Category", "Orders"].forEach((title) => includedSubItems.add(title));
              }
            }
  
            if (userRole === userRoles.CONTRIBUTOR) {
              if (user.website?.permissions?.includes(PermissionEnum.BLOG)) {
                ["New Post", "All Post", "Tags"].forEach((title) => includedSubItems.add(title));
              }
              if (user.website?.permissions?.includes(PermissionEnum.STORE)) {
                ["New Product", "All Product", "Orders"].forEach((title) => includedSubItems.add(title));
              }
            }
  
            return includedSubItems.has(subItem.title);
          });
  
          // console.log("Filtered Submenu for", item.title, ":", filteredSubMenu);
  
          return filteredSubMenu.length > 0 ? { ...item, subMenu: filteredSubMenu } : null;
        }
  
        return item;
      })
      .filter(Boolean);
  };
  


  // let filteredItems: any = [];

  useEffect(() => {
    setFilteredItems(getFilteredMenuItems(user));
  }, [user]);





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
              {filteredItems.map((item: any, index: any) => (
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
