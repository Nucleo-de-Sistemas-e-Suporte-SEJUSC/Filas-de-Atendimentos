import React from "react"
import { Input } from "../components/Input"
import { Select } from "../components/Select"
import { Button } from "../components/Button"
import { Modal } from "../components/Modal"

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

        setIsModalOpen(true)
        form.reset()
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
                        onChange={handleSanitizedCpfChange}
                        placeholder="000.000.000-00"
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

                    <Select
                        id="services"
                        label="Serviços"
                        optionLabel='Selecione um Serviço'
                        options={['PAV', 'RCN']}
                        required
                    />

                    <Select
                        id="fila"
                        label="Fila"
                        optionLabel='Selecione uma Fila'
                        options={['NORMAL', 'PREFERENCIAL']}
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