import { ParComVolume, SymbolInfo, TickerData } from "@/@types/services/get-main-cryptos";

export async function getMainCryptos(): Promise<ParComVolume[]> {
  try {
    const exchangeResponse = await fetch("https://api.binance.com/api/v3/exchangeInfo");
    if (!exchangeResponse.ok) throw new Error("Erro no exchangeInfo");
    const exchangeData: { symbols: SymbolInfo[] } = await exchangeResponse.json();

    const tickerResponse = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    if (!tickerResponse.ok) throw new Error("Erro no ticker/24hr");
    const tickerData: TickerData[] = await tickerResponse.json();

    const paresComVolume: ParComVolume[] = exchangeData.symbols
      .filter((symbol: SymbolInfo) => symbol.status === "TRADING")
      .map((symbol: SymbolInfo) => {
        const ticker = tickerData.find((t: TickerData) => t.symbol === symbol.symbol);
        return {
          symbol: symbol.symbol,
          websocketStream: `${symbol.symbol.toLowerCase()}@ticker`,
          baseAsset: symbol.baseAsset,
          quoteAsset: symbol.quoteAsset,
          volume: ticker ? parseFloat(ticker.volume) : 0,
          quoteVolume: ticker ? parseFloat(ticker.quoteVolume) : 0,
          tradeCount: ticker ? parseInt(ticker.count) : 0,
        };
      });

    const paresOrdenados: ParComVolume[] = paresComVolume.sort(
      (a: ParComVolume, b: ParComVolume) => b.quoteVolume - a.quoteVolume
    );

    return paresOrdenados;
  } catch (error) {
    console.error("Erro ao buscar pares:", (error as Error).message);
    return [];
  }
}