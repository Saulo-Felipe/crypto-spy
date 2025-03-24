import { useAppData } from "@/context/app-data";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export function Header() {
  const { availableSymbols } = useAppData();
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isComboxOpen, setIsComboxOpen] = useState(false)

  function handleAddNewCrypto() {

  }

  return (
    <header className="flex p-2 items-center gap-2 border-b">
      <Popover open={isComboxOpen} onOpenChange={setIsComboxOpen}>
        <PopoverTrigger className="flex-1">
          <Button variant={"outline"} className={cn("w-full text-start justify-between font-normal", {
            'opacity-50': !selectedItem
          })}>
            {
              selectedItem
                ? selectedItem
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
                    availableSymbols.map(symbol => (
                      <CommandItem
                        key={symbol}
                        value={symbol}
                        onSelect={(currentValue) => {
                          setSelectedItem(currentValue)
                          setIsComboxOpen(false)
                        }}
                      >
                        {symbol}
                        <CheckIcon
                          className={cn(
                            "ml-auto",
                            selectedItem === symbol ? "opacity-100" : "opacity-0"
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
        variant={"outline"}
        disabled={!selectedItem}
        className="disabled:opacity-30 disabled:cursor-not-allowed "
      >
        <PlusIcon />
      </Button>

      <Button variant={"outline"}>
        <SettingsIcon />
      </Button>
    </header>
  );
}