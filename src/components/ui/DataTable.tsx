import { useQueryState } from "@/hooks/ui/useQueryState";
import debounce from "@/utils/debounce";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Dropdown } from "./Dropdown";
import { FormControl } from "./FormControl";
import { Pagination } from "./Pagination";
import { Table } from "./Table";

// Types
export type TColumn<T, K extends keyof T = keyof T> = {
  name: string;
  field: K;
  isSortable?: boolean;
  isSearchable?: boolean;
  head?: (info: {
    head: TColumn<T, K>;
  }) => React.ReactNode | string | number | null | undefined;
  cell?: (info: {
    cell: T[K];
    row: T;
    index: number;
  }) => React.ReactNode | string | number | null | undefined;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: "start" | "center" | "end";
  style?: React.CSSProperties;
  className?: string;
};

export type TState = {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  total?: number;
  setSearch?: (search: string) => void;
  setSort?: (sort: string) => void;
  setPage?: (page: number) => void;
  setLimit?: (limit: number) => void;
};

export type TConfig = {
  isSearchProcessed?: boolean;
  isSortProcessed?: boolean;
  isPaginationProcessed?: boolean;
  isViewSearch?: boolean;
  isViewSort?: boolean;
  isViewPagination?: boolean;
};

export type TDataTableProps<T> = {
  title?: string;
  slot?: React.ReactNode | string | number | null | undefined;
  status?: "loading" | "error" | "success" | string;
  columns: TColumn<T>[];
  data: T[];
  config?: TConfig;
  state?: TState;
  onSelectionChange?: (selectedRows: T[]) => void;
  getRowId?: (row: T) => string;
  bulkActions?: (selectedRows: T[], clearSelection: () => void) => React.ReactNode;
};

type CellContentProps<T, K extends keyof T = keyof T> = {
  index: number;
  row: T;
  cell: T[K];
  formatter?: (info: {
    index: number;
    row: T;
    cell: T[K];
  }) => React.ReactNode | string | number | null | undefined;
};

type SkeletonTableRowsProps = {
  rows: number;
  cells: number;
};

// Columns Hook
const useColumns = <T extends Record<string, unknown>>(
  initialColumns: TColumn<T>[],
) => {
  const [selected, setSelected] = useState<string[]>(
    initialColumns?.map((c) => c?.name.toString()) || [],
  );

  const toggler = (column: TColumn<T>) => {
    setSelected((prev) =>
      prev.includes(column.name.toString())
        ? prev.filter((c) => c !== column.name.toString())
        : [...prev, column.name.toString()],
    );
  };

  const processedColumns = useMemo(() => {
    if (!(selected?.length > 0)) return [];
    return initialColumns?.filter((column) =>
      selected.includes(column.name.toString()),
    );
  }, [initialColumns, selected]);

  return { columns: processedColumns, selected, setSelected, toggler };
};

// Searching Hook
const useSearching = <T extends Record<string, unknown>>(
  data: T[],
  columns: TColumn<T>[],
  search?: string,
  isSearchProcessed: boolean = false,
) => {
  return useMemo(() => {
    if (isSearchProcessed || !search || search.trim() === "") return data;
    const checkIsSearchable = (field: keyof T) =>
      columns.some((c) => c.field === field && c.isSearchable);
    const searchLower = search.toLowerCase();
    return data.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        if (
          (typeof value === "string" || typeof value === "number") &&
          checkIsSearchable(key as keyof T)
        ) {
          return value.toString().toLowerCase().includes(searchLower);
        }
        return false;
      }),
    );
  }, [data, columns, search, isSearchProcessed]);
};

// Pagination Hook
const usePagination = <T extends Record<string, unknown>>(
  data: T[],
  page: number,
  limit: number,
  isPaginationProcessed: boolean = false,
) => {
  return useMemo(() => {
    if (isPaginationProcessed) return data;
    const startIndex = (page - 1) * limit;
    return data.slice(startIndex, startIndex + limit);
  }, [data, page, limit, isPaginationProcessed]);
};

// Sorting Hook
const useSorting = <T extends Record<string, unknown>>(
  data: T[],
  sort?: string,
  isSortProcessed: boolean = false,
): T[] => {
  return useMemo(() => {
    if (isSortProcessed || !sort || sort === "") return data;
    const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
    const isDescending = sort.startsWith("-");
    return [...data].sort((a, b) => {
      const aValue = a[sortField as keyof T];
      const bValue = b[sortField as keyof T];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      let comparison = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      return isDescending ? -comparison : comparison;
    });
  }, [data, sort, isSortProcessed]);
};

