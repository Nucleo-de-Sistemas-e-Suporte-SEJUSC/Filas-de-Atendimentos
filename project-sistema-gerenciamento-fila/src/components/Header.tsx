export function Header() {
    return (
        <header className="flex justify-between items-center p-8 bg-gray-50 shadow-md">
            <a href="/" className="w-32">
                <img src="./src/assets/logo.png" alt="SEJUSC" />
            </a>

            <nav className="flex gap-6 *:text-gray-800 *:font-semibold *:tracking-wider *:text-2xl *:p-2">
                <a href="/" className="relative
        after:absolute after:bottom-0 after:left-0
         after:h-0.5 after:w-full after:bg-blue-800
         after:origin-left after:scale-x-0 hover:after:scale-x-100
         after:transition-transform after:duration-200 after:ease-in">
                    Fila
                </a>
                <a className="relative
        after:absolute after:bottom-0 after:left-0
         after:h-0.5 after:w-full after:bg-blue-800
         after:origin-left after:scale-x-0 hover:after:scale-x-100
         after:transition-transform after:duration-200 after:ease-in" href="/">
                    Acesso
                </a>
            </nav>
        </header>
    )
}