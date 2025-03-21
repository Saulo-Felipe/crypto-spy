export interface SymbolInfo {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
}

export interface TickerData {
  symbol: string;
  volume: string;
  quoteVolume: string;
  count: string;
}

export interface ParComVolume {
  symbol: string;
  websocketStream: string;
  baseAsset: string;
  quoteAsset: string;
  volume: number;
  quoteVolume: number;
  tradeCount: number;
}
