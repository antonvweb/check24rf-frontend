import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import {styled} from '@mui/material/styles';

type CustomCheckboxProps = {
    checked: boolean; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; ariaLabel?: string;
    color?: string;
};

// Своя SVG галочка
interface CheckSvgProps {
    color?: string;
}

export const CheckSvg: React.FC<CheckSvgProps> = ({ color = 'var(--checkbox-fill)' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <path
            d="M17.5129 6.41447C17.7894 6.14569 18.1573 5.99709 18.5391 6.00004C18.9208 6.00299 19.2865 6.15725 19.559 6.43027C19.8315 6.7033 19.9894 7.07372 19.9995 7.46339C20.0096 7.85306 19.871 8.23149 19.6131 8.51883L11.7817 18.5196C11.647 18.6677 11.4845 18.7866 11.3038 18.8691C11.1232 18.9515 10.9281 18.996 10.7302 18.9997C10.5323 19.0035 10.3357 18.9664 10.1522 18.8908C9.96861 18.8152 9.80188 18.7026 9.66194 18.5597L4.46852 13.2567C4.3239 13.1191 4.20789 12.9531 4.12744 12.7687C4.04698 12.5844 4.00372 12.3853 4.00023 12.1835C3.99674 11.9817 4.0331 11.7812 4.10714 11.594C4.18117 11.4069 4.29137 11.2368 4.43116 11.0941C4.57094 10.9514 4.73745 10.8388 4.92074 10.7632C5.10404 10.6876 5.30037 10.6505 5.49803 10.6541C5.69568 10.6576 5.89061 10.7018 6.07118 10.784C6.25175 10.8661 6.41427 10.9846 6.54903 11.1323L10.659 15.327L17.4756 6.45856L17.5129 6.41447Z"
            fill={color}
        />
    </svg>
);


// Базовый стиль чекбокса
const BaseIcon = styled('span')<{ color?: string }>(({ color = 'var(--checkbox-fill)' }) => ({
    width: 28,
    height: 28,
    borderRadius: 4,
    border: `1px solid ${color}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease-in-out',
    padding: 0,
}));

// Неотмеченный чекбокс (svg скрыт)
const UncheckedIcon = styled(BaseIcon)({
    '& svg': {
        opacity: 0, transition: 'opacity 0.2s ease-in-out',
    },
});

// Отмеченный чекбокс (svg виден)
const CheckedIcon = styled(BaseIcon)({
    '& svg': {
        opacity: 1, transition: 'opacity 0.2s ease-in-out',
    },
});

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
                                                                  checked,
                                                                  onChange,
                                                                  ariaLabel = 'custom checkbox',
                                                                  color = 'var(--checkbox-fill)',
                                                              }) => {
    return (
        <Checkbox
            checked={checked}
            onChange={onChange}
            icon={
                <UncheckedIcon color={color}>
                    <CheckSvg color={color} />
                </UncheckedIcon>
            }
            checkedIcon={
                <CheckedIcon color={color}>
                    <CheckSvg color={color} />
                </CheckedIcon>
            }
            inputProps={{ 'aria-label': ariaLabel }}
        />
    );
};

