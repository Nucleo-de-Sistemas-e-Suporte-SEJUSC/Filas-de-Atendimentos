import React from "react"
import { api } from "@/api/axios"
import type { Attendance } from "@/interfaces"
import type { AxiosError } from "axios"

export function QueueScreen() {
    const [requestState, setRequestState] = React.useState<{
        attendances: Attendance[] | null
        loading: boolean
        error: string | null
    }>({
        attendances: null,
        loading: false,
        error: null
    })
    const { attendances } = requestState

    React.useEffect(() => {
        const fetchListOfAttendances = async () => {
            setRequestState((prevStates) => ({
                ...prevStates,
                loading: true,
                error: null
            }))

            try {
                const response = await api.get('/attendance')
                const data = (await response.data) as Attendance[]
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

    const filteredListOfAttendanceHistory = (attendances ?? []).filter(
        (attendance) => attendance.status === 'CHAMADO'
    ).reverse();

    if (!attendances) {
        return <p className="text-xl text-center pt-8">Nenhum atendimento foi iniciado</p>
    }

    return (
        <main className="grid grid-cols-[1fr_0.2fr] gap-4 mx-auto mt-64 w-max">
            <div className="flex flex-col gap-8 bg-gray-50 p-8 shadow-md rounded">
                <div className="*:text-center *:font-bold *:pb-6 *:text-7xl">
                    <h1>
                        {filteredListOfAttendanceHistory.length !== 0 && (
                            `${filteredListOfAttendanceHistory[0].name}`
                        )}
                    </h1>
                    <h2>{filteredListOfAttendanceHistory[0].ticket_number}</h2>
                    <h3>Guichê: {attendances[0].guiche}</h3>
                </div>
            </div>
            <div className="flex flex-col items-center gap-8 bg-gray-50 p-8 shadow-md rounded">
                <h3 className="text-2xl font-medium text-gray-800 pb-2">Últimas Senhas</h3>
                <ul className="*:text-center *:text-2xl">
                    {filteredListOfAttendanceHistory?.map((attendance, index) => {
                        if (index !== 0) {

                            return (
                                <>
                                    <li key={attendance.id}>{attendance.ticket_number}</li>
                                </>
                            )
                        }
                    })}
                </ul>
            </div>
        </main>
    )
}
