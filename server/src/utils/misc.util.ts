import { ParsedAction, Placeholders } from "@/constants";

export const parseActionCommand = (content: string): ParsedAction => {
    const match = content?.trim().match(/^(\!\S+)\s+(\S+)(?:\s+(.*))?$/);
    if (!match) return { trigger: null, action: null, targetRaw: null };

    const [, trigger, action, targetRaw] = match;

    return {
        trigger: trigger.trim().toLowerCase(),
        action: action.trim().toLowerCase(),
        targetRaw: targetRaw?.trim().toLowerCase() ?? null,
    };
};

export function replacePlaceholders(
    template: string,
    data: Placeholders
): string {
    return template.replace(/\{(\w+)\}/g, (_, key: string) => {
        const value = data[key];
        return value != null ? `${String(value)}` : '';
    });
}

const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        Math.round(
            255 *
                (l -
                    a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
        );

    return `#${[f(0), f(8), f(4)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;
};

export const getRandomPastelHexColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70;
    const lightness = 80;

    return hslToHex(hue, saturation, lightness);
};

export const getMentionPosition = (text: string, username: string) => {
    const regex = /@\w+/;
    const match = text.match(regex);

    if (!match) return null;

    const start = match.index;
    const end = start ? start + username.length + 1 : 0;
    return { start, end };
};
