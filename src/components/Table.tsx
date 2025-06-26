import { api } from "@/api/axios"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { Attendances } from "@/interfaces"
import type { AxiosError } from "axios"
import { toast } from "sonner"

interface TableProps {
    filteredAttendances: Attendances[] | undefined
    setRequestState: React.Dispatch<React.SetStateAction<{
        attendances: Attendances[] | null;
        loading: boolean;
        error: string | null;
    }>>
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Table({ filteredAttendances, setRequestState, setIsModalOpen }: TableProps) {
    const { setStoredValue } = useLocalStorage<Attendances | null>('attendance', null)

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

    return (
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
    )
}