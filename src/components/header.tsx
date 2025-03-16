import { PlusIcon, SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const fiatCurrencies = [
  "BRL", "USD", "EUR", "GBP", "AUD", "CAD", "JPY", "RUB", "TRY", "ZAR",
  "NGN", "UAH", "ARS", "PLN", "RON", "MXN", "INR", "IDR", "THB"
];

export function Header() {


  return (
    <header className="flex p-2 items-center gap-2 border-b">
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

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Moeda" />
        </SelectTrigger>

        <SelectContent>
          {
            fiatCurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)
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