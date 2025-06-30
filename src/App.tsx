import { BrowserRouter, Route, Routes } from "react-router"
import { RegisterScreen } from "./screens/RegisterScreen"
import { QueueScreen } from "./screens/QueueScreen"
import { AccessScreen } from "./screens/AccessScreen"
import { Toaster } from "sonner"

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RegisterScreen />} />
        <Route path='/fila' element={<QueueScreen />} />
        <Route path='/acesso' element={<AccessScreen />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  )
}
