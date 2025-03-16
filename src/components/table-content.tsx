import { MessageTicker24h, Ticker24hr } from "@/@types/components/table-content";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EllipsisIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "./ui/checkbox";

type Ticker24hKey = { [key: string]: Ticker24hr }

export function TableContent() {
  const currentCryptoStateRef = useRef<{ updated: Ticker24hKey, old: Ticker24hKey }>({
    updated: {},
    old: {},
  })
  const [currentCrypto, setCurrentCryptoState] = useState<Ticker24hKey>({})

  useEffect(() => {
    const socket = new WebSocket("wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker")

    socket.onopen = (data) => {
      console.log('connected: ', data)
    }

    socket.onmessage = async (message: MessageEvent<MessageTicker24h>) => {
      const data = JSON.parse(String(message.data))
      currentCryptoStateRef.current.updated[data.stream] = data.data
    }

    const interval = setInterval(() => {
      setCurrentCryptoState(prev => {
        currentCryptoStateRef.current.old = { ...prev }
        return { ...currentCryptoStateRef.current.updated }
      })

      return () => clearInterval(interval);
    }, 6000);

    return () => {
      socket.close()
    }

  }, [])

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
          Object.values(currentCrypto).map((crypto, i) => {
            const oldPrice = currentCryptoStateRef.current.old[Object.keys(currentCrypto)[i]]?.c
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