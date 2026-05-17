export function roundNum(value: number | string | null | undefined): number {
    const n = Number(value);
    if (!isFinite(n)) return 0;
    return parseFloat(n.toFixed(2));
}
