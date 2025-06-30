import React from "react"
import {
    Button,
    Modal,
    Header,
    Form
} from "@/components"
import type {
    Ticket,
} from '@/interfaces'

export function RegisterScreen() {
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [requestState, setRequestState] = React.useState<{
        ticket: Ticket | null
        loading: boolean
        error: string | null
    }>({
        ticket: null,
        loading: false,
        error: null
    })
    const { ticket, loading } = requestState

    return (
        <>
            {
                isModalOpen && (
                    <Modal onClick={() => setIsModalOpen(false)}>
                        <div className="grid justify-items-center">
                            <span className="text-xl pb-2">Sua senha: </span>
                            <h1 className="text-2xl pb-2 font-semibold">{ticket?.name}</h1>
                            <h2 className="text-2xl font-semibold">{ticket?.ticket_number}</h2>
                        </div>
                        <Button onClick={() => setIsModalOpen(false)}>
                            Finalizar
                        </Button>
                    </Modal>
                )
            }
            <Header />

            <main className="flex flex-col items-center gap-8 bg-gray-50 mx-auto mt-16 max-w-2xl shadow-md p-8 rounded">
                <section className="*:text-center flex flex-col items-center gap-2 max-w-md">
                    <img className="max-w-2xs" src="./src/assets/siaf.png" alt="SEJUSC" />
                    <p className="text-base font-medium text-gray-600">Preencha os campos abaixo para gerar uma senha para o seu Atendimento</p>
                </section>

                <Form
                    setRequestState={setRequestState}
                    setIsModalOpen={setIsModalOpen}
                    loading={loading}
                />
            </main>
        </>
    )
}