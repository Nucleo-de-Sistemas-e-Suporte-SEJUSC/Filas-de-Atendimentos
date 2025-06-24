import React from "react"
import { api } from "@/api/axios"
import { 
    Input, 
    Select 
} from "@/components"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { Attendances, Filters } from "@/interfaces"

import type { AxiosError } from "axios"
import { toast } from "sonner"

export function AccessScreen() {
    const { setStoredValue } = useLocalStorage<Attendances | null>('attendance', null)
    const [requestState, setRequestState] = React.useState<{
        attendances: Attendances[] | null
        loading: boolean
        error: string | null
    }>({
        attendances: null,
        loading: false,
        error: null
    })

    const [filters, setFilters] = React.useState<Filters>({
        searchByName: '',
        searchByTicket: '',
        services: '',
        queue: ''

    })

    const { attendances, loading, error } = requestState
    const { searchByName, searchByTicket, services, queue } = filters

    React.useEffect(() => {
        const fetchListOfAttendances = async () => {
            setRequestState((prevStates) => ({
                ...prevStates,
                loading: true,
                error: null
            }))

            try {
                const response = await api.get('/tickets')
                const data = (await response.data) as Attendances[]
                setRequestState((prevVAlues) => ({
                    ...prevVAlues,
                    attendances: data
                }))
            } catch (error) {
                const { response } = error as AxiosError<{ message: string }>
                setRequestState((prevStates) => ({
                    ...prevStates,
                    error: `Erro ao gerar a senha: ${response?.data.message || 'Erro desconhecido'}`
                }))
            } finally {
                setRequestState((prevStates) => ({
                    ...prevStates,
                    loading: false,
                }))
            }
        }
        fetchListOfAttendances()
    }, [])

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget

        setFilters((prevValues) => ({
            ...prevValues,
            [name]: value.toUpperCase()
        }))
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.currentTarget

        setFilters((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleStartAttendance = (attendance: Attendances) => {
        setStoredValue(attendance)
        toast.success('Atendimento Iniciado', {
            description: `${attendance.name} ${attendance.ticket_number}`
        })
    }

    const filterListOfAttendances = () => {
        let filteredListOfAttendances: Attendances[] | null | undefined = attendances

        filteredListOfAttendances = filteredListOfAttendances?.filter((attendance) => {
            return attendance.name.includes(searchByName)
        })

        filteredListOfAttendances = filteredListOfAttendances?.filter((attendance) => {
            return attendance.ticket_number.includes(searchByTicket)
        })

        if (services !== '' && services !== 'all') {
            filteredListOfAttendances = filteredListOfAttendances?.filter((attendance) => {
                return attendance.service === services
            })
        }

        if (queue !== '' && queue !== 'all') {
            filteredListOfAttendances = filteredListOfAttendances?.filter((attendance) => {
                return attendance.queue_type === queue
            })
        }

        return filteredListOfAttendances
    }

    const filteredAttendances = filterListOfAttendances()

    if (loading) return <p className="text-xl text-center pt-8">Carregando lista de atendimentos...</p>
    if (error) return <p className="text-xl text-center pt-8">Erro desconhecido ocorreu</p>

    return (
        <main className="grid justify-items-center gap-8 mx-auto mt-24 max-w-max rounded p-8">
            <section className="flex flex-col gap-4 overflow-x-auto w-full">
                <div className="flex flex-wrap gap-4 max-w-max">
                    <Input
                        id="searchByName"
                        label="Nome"
                        value={searchByName}
                        onChange={handleSearchChange}
                        placeholder="Pesquise por um Nome..."
                        className="border-2 border-gray-800 p-2 rounded text-lg text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
                    />
                    <Select
                        id="services"
                        label="Serviços"
                        value={services}
                        optionLabel='Selecione um Serviço'
                        options={[{ label: 'Todos os serviços', value: 'all' }, { label: 'PAV', value: 'PAV' }, { label: 'RCN', value: 'RCN' }]}
                        onChange={handleSelectChange}
                        required
                        className="border-2 border-gray-800 p-2 rounded text-xl text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
                    />
                    <Select
                        id="queue"
                        label="Filas"
                        value={queue}
                        optionLabel='Selecione uma Fila'
                        options={[{ label: 'Todos os serviços', value: 'all' }, { label: 'PREFERENCIAL', value: 'P' }, { label: 'NORMAL', value: 'N' }]}
                        onChange={handleSelectChange}
                        required
                        className="border-2 border-gray-800 p-2 rounded text-xl text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
                    />
                    <Input
                        id="searchByTicket"
                        label="Senha"
                        value={searchByTicket}
                        onChange={handleSearchChange}
                        placeholder="Pesquise por uma Senha..."
                        className="border-2 border-gray-800 p-2 rounded text-lg text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
                    />
                </div>

                <table className="min-w-full text-left text-gray-700 overflow-hidden rounded-md">
                    <thead className="bg-blue-900 text-white uppercase text-xl tracking-wider">
                        <tr className="*:px-6 *:py-4">
                            <th scope="col">Nome</th>
                            <th scope="col">CPF</th>
                            <th scope="col">Serviço</th>
                            <th scope="col">Fila</th>
                            <th scope="col">Senha</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-50 divide-y divide-gray-300">
                        {filteredAttendances?.map((attendance) => (
                            <tr key={attendance.id} className="*:px-6 *:py-4 *:text-lg">
                                <td>{attendance.name}</td>
                                <td>{attendance.cpf ? attendance.cpf : '-/-'}</td>
                                <td>{attendance.service}</td>
                                <td>{attendance.queue_type}</td>
                                <td>{attendance.ticket_number}</td>
                                <td>
                                    <button
                                        onClick={() => handleStartAttendance(attendance)}
                                        className="cursor-pointer p-2">
                                        Chamar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAttendances?.length === 0 && <p className="text-xl text-center pt-8">Nenhum Atendimento encontrado</p>}
            </section>
        </main>
    )
}