import React from "react"
import { Input } from "../components/Input"
import { Select } from "../components/Select"
import { Button } from "../components/Button"
import { Modal } from "../components/Modal"
import { api } from "../api/axios"

type Services = '' | 'RCN' | 'PAV'
type Fila = '' | 'NORMAL' | 'PREFERENCIAL'

interface FormData {
    cpf: string
    name: string
    services: Services
    fila: Fila
}

export function HomeScreen() {
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [formValues, setFormValues] = React.useState<FormData>({
        cpf: '',
        name: '',
        services: '',
        fila: ''
    })

    const { cpf, name, services, fila } = formValues

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.currentTarget

        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        const name = event.currentTarget

        const sanitizedName = name.value
            .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
            .replace(/\s{2,}/g, ' ')
            .trimStart()
            .toUpperCase()

        setFormValues((prevValues) => ({
            ...prevValues,
            name: sanitizedName
        }))
    }

    const handleCpfChange = (event: React.FormEvent<HTMLInputElement>) => {
        const rawValue = event.currentTarget.value.replace(/\D/g, '')

        const formattedCpf = rawValue
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')

        setFormValues((prevValues) => ({
            ...prevValues,
            cpf: formattedCpf,
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const response = await api.post('/generate-ticket', formValues)

            const { data } = response
            console.log(data)

            setIsModalOpen(true)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {
                isModalOpen && (
                    <Modal onClick={() => setIsModalOpen(false)} />
                )
            }

            <main className="grid justify-items-center gap-8 bg-gray-50 mx-auto mt-24 max-w-2xl shadow-md p-8 rounded">
                <section className="*:text-center">
                    <h1 className="text-xl font-bold text-gray-900 pb-2">Sistema de Gerenciamento de Fila</h1>
                    <p className="text-base font-medium text-gray-600">Preencha os campos abaixo para gerar uma senha para o seu
                        Atendimento</p>
                </section>

                <form onSubmit={handleSubmit} id="form" className='grid gap-10 w-full max-w-md'>
                    <Input
                        id="cpf"
                        label="CPF"
                        maxLength={14}
                        minLength={14}
                        value={cpf}
                        onChange={handleCpfChange}
                        placeholder="000.000.000-00"
                    />

                    <Input
                        id="name"
                        label="Nome"
                        maxLength={50}
                        minLength={25}
                        value={name}
                        onChange={handleNameChange}
                        placeholder="José da Silva Xavier"
                        required
                    />

                    <Select
                        id="services"
                        label="Serviços"
                        value={services}
                        optionLabel='Selecione um Serviço'
                        options={[{ label: 'PAV', value: 'PAV' }, { label: 'RCN', value: 'PCN' }]}
                        onChange={handleSelectChange}
                        required
                    />

                    <Select
                        id="fila"
                        label="Fila"
                        value={fila}
                        optionLabel='Selecione uma Fila'
                        options={[{ label: 'NORMAL', value: 'N' }, { label: 'PREFERENCIAL', value: 'P' }]}
                        onChange={handleSelectChange}
                        required
                    />

                    <Button>
                        Gerar Senha
                    </Button>
                </form>
            </main>
        </>
    )
}