// import { UserProfile } from "@/types";

export const userRoles = {
    SUBSCRIBER: 'subscriber',
    CONTRIBUTOR: 'contributor',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
}

export const INITIAL_USER = {
    id: '',
    name: '',
    email: '',
    role: '',
    storeRole: ''
};



export const PaymentTypeEnum = {
    cash_on_delivery: "COD",
    upi: "UPI",
    credit_card: "Credit card",
    debit_card: "Debit card",
    net_banking: "Net Banking",
    wallet: "Wallet",
    emi: "EMI",
    pay_later: "Pay Later",
    cardless_emi: "Cardless EMI",
    bank_transfer: "Bank Transfer",
}


export const PaymentStatusEnum = {
    paid: "PAID",
    unpaid: "UNPAID"
}
