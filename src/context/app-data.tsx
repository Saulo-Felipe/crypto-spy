import { LocalStorageData, MessageTicker24h, Symbol, Ticker24hKey } from "@/@types/components/table-content";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";

interface AppDataContext {
  symbols: readonly Symbol[]
  addedCryptos: Ticker24hKey
  addedCryptosRef: React.RefObject<Ticker24hKey>
  setAddedCryptos: Dispatch<SetStateAction<Ticker24hKey>>

  selectedSymbol: Symbol
}

const AppDataContext = createContext<AppDataContext>({} as AppDataContext)

export const symbols = [
  "USDT", "EUR", "BRL", "GBP", "AUD", "CAD", "MXN", "ARS", "CHF",
  "JPY", "CNY", "RUB", "INR", "KRW", "TRY", "HKD", "SGD", "THB",
  "MYR", "VND", "IDR", "PLN", "SEK", "NOK"
] as const;

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [addedCryptos, setAddedCryptos] = useState<Ticker24hKey>({})
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>("USDT")
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const addedCryptosRef = useRef<Ticker24hKey>({})
  const updateInstantlyMessagesFlag = useRef(0)

  async function loadInitialData() {
    const { addedCryptos, selectedSymbol } = await chrome.storage.local.get<LocalStorageData>({
      addedCryptos: {},
      selectedSymbol: "USDT"
    });

    setAddedCryptos(addedCryptos)
    setSelectedSymbol(selectedSymbol)
  };

  async function startWSNewConnection(streams: string[]) {
    const url = `wss://stream.binance.com:9443/stream?streams=${streams.map(s => `${s}@ticker`).join("/")}`
    setSocket(new WebSocket(url))
  }

  useEffect(() => {
    if (!socket) return

    socket.onopen = (data) => {
      console.log('connected: ', data)
      updateInstantlyMessagesFlag.current = Object.keys(addedCryptos).length
    }

    socket.onmessage = async (message: MessageEvent<MessageTicker24h>) => {
      const parsed = JSON.parse(String(message.data)) as MessageTicker24h
      addedCryptosRef.current[parsed.stream] = parsed.data

      if (updateInstantlyMessagesFlag.current > 0) {
        return updateInstantlyMessagesFlag.current--
      }

      if (updateInstantlyMessagesFlag.current === 0) {
        console.log("update instantly")
        updateInstantlyMessagesFlag.current--
        setAddedCryptos({ ...addedCryptosRef.current })
      }
    }

    return () => { socket.close() }
  }, [socket])

  useEffect(() => {
    loadInitialData()
    startWSNewConnection(["btcusdt"])

    const interval = setInterval(() => {
      setAddedCryptos({ ...addedCryptosRef.current })
    }, 6000);

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <AppDataContext.Provider value={{
      symbols,
      selectedSymbol,
      addedCryptos,
      setAddedCryptos,
      addedCryptosRef
    }}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  return useContext(AppDataContext)
}