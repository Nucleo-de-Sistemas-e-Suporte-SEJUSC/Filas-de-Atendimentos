type ModalProps = {
    onClick: () => void
    children: React.ReactNode
}

export function Modal({ onClick, children }: ModalProps) {
    return (
        <div
            onClick={onClick}
            className="fixed grid place-items-center inset-0 bg-gray-800/80">
            <section
                onClick={(event) => event.stopPropagation()}
                className="grid justify-items-center gap-6 max-w-max bg-gray-100 rounded p-6"
            >
                {children}
            </section>
        </div>
    )
}