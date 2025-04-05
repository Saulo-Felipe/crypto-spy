import { Ticker24hKey } from "@/@types/components/table-content";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppData } from "@/context/app-data";
import { cn } from "@/lib/utils";
import { EllipsisIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";


export function TableContent() {
  const { oldAddedCryptosPriceRef } = useAppData()

  const addedCryptos: Ticker24hKey = {
    "BTCUSDT": {
      e: "24hrTicker",
      E: 1712102400000,
      s: "BTCUSDT",
      p: "500.00",
      P: 1.23,
      w: "41000.50",
      x: "40500.00",
      c: "41000.00",
      Q: "0.5",
      b: "40999.50",
      B: "0.8",
      a: "41000.50",
      A: "0.7",
      o: "40500.00",
      h: "41500.00",
      l: "40000.00",
      v: "3500.00",
      q: "143500000.00",
      O: 1712025600000,
      C: 1712102399999,
      F: 1000000,
      L: 1005000,
      n: 5000
    },
    "ETHUSDT": {
      e: "24hrTicker",
      E: 1712102400000,
      s: "ETHUSDT",
      p: "30.00",
      P: 2.05,
      w: "2100.75",
      x: "2050.00",
      c: "2100.00",
      Q: "1.2",
      b: "2099.50",
      B: "2.0",
      a: "2100.50",
      A: "1.5",
      o: "2050.00",
      h: "2150.00",
      l: "2000.00",
      v: "12000.00",
      q: "25200000.00",
      O: 1712025600000,
      C: 1712102399999,
      F: 2000000,
      L: 2008000,
      n: 8000
    }
  };

  return (
    <ScrollArea className="w-full h-[calc(500px-52.8px)]">
      <Table className="border-collapse" border={1}>
        <TableCaption className="pb-8">Criptomoedas salvas</TableCaption>

        <TableHeader className="sticky top-0 z-10 bg-black">
          <TableRow>
            <TableHead><EllipsisIcon /></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>24 %</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {
            [...Object.values(addedCryptos), ...Object.values(addedCryptos), ...Object.values(addedCryptos), ...Object.values(addedCryptos), ...Object.values(addedCryptos), ...Object.values(addedCryptos), ...Object.values(addedCryptos)].map((crypto, i) => {
              const oldPrice = oldAddedCryptosPriceRef.current[i]
              return (
                <TableRow key={`${crypto.s}-${crypto.c}`}>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>{crypto.s}</TableCell>
                  <TableCell className={cn({
                    "price-up": crypto.c > oldPrice,
                    "price-down": crypto.c < oldPrice
                  })}>
                    {crypto.c
                      ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(Number(crypto.c))
                      : "Carregando..."
                    }
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
      </Table>
      <ScrollBar />
    </ScrollArea>
  )
}