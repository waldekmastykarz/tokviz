import { randomBytes } from 'crypto';
import { GenAISpan } from './types.js';

const models = [
  { name: 'gpt-4o', inputCostPer1k: 0.0025, outputCostPer1k: 0.01 },
  { name: 'gpt-4o-mini', inputCostPer1k: 0.00015, outputCostPer1k: 0.0006 },
  { name: 'claude-sonnet-4-20250514', inputCostPer1k: 0.003, outputCostPer1k: 0.015 },
  { name: 'claude-3-5-haiku-20241022', inputCostPer1k: 0.0008, outputCostPer1k: 0.004 },
  { name: 'gemini-2.0-flash', inputCostPer1k: 0.0001, outputCostPer1k: 0.0004 },
];

const operations = ['chat', 'chat', 'chat', 'embeddings', 'completions'];

function hexId(bytes: number): string {
  return randomBytes(bytes).toString('hex');
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSpan(baseTime?: number): GenAISpan {
  const model = pick(models);
  const operation = pick(operations);
  const now = baseTime ?? Date.now();
  const duration = randomInt(200, 8000);
  const startTime = now - duration;
  const inputTokens = randomInt(50, 12000);
  const outputTokens = operation === 'embeddings' ? 0 : randomInt(20, 4000);
  const totalTokens = inputTokens + outputTokens;
  const cost =
    (inputTokens / 1000) * model.inputCostPer1k +
    (outputTokens / 1000) * model.outputCostPer1k;

  const spanId = hexId(8);
  const traceId = hexId(16);

  return {
    id: spanId,
    traceId,
    name: `${operation} ${model.name}`,
    startTime,
    endTime: now,
    duration,
    model: model.name,
    requestModel: model.name,
    responseModel: model.name,
    inputTokens,
    outputTokens,
    totalTokens,
    cost,
    operationName: operation,
    attributes: {
      'gen_ai.operation.name': operation,
      'gen_ai.request.model': model.name,
      'gen_ai.response.model': model.name,
      'gen_ai.usage.input_tokens': inputTokens,
      'gen_ai.usage.output_tokens': outputTokens,
      'gen_ai.usage.total_tokens': totalTokens,
      'gen_ai.usage.cost': parseFloat(cost.toFixed(6)),
      'gen_ai.system': model.name.startsWith('gpt')
        ? 'openai'
        : model.name.startsWith('claude')
          ? 'anthropic'
          : 'google_genai',
    },
  };
}

export function generateInitialSpans(count: number = 25): GenAISpan[] {
  const spans: GenAISpan[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    // Spread spans over the last 10 minutes
    const time = now - randomInt(0, 10 * 60_000);
    spans.push(generateSpan(time));
  }

  return spans.sort((a, b) => a.startTime - b.startTime);
}
