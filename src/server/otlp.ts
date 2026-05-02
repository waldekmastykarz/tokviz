import protobuf from 'protobufjs';
import { GenAISpan } from './types.js';
import { store } from './store.js';
import { protoDescriptor } from './proto.js';

const root = protobuf.Root.fromJSON(protoDescriptor);
const ExportTraceServiceRequest = root.lookupType(
  'opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest'
);

export function handleTraces(
  body: Buffer | object,
  contentType: string
): GenAISpan[] {
  let request: any;

  if (contentType.includes('application/x-protobuf')) {
    const message = ExportTraceServiceRequest.decode(
      body instanceof Buffer ? new Uint8Array(body) : (body as unknown as Uint8Array)
    );
    request = ExportTraceServiceRequest.toObject(message, {
      longs: String,
      bytes: Buffer,
      defaults: true,
    });
  } else {
    request = body;
  }

  return extractGenAISpans(request);
}

function extractGenAISpans(request: any): GenAISpan[] {
  const spans: GenAISpan[] = [];

  for (const resourceSpan of request.resourceSpans || []) {
    for (const scopeSpan of resourceSpan.scopeSpans || []) {
      for (const span of scopeSpan.spans || []) {
        const attrs = extractAttributes(span.attributes || []);

        const hasGenAI = Object.keys(attrs).some((k) =>
          k.startsWith('gen_ai.')
        );
        if (!hasGenAI) continue;

        const inputTokens = toNumber(attrs['gen_ai.usage.input_tokens']);
        const outputTokens = toNumber(attrs['gen_ai.usage.output_tokens']);

        const genAISpan: GenAISpan = {
          id: toHex(span.spanId),
          traceId: toHex(span.traceId),
          name: span.name || '',
          startTime: nanoToMs(span.startTimeUnixNano),
          endTime: nanoToMs(span.endTimeUnixNano),
          duration:
            nanoToMs(span.endTimeUnixNano) - nanoToMs(span.startTimeUnixNano),
          model: String(
            attrs['gen_ai.response.model'] ||
              attrs['gen_ai.request.model'] ||
              'unknown'
          ),
          requestModel:
            attrs['gen_ai.request.model'] != null
              ? String(attrs['gen_ai.request.model'])
              : undefined,
          responseModel:
            attrs['gen_ai.response.model'] != null
              ? String(attrs['gen_ai.response.model'])
              : undefined,
          inputTokens,
          outputTokens,
          totalTokens:
            attrs['gen_ai.usage.total_tokens'] != null
              ? toNumber(attrs['gen_ai.usage.total_tokens'])
              : inputTokens + outputTokens,
          cost: toFloat(attrs['gen_ai.usage.cost']),
          operationName: String(
            attrs['gen_ai.operation.name'] || span.name || ''
          ),
          attributes: attrs,
        };

        store.add(genAISpan);
        spans.push(genAISpan);
      }
    }
  }

  return spans;
}

function extractAttributes(
  attributes: any[]
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};

  for (const attr of attributes) {
    const key = attr.key;
    const value = attr.value;
    if (!value) continue;

    if (value.stringValue != null) result[key] = value.stringValue;
    else if (value.intValue != null) result[key] = Number(value.intValue);
    else if (value.doubleValue != null) result[key] = value.doubleValue;
    else if (value.boolValue != null) result[key] = value.boolValue;
  }

  return result;
}

function toHex(value: any): string {
  if (typeof value === 'string') {
    if (/^[0-9a-f]+$/i.test(value)) return value.toLowerCase();
    return Buffer.from(value, 'base64').toString('hex');
  }
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return Buffer.from(value).toString('hex');
  }
  return String(value);
}

function nanoToMs(nano: any): number {
  if (typeof nano === 'string') {
    return Number(BigInt(nano) / BigInt(1_000_000));
  }
  if (typeof nano === 'number') return nano / 1_000_000;
  return 0;
}

function toNumber(value: any): number {
  if (value == null) return 0;
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

function toFloat(value: any): number {
  if (value == null) return 0;
  const n = parseFloat(String(value));
  return isNaN(n) ? 0 : n;
}
