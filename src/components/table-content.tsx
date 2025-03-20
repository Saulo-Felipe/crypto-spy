import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppData } from "@/context/app-data";
import { cn } from "@/lib/utils";
import { EllipsisIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";


export function TableContent() {
  const { addedCryptos, addedCryptosRef } = useAppData()

  return (
    <Table>
      <TableCaption>Criptomoedas salvas</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead><EllipsisIcon /></TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>24 %</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {
          Object.values(addedCryptos).map((crypto, i) => {
            const oldPrice = addedCryptosRef.current[Object.keys(addedCryptos)[i]]?.c
            return (
              <TableRow key={`${crypto.s}-${crypto.c}`}>
                <TableCell><Checkbox /></TableCell>
                <TableCell>{crypto.s}</TableCell>
                <TableCell className={cn({
                  "price-up": crypto.c > oldPrice,
                  "price-down": crypto.c < oldPrice
                })}>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(Number(crypto.c))}
                </TableCell>
                <TableCell className={cn({
                  "text-red-500": crypto.P < 0,
                  "text-green-500": crypto.P > 0,
                })}>{crypto.P}</TableCell>
              </TableRow>
            )
          })
        }
      </TableBody>
    </Table >
  )
}