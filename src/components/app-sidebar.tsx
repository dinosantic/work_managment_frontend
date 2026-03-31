import { useState } from "react";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  SquareTerminal,
  UserCircle2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar-context";
import type { CurrentUser } from "@/lib/api";
import type { DashboardSection } from "@/components/layout";

const navItems: Array<{
  id: DashboardSection;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: SquareTerminal },
];

function UserMenu({
  user,
  onLogout,
  onOpenProfile,
}: Readonly<{
  user: CurrentUser;
  onLogout: () => void;
  onOpenProfile: () => void;
}>) {
  const { open } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={open ? "" : "relative"}>
      <button
        type="button"
        onClick={() => setMenuOpen((current) => !current)}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left shadow-xs transition hover:border-slate-300 hover:bg-slate-50"
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">
          {user.displayName.slice(0, 1).toUpperCase()}
        </div>
        {open && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
            <ChevronRight
              className={`size-4 text-slate-400 transition ${
                menuOpen ? "rotate-90" : ""
              }`}
            />
          </>
        )}
      </button>
      {menuOpen && (
        <div
          className={
            open
              ? "absolute bottom-4 -right-34 mt-0 rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
              : "absolute hidden z-20 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
          }
        >
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onOpenProfile();
            }}
            className="flex w-30 items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <UserCircle2 className="size-4" />
            Profile
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

type AppSidebarProps = {
  activeSection: DashboardSection;
  currentUser: CurrentUser;
  onLogout: () => void;
  onSectionChange: (section: DashboardSection) => void;
};

export function AppSidebar({
  activeSection,
  currentUser,
  onLogout,
  onSectionChange,
}: Readonly<AppSidebarProps>) {
  const { open } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <SquareTerminal className="size-5" />
          </div>
          {open && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                TM Playground
              </p>
              <p className="truncate text-xs text-slate-500">
                Task management starter
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <Separator className="mx-3 mb-4" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => onSectionChange(item.id)}
                  >
                    <Icon className="size-4 shrink-0" />
                    {open && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-3">
          <UserMenu
            user={currentUser}
            onLogout={onLogout}
            onOpenProfile={() => onSectionChange("profile")}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
