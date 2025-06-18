import React from "react"
import { 
    Input, 
    Select, 
    Button, 
    Modal 
} from "@/components"
import type { 
    Ticket, 
    FormValues 
} from '@/interfaces'
import { api } from "@/api/axios"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import { Loader } from 'lucide-react'


export function HomeScreen() {
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [requestState, setRequestState] = React.useState<{
        ticket: Ticket | null
        loading: boolean
        error: string
    }>({
        ticket: null,
        loading: false,
        error: ''
    })
    const [formValues, setFormValues] = React.useState<FormValues>({
        cpf: '',
        name: '',
        services: '',
        fila: ''
    })

    const { cpf, name, services, fila } = formValues
    const { ticket, loading } = requestState

    const handleResetForm = () => {
        setFormValues(() => ({
            cpf: '',
            name: '',
            services: '',
            fila: ''
        }))
        setIsModalOpen(false)
    }

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

        setRequestState((prevStates) => ({
            ...prevStates,
            ticket: ticket,
            loading: true
        }))

        try {
            const response = await api.post('/generate-ticket', formValues)
            const { ticket } = response.data

            setRequestState((prevStates) => ({
                ...prevStates,
                ticket: ticket,
                loading: false
            }))

            setIsModalOpen(true)
        } catch (error) {
            const { response } = error as AxiosError<{ message: string }>
            setRequestState((prevStates) => ({
                ...prevStates,
                loading: false,
                error: `Erro ao gerar a senha: ${response?.data.message || 'Erro desconhecido'}`
            }))

            toast.error('Error', {
                description: response?.data.message || 'Erro desconhecido'
            })
        }
    }


    return (
        <>
            {
                isModalOpen && (
                    <Modal ticket={ticket} onClick={handleResetForm} />
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

                    <Button disabled={loading}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader className="animate-spin w-4 h-4" />
                                Gerando...
                            </span>
                        ) : (
                            'Gerar Senha'
                        )}
                    </Button>
                </form>
            </main>
        </>
    )
}