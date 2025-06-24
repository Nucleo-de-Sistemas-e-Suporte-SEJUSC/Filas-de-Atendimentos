import { useAttendance } from "@/context/AttendanceContext"

export function QueueScreen() {
    const { name, ticket_number } = useAttendance()

    return (
        <>
            <main className="grid justify-items-center gap-8 bg-gray-50 mx-auto mt-64 w-max shadow-md p-8 rounded">
                <h1 className="text-8xl font-bold">{name}</h1>
                <h2 className="text-8xl font-bold">{ticket_number}</h2>
            </main>
        </>
    )
}