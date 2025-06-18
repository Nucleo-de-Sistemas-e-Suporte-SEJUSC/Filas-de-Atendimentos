import { BrowserRouter, Route, Routes } from "react-router"
import { RegisterScreen } from "./screens/RegisterScreen"
import { FilaScreen } from "./screens/FilaScreen"
import { Header } from "./components/Header"
import { Toaster } from "sonner"

export default function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<RegisterScreen />} />
        <Route path='/fila' element={<FilaScreen />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  )
}
