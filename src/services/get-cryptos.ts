import { SymbolInfo, TickerData } from "@/@types/services/get-main-cryptos";

export async function getMainAvailableCryptos(): Promise<string[]> {
  try {
    console.log("[API] Buscando pares...");
    const exchangeResponse = await fetch("https://api.binance.com/api/v3/exchangeInfo");
    if (!exchangeResponse.ok) throw new Error("Erro no exchangeInfo");
    const exchangeData: { symbols: SymbolInfo[] } = await exchangeResponse.json();

    const tickerResponse = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    if (!tickerResponse.ok) throw new Error("Erro no ticker/24hr");
    const tickerData: TickerData[] = await tickerResponse.json();

    return exchangeData.symbols
      .filter((symbol: SymbolInfo) => symbol.status === "TRADING")
      .map((symbol: SymbolInfo) => {
        const ticker = tickerData.find((t: TickerData) => t.symbol === symbol.symbol);
        return {
          symbol: symbol.symbol,
          quoteVolume: ticker ? parseFloat(ticker.quoteVolume) : 0,
        };
      })
      .sort(
        (a, b) => b.quoteVolume - a.quoteVolume
      ).map(item => item.symbol);

  } catch (error) {
    console.error("Erro ao buscar pares:", (error as Error).message);
    return [];
  }
}