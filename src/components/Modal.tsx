import { Button } from "./Button";

type ModalProps = {
    onClick: () => void
}

export function Modal({ onClick }: ModalProps) {

    return (
        <div
            onClick={onClick} 
            className="fixed grid place-items-center top-0 right-0 left-0 bottom-0 bg-gray-800/80">
            <section 
                onClick={(event) => event.stopPropagation()}
                className="grid justify-items-center gap-6 max-w-md bg-gray-100 rounded p-6"
            >
                <div className="grid justify-items-center">
                    <span className="text-xl pb-2">Sua senha: </span>
                    <h1 className="text-2xl font-semibold">Yuri Odilon Nogueira Moura</h1>
                    <h2 className="text-2xl font-semibold">PAV-P001</h2>
                </div>
                <Button onClick={onClick}>
                    Finalizar
                </Button>
            </section>
        </div>
    )
}