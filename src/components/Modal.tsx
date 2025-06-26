type ModalProps = {
    onClick: () => void
    children: React.ReactNode
}

export function Modal({ onClick, children }: ModalProps) {
    return (
        <div
            onClick={onClick}
            className="fixed grid place-items-center top-0 right-0 left-0 bottom-0 bg-gray-800/80">
            <section
                onClick={(event) => event.stopPropagation()}
                className="grid justify-items-center gap-6 max-w-md bg-gray-100 rounded p-6"
            >
                {children}
            </section>
        </div>
    )
}