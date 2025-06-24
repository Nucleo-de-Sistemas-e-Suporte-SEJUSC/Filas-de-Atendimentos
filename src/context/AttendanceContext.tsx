import type { Attendances } from "@/interfaces";
import React from "react";

type Attendance = Pick<Attendances, 'name' | 'ticket_number'>

const AttendanceContext = React.createContext<Attendance | null>(null)

export const useAttendance = () => {
    const context = React.useContext(AttendanceContext)
    if (context === null) throw new Error('useContext deve estar dentro do Provider')
    return context
}

export const AttendanceContextProvider = ({ children }: React.PropsWithChildren) => {
    return (
        <AttendanceContext.Provider value={{ name: 'YURI ODILON NOGUEIRA MOURA', ticket_number:  'PAV-N-001'}}>{children}</AttendanceContext.Provider>
    )
}
