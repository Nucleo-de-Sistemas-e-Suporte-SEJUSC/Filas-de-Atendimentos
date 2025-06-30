import React from "react"
import { Modal } from "./Modal"
import { Select } from "./Select"
import { Button } from "./Button"
import { api } from "@/api/axios"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { Attendances } from "@/interfaces"
import { AxiosError } from "axios"
import { toast } from "sonner"

type AttendancesWithGuiche = Attendances & {
    guiche?: string
}

interface TableProps {
    filteredAttendances: Attendances[] | undefined
    setRequestState: React.Dispatch<React.SetStateAction<{
        attendances: Attendances[] | null;
        loading: boolean;
        error: string | null;
    }>>
}

export function Table({ filteredAttendances, setRequestState }: TableProps) {
    const { storedValue, setStoredValue } = useLocalStorage<AttendancesWithGuiche | null>('attendance', null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.currentTarget

        if (!storedValue) return

        setStoredValue({
            ...storedValue,
            guiche: value
        })
    }

    const handleStartAttendance = async (attendance: Attendances) => {
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
            setIsModalOpen(true) // isso deve ser chamado antes da requisição
            setStoredValue(attendance)
        } catch (error) {
            const { response } = error as AxiosError<{ message: string }>
            toast.error('Error', {
                description: response?.data.message || 'Erro desconhecido'
            })
        }
    }

    const handleEndAttendance = async (attendance: Attendances) => {
        const { id, status } = attendance

        try {
            if (status === 'AGUARDANDO') throw new Error('Não é possível finalizar um atendimento que está em espera')

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
            setStoredValue(null)
        } catch (error) {
            if (error instanceof AxiosError) {
                const { response } = error as AxiosError<{ message: string }>
                toast.error('Error', {
                    description: response?.data.message || 'Erro desconhecido'
                })
            }
            if (error instanceof Error) {
                toast.error('Error', {
                    description: error.message || 'Erro desconhecido'
                })
            }
        }
    }

    return (
        <>
            {
                isModalOpen && (
                    <Modal onClick={() => setIsModalOpen(false)}>
                        <div className="flex flex-col items-center">
                            <span className="text-xl text-center pb-4">Selecione um guichê em que será realizado o atendimento</span>
                            <Select
                                id="guiche"
                                optionLabel='Selecione um Guichê'
                                options={[
                                    { label: 'guichê 01', value: '01' },
                                    { label: 'guichê 02', value: '02' },
                                    { label: 'guichê 03', value: '03' },
                                    { label: 'guichê 04', value: '04' },
                                    { label: 'guichê 05', value: '05' },
                                    { label: 'guichê 06', value: '06' },
                                    { label: 'guichê 07', value: '07' },
                                    { label: 'guichê 08', value: '08' },
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
        </>
    )
}