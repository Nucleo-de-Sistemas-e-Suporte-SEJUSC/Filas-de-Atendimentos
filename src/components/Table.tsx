import React from "react"
import { Modal } from "./Modal"
import { Select } from "./Select"
import { Button } from "./Button"
import { api } from "@/api/axios"
import type { Attendance } from "@/interfaces"
import { AxiosError } from "axios"
import { toast } from "sonner"

interface TableProps {
    filteredAttendances: Attendance[] | undefined
    setRequestState: React.Dispatch<React.SetStateAction<{
        attendances: Attendance[] | null;
        loading: boolean;
        error: string | null;
    }>>
}

export function Table({ filteredAttendances, setRequestState }: TableProps) {
    const [modalState, setModalState] = React.useState({
        isOpen: false,
        selectedGuiche: '',
        selectedAttendance: null as Attendance | null
    })
    const { isOpen, selectedGuiche, selectedAttendance } = modalState

    const handleCallAttendance = async () => {
        if (!selectedAttendance) {
            return
        }

        const { id } = selectedAttendance
        try {
            await api.patch(`/attendance/${id}`, {
                status: 'CHAMADO',
                guiche: selectedGuiche
            })
            setRequestState((prevValues) => {
                if (!prevValues.attendances) return prevValues
                const updatedAttendances = prevValues.attendances?.map((attendance) => {
                    return attendance.id === id ? { ...attendance, status: 'CHAMADO' } : attendance
                })
                return {
                    ...prevValues,
                    attendances: updatedAttendances
                }
            })
        } catch (error) {
            const { response } = error as AxiosError<{ message: string }>
            toast.error('Error', {
                description: response?.data.message || 'Erro desconhecido'
            })
        }
    }

    const handleStartAttendance = async (attendance: Attendance) => {
        const { id } = attendance
        try {
            await api.patch(`/attendance/${id}`, {
                status: 'ATENDIMENTO'
            })
            setRequestState((prevValues) => {
                if (!prevValues.attendances) return prevValues
                const updatedAttendances = prevValues.attendances?.map((attendance) => {
                    return attendance.id === id ? { ...attendance, status: 'ATENDIMENTO' } : attendance
                })
                return {
                    ...prevValues,
                    attendances: updatedAttendances
                }
            })
        } catch (error) {
            const { response } = error as AxiosError<{ message: string }>
            toast.error('Error', {
                description: response?.data.message || 'Erro desconhecido'
            })
        }
    }

    const handleEndAttendance = async (attendance: Attendance) => {
        const { id, status } = attendance
        try {
            if (status === 'CHAMADO') {
                await api.patch(`/attendance/${id}`, {
                    status: 'AUSENTE'
                })
                setRequestState((prevValues) => {
                    if (!prevValues.attendances) return prevValues
                    const updatedAttendances = prevValues.attendances?.map((attendance) => {
                        return attendance.id === id ? { ...attendance, status: 'AUSENTE' } : attendance
                    })
                    return {
                        ...prevValues,
                        attendances: updatedAttendances
                    }
                })
                toast.warning('Chamado Encerrado', {
                    description: `Beneficiário: ${attendance.name} Senha: ${attendance.ticket_number} está ausente`
                })
            }
            if (status === 'ATENDIMENTO') {
                await api.patch(`/attendance/${id}`, {
                    status: 'ATENDIDO'
                })
                setRequestState((prevValues) => {
                    if (!prevValues.attendances) return prevValues
                    const updatedAttendances = prevValues.attendances?.map((attendance) => {
                        return attendance.id === id ? { ...attendance, status: 'ATENDIDO' } : attendance
                    })
                    return {
                        ...prevValues,
                        attendances: updatedAttendances
                    }
                })
                toast.info('Atendimento Finalizado', {
                    description: `Beneficiário: ${attendance.name} Senha: ${attendance.ticket_number}`
                })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const { response } = error as AxiosError<{ message: string }>
                toast.error('Error', {
                    description: response?.data.message || 'Erro desconhecido'
                })
            }
        }
    }

    return (
        <>
            {
                isOpen && (
                    <Modal onClick={() => setModalState((prevValues) => ({
                        ...prevValues,
                        isOpen: false
                    }))}>
                        <span className="text-xl text-center pb-4">Selecione um guichê em que será realizado o atendimento</span>
                        <form
                            onSubmit={handleCallAttendance}
                            className="flex flex-col items-center gap-4"
                        >
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
                                onChange={({ currentTarget }) => setModalState((prevValues) => ({
                                    ...prevValues,
                                    selectedGuiche: currentTarget.value
                                }))}
                                required
                                className="bg-gray-50 border-2 border-gray-800 p-2 rounded text-xl text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
                            />
                            <Button>
                                Chamar
                            </Button>
                        </form>
                    </Modal>
                )
            }
            <table className="text-center text-gray-700">
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
                        <tr
                            key={attendance.id}
                            className={
                                `*:px-6 *:py-4 *:text-lg 
                                ${attendance.status === 'CHAMADO' && 'bg-amber-200'}
                                ${attendance.status === 'ATENDIMENTO' && 'bg-lime-200'}
                                ${attendance.status === 'AUSENTE' && 'bg-red-200'}
                                ${attendance.status === 'ATENDIDO' && 'bg-gray-300'}`
                            }
                        >

                            <td>{attendance.name}</td>
                            <td>{attendance.cpf ? attendance.cpf : '-/-'}</td>
                            <td>{attendance.service}</td>
                            <td>{attendance.queue_type}</td>
                            <td>{attendance.ticket_number}</td>
                            <td>{attendance.status}</td>
                            <td className="flex justify-center">
                                {(attendance.status === 'AGUARDANDO' || attendance.status === 'AUSENTE') && (
                                    <button
                                        onClick={() => setModalState((prevValues) => ({
                                            ...prevValues,
                                            isOpen: true,
                                            selectedAttendance: attendance
                                        }))}
                                        className="cursor-pointer p-2">
                                        Chamar
                                    </button>
                                )}

                                {attendance.status === 'CHAMADO' && (
                                    <>
                                        <button
                                            onClick={() => handleStartAttendance(attendance)}
                                            className="cursor-pointer p-2">
                                            Iniciar
                                        </button>
                                        <button
                                            onClick={() => handleEndAttendance(attendance)}
                                            className="cursor-pointer p-2">
                                            Finalizar
                                        </button>
                                    </>
                                )}
                                {attendance.status === 'ATENDIMENTO' && (
                                    <button
                                        onClick={() => handleEndAttendance(attendance)}
                                        className="cursor-pointer p-2">
                                        Finalizar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}