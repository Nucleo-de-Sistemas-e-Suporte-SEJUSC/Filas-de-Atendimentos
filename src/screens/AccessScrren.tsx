import React from "react"
import { api } from "@/api/axios"
import type { AxiosError } from "axios"

interface Attendances {
    id: number
    cpf: string
    name: string
    service: string
    queue_type: string
    ticket_number: string
}

export function AccessScreen() {
    const [requestState, setRequestState] = React.useState<{
        attendances: Attendances[] | null
        loading: boolean
        error: string | null
    }>({
        attendances: null,
        loading: false,
        error: null
    })

    const { attendances, loading, error } = requestState

    React.useEffect(() => {
        const fetchTickets = async () => {
            setRequestState((prevStates) => ({
                ...prevStates,
                loading: true,
                error: null
            }))

            try {
                const response = await api.get('/ticketss')
                const data = (await response.data) as Attendances[]
                setRequestState((prevVAlues) => ({
                    ...prevVAlues,
                    attendances: data
                }))
            } catch (error) {
                const { response } = error as AxiosError<{ message: string }>
                setRequestState((prevStates) => ({
                    ...prevStates,
                    loading: false,
                    error: `Erro ao gerar a senha: ${response?.data.message || 'Erro desconhecido'}`
                }))
            }
        }
        fetchTickets()
    }, [])

    if (loading) <p className="text-lg">Carregando lista de atendimentos...</p>
    if (error) <p>Erro Inesperado ocorreu</p>

    return (
        <main className="grid justify-items-center gap-8 bg-gray-50 mx-auto mt-24 max-w-4xl shadow-md rounded">
            <div className="overflow-x-auto rounded shadow-lg w-full">
                <table className="min-w-full text-left text-gray-700">
                    <thead className="bg-blue-900 text-white uppercase text-xl tracking-wider">
                        <tr className="*:px-6 *:py-3">
                            <th scope="col">Nome</th>
                            <th scope="col">Serviço</th>
                            <th scope="col">Fila</th>
                            <th scope="col">Senha</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {attendances && attendances.map(({ id, name, service, queue_type, ticket_number }) => (
                            <tr key={id} className="*:px-6 *:py-4 *:text-lg">
                                <td>{name}</td>
                                <td>{service}</td>
                                <td>{queue_type}</td>
                                <td>{ticket_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </main>
    )
}