// Animated sort icon
const SortIcon = ({
  field,
  sort,
}: {
  field: string;
  sort?: string;
}) => {
  const isAsc = sort === field;
  const isDesc = sort === `-${field}`;
  return (
    <span className="relative ml-1 inline-flex h-4 w-4 items-center justify-center">
      <ArrowUpDown
        className={`absolute h-4 w-4 transition-all duration-200 ${
          isAsc || isDesc ? "scale-0 opacity-0" : "scale-100 opacity-40"
        }`}
      />
      <ArrowUp
        className={`absolute h-4 w-4 text-primary transition-all duration-200 ${
          isAsc ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
      <ArrowDown
        className={`absolute h-4 w-4 text-primary transition-all duration-200 ${
          isDesc ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </span>
  );
};

const SkeletonTableRows = ({ rows, cells }: SkeletonTableRowsProps) => {
  const skeletonRows = useMemo(
    () =>
      Array.from({ length: rows }, (_, rowIndex) => (
        <Table.Row key={`skeleton-${rowIndex}`}>
          {Array.from({ length: cells || 1 }, (_, cellIndex) => (
            <Table.Cell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
            </Table.Cell>
          ))}
        </Table.Row>
      )),
    [rows, cells],
  );
  return <>{skeletonRows}</>;
};

// Cell Content Component
export const CellContent = <T extends Record<string, unknown>>({
  index,
  row,
  cell,
  formatter,
}: CellContentProps<T>) => {
  const renderValue = (val: unknown): React.ReactNode => {
    if (React.isValidElement(val)) return val;
    if (val === null || val === undefined) return "";
    if (
      typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean"
    )
      return String(val);
    if (Array.isArray(val)) {
      if (val.every((item) => typeof item === "string" || typeof item === "number"))
        return (val as (string | number)[]).join(", ");
      return JSON.stringify(val);
    }
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  if (formatter) return <>{formatter({ cell, row, index })}</>;
  return <>{renderValue(cell)}</>;
};

// DataTable Component
const DataTable = <T extends Record<string, unknown>>({
  title,
  slot,
  columns,
  data,
  config,
  state,
  status,
  onSelectionChange,
  getRowId,
  bulkActions,
}: TDataTableProps<T>) => {
  const {
    isSearchProcessed = false,
    isSortProcessed = false,
    isPaginationProcessed = false,
    isViewSearch = true,
    isViewSort = true,
    isViewPagination = true,
  } = config || {};

  const {
    search,
    sort,
    page,
    limit,
    onSearchChange,
    onSortChange,
    onPageChange,
    onLimitChange,
  } = useQueryState({
    search: state?.search,
    sort: state?.sort,
    page: state?.page,
    limit: state?.limit,
    onSearchChange: state?.setSearch,
    onSortChange: state?.setSort,
    onPageChange: state?.setPage,
    onLimitChange: state?.setLimit,
  });

  const currentSearch = search || "";
  const currentSort = sort || "";
  const currentPage = page || 1;
  const currentLimit = limit || 10;

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const defaultGetRowId = useCallback(
    (row: T) => String((row as any)._id || (row as any).id || ""),
    [],
  );
  const resolveRowId = getRowId || defaultGetRowId;

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const searchedData = useSearching(data, columns, currentSearch, isSearchProcessed);
  const sortedData = useSorting(searchedData, currentSort, isSortProcessed);

  const totalCount = useMemo(() => {
    if (isPaginationProcessed && typeof state?.total === "number") return state.total;
    return sortedData.length;
  }, [isPaginationProcessed, state?.total, sortedData.length]);

  const paginatedData = usePagination(sortedData, currentPage, currentLimit, isPaginationProcessed);

  const paginatedIds = useMemo(
    () => paginatedData.map((r) => resolveRowId(r)),
    [paginatedData, resolveRowId],
  );

  const allPageSelected =
    paginatedIds.length > 0 && paginatedIds.every((id) => selectedIds.has(id));
  const somePageSelected =
    !allPageSelected && paginatedIds.some((id) => selectedIds.has(id));

  const handleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        paginatedIds.forEach((id) => next.delete(id));
      } else {
        paginatedIds.forEach((id) => next.add(id));
      }
      const nextSelected = data.filter((r) => next.has(resolveRowId(r)));
      onSelectionChange?.(nextSelected);
      return next;
    });
  }, [allPageSelected, paginatedIds, data, resolveRowId, onSelectionChange]);

  const handleSelectRow = useCallback(
    (row: T) => {
      const id = resolveRowId(row);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        const nextSelected = data.filter((r) => next.has(resolveRowId(r)));
        onSelectionChange?.(nextSelected);
        return next;
      });
    },
    [data, resolveRowId, onSelectionChange],
  );

  const selectedRows = useMemo(
    () => data.filter((r) => selectedIds.has(resolveRowId(r))),
    [data, selectedIds, resolveRowId],
  );

  const getFieldValue = useCallback((row: T, field: keyof T): T[keyof T] => row?.[field], []);

  const handleSortClick = useCallback(
    (field: string) => {
      let newSort: string;
      if (currentSort === field) newSort = `-${field}`;
      else if (currentSort === `-${field}`) newSort = "";
      else newSort = field;
      onSortChange(newSort);
    },
    [currentSort, onSortChange],
  );

  const handleSearchChange = debounce((value: string | null) => {
    onSearchChange(value || "");
  }, 500);

  const handlePageChange = useCallback((p: number) => onPageChange(p), [onPageChange]);
  const handleLimitChange = useCallback((l: number) => onLimitChange(l), [onLimitChange]);

  const { columns: processedColumns, selected, toggler } = useColumns(columns);

  const hasSelection = onSelectionChange !== undefined;
  const colSpanTotal = processedColumns.length + (hasSelection ? 1 : 0);

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex w-full flex-col flex-wrap gap-4 lg:flex-row lg:items-center lg:justify-between">
        {title && (
          <div className="flex flex-1 items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        )}
        <div className="flex w-full flex-1 items-center gap-3">
          {isViewSearch && (
            <div className="flex-1">
              <FormControl
                className="w-full min-w-12"
                as="input"
                type="search"
                onChange={(e) => handleSearchChange(e.target.value || null)}
                defaultValue={currentSearch}
                placeholder="Search…"
              />
            </div>
          )}

          <Dropdown side={"end"}>
            <Dropdown.Trigger className="" variant={"outline"}>
              <span>Columns</span>
            </Dropdown.Trigger>
            <Dropdown.Content className="top-full right-0 mt-1 min-w-40">
              <div className="bg-card text-card-foreground py-1">
                <ul>
                  {columns?.map((column) => (
                    <li
                      className="hover:bg-muted cursor-pointer rounded p-2 py-1"
                      key={column.name}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggler(column);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          className="accent-accent size-4 cursor-pointer"
                          placeholder="column"
                          type="checkbox"
                          checked={selected?.includes(column?.name.toString())}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                          readOnly
                        />
                        {column.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Dropdown.Content>
          </Dropdown>

          {slot && <>{slot}</>}
        </div>
      </div>

      {/* Bulk action bar */}
      {hasSelection && selectedIds.size > 0 && bulkActions && (
        <div className="bg-primary/5 border-primary/20 flex items-center gap-3 rounded-lg border px-4 py-2">
          <span className="text-primary text-sm font-medium">
            {selectedIds.size} row{selectedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions(selectedRows, clearSelection)}
          </div>
          <button
            onClick={clearSelection}
            className="text-muted-foreground hover:text-foreground ml-auto text-xs underline transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-md border px-4">
        <Table className="w-full">
          <Table.Header>
            <Table.Row>
              {hasSelection && (
                <Table.Head style={{ width: "44px" }}>
                  <input
                    type="checkbox"
                    className="accent-primary size-4 cursor-pointer rounded"
                    checked={allPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = somePageSelected;
                    }}
                    onChange={handleSelectAll}
                    disabled={status === "loading" || paginatedData.length === 0}
                  />
                </Table.Head>
              )}
              {processedColumns?.map((head, index) => (
                <Table.Head
                  key={`header-${head.field as string}-${index}`}
                  style={head.style}
                >
                  {head.isSortable && isViewSort ? (
                    <button
                      className="flex items-center gap-1 font-medium"
                      onClick={() => handleSortClick(head.field as string)}
                      type="button"
                      disabled={status === "loading"}
                    >
                      {head.head ? head.head({ head }) : head.name}
                      {status !== "loading" && (
                        <SortIcon field={head.field as string} sort={currentSort} />
                      )}
                    </button>
                  ) : (
                    <>{head.head ? head.head({ head }) : head.name}</>
                  )}
                </Table.Head>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {status === "loading" ? (
              <SkeletonTableRows rows={currentLimit} cells={colSpanTotal} />
            ) : status === "error" ? (
              <Table.Row>
                <Table.Cell
                  colSpan={colSpanTotal}
                  className="text-destructive py-10 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-medium">Failed to load data</span>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-primary text-sm hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : paginatedData.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={colSpanTotal}
                  className="text-muted-foreground py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-base font-medium">No data found</span>
                    <span className="text-sm">Try adjusting your search or filters</span>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowId = resolveRowId(row);
                const isSelected = selectedIds.has(rowId);
                return (
                  <Table.Row
                    key={`row-${rowIndex}`}
                    className={`transition-colors ${isSelected ? "bg-primary/5" : ""}`}
                  >
                    {hasSelection && (
                      <Table.Cell style={{ width: "44px" }}>
                        <input
                          type="checkbox"
                          className="accent-primary size-4 cursor-pointer rounded"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row)}
                        />
                      </Table.Cell>
                    )}
                    {processedColumns.map((head, cellIndex) => (
                      <Table.Cell
                        key={`cell-${rowIndex}-${cellIndex}`}
                        style={head.style}
                      >
                        <CellContent
                          index={rowIndex}
                          row={row}
                          cell={getFieldValue(row, head.field)}
                          formatter={head.cell}
                        />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table>
      </div>

      {isViewPagination && totalCount > 0 && (
        <Pagination
          total={totalCount}
          limit={currentLimit}
          page={currentPage}
          setLimit={handleLimitChange}
          setPage={handlePageChange}
        />
      )}
    </div>
  );
};

export default DataTable;
