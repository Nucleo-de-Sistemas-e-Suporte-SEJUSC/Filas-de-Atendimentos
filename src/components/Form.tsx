import React from "react"
import { Input } from "./Input"
import { Select } from "./Select"
import { Button } from "./Button"
import type {
    FormValues,
    Ticket
} from "@/interfaces"
import { api } from "@/api/axios"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import { Loader } from "lucide-react"

interface FormProps {
    setRequestState: React.Dispatch<React.SetStateAction<{
        ticket: Ticket | null
        loading: boolean
        error: string | null
    }>>
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
}

export function Form({ setRequestState, setIsModalOpen, loading }: FormProps) {
    const [formValues, setFormValues] = React.useState<FormValues>({
        cpf: '',
        name: '',
        service: '',
        queue_type: ''
    })
    const { cpf, name, service, queue_type } = formValues

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.currentTarget
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            loading: true,
            error: null
        }))
        try {
            const response = await api.post('/attendance', formValues)
            const ticket = response.data

            setRequestState((prevStates) => ({
                ...prevStates,
                ticket: ticket,
            }))

            setIsModalOpen(true)
            setFormValues(() => ({
                cpf: '',
                name: '',
                service: '',
                queue_type: ''
            }))
        } catch (error) {
            const { response } = error as AxiosError<{ message: string }>
            setRequestState((prevStates) => ({
                ...prevStates,
                error: `Erro ao gerar a senha: ${response?.data.message || 'Erro desconhecido'}`
            }))
            toast.error('Error', {
                description: response?.data.message || 'Erro desconhecido'
            })
        } finally {
            setRequestState((prevStates) => ({
                ...prevStates,
                loading: false,
            }))
        }
    }

    return (
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
                minLength={20}
                value={name}
                onChange={handleNameChange}
                placeholder="José da Silva Xavier"
                required
            />
            <Select
                id="service"
                label="Serviços"
                value={service}
                optionLabel='Selecione um Serviço'
                options={[{ label: 'PAV', value: 'PAV' }, { label: 'RCN', value: 'RCN' }]}
                onChange={handleSelectChange}
                required
            />
            <Select
                id="queue_type"
                label="Fila"
                value={queue_type}
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
    )
}