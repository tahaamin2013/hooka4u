"use client"

import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  MenuSquare,
  PieChart,
  Settings2
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/sidebars/user-sidebar/nav-main"
import { NavProjects } from "@/components/sidebars/user-sidebar/nav-projects"
import { NavUser } from "@/components/sidebars/user-sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebars/user-sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: 
    {
      name: "Hooka4u",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  navMain: [
    {
      title: "Order Taking",
      url: "#",
      icon: MenuSquare,
      isActive: true,
      items: [
        {
          title: "New Order",
          url: "/user-dashboard/new-order",
        },
        {
          title: "Edit Order",
          url: "/user-dashboard/edit-order",
        },
        {
          title: "Delete Orders",
          url: "/user-dashboard/delete-orders",
        },
        {
          title: "All Orders",
          url: "/user-dashboard/all-orders",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
