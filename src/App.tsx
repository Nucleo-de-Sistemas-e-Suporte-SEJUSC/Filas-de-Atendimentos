import { BrowserRouter, Route, Routes } from "react-router"
import { RegisterScreen } from "./screens/RegisterScreen"
import { QueueScreen } from "./screens/QueueScreen"
import { AccessScreen } from "./screens/AccessScrren"
import { Header } from "./components/Header"
import { Toaster } from "sonner"
import { AttendanceContextProvider } from "./context/AttendanceContext"

export default function App() {

  return (
    <BrowserRouter>
      <Header />
      <AttendanceContextProvider>
        <Routes>
          <Route path='/' element={<RegisterScreen />} />
          <Route path='/fila' element={<QueueScreen />} />
          <Route path='/acesso' element={<AccessScreen />} />
        </Routes>
      </AttendanceContextProvider>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  )
}
