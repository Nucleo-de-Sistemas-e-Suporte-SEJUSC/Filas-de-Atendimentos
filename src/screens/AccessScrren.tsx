import React from "react"
import {
    Header,
    FilterFields,
    Table
} from "@/components"
import { api } from "@/api/axios"
import type { Attendances, Filters } from "@/interfaces"
import type { AxiosError } from "axios"

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

    const filterListOfAttendanceHistory = attendances?.filter((attendance) => {
        return attendance.status !== 'AGUARDANDO'
    }).reverse() as Attendances[] | null | undefined

    console.log(Boolean(filterListOfAttendanceHistory))

    if (loading) return <p className="text-xl text-center pt-8">Carregando lista de atendimentos...</p>
    if (error) return <p className="text-xl text-center pt-8">Erro desconhecido ocorreu</p>

    return (
        <>

            <Header />
            <main className="grid grid-cols-[1fr_auto] justify-items-center gap-8 mx-auto mt-24 max-w-max rounded p-8">
                <section className="flex flex-col gap-4 overflow-x-auto w-full">
                    <FilterFields
                        filters={filters}
                        setFilters={setFilters}
                    />
                    <Table
                        filteredAttendances={filteredAttendances}
                        setRequestState={setRequestState}
                    />
                    {filteredAttendances?.length === 0 && <p className="text-xl text-center pt-8">Nenhum Atendimento encontrado</p>}
                </section>

                <section className="bg-gray-50 p-4 rounded ">
                    <h2 className="text-4xl text-center font-semibold text-gray-800 pb-6">Histórico de Chamadas</h2>
                    <div className="flex flex-col gap-8">
                        <div className="*:text-center">
                            <h3 className="text-2xl font-medium text-gray-800 pb-2">Último</h3>
                            <p className="text-lg">{filterListOfAttendanceHistory && filterListOfAttendanceHistory[0]?.name}</p>
                        </div>
                        <div className="*:text-center">
                            <h3 className="text-2xl font-medium text-gray-800 pb-2">Anteriores</h3>
                            <ul>
                                {filterListOfAttendanceHistory?.map((attendance, index) => {
                                    if (index !== 0)
                                        return <li className="text-lg" key={attendance.id}>{attendance.name}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}