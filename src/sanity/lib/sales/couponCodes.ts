export const COUPON_CODES = {
    RAMADAN2025: 'RAMADAN2025',
    BFRIDAY: "BFRIDAY",
    XMAS2021: "XMAS2021",
    NY2022: "NY2022",
} as const;

export type CouponCode = keyof typeof COUPON_CODES;