import { MenuItem } from "@/types";
import { Home, ScrollText, UsersRound, Bell, Settings, ChevronRight, LucideProps, Image, Plus, } from "lucide-react";
import { BiCategory } from "react-icons/bi";
import { MdPostAdd } from "react-icons/md";
import { IoPricetags } from "react-icons/io5";
import { MdOutlineComment } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";

export const items: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Post",
    icon: ScrollText,
    subMenu: [
      {
        title: "New Post",
        url: "/newPost",
        icon: MdPostAdd,
      },
      {
        title: "All Post",
        url: "/allPost",
        icon: ScrollText,
      },
      {
        title: "Category",
        url: "/category",
        icon: BiCategory,
      },
      {
        title: "Tags",
        url: "/tags",
        icon: IoPricetags,
      },
    ]
  },
  {
    title: "Page",
    icon: RiPagesLine,
    subMenu: [
      {
        title: "New Page",
        url: "/newPage",
        icon: MdPostAdd,
      },
      {
        title: "All Page",
        url: "/allPage",
        icon: ScrollText,
      },
    ]
  },
  {
    title: "Comments",
    url: "/allComments",
    icon: MdOutlineComment
  },
  {
    title: "Subscribers",
    url: "/subscribers",
    icon: UsersRound,
  },
  {
    title: "Contributor",
    url: "/contributor",
    icon: UsersRound,
  },
  {
    title: "Moderator",
    url: "/moderator",
    icon: UsersRound,
  },
  {
    title: "Media",
    url: "/media",
    icon: Image,
  },
  {
    title: "Notification",
    url: "/notification",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/profile",
    icon: Settings,
  },
];
