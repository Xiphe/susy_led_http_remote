import * as React from "react";
import { Link, LinkProps } from "react-router-dom";
import { cn } from "@/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Button,
} from "@/components";
import { focusStyles } from "./ui/styles";
import { useConfig } from "@/api";

const animationListSizes = "w-[500px]";
const animations = ["Base", "Mid", "Top"];
const palettes = ["First", "Second"];

export function TopNavigation() {
  const [currentItem, setCurrentItem] = React.useState<string>();

  return (
    <NavigationMenu
      className="hidden sm:block"
      onValueChange={setCurrentItem}
      value={currentItem}
    >
      <NavigationMenuList>
        <NavigationMenuItem value="animations">
          <NavigationMenuTrigger>Animations</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className={cn("flex flex-col gap-3 p-4", animationListSizes)}>
              {animations.map((name, i) => (
                <ListItem to={`animation/${i}`} key={i} title={name}>
                  Configure {name} animation layer
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="palette">
          <NavigationMenuTrigger>Palette Builder</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className={cn("grid gap-3 p-4 grid-cols-2", animationListSizes)}
            >
              {palettes.map((paletteName, i) => (
                <ListItem key={i} title={paletteName} to={`palette/${i}`}>
                  Customize {paletteName} palette
                </ListItem>
              ))}
              <ListItem title={"All"} to={`palette/explorer`}>
                View all palettes
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="settings">
          <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className={cn("grid gap-3 p-4 grid-cols-2", animationListSizes)}
            >
              <ListItem
                title={
                  <>
                    Brightness <MiniBrightness />
                  </>
                }
                to={`settings/brightness`}
              >
                Set global brightness
              </ListItem>
              <ListItem title={"Strips"} to={`settings/strips`}>
                (De)activate Strips
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "title"> & { title: React.ReactNode }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            focusStyles,
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

function MiniBrightness() {
  const [config, setConfig] = useConfig();

  return (
    <>
      <Button
        variant="ghost"
        size="inline"
        disabled={config.brightness === 0}
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          setConfig({ brightness: Math.max(0, config.brightness - 10) });
        }}
      >
        -
      </Button>
      <Button
        variant="ghost"
        size="inline"
        disabled={config.brightness === 255}
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          setConfig({ brightness: Math.min(255, config.brightness + 10) });
        }}
      >
        +
      </Button>
    </>
  );
}
