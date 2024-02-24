"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Column, Table } from "@tanstack/react-table";

import { DataTableViewOptions } from "./data-table-view-options";
import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilterBy } from "./data-table-faceted-filter-by";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export const filterByList: {
  title: string;
  options: {
    value: string;
    label: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  }[];
}[] = [
  {
    title: "status",
    options: statuses,
  },
  {
    title: "priority",
    options: priorities,
  },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DataTableFacetedFilterBy table={table} filterbyList={filterByList} />
        <FilteredOptions table={table} />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}

interface DataTableFacetedFilterProps<TData> {
  table: Table<TData>;
}

export function FilteredOptions<TData>({
  table,
}: DataTableFacetedFilterProps<TData>) {
  const filteredColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanFilter()
    );

  return (
    <div>
      {filteredColumns.map((column) => {
        const selectedValues = new Set(column?.getFilterValue() as string[]);
        const filterby = filterByList.find(({ title }) => column.id === title);
        console.log(filterby);
        if (!filterby) return null;

        const { title, options } = filterby;
        return (
          <div>
            {selectedValues?.size > 0 && (
              <Button
                key={title}
                variant="outline"
                size="sm"
                className="h-8 border-dashed"
              >
                {title}
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedValues.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedValues.size} selected
                    </Badge>
                  ) : (
                    options &&
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="rounded-sm px-1 font-normal"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
