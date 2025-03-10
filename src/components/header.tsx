import { SettingsIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Header() {

  return (
    <header className="flex p-5 items-center gap-4 border-b">
      <SettingsIcon />

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma Crypto" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="1">BITCOIN</SelectItem>
          <SelectItem value="2">SOLANA</SelectItem>
          <SelectItem value="2">ETHEREUM</SelectItem>
        </SelectContent>
      </Select>
    </header>
  )
}