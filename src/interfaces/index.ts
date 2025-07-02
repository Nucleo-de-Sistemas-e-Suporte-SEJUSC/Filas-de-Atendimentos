export interface Attendance {
    id: number
    cpf: string
    name: string
    service: '' | 'RCN' | 'PAV'
    queue_type: '' | 'N' | 'P'
    status: string
    ticket_number: string
    guiche?: string
}

export interface Filters {
    searchByName: string
    searchByTicket: string
    services: string
    status: string
    queue: string
}

export type FormValues = Pick<Attendance, 'cpf' | 'name' | 'service' | 'queue_type'>
export type Ticket = Pick<Attendance, 'name' | 'ticket_number'>
