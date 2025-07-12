// utils/phoneValidation.ts
const VALID_OPERATOR_CODES = new Set([
    '901','902','903','904','905','906','908','909',
    '910','911','912','913','914','915','916','917',
    '918','919','920','921','922','923','924','925',
    '926','927','928','929','930','931','932','933',
    '934','936','937','938','939','950','951','952',
    '953','954','955','956','957','958','959','960',
    '961','962','963','964','965','966','967','968',
    '969','970','971','977','978','980','981','982',
    '983','984','985','986','987','988','989','991',
    '992','993','994','995','996','997','998','999'
]);

export const formatPhoneRussianNumber = (phone: string): boolean => {
    return VALID_OPERATOR_CODES.has( phone.slice(0, 3));
};

const maskTemplate = '+7 (XXX) XXX-XX-XX';

export const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').replace(/^7|8/, '').slice(0, 10);
    let result = '';
    let digitIndex = 0;

    for (const char of maskTemplate) {
        if (char === 'X') {
            if (digitIndex < digits.length) {
                result += digits[digitIndex++];
            } else {
                result += 'X';
            }
        } else {
            result += char;
        }
    }

    return result;
};

