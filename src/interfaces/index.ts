export interface Attendances {
    id: number
    cpf: string
    name: string
    service: '' | 'RCN' | 'PAV'
    queue_type: '' | 'N' | 'P'
    status: string
    ticket_number: string
}

export interface Filters {
    searchByName: string
    searchByTicket: string
    services: string
    queue: string
}

export type FormValues = Pick<Attendances, 'cpf' | 'name' | 'service' | 'queue_type'>
export type Ticket = Pick<Attendances, 'name' | 'ticket_number'>
