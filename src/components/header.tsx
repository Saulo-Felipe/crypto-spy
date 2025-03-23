import { useAppData } from "@/context/app-data";
import { PlusIcon, SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


export function Header() {
  const { availableSymbols } = useAppData()

  return (
    <header className="flex p-2 items-center gap-2 border-b">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma Crypto" />
        </SelectTrigger>

        <SelectContent>
          {
            availableSymbols.map(f =>
              <SelectItem key={f} value={f}>{f}</SelectItem>
            )
          }
        </SelectContent>
      </Select>

      <Button variant={"outline"}>
        <PlusIcon />
      </Button>

      <Button variant={"outline"}>
        <SettingsIcon />
      </Button>
    </header>
  )
}