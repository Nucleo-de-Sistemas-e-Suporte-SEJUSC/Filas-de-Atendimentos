type ButtonProps = React.ComponentProps<'button'>

export function Button({children, ...props}: ButtonProps) {
    return (
        <button
            id="button-form"
            type="submit"
            className='bg-blue-950 rounded-sm p-2 font-bold text-gray-200 tracking-wider cursor-pointer hover:bg-blue-800 ease-in duration-100'
            {...props}
        >
            {children}
        </button>
    )
}