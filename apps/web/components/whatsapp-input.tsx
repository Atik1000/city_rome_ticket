"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { countries, type Country } from "@/lib/countries"

const dialDigits = (c: Country) => c.dial_code.replace(/\D/g, "")
const dialLabel = (c: Country) => `+${dialDigits(c)}`

// When several countries share a dial code (+1, +7, +44, ...), pick the main one.
const PRIMARY = new Set(["US", "GB", "RU", "AU", "IT", "NO", "FI", "MA", "FR", "ES"])

export const findCountry = (iso: string | null | undefined) => countries.find((c) => c.code === iso) ?? null
export const findCountryByName = (name: string | null | undefined) => countries.find((c) => c.name === name) ?? null

/**
 * Split a stored number ("+39 333 1234567" or "+393331234567") into its country and local part.
 * `preferIso` breaks ties between countries that share a dial code.
 */
export function parseWhatsApp(value: string, preferIso?: string | null): { iso: string | null; local: string } {
    const raw = (value || "").replace(/^\s+/, "")
    if (!raw.startsWith("+")) return { iso: preferIso ?? null, local: raw }

    const digits = raw.replace(/\D/g, "")
    const matches = countries.filter((c) => digits.startsWith(dialDigits(c)))
    if (matches.length === 0) return { iso: preferIso ?? null, local: raw.slice(1) }

    const best =
        matches.find((c) => c.code === preferIso) ??
        [...matches].sort(
            (a, b) =>
                dialDigits(b).length - dialDigits(a).length ||
                Number(PRIMARY.has(b.code)) - Number(PRIMARY.has(a.code))
        )[0]

    // Drop the dial-code digits from the front, keep whatever spacing the rest had.
    let toDrop = dialDigits(best).length
    let i = 1
    while (toDrop > 0 && i < raw.length) {
        if (/\d/.test(raw[i])) toDrop--
        i++
    }
    return { iso: best.code, local: raw.slice(i).replace(/^[\s\-.]+/, "") }
}

interface WhatsAppInputProps {
    value: string
    /** Receives the full international number, e.g. "+39 333 1234567", or "" when the number is empty. */
    onChange: (value: string) => void
    /** Country name chosen elsewhere in the form; preselects its code while no number is typed. */
    countryHint?: string
    id?: string
    required?: boolean
    /** Classes for the code button and the number box, so the field matches the surrounding form. */
    fieldClassName?: string
    /** Classes for the highlighted row in the code list. */
    activeItemClassName?: string
    /** Extra classes for the dropdown, e.g. a higher z-index inside a modal. */
    popoverClassName?: string
}

export function WhatsAppInput({
    value,
    onChange,
    countryHint,
    id = "whatsapp",
    required = true,
    fieldClassName = "border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
    activeItemClassName = "bg-blue-50 text-blue-700",
    popoverClassName,
}: WhatsAppInputProps) {
    const [open, setOpen] = useState(false)
    const [iso, setIso] = useState<string | null>(
        () => parseWhatsApp(value, findCountryByName(countryHint)?.code).iso ?? findCountryByName(countryHint)?.code ?? null
    )
    const numberRef = useRef<HTMLInputElement>(null)

    const parsed = parseWhatsApp(value, iso)
    const selected = findCountry(parsed.iso ?? iso)
    const local = parsed.local

    // Follow the Country field while the visitor hasn't typed a number yet.
    useEffect(() => {
        const hinted = findCountryByName(countryHint)
        if (hinted && !local) setIso(hinted.code)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countryHint])

    // A number without a code can't be reached on WhatsApp.
    useEffect(() => {
        numberRef.current?.setCustomValidity(local && !selected ? "Select your country code." : "")
    }, [local, selected])

    const emit = (country: Country | null, localPart: string) => {
        // Only trim the front: a trailing space is the visitor mid-typing "333 123".
        const typed = localPart.replace(/^\s+/, "")
        if (!typed.trim()) return onChange("")
        onChange(country ? `${dialLabel(country)} ${typed}` : typed)
    }

    return (
        <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Country code"
                        className={cn(
                            "w-[118px] shrink-0 px-3 py-2.5 bg-white text-left flex items-center justify-between gap-1 text-sm outline-none transition-all cursor-pointer",
                            fieldClassName
                        )}
                    >
                        {selected ? (
                            <span className="flex items-center gap-1.5 font-medium text-gray-900 truncate">
                                <span aria-hidden="true">{selected.flag}</span>
                                {dialLabel(selected)}
                            </span>
                        ) : (
                            <span className="text-gray-500">Code</span>
                        )}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className={cn("w-[300px] p-1 bg-white border border-gray-200 shadow-xl rounded-xl", popoverClassName)} align="start">
                    <Command>
                        <div className="px-2 pt-2 pb-1">
                            <CommandInput placeholder="Search country or code..." className="h-10 text-sm" />
                        </div>
                        <CommandList className="max-h-[280px] overflow-y-auto px-1">
                            <CommandEmpty className="py-6 text-center text-sm text-gray-500">No country found.</CommandEmpty>
                            <CommandGroup>
                                {countries.map((c) => {
                                    const isActive = selected?.code === c.code
                                    return (
                                        <CommandItem
                                            key={c.code}
                                            value={`${c.name} ${dialLabel(c)} ${dialDigits(c)}`}
                                            onSelect={() => {
                                                setIso(c.code)
                                                emit(c, local)
                                                setOpen(false)
                                                numberRef.current?.focus()
                                            }}
                                            className={cn(
                                                "flex items-center gap-2.5 p-2.5 cursor-pointer rounded-lg mx-1 my-0.5",
                                                isActive && activeItemClassName
                                            )}
                                        >
                                            <span aria-hidden="true">{c.flag}</span>
                                            <span className="flex-1 truncate text-sm">{c.name}</span>
                                            <span className="text-xs text-gray-500 tabular-nums">{dialLabel(c)}</span>
                                            {isActive && <Check className="h-3.5 w-3.5" />}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <input
                ref={numberRef}
                id={id}
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                required={required}
                pattern="[\d\s().\-]{4,20}"
                title="Enter your WhatsApp number without the country code"
                value={local}
                onChange={(e) => {
                    const text = e.target.value
                    // Pasted a full international number: let the parser pick the code.
                    if (text.trim().startsWith("+")) {
                        const p = parseWhatsApp(text, iso)
                        if (p.iso) setIso(p.iso)
                        emit(findCountry(p.iso), p.local)
                    } else {
                        emit(selected, text)
                    }
                }}
                placeholder="333 123 4567"
                className={cn("min-w-0 flex-1 px-3 py-2.5 bg-white outline-none placeholder:text-gray-400", fieldClassName)}
            />
        </div>
    )
}
