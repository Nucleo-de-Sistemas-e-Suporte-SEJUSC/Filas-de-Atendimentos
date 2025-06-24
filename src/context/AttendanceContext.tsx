import type { Attendances } from "@/interfaces";
import React from "react";

type Attendance = Pick<Attendances, 'name' | 'ticket_number'>

type AttendanceContext = {
    attendance: Attendance | null
    setAttendance: React.Dispatch<React.SetStateAction<Attendance | null>>
}

const AttendanceContext = React.createContext<AttendanceContext | null>(null)

export const useAttendance = () => {
    const context = React.useContext(AttendanceContext)
    if (!context) throw new Error('useAttendance deve estar dentro do AttendanceContextProvider')
    return context
}

export const AttendanceContextProvider = ({ children }: React.PropsWithChildren) => {
    const [attendance, setAttendance] = React.useState<Attendance | null>(null)

    return (
        <AttendanceContext.Provider value={{ attendance, setAttendance }}>{children}</AttendanceContext.Provider>
    )
}
