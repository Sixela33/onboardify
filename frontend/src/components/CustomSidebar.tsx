import { Sidebar, SidebarGroupContent, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from './ui/sidebar'
import { Home, List, MessageCircle, Plus } from 'lucide-react'
import LoginButton from './LoginButton'

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Bulk Message",
    url: "/bulk-message",
    icon: MessageCircle,
  },
  {
    title: "Create Form",
    url: "/create-form",
    icon: Plus,
  },
  {
    title: "Forms",
    url: "/forms",
    icon: List,
  },
  {
    title: "Form Status",
    url: "/form-status",
    icon: List,
  }
]

export default function CustomSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
            Spammer
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <LoginButton />
      </SidebarFooter>
    </Sidebar>  
  )
}
