import { LocalStorageData, Ticker24hr } from "@/@types/components/table-content";
import { useAppData } from "@/context/app-data";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, LoaderCircleIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export function Header() {
  const { availableSymbols, addedCryptosRef, updateSocketCryptoConnections, isLoading, setIsLoading } = useAppData();
  const [selectedCrypto, setSelectedCryto] = useState<string | null>(null)
  const [isComboxOpen, setIsComboxOpen] = useState(false)

  async function handleAddNewCrypto() {
    // lembrar de tratar as cryptos invaldias
    if (selectedCrypto) {
      setIsLoading(true)
      setSelectedCryto(null)

      const cryptoKey = `${selectedCrypto}@ticker`.toLowerCase()

      const newdata = {
        addedCryptos: {
          ...addedCryptosRef.current,
          [cryptoKey]: {
            s: selectedCrypto,
            P: 0
          } as Ticker24hr
        }
      }

      addedCryptosRef.current = newdata.addedCryptos
      await chrome.storage.local.set<LocalStorageData>(newdata)
      updateSocketCryptoConnections()
    }
  }

  return (
    <header className="flex p-2 items-center gap-2 border-b">
      <Popover open={isComboxOpen} onOpenChange={setIsComboxOpen}>
        <PopoverTrigger
          className="flex-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          disabled={isLoading}
        >
          <Button variant={"outline"} className={cn("w-full text-start justify-between font-normal", {
            'opacity-50': !selectedCrypto
          })}>
            {
              selectedCrypto
                ? selectedCrypto
                : "Selecione uma crypto"
            }
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Selecione uma crypto" />

            <CommandList className="overflow-hidden">
              <ScrollArea className="h-[300px]">
                <CommandEmpty>Nenhuma crypto disponível</CommandEmpty>
                <CommandGroup>
                  {
                    availableSymbols
                      .filter(symbol => addedCryptosRef.current[`${symbol}@ticker`.toLowerCase()] === undefined)
                      .map(symbol => (
                        <CommandItem
                          key={symbol}
                          value={symbol}
                          onSelect={(currentValue) => {
                            setSelectedCryto(currentValue)
                            setIsComboxOpen(false)
                          }}
                        >
                          {symbol}
                          <CheckIcon
                            className={cn(
                              "ml-auto",
                              selectedCrypto === symbol ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))
                  }
                </CommandGroup>

                <ScrollBar />
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>


      <Button
        onClick={handleAddNewCrypto}
        variant={selectedCrypto ? "default" : "outline"}
        disabled={!selectedCrypto || isLoading}
        className="disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        {
          isLoading
            ? <LoaderCircleIcon className="animate-spin size-4" />
            : <PlusIcon />
        }
      </Button>

      <Button variant={"outline"}>
        <SettingsIcon />
      </Button>
    </header>
  );
}