import React from "react"
import {
    Header,
    FilterFields,
    Table
} from "@/components"
import { api } from "@/api/axios"
import type { Attendance, Filters } from "@/interfaces"
import type { AxiosError } from "axios"

export function AccessScreen() {
    const [requestState, setRequestState] = React.useState<{
        attendances: Attendance[] | null
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
        status: '',
        queue: ''

    })
    const { searchByName, searchByTicket, services, status, queue } = filters
    const { attendances, loading } = requestState

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

    const filterListOfAttendances = () => {
        let filteredListOfAttendances: Attendance[] | null | undefined = attendances

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
        if (status !== '' && status !== 'all') {
            filteredListOfAttendances = filteredListOfAttendances?.filter((attendance) => {
                return attendance.status === status
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

    const filteredListOfAttendanceHistory = (attendances ?? []).filter(
        (attendance) => attendance.status === 'CHAMADO'
    ).reverse();

    if (loading) return <p className="text-xl text-center pt-8">Carregando lista de atendimentos...</p>

    return (
        <>
            <Header />
            <main className="grid grid-cols-[1fr_auto] justify-items-center gap-8 mx-auto mt-24 max-w-max p-8">
                <section className="">
                    <FilterFields
                        filters={filters}
                        setFilters={setFilters}
                    />
                    <div className="overflow-auto rounded">
                        <Table
                            filteredAttendances={filteredAttendances}
                            setRequestState={setRequestState}
                        />
                        {filteredAttendances?.length === 0 && <p className="text-xl text-center pt-8">Nenhum Atendimento encontrado</p>}
                    </div>
                </section>

                <section className="bg-gray-50 p-4 rounded ">
                    <h2 className="text-4xl text-center font-semibold text-gray-800 pb-6">Histórico de Chamadas</h2>
                    <div className="flex flex-col gap-8">
                        <div className="*:text-center">
                            <h3 className="text-2xl font-medium text-gray-800 pb-2">Último</h3>
                            <p className="text-lg">
                                {filteredListOfAttendanceHistory.length !== 0 && (
                                    `${filteredListOfAttendanceHistory[0].name} - ${filteredListOfAttendanceHistory[0].service}`
                                )}
                            </p>
                        </div>
                        <div className="*:text-center">
                            <h3 className="text-2xl font-medium text-gray-800 pb-2">Anteriores</h3>
                            <ul>
                                {filteredListOfAttendanceHistory?.map((attendance, index) => {
                                    if (index !== 0)
                                        return <li className="text-lg" key={attendance.id}>{attendance.name} - {attendance.service}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}