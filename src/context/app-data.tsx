import { LocalStorageData, MessageTicker24h, Symbol, Ticker24hKey } from "@/@types/components/table-content";
import { getMainAvailableCryptos } from "@/services/get-cryptos";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";

interface AppDataContext {
  availableSymbols: readonly Symbol[]
  addedCryptos: Ticker24hKey
  addedCryptosRef: React.RefObject<Ticker24hKey>
  setAddedCryptos: Dispatch<SetStateAction<Ticker24hKey>>
  oldAddedCryptosPriceRef: React.RefObject<string[]>
  selectedSymbol: Symbol
}

const AppDataContext = createContext<AppDataContext>({} as AppDataContext)

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [addedCryptos, setAddedCryptos] = useState<Ticker24hKey>({})
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>("USDT")
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([])

  const addedCryptosRef = useRef<Ticker24hKey>({})
  const oldAddedCryptosPriceRef = useRef<string[]>([])
  const updateInstantlyMessagesFlag = useRef(0)

  async function loadInitialData() {
    const chromeLocal = await chrome.storage.local.get<LocalStorageData>({
      addedCryptos: {},
      selectedSymbol: "USDT",
      availableSymbols: {
        data: [],
        lastUpdate: 0
      }
    });

    setAddedCryptos(chromeLocal.addedCryptos)
    setSelectedSymbol(chromeLocal.selectedSymbol)

    if (Date.now() - chromeLocal.availableSymbols.lastUpdate > 86_400_000) {
      const data = await getMainAvailableCryptos()
      await chrome.storage.local.set({ availableSymbols: { data, lastUpdate: Date.now() } })
      return setAvailableSymbols(data)
    }

    setAvailableSymbols(chromeLocal.availableSymbols.data)
  };

  async function startWSNewConnection(streams: string[]) {
    const url = `wss://stream.binance.com:9443/stream?streams=${streams.map(s => `${s}@ticker`).join("/")}`
    setSocket(new WebSocket(url))
  }

  async function handleUpdateAddedCryptos() {
    setAddedCryptos(prev => {
      oldAddedCryptosPriceRef.current = Object.values(prev).map(c => c.c)
      return { ...addedCryptosRef.current }
    })

    await chrome.storage.local.set<LocalStorageData>({
      addedCryptos: {
        ...addedCryptosRef.current,
      }
    });
  }

  useEffect(() => {
    if (!socket) return

    socket.onopen = () => {
      updateInstantlyMessagesFlag.current = Object.keys(addedCryptos).length
    }

    socket.onmessage = async (message: MessageEvent<MessageTicker24h>) => {
      const parsed = JSON.parse(String(message.data)) as MessageTicker24h
      addedCryptosRef.current[parsed.stream] = parsed.data

      if (updateInstantlyMessagesFlag.current > 0) {
        return updateInstantlyMessagesFlag.current--
      }

      if (updateInstantlyMessagesFlag.current === 0) {
        updateInstantlyMessagesFlag.current--
        handleUpdateAddedCryptos()
      }
    }

    return () => { socket.close() }
  }, [socket])

  useEffect(() => {
    loadInitialData()
    startWSNewConnection(["btcusdt"])

    const interval = setInterval(handleUpdateAddedCryptos, 6000);

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <AppDataContext.Provider value={{
      availableSymbols,
      selectedSymbol,
      addedCryptos,
      setAddedCryptos,
      addedCryptosRef,
      oldAddedCryptosPriceRef
    }}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  return useContext(AppDataContext)
}