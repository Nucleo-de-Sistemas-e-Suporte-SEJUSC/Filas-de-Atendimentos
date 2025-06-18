export interface Ticket {
    cpf: string,
    fila: string,
    id: number,
    name: string
    services: string
    ticket_number: string
}

export interface FormValues {
    cpf: string
    name: string
    services: '' | 'RCN' | 'PAV'
    fila: '' | 'NORMAL' | 'PREFERENCIAL'
}