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

export interface Attendances {
    id: number
    cpf: string
    name: string
    service: string
    queue_type: string
    ticket_number: string
}

export interface Filters {
    searchByName: string
    searchByTicket: string
    services: string
    queue: string
}