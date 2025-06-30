import React from "react"
import { Input } from "./Input"
import { Select } from "./Select"
import type { Filters } from "@/interfaces"

interface FilterFieldsProps {
    filters: Filters
    setFilters: React.Dispatch<React.SetStateAction<Filters>>
}

export function FilterFields({ filters, setFilters }: FilterFieldsProps) {

    const { searchByName, searchByTicket, services, queue } = filters

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget

        setFilters((prevValues) => ({
            ...prevValues,
            [name]: value.toUpperCase()
        }))
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.currentTarget

        setFilters((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    return (
        <div className="flex flex-wrap gap-4 max-w-max">
            <Input
                id="searchByName"
                label="Nome"
                value={searchByName}
                onChange={handleSearchChange}
                placeholder="Pesquise por um Nome..."
                className="bg-gray-50 font-normal border-2 border-gray-800 p-2 rounded text-lg text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
            />
            <Select
                id="services"
                label="Serviços"
                value={services}
                optionLabel='Selecione um Serviço'
                options={[{ label: 'Todos os serviços', value: 'all' }, { label: 'PAV', value: 'PAV' }, { label: 'RCN', value: 'RCN' }]}
                onChange={handleSelectChange}
                required
                className="bg-gray-50 font-normal border-2 border-gray-800 p-2 rounded text-xl text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
            />
            <Select
                id="queue"
                label="Filas"
                value={queue}
                optionLabel='Selecione uma Fila'
                options={[{ label: 'Todos os serviços', value: 'all' }, { label: 'PREFERENCIAL', value: 'P' }, { label: 'NORMAL', value: 'N' }]}
                onChange={handleSelectChange}
                required
                className="bg-gray-50 font-normal border-2 border-gray-800 p-2 rounded text-xl text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
            />
            <Input
                id="searchByTicket"
                label="Senha"
                value={searchByTicket}
                onChange={handleSearchChange}
                placeholder="Pesquise por uma Senha..."
                className="bg-gray-50 font-normal border-2 border-gray-800 p-2 rounded text-lg text-gray-800 focus:border-blue-800 focus:shadow-md ease-in duration-200 outline-none"
            />
        </div>
    )
}