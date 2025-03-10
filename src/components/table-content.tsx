import { TickerData } from "@/@types/services/get-crypto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCryptos } from "@/services/get-cryptos";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { EllipsisIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


export function TableContent() {

  const { data: getCryptosQuery } = useQuery<TickerData[] | null>({
    queryKey: ['get-cryptos'],
    queryFn: async () => {
      return getCryptos(["BTCUSDT", "ETHUSDT", "SOLUSDT"])
    },
    initialData: []
  })

  const columns: ColumnDef<TickerData>[] = [
    {
      id: "delete",
      header: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisIcon className="size-5" />

            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-center justify-center items-center">Apagar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      cell: () => {
        return (
          <Checkbox />
        )
      }
    },
    { accessorKey: "symbol", header: "Nome" },
    {
      accessorKey: "lastPrice",
      header: "Preço",
      cell: ({ row }) => {
        const price = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.getValue("lastPrice"))

        return price
      }
    },
    { accessorKey: "priceChangePercent", header: "24 %" }
  ]

  const table = useReactTable({
    data: getCryptosQuery || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}