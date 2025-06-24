import type { Attendances } from "@/interfaces"
import React from "react"

export function QueueScreen() {
    const [attendance, setAttendance] = React.useState<Attendances | null>(null)

    React.useEffect(() => {
        const syncAttendance = () => {
            const item = localStorage.getItem('attendance')
            if (item) {
                setAttendance(JSON.parse(item))
            } else {
                setAttendance(null)
            }
        }

        window.addEventListener('storage', syncAttendance)

        syncAttendance()

        return () => {
            window.removeEventListener('storage', syncAttendance)
        }
    }, [])


    if (!attendance) {
        return <p className="text-xl text-center pt-8">Nenhum atendimento foi iniciado</p>
    }

    return (
        <main className="grid justify-items-center gap-8 bg-gray-50 mx-auto mt-64 w-max shadow-md p-8 rounded">
            <h1 className="text-8xl font-bold">{attendance.name}</h1>
            <h2 className="text-8xl font-bold">{attendance.ticket_number}</h2>
        </main>
    )
}
