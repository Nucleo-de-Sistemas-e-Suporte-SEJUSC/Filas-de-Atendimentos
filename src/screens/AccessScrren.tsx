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

    if (loading) return <p className="text-xl text-center pt-8">Carregando lista de atendimentos...</p>
    if (error) return <p className="text-xl text-center pt-8">Erro desconhecido ocorreu</p>

    return (
        <>
            
            <Header />
            <main className="grid justify-items-center gap-8 mx-auto mt-24 max-w-max rounded p-8">
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
            </main>
        </>
    )
}