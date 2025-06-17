import { BrowserRouter, Route, Routes } from "react-router"
import { HomeScreen } from "./screens/HomeScreen"
import { FilaScreen } from "./screens/FilaScreen"
import { Header } from "./components/Header"

export default function App() {

  return (
    <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/fila' element={<FilaScreen />} />
        </Routes>
    </BrowserRouter>
  )
}
