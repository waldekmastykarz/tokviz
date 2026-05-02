import { GenAISpan } from '../types';

interface Props {
  span: GenAISpan;
  onClose: () => void;
}

export function RequestDetail({ span, onClose }: Props) {
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>{span.name}</h3>
        <table className="attr-table">
          <tbody>
            <tr>
              <td>Span ID</td>
              <td className="mono">{span.id}</td>
            </tr>
            <tr>
              <td>Trace ID</td>
              <td className="mono">{span.traceId}</td>
            </tr>
            <tr>
              <td>Model</td>
              <td className="mono">{span.model}</td>
            </tr>
            <tr>
              <td>Operation</td>
              <td>{span.operationName}</td>
            </tr>
            <tr>
              <td>Duration</td>
              <td>{span.duration.toFixed(0)}ms</td>
            </tr>
            <tr>
              <td>Input Tokens</td>
              <td>{span.inputTokens.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Output Tokens</td>
              <td>{span.outputTokens.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total Tokens</td>
              <td>{span.totalTokens.toLocaleString()}</td>
            </tr>
            {span.cost > 0 && (
              <tr>
                <td>Cost</td>
                <td>${span.cost.toFixed(4)}</td>
              </tr>
            )}
            {Object.entries(span.attributes)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, value]) => (
                <tr key={key}>
                  <td className="mono">{key}</td>
                  <td className="mono">{String(value)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
