import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { statuses } from "../data/data";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CheckIcon, FilterIcon } from "lucide-react";
import { title } from "process";
import { IconProps } from "@radix-ui/react-icons/dist/types";

interface DataTableFacetedFilterByProps<TData> {
  table: Table<TData>;
  filterbyList: {
    title: string;
    options: {
      value: string;
      label: string;
      icon: React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
      >;
    }[];
  }[];
}

export function DataTableFacetedFilterBy<TData>({
  table,
  filterbyList,
}: DataTableFacetedFilterByProps<TData>) {
  return (
    <div style={{ display: "flex", gap: 50 }}>
      <DropdownWithDialogItemsSolution2
        table={table}
        filterbyList={filterbyList}
      />
    </div>
  );
}

function DropdownWithDialogItemsSolution2<TData>({
  table,
  filterbyList,
}: DataTableFacetedFilterByProps<TData>) {
  const column = table.getColumn("status");
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
  const dropdownTriggerRef = React.useRef<HTMLButtonElement>(null);
  const focusRef = React.useRef<HTMLButtonElement | null>(null);

  function handleDialogItemSelect() {
    if (focusRef.current) focusRef.current.focus();
  }

  function handleDialogItemOpenChange(open: boolean) {
    setHasOpenDialog(open);
    if (!open) setDropdownOpen(false);
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" ref={dropdownTriggerRef}>
          <FilterIcon className="mr-2 h-4 w-4 text-gray-600" />
          Filter by
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={5}
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus();
            focusRef.current = null;
            event.preventDefault();
          }
        }}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Filters</DropdownMenuLabel>
          {filterbyList.map(({ title, options }) => {
            return (
              <DialogItem
                triggerChildren={title}
                onSelect={handleDialogItemSelect}
                onOpenChange={handleDialogItemOpenChange}
                position="right"
              >
                <Command>
                  <CommandInput placeholder={title} />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => {
                        const isSelected = selectedValues.has(option.value);
                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              if (isSelected) {
                                selectedValues.delete(option.value);
                              } else {
                                selectedValues.add(option.value);
                              }
                              const filterValues = Array.from(selectedValues);
                              column?.setFilterValue(
                                filterValues.length ? filterValues : undefined
                              );
                            }}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}
                            >
                              <CheckIcon className={cn("h-4 w-4")} />
                            </div>
                            {option.icon && (
                              <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                            )}
                            <span>{option.label}</span>
                            {facets?.get(option.value) && (
                              <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                {facets.get(option.value)}
                              </span>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                    {selectedValues.size > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => column?.setFilterValue(undefined)}
                            className="justify-center text-center"
                          >
                            Clear filters
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </DialogItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DialogItemProps {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
  position?: "left" | "right";
}

const DialogItem = React.forwardRef<HTMLDivElement, DialogItemProps>(
  (
    {
      triggerChildren,
      children,
      onSelect,
      onOpenChange,
      position,
      ...itemProps
    },
    forwardedRef
  ) => {
    return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            //
            onSelect={(event) => {
              event.preventDefault();
              onSelect && onSelect();
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay hidden />
          <DialogContent>{children}</DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }
);
