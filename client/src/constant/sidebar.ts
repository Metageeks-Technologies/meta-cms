import { MenuItem } from "@/types";
import { Home, ScrollText, UsersRound, Bell, Settings, ChevronRight, LucideProps, Image, Plus, } from "lucide-react";
import { BiCategory } from "react-icons/bi";
import { MdPostAdd } from "react-icons/md";
import { IoPricetags } from "react-icons/io5";
import { MdOutlineComment } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";
import { HiTemplate } from "react-icons/hi";
import { TiThSmallOutline } from "react-icons/ti";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaGlobe } from "react-icons/fa6";
import { RxBorderSplit } from "react-icons/rx";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { GrServices } from "react-icons/gr";




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
        title: "Services",
        url: "/allServices",
        icon: MdOutlineMiscellaneousServices,
      },
      {
        title: "Sub Services",
        url: "/allSubServices",
        icon: GrServices,
      },
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
      {
        title: "New CaseStudy",
        url: "/newCaseStudy",
        icon: MdPostAdd,
      },
      {
        title: "All CaseStudy",
        url: "/allCaseStudy",
        icon: ScrollText,
      },
    ]
  },

  {
    title: "Product",
    icon: HiTemplate,
    subMenu: [
      {
        title: "New Product",
        url: "/store/newProduct",
        icon: MdPostAdd,
      },
      {
        title: "All Product",
        url: "/store/allProduct",
        icon: TiThSmallOutline,
      },
      {
        title: "Product Category",
        url: "/store/productCategory",
        icon: BiSolidCategoryAlt,
      },
      {
        title: "Orders",
        url: "/store/order",
        icon: RxBorderSplit,
      },
    ]
  },
  {
    title: "Websites",
    url: "/website",
    icon: FaGlobe,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: UsersRound,
  },
  // {
  //   title: "Users",
  //   url: "/store/users",
  //   icon: UsersRound,
  // },
  // {
  //   title: "Vendors",
  //   url: "/store/vendor",
  //   icon: UsersRound,
  // },
  // {
  //   title: "Store Moderator",
  //   url: "/store/storeModerator",
  //   icon: UsersRound,
  // },

  {
    title: "Comments",
    url: "/allComments",
    icon: MdOutlineComment
  },
  // {
  //   title: "Subscribers",
  //   url: "/subscribers",
  //   icon: UsersRound,
  // },
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


export const headerData = {
  dashboard: "Dashboard",
  newPost: "New Post",
  allPost: "All Post",
  category: "Category",
  tags: "Tags",
  allServices: "Services",
  allSubServices:"Sub Services",
  newPage: "New Page",
  allPage: "All Page",
  newCaseStudy: "New CaseStudy",
  allCaseStudy: "All CaseStudy",
  product:"Product",
  newProduct: "New Product",
  allProduct:" All Product",
  productCategory: "Product Category",
  allProductCategory: "All Product Category",
  order:"Orders",
  // users: "Users",
  // vendor: "Vendors",
  // storeModerator: "Store Moderator",
  allComments: "All Comments",
  // subscribers: "Subscribers",
  contributor: "Contributor",
  moderator: "Moderator",
  media: "Media",
  notification: "Notification",
  profile: "Settings",
  admin: "Admin",
  website: "Websites",
}


export const PermissionEnum = {
  BLOG : "blog",
  PAGE : "page",
  STORE : "store"
}