import { useState } from 'react';
import { GenAISpan } from '../types';
import { RequestDetail } from './RequestDetail';

interface Props {
  spans: GenAISpan[];
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString();
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatCost(n: number): string {
  if (n === 0) return '-';
  if (n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

export function Requests({ spans }: Props) {
  const [selected, setSelected] = useState<GenAISpan | null>(null);

  const sorted = [...spans].sort((a, b) => b.startTime - a.startTime);

  return (
    <div>
      <div className="chart-container">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Model</th>
              <th>Operation</th>
              <th>Input</th>
              <th>Output</th>
              <th>Cost</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((span) => (
              <tr
                key={span.id}
                className="clickable"
                onClick={() => setSelected(span)}
              >
                <td className="mono">{formatTime(span.startTime)}</td>
                <td className="mono">{span.model}</td>
                <td>{span.operationName}</td>
                <td>{span.inputTokens.toLocaleString()}</td>
                <td>{span.outputTokens.toLocaleString()}</td>
                <td>{formatCost(span.cost)}</td>
                <td>{formatDuration(span.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <RequestDetail span={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
