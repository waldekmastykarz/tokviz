import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { GenAISpan } from '../types';

interface Props {
  spans: GenAISpan[];
}

interface TimePoint {
  time: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  requests: number;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString();
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatCost(n: number): string {
  if (n === 0) return '$0.00';
  if (n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

function chooseBucketSize(spans: GenAISpan[]): number {
  if (spans.length === 0) return 1_000;
  const first = Math.min(...spans.map((s) => s.startTime));
  const last = Math.max(...spans.map((s) => s.startTime));
  const rangeMs = last - first;
  // <2 min → 1s buckets, <10 min → 10s, <1h → 1 min, else 5 min
  if (rangeMs < 2 * 60_000) return 1_000;
  if (rangeMs < 10 * 60_000) return 10_000;
  if (rangeMs < 60 * 60_000) return 60_000;
  return 5 * 60_000;
}

export function Overview({ spans }: Props) {
  const timeData = useMemo(() => {
    const bucketSize = chooseBucketSize(spans);
    const buckets = new Map<number, TimePoint>();

    for (const span of spans) {
      const bucket = Math.floor(span.startTime / bucketSize) * bucketSize;
      const existing = buckets.get(bucket) || {
        time: bucket,
        inputTokens: 0,
        outputTokens: 0,
        cost: 0,
        requests: 0,
      };
      existing.inputTokens += span.inputTokens;
      existing.outputTokens += span.outputTokens;
      existing.cost += span.cost;
      existing.requests += 1;
      buckets.set(bucket, existing);
    }

    return Array.from(buckets.values()).sort((a, b) => a.time - b.time);
  }, [spans]);

  const totals = useMemo(() => {
    const models = new Set<string>();
    let tokens = 0;
    let cost = 0;

    for (const span of spans) {
      tokens += span.totalTokens;
      cost += span.cost;
      models.add(span.model);
    }

    return { tokens, cost, requests: spans.length, models: models.size };
  }, [spans]);

  const hasCost = totals.cost > 0;

  return (
    <div>
      <div className="cards">
        <div className="card">
          <div className="card-label">Total Tokens</div>
          <div className="card-value">{formatNumber(totals.tokens)}</div>
        </div>
        <div className="card">
          <div className="card-label">Total Cost</div>
          <div className="card-value">{formatCost(totals.cost)}</div>
        </div>
        <div className="card">
          <div className="card-label">Requests</div>
          <div className="card-value">{formatNumber(totals.requests)}</div>
        </div>
        <div className="card">
          <div className="card-label">Models</div>
          <div className="card-value">{totals.models}</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">Tokens over time</div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              stroke="var(--text-secondary)"
              fontSize={12}
            />
            <YAxis stroke="var(--text-secondary)" fontSize={12} />
            <Tooltip
              labelFormatter={formatTime}
              contentStyle={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="inputTokens"
              stroke="var(--chart-input)"
              name="Input"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="outputTokens"
              stroke="var(--chart-output)"
              name="Output"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {hasCost && (
        <div className="chart-container">
          <div className="chart-title">Cost over time</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="time"
                tickFormatter={formatTime}
                stroke="var(--text-secondary)"
                fontSize={12}
              />
              <YAxis
                stroke="var(--text-secondary)"
                fontSize={12}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                labelFormatter={formatTime}
                formatter={(value: number) => [`$${value.toFixed(4)}`, 'Cost']}
                contentStyle={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="var(--chart-cost)"
                name="Cost"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
