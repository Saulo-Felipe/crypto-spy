export interface Ticker24hr {
  e: string;  // Event type
  E: number;  // Event time (timestamp)
  s: string;  // Symbol (e.g., BTCUSDT)
  p: string;  // Price change
  P: number;  // Price change percentage
  w: string;  // Weighted average price
  x: string;  // Previous day's close price
  c: string;  // Last price
  Q: string;  // Last quantity
  b: string;  // Best bid price
  B: string;  // Best bid quantity
  a: string;  // Best ask price
  A: string;  // Best ask quantity
  o: string;  // Open price
  h: string;  // High price
  l: string;  // Low price
  v: string;  // Total traded base asset volume
  q: string;  // Total traded quote asset volume
  O: number;  // Statistics open time (timestamp)
  C: number;  // Statistics close time (timestamp)
  F: number;  // First trade ID
  L: number;  // Last trade ID
  n: number;  // Total number of trades
}

export interface MessageTicker24h {
  stream: string;
  data: Ticker24hr
}

export type Ticker24hKey = { [key: string]: Ticker24hr }

export type Symbol = string

export type AvailableSymbols = {
  data: Symbol[]
  lastUpdate: number
}

// type UpdateTime = {
//   lastUpdate: number
// }

export interface LocalStorageData {
  addedCryptos: Ticker24hKey
  selectedSymbol: Symbol
  availableSymbols: AvailableSymbols
}