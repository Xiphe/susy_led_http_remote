import * as React from "react";
import { HamburgerMenuIcon, SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { Link, LinkProps, useLocation } from "react-router-dom";
import { cn } from "@/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Button,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components";
import { focusStyles } from "./ui/styles";
import { useObjectConfig } from "@/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const navigation = [
  {
    title: "Animations",
    path: "animation",
    children: [
      {
        title: "Base",
        description: "Configure the lowest animation",
        to: "0",
      },
      {
        title: "Middle",
        description: "Set mid-layer animation",
        to: "1",
      },
      {
        title: "Top",
        description: "The top-most animation",
        to: "2",
      },
    ],
  },
  {
    title: "Palette Builder",
    path: "palette",
    children: [
      {
        title: "Palette A",
        description: "Customize first palette",
        to: "a",
      },
      {
        title: "Palette B",
        description: "Customize the other palette",
        to: "b",
      },
      {
        title: "All",
        description: "Explore all custom and build-in palettes",
        to: "explorer",
      },
    ],
  },
  {
    title: "Settings",
    path: "settings",
    children: [
      {
        title: "Brightness",
        description: "Set global brightness",
        to: "brightness",
      },
      {
        title: "Strips",
        description: "Set which parts of the led-strips are globally enabled",
        to: "strips",
      },
    ],
  },
] as const;

export function Navigation() {
  const [sheetOpen, setSheetOpen] = React.useState<boolean>();
  const [currentItem, setCurrentItem] = React.useState<string>();
  const { pathname } = useLocation();

  return (
    <>
      <Sheet
        onOpenChange={(open) => {
          if (open) {
            const navItem =
              navigation.find(({ path }) => pathname.startsWith(`/${path}/`)) ||
              navigation[0];

            setCurrentItem((item) => item || navItem.title);
          }
          setSheetOpen(open);
        }}
        open={sheetOpen}
      >
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="sm:hidden fixed bottom-4 right-4"
          >
            <HamburgerMenuIcon aria-label="Open menu" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-between overflow-y-scroll pb-2">
          <SheetClose />
          <SheetHeader>
            <div className="absolute top-4 right-16">
              <MiniBrightness icons />
            </div>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
          </SheetHeader>
          <Accordion
            type="single"
            onValueChange={(item) => {
              if (sheetOpen) {
                setCurrentItem(item);
              }
            }}
            value={currentItem}
          >
            {[...navigation].reverse().map(({ title, children, path }, i) => (
              <AccordionItem
                key={title + i}
                value={title}
                className={cn(i === navigation.length - 1 ? "border-none" : "")}
              >
                <AccordionTrigger>{title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4">
                    {[...children]
                      .reverse()
                      .map(({ title, to, description }, i) => {
                        const target = to.startsWith("/")
                          ? to
                          : `/${path}/${to}`;

                        return (
                          <li key={description + i}>
                            <SheetTrigger asChild>
                              <NavLink
                                current={pathname.startsWith(target)}
                                title={title}
                                to={target}
                              >
                                {description}
                              </NavLink>
                            </SheetTrigger>
                          </li>
                        );
                      })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SheetContent>
      </Sheet>

      <NavigationMenu
        className="hidden sm:block grow-0"
        onValueChange={(item) => {
          if (!sheetOpen) {
            setCurrentItem(item);
          }
        }}
        value={currentItem}
      >
        <NavigationMenuList>
          {navigation.map(({ title, children, path }, i) => (
            <NavigationMenuItem value={title} key={title + i}>
              <NavigationMenuTrigger current={pathname.startsWith(`/${path}/`)}>
                {title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col gap-3 p-4 w-[500px]">
                  {children.map(({ title, to, description }, i) => {
                    const target = to.startsWith("/") ? to : `/${path}/${to}`;
                    return (
                      <ListItem
                        current={pathname.startsWith(target)}
                        to={target}
                        key={description + i}
                        title={
                          <>
                            {title}
                            {title === "Brightness" ? <MiniBrightness /> : null}
                          </>
                        }
                      >
                        {description}
                      </ListItem>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

const NavLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "title"> & { title: React.ReactNode; current?: boolean }
>(({ className, title, children, current, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      className={cn(
        "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        current ? "bg-primary/20" : "bg-muted/20",
        focusStyles,
        className
      )}
      {...props}
    >
      <div
        className={cn("text-sm font-medium leading-none", "text-foreground")}
      >
        {title}
      </div>
      <p className="line-clamp-2 text-sm leading-snug text-foreground/50">
        {children}
      </p>
    </Link>
  );
});

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "title"> & { title: React.ReactNode; current?: boolean }
>(({ className, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <NavLink {...props} ref={ref} />
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

interface MiniBrightnessProps {
  icons?: boolean;
}
function MiniBrightness({ icons }: MiniBrightnessProps) {
  const [config, setConfig] = useObjectConfig();

  return (
    <>
      <Button
        variant="ghost"
        size={icons ? "icon" : "inline"}
        disabled={config.brightness === 0}
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          setConfig({ brightness: Math.max(0, config.brightness - 10) });
        }}
      >
        <span className="sr-only">Decrease global brightness</span>
        {icons ? <MoonIcon aria-hidden /> : "-"}
      </Button>
      <Button
        variant="ghost"
        size={icons ? "icon" : "inline"}
        disabled={config.brightness === 255}
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          setConfig({ brightness: Math.min(255, config.brightness + 10) });
        }}
      >
        <span className="sr-only">Increase global brightness</span>
        {icons ? <SunIcon aria-hidden /> : "+"}
      </Button>
    </>
  );
}
