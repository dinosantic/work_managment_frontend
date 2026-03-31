import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarContext, useSidebar } from "@/components/ui/sidebar-context";
import { cn } from "@/lib/utils";

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  const toggleSidebar = React.useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      toggleSidebar,
    }),
    [open, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function Sidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useSidebar();

  return (
    <aside
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "relative flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white/90 backdrop-blur transition-[width] duration-200",
        open ? "w-72" : "w-22",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-3 py-4", className)}>{children}</div>;
}

export function SidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mt-auto px-3 py-4", className)}>{children}</div>;
}

export function SidebarContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1 overflow-y-auto px-3", className)}>{children}</div>;
}

export function SidebarGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("space-y-2", className)}>{children}</section>;
}

export function SidebarGroupLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useSidebar();

  if (!open) {
    return null;
  }

  return (
    <p
      className={cn(
        "px-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SidebarMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-1", className)}>{children}</div>;
}

export function SidebarMenuItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}

export function SidebarMenuButton({
  children,
  className,
  isActive = false,
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  asChild?: boolean;
}) {
  const { open } = useSidebar();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        isActive && "bg-amber-100 text-amber-950 hover:bg-amber-100",
        !open && "justify-center px-0",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

export function SidebarInset({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex min-h-screen flex-1 flex-col", className)}>{children}</div>;
}
