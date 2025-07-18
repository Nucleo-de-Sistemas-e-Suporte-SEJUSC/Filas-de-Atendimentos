import { Link } from "react-router";
import logo from "@/assets/sejusc.png"

export function Header() {
    return (
        <header className="flex justify-between items-center p-8 bg-gray-50 shadow-md">
            <Link to="/" className="max-w-32">
                <img src={logo} alt="SEJUSC" />
            </Link>

            <nav className="flex gap-6 *:text-blue-950 *:font-semibold *:tracking-wider *:text-2xl *:p-2">
                <Link to="/fila" className="relative
        after:absolute after:bottom-0 after:left-0
         after:h-0.5 after:w-full after:bg-blue-950
         after:origin-left after:scale-x-0 hover:after:scale-x-100
         after:transition-transform after:duration-200 after:ease-in">
                    Fila
                </Link>
                <Link className="relative
        after:absolute after:bottom-0 after:left-0
         after:h-0.5 after:w-full after:bg-blue-950
         after:origin-left after:scale-x-0 hover:after:scale-x-100
         after:transition-transform after:duration-200 after:ease-in" to="/acesso">
                    Acesso
                </Link>
            </nav>
        </header>
    )
}