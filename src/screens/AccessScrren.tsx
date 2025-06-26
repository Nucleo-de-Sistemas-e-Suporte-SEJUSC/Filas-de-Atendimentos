import React from "react"
import {
    Button,
    Header,
    Modal,
    Select
} from "@/components"
import { api } from "@/api/axios"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { Attendances, Filters } from "@/interfaces"

import type { AxiosError } from "axios"
import { toast } from "sonner"
import { FilterFields } from "@/components/FilterFields"

export function AccessScreen() {
    const { setStoredValue } = useLocalStorage<Attendances | null>('attendance', null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)
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
    const { searchByName, searchByTicket, services, queue } = filters
    const { attendances, loading, error } = requestState

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

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.currentTarget

        setFilters((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleStartAttendance = async (attendance: Attendances) => {
        setStoredValue(attendance)

        const { id } = attendance

        try {
            await api.patch(`/tickets/${id}/status`, {
                status: 'EM ATENDIMENTO'
            })
            setRequestState((prevValues) => {
                if (!prevValues.attendances) return prevValues

                const updatedAttendances = prevValues.attendances?.map((attendance) => {
                    return attendance.id === id ? { ...attendance, status: 'EM ATENDIMENTO' } : attendance
                })

                return {
                    ...prevValues,
                    attendances: updatedAttendances
                }

            })
            setIsModalOpen(true)
        } catch (error) {
            const { response } = error as AxiosError<{ message: string }>
            toast.error('Error', {
                description: response?.data.message || 'Erro desconhecido'
            })
        }
    }

    const handleEndAttendance = async (attendance: Attendances) => {
        const { id } = attendance

        try {
            await api.patch(`/tickets/${id}/status`, {
                status: 'ATENDIDO'
            })
            setRequestState((prevValues) => {
                if (!prevValues.attendances) return prevValues

                const updatedAttendances = prevValues.attendances?.filter((attendance) =>
                    attendance.id !== id
                )

                return {
                    ...prevValues,
                    attendances: updatedAttendances
                }
            })
            toast.info('Atendimento Finalizado', {
                description: `Beneficiário: ${attendance.name} Senha: ${attendance.ticket_number}`
            })
        } catch (error) {
            const { response } = error as AxiosError<{ message: string }>
            toast.error('Error', {
                description: response?.data.message || 'Erro desconhecido'
            })
        }
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
        <>
            {
                isModalOpen && (
                    <Modal onClick={() => setIsModalOpen(false)}>
                        <div className="flex flex-col items-center">
                            <span className="text-xl text-center pb-4">Selecione um guichê em que você realizará o atendimento</span>
                            <Select
                                id="guiche"
                                label="Guichê"
                                value={services}
                                optionLabel='Selecione um Guichê'
                                options={[
                                    { label: 'guichê 01', value: '01' },
                                    { label: 'guichê 02', value: '02' },
                                    { label: 'guichê 03', value: '03' },
                                    { label: 'guichê 04', value: '04' },
                                    { label: 'guichê 05', value: '06' }
                                ]}
                                onChange={handleSelectChange}
                                required
                                className="bg-gray-50 border-2 border-gray-800 p-2 rounded text-xl text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
                            />
                        </div>
                        <Button onClick={() => setIsModalOpen(false)}>
                            Fechar
                        </Button>
                    </Modal>
                )
            }
            <Header />

            <main className="grid justify-items-center gap-8 mx-auto mt-24 max-w-max rounded p-8">
                <section className="flex flex-col gap-4 overflow-x-auto w-full">

                    <FilterFields filters={filters} setFilters={setFilters} />

                    <table className="min-w-full text-left text-gray-700 overflow-hidden rounded-md">
                        <thead className="bg-blue-950 text-white uppercase text-xl tracking-wider">
                            <tr className="*:px-6 *:py-4">
                                <th scope="col">Nome</th>
                                <th scope="col">CPF</th>
                                <th scope="col">Serviço</th>
                                <th scope="col">Fila</th>
                                <th scope="col">Senha</th>
                                <th scope="col">Status</th>
                                <th scope="col" className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-50 divide-y divide-gray-300">
                            {filteredAttendances?.map((attendance) => (
                                <tr key={attendance.id} className={`*:px-6 *:py-4 *:text-lg ${attendance.status === 'EM ATENDIMENTO' && 'bg-lime-200'}`}>
                                    <td>{attendance.name}</td>
                                    <td>{attendance.cpf ? attendance.cpf : '-/-'}</td>
                                    <td>{attendance.service}</td>
                                    <td>{attendance.queue_type}</td>
                                    <td>{attendance.ticket_number}</td>
                                    <td>{attendance.status}</td>
                                    <td className="flex">
                                        <button
                                            onClick={() => handleStartAttendance(attendance)}
                                            className="cursor-pointer p-2">
                                            Chamar
                                        </button>
                                        <button
                                            onClick={() => handleEndAttendance(attendance)}
                                            className="cursor-pointer p-2">
                                            Finalizar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredAttendances?.length === 0 && <p className="text-xl text-center pt-8">Nenhum Atendimento encontrado</p>}
                </section>
            </main>
        </>
    )
}