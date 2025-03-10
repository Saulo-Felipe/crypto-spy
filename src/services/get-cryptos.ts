import { TickerData } from "@/@types/services/get-crypto"


export async function getCryptos(symbols: string[]): Promise<TickerData[] | null> {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`)
    const data: TickerData[] = await response.json()

    return data

  } catch (err) {
    console.log({ err })
    return null
  }
}