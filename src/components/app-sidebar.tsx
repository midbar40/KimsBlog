import { FileTerminal, Home, NotebookTabs, Database, SquarePen} from "lucide-react"
import { Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "글목록",
    url: "/posts",
    icon: NotebookTabs,
  },
  {
    title: "CLI",
    url: "#",
    icon: FileTerminal,
  },
  {
    title: "SQL",
    url: "#",
    icon: Database,
  },
  {
    title: "글쓰기",
    url: "posts/edit",
    icon: SquarePen,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>KimsBlog</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                    {/* // <a href={item.url}> */}
                      <item.icon />
                      <span>{item.title}</span>
                      </Link>
                    {/* </a> */}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
