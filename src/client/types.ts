export interface GenAISpan {
  id: string;
  traceId: string;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  model: string;
  requestModel?: string;
  responseModel?: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  operationName: string;
  attributes: Record<string, string | number | boolean>;
}

export type WSMessage =
  | { type: 'init'; data: { spans: GenAISpan[] } }
  | { type: 'spans'; data: GenAISpan[] };
