/**
 * Collaboration Space — In-memory message bus for inter-agent communication.
 *
 * Agents are CLI subprocesses and cannot talk to each other directly.
 * The orchestrator mediates all communication by publishing agent outputs
 * to this space and building context strings for subsequent agents.
 */

export type MessageType = "output" | "task-assignment" | "context" | "status" | "error";

export interface SpaceMessage {
  readonly id: number;
  readonly from: string;
  readonly to: string;
  readonly content: string;
  readonly type: MessageType;
  readonly timestamp: string;
}

/**
 * Collaboration space for a single orchestration session.
 * Thread-safe for single-threaded Node.js — no locking needed.
 */
export class CollaborationSpace {
  private messages: SpaceMessage[] = [];
  private nextId = 1;

  publish(from: string, content: string, type: MessageType = "output"): void {
    this.messages.push({
      id: this.nextId++,
      from,
      to: "all",
      content,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  send(from: string, to: string, content: string, type: MessageType = "context"): void {
    this.messages.push({
      id: this.nextId++,
      from,
      to,
      content,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  getMessagesFor(agentId: string): SpaceMessage[] {
    return this.messages.filter((m) => m.to === "all" || m.to === agentId);
  }

  getOutputs(): SpaceMessage[] {
    return this.messages.filter((m) => m.type === "output");
  }

  getHistory(): readonly SpaceMessage[] {
    return [...this.messages];
  }

  /**
   * Build a context string for an agent from all messages it can see.
   * Used to inject prior agent outputs as context for subsequent agents.
   */
  buildContext(agentId: string): string {
    const visible = this.getMessagesFor(agentId);
    if (visible.length === 0) return "";

    return visible
      .filter((m) => m.type === "output" || m.type === "context")
      .map((m) => `[${m.from}]: ${m.content}`)
      .join("\n\n");
  }

  /** Get a compact summary of the space state for status reporting. */
  getSummary(): { messageCount: number; agents: string[]; outputCount: number } {
    const agents = new Set<string>();
    let outputCount = 0;
    for (const m of this.messages) {
      if (m.from !== "system" && m.from !== "orchestrator") {
        agents.add(m.from);
      }
      if (m.type === "output") outputCount++;
    }
    return {
      messageCount: this.messages.length,
      agents: [...agents],
      outputCount,
    };
  }

  /** Clear all messages. */
  clear(): void {
    this.messages = [];
    this.nextId = 1;
  }
}
