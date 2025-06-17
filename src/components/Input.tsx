import type React from "react"

type InputProps = React.ComponentProps<'input'> & {
    label: string
}

export function Input({ id, label, ...props }: InputProps) {
    return (
        <div>
            <label
                className='flex flex-col gap-0.5 text-sm font-bold text-gray-700'
                htmlFor={id}>
                {label}
                <input
                    className="p-2 border-2 border-transparent border-b-blue-900 focus:border-blue-900 focus:outline-none focus:rounded ease-in duration-200 text-lg font-normal text-gray-800"
                    type="text"
                    id={id}
                    name={id}
                    {...props}
                />
            </label>
        </div>
    )
}