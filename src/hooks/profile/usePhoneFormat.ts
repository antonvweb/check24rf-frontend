export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length !== 11 || !cleaned.startsWith('7') && !cleaned.startsWith('8')) {
        return phone;
    }

    // Берём код оператора и остальное
    const code = cleaned.slice(1, 4);
    const part1 = cleaned.slice(4, 7);
    const part2 = cleaned.slice(7, 9);
    const part3 = cleaned.slice(9);

    return `+7 (${code}) ${part1}-${part2}-${part3}`;
}