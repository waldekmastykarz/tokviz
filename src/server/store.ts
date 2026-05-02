import { GenAISpan } from './types.js';

class Store {
  private spans: GenAISpan[] = [];

  add(span: GenAISpan): void {
    this.spans.push(span);
  }

  getAll(): { spans: GenAISpan[] } {
    return { spans: this.spans };
  }
}

export const store = new Store();
