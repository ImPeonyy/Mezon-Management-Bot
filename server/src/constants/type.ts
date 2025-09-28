export type ParsedAction = {
    trigger: string | null;
    action: string | null;
    targetRaw: string | null;
};

export type Placeholders = Record<string, string | number | boolean | null | undefined>;

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}