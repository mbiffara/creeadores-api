export type BullMQJobOptions = {
    name: string;
    data: Record<string, unknown>;
};
export declare const bullmqClient: {
    enqueue(options: BullMQJobOptions): Promise<string | undefined>;
    close(): Promise<void>;
};
//# sourceMappingURL=bullmqClient.d.ts.map