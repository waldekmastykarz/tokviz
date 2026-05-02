import { useMemo } from 'react';
import { GenAISpan } from '../types';

interface Props {
  spans: GenAISpan[];
}

interface ModelStats {
  model: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatCost(n: number): string {
  if (n === 0) return '-';
  if (n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

export function Models({ spans }: Props) {
  const models = useMemo(() => {
    const map = new Map<string, ModelStats>();

    for (const span of spans) {
      const existing = map.get(span.model) || {
        model: span.model,
        requests: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        cost: 0,
      };
      existing.requests += 1;
      existing.inputTokens += span.inputTokens;
      existing.outputTokens += span.outputTokens;
      existing.totalTokens += span.totalTokens;
      existing.cost += span.cost;
      map.set(span.model, existing);
    }

    return Array.from(map.values()).sort((a, b) => b.requests - a.requests);
  }, [spans]);

  return (
    <div className="chart-container">
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Requests</th>
            <th>Input Tokens</th>
            <th>Output Tokens</th>
            <th>Total Tokens</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.model}>
              <td className="mono">{m.model}</td>
              <td>{m.requests}</td>
              <td>{formatNumber(m.inputTokens)}</td>
              <td>{formatNumber(m.outputTokens)}</td>
              <td>{formatNumber(m.totalTokens)}</td>
              <td>{formatCost(m.cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
