import { Header } from "./components/Header";
import { Input } from "./components/Input";

type Services = 'RCN' | 'PAV'
type Fila = 'N' | 'P'

interface FormData {
  cpf: string
  name: string
  services: Services
  fila: Fila
}

export default function App() {

  const handleSanitizedNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    const name = event.currentTarget

    const sanitizedName = name.value
      .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trimStart()
      .toUpperCase()

    name.value = sanitizedName
  }

  const handleSanitizedCpfChange = (event: React.FormEvent<HTMLInputElement>) => {
    const cpf = event.currentTarget
    const cpfValue = cpf.value.replace(/\D/g, '')

    cpf.value = cpfValue
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const formObj = Object.fromEntries(formData.entries())

    console.log(formObj) // Body da Requisição
    form.reset()
  }

  return (
    <div className="bg-gray-100">

      <Header />

      <main className="grid justify-items-center gap-8 bg-gray-50 mx-auto mt-24 max-w-2xl shadow-md p-8 rounded">
        <section className="*:text-center">
          <h2 className="text-xl font-bold text-gray-900 pb-2">Sistema de Gerenciamento de Fila</h2>
          <p className="text-base font-medium text-gray-600">Preencha os campos abaixo para gerar uma senha para o seu
            Atendimento</p>
        </section>

        <form onSubmit={handleSubmit} id="form" className='grid gap-10 w-full max-w-md'>

          <Input
            id="cpf"
            label="CPF"
            maxLength={14}
            minLength={14}
            onChange={handleSanitizedCpfChange}
            placeholder="000.000.000-00"
            required
          />

          <Input
            id="name"
            label="Nome"
            maxLength={50}
            minLength={25}
            onChange={handleSanitizedNameChange}
            placeholder="José da Silva Xavier"
            required
          />

          <div className='flex flex-col gap-0.5'>
            <label className='text-sm font-bold text-gray-700' htmlFor="services">
              Serviço
            </label>

            <select
              className="p-2 border-2 border-transparent border-b-blue-900 focus:border-blue-900 focus:outline-none focus:rounded ease-in duration-200 text-lg text-gray-800 hover:bg-gray-200 transition-colors"
              name="services" id="services" required>
              <option value="">Selecione um Serviço</option>
              <option value="PAV">PAV</option>
              <option value="RCN">RCN</option>
            </select>
          </div>


          <div className='flex flex-col gap-0.5'>
            <label className='text-sm font-bold text-gray-700' htmlFor="fila">
              Fila
            </label>

            <select
              className="p-2 border-2 border-transparent border-b-blue-900 focus:border-blue-900 focus:outline-none focus:rounded ease-in duration-200 text-lg text-gray-800 hover:bg-gray-200 transition-colors "
              name="fila" id="fila" required>
              <option value="">Selecione uma Fila</option>
              <option value="N">Normal</option>
              <option value="P">Preferencial</option>
            </select>
          </div>

          <button
            id="button-form"
            type="submit"
            className='bg-blue-900 rounded-sm p-2 font-bold text-gray-200 tracking-wider cursor-pointer hover:bg-blue-800 ease-in duration-100'>
            Gerar Senha
          </button>
        </form>
      </main>
    </div>
  )
}
