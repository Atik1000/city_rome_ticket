"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getCart, createBooking, BookingPayload, TravelerDetail } from "@/services/tourService"

import { isLoggedIn, getUserProfile } from "@/services/authService"
import { Loader2, User, Mail, Globe, Phone, Check, CheckCircle2, AlertCircle, ShieldCheck, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export const countries = [
    { name: "Afghanistan", code: "AF", dial_code: "+93", flag: "🇦🇫" },
    { name: "Albania", code: "AL", dial_code: "+355", flag: "🇦🇱" },
    { name: "Algeria", code: "DZ", dial_code: "+213", flag: "🇩🇿" },
    { name: "American Samoa", code: "AS", dial_code: "+1-684", flag: "🇦🇸" },
    { name: "Andorra", code: "AD", dial_code: "+376", flag: "🇦🇩" },
    { name: "Angola", code: "AO", dial_code: "+244", flag: "🇦🇴" },
    { name: "Anguilla", code: "AI", dial_code: "+1-264", flag: "🇦🇮" },
    { name: "Antarctica", code: "AQ", dial_code: "+672", flag: "🇦🇶" },
    { name: "Antigua and Barbuda", code: "AG", dial_code: "+1-268", flag: "🇦🇬" },
    { name: "Argentina", code: "AR", dial_code: "+54", flag: "🇦🇷" },
    { name: "Armenia", code: "AM", dial_code: "+374", flag: "🇦🇲" },
    { name: "Aruba", code: "AW", dial_code: "+297", flag: "🇦🇼" },
    { name: "Australia", code: "AU", dial_code: "+61", flag: "🇦🇺" },
    { name: "Austria", code: "AT", dial_code: "+43", flag: "🇦🇹" },
    { name: "Azerbaijan", code: "AZ", dial_code: "+994", flag: "🇦🇿" },
    { name: "Bahamas", code: "BS", dial_code: "+1-242", flag: "🇧🇸" },
    { name: "Bahrain", code: "BH", dial_code: "+973", flag: "🇧🇭" },
    { name: "Bangladesh", code: "BD", dial_code: "+880", flag: "🇧🇩" },
    { name: "Barbados", code: "BB", dial_code: "+1-246", flag: "🇧🇧" },
    { name: "Belarus", code: "BY", dial_code: "+375", flag: "🇧🇾" },
    { name: "Belgium", code: "BE", dial_code: "+32", flag: "🇧🇪" },
    { name: "Belize", code: "BZ", dial_code: "+501", flag: "🇧🇿" },
    { name: "Benin", code: "BJ", dial_code: "+229", flag: "🇧🇯" },
    { name: "Bermuda", code: "BM", dial_code: "+1-441", flag: "🇧🇲" },
    { name: "Bhutan", code: "BT", dial_code: "+975", flag: "🇧🇹" },
    { name: "Bolivia", code: "BO", dial_code: "+591", flag: "🇧🇴" },
    { name: "Bosnia and Herzegovina", code: "BA", dial_code: "+387", flag: "🇧🇦" },
    { name: "Botswana", code: "BW", dial_code: "+267", flag: "🇧🇼" },
    { name: "Brazil", code: "BR", dial_code: "+55", flag: "🇧🇷" },
    { name: "British Indian Ocean Territory", code: "IO", dial_code: "+246", flag: "🇮🇴" },
    { name: "British Virgin Islands", code: "VG", dial_code: "+1-284", flag: "🇻🇬" },
    { name: "Brunei", code: "BN", dial_code: "+673", flag: "🇧🇳" },
    { name: "Bulgaria", code: "BG", dial_code: "+359", flag: "🇧🇬" },
    { name: "Burkina Faso", code: "BF", dial_code: "+226", flag: "🇧🇫" },
    { name: "Burundi", code: "BI", dial_code: "+257", flag: "🇧🇮" },
    { name: "Cambodia", code: "KH", dial_code: "+855", flag: "🇰🇭" },
    { name: "Cameroon", code: "CM", dial_code: "+237", flag: "🇨🇲" },
    { name: "Canada", code: "CA", dial_code: "+1", flag: "🇨🇦" },
    { name: "Cape Verde", code: "CV", dial_code: "+238", flag: "🇨🇻" },
    { name: "Cayman Islands", code: "KY", dial_code: "+1-345", flag: "🇰🇾" },
    { name: "Central African Republic", code: "CF", dial_code: "+236", flag: "🇨🇫" },
    { name: "Chad", code: "TD", dial_code: "+235", flag: "🇹🇩" },
    { name: "Chile", code: "CL", dial_code: "+56", flag: "🇨🇱" },
    { name: "China", code: "CN", dial_code: "+86", flag: "🇨🇳" },
    { name: "Christmas Island", code: "CX", dial_code: "+61", flag: "🇨🇽" },
    { name: "Cocos Islands", code: "CC", dial_code: "+61", flag: "🇨🇨" },
    { name: "Colombia", code: "CO", dial_code: "+57", flag: "🇨🇴" },
    { name: "Comoros", code: "KM", dial_code: "+269", flag: "🇰🇲" },
    { name: "Cook Islands", code: "CK", dial_code: "+682", flag: "🇨🇰" },
    { name: "Costa Rica", code: "CR", dial_code: "+506", flag: "🇨🇷" },
    { name: "Croatia", code: "HR", dial_code: "+385", flag: "🇭🇷" },
    { name: "Cuba", code: "CU", dial_code: "+53", flag: "🇨🇺" },
    { name: "Curacao", code: "CW", dial_code: "+599", flag: "🇨🇼" },
    { name: "Cyprus", code: "CY", dial_code: "+357", flag: "🇨🇾" },
    { name: "Czech Republic", code: "CZ", dial_code: "+420", flag: "🇨🇿" },
    { name: "Democratic Republic of the Congo", code: "CD", dial_code: "+243", flag: "🇨🇩" },
    { name: "Denmark", code: "DK", dial_code: "+45", flag: "🇩🇰" },
    { name: "Djibouti", code: "DJ", dial_code: "+253", flag: "🇩🇯" },
    { name: "Dominica", code: "DM", dial_code: "+1-767", flag: "🇩🇲" },
    { name: "Dominican Republic", code: "DO", dial_code: "+1-809, 1-829, 1-849", flag: "🇩🇴" },
    { name: "East Timor", code: "TL", dial_code: "+670", flag: "🇹🇱" },
    { name: "Ecuador", code: "EC", dial_code: "+593", flag: "🇪🇨" },
    { name: "Egypt", code: "EG", dial_code: "+20", flag: "🇪🇬" },
    { name: "El Salvador", code: "SV", dial_code: "+503", flag: "🇸🇻" },
    { name: "Equatorial Guinea", code: "GQ", dial_code: "+240", flag: "🇬🇶" },
    { name: "Eritrea", code: "ER", dial_code: "+291", flag: "🇪🇷" },
    { name: "Estonia", code: "EE", dial_code: "+372", flag: "🇪🇪" },
    { name: "Ethiopia", code: "ET", dial_code: "+251", flag: "🇪🇹" },
    { name: "Falkland Islands", code: "FK", dial_code: "+500", flag: "🇫🇰" },
    { name: "Faroe Islands", code: "FO", dial_code: "+298", flag: "🇫🇴" },
    { name: "Fiji", code: "FJ", dial_code: "+679", flag: "🇫🇯" },
    { name: "Finland", code: "FI", dial_code: "+358", flag: "🇫🇮" },
    { name: "France", code: "FR", dial_code: "+33", flag: "🇫🇷" },
    { name: "French Polynesia", code: "PF", dial_code: "+689", flag: "🇵🇫" },
    { name: "Gabon", code: "GA", dial_code: "+241", flag: "🇬🇦" },
    { name: "Gambia", code: "GM", dial_code: "+220", flag: "🇬🇲" },
    { name: "Georgia", code: "GE", dial_code: "+995", flag: "🇬🇪" },
    { name: "Germany", code: "DE", dial_code: "+49", flag: "🇩🇪" },
    { name: "Ghana", code: "GH", dial_code: "+233", flag: "🇬🇭" },
    { name: "Gibraltar", code: "GI", dial_code: "+350", flag: "🇬🇮" },
    { name: "Greece", code: "GR", dial_code: "+30", flag: "🇬🇷" },
    { name: "Greenland", code: "GL", dial_code: "+299", flag: "🇬🇱" },
    { name: "Grenada", code: "GD", dial_code: "+1-473", flag: "🇬🇩" },
    { name: "Guam", code: "GU", dial_code: "+1-671", flag: "🇬🇺" },
    { name: "Guatemala", code: "GT", dial_code: "+502", flag: "🇬🇹" },
    { name: "Guernsey", code: "GG", dial_code: "+44-1481", flag: "🇬🇬" },
    { name: "Guinea", code: "GN", dial_code: "+224", flag: "🇬🇳" },
    { name: "Guinea-Bissau", code: "GW", dial_code: "+245", flag: "🇬🇼" },
    { name: "Guyana", code: "GY", dial_code: "+592", flag: "🇬🇾" },
    { name: "Haiti", code: "HT", dial_code: "+509", flag: "🇭🇹" },
    { name: "Honduras", code: "HN", dial_code: "+504", flag: "🇭🇳" },
    { name: "Hong Kong", code: "HK", dial_code: "+852", flag: "🇭🇰" },
    { name: "Hungary", code: "HU", dial_code: "+36", flag: "🇭🇺" },
    { name: "Iceland", code: "IS", dial_code: "+354", flag: "🇮🇸" },
    { name: "India", code: "IN", dial_code: "+91", flag: "🇮🇳" },
    { name: "Indonesia", code: "ID", dial_code: "+62", flag: "🇮🇩" },
    { name: "Iran", code: "IR", dial_code: "+98", flag: "🇮🇷" },
    { name: "Iraq", code: "IQ", dial_code: "+964", flag: "🇮🇶" },
    { name: "Ireland", code: "IE", dial_code: "+353", flag: "🇮🇪" },
    { name: "Isle of Man", code: "IM", dial_code: "+44-1624", flag: "🇮🇲" },
    { name: "Israel", code: "IL", dial_code: "+972", flag: "🇮🇱" },
    { name: "Italy", code: "IT", dial_code: "+39", flag: "🇮🇹" },
    { name: "Ivory Coast", code: "CI", dial_code: "+225", flag: "🇨🇮" },
    { name: "Jamaica", code: "JM", dial_code: "+1-876", flag: "🇯🇲" },
    { name: "Japan", code: "JP", dial_code: "+81", flag: "🇯🇵" },
    { name: "Jersey", code: "JE", dial_code: "+44-1534", flag: "🇯🇪" },
    { name: "Jordan", code: "JO", dial_code: "+962", flag: "🇯🇴" },
    { name: "Kazakhstan", code: "KZ", dial_code: "+7", flag: "🇰🇿" },
    { name: "Kenya", code: "KE", dial_code: "+254", flag: "🇰🇪" },
    { name: "Kiribati", code: "KI", dial_code: "+686", flag: "🇰🇮" },
    { name: "Kosovo", code: "XK", dial_code: "+383", flag: "🇽🇰" },
    { name: "Kuwait", code: "KW", dial_code: "+965", flag: "🇰🇼" },
    { name: "Kyrgyzstan", code: "KG", dial_code: "+996", flag: "🇰🇬" },
    { name: "Laos", code: "LA", dial_code: "+856", flag: "🇱🇦" },
    { name: "Latvia", code: "LV", dial_code: "+371", flag: "🇱🇻" },
    { name: "Lebanon", code: "LB", dial_code: "+961", flag: "🇱🇧" },
    { name: "Lesotho", code: "LS", dial_code: "+266", flag: "🇱🇸" },
    { name: "Liberia", code: "LR", dial_code: "+231", flag: "🇱🇷" },
    { name: "Libya", code: "LY", dial_code: "+218", flag: "🇱🇾" },
    { name: "Liechtenstein", code: "LI", dial_code: "+423", flag: "🇱🇮" },
    { name: "Lithuania", code: "LT", dial_code: "+370", flag: "🇱🇹" },
    { name: "Luxembourg", code: "LU", dial_code: "+352", flag: "🇱🇺" },
    { name: "Macau", code: "MO", dial_code: "+853", flag: "🇲🇴" },
    { name: "Macedonia", code: "MK", dial_code: "+389", flag: "🇲🇰" },
    { name: "Madagascar", code: "MG", dial_code: "+261", flag: "🇲🇬" },
    { name: "Malawi", code: "MW", dial_code: "+265", flag: "🇲🇼" },
    { name: "Malaysia", code: "MY", dial_code: "+60", flag: "🇲🇾" },
    { name: "Maldives", code: "MV", dial_code: "+960", flag: "🇲🇻" },
    { name: "Mali", code: "ML", dial_code: "+223", flag: "🇲🇱" },
    { name: "Malta", code: "MT", dial_code: "+356", flag: "🇲🇹" },
    { name: "Marshall Islands", code: "MH", dial_code: "+692", flag: "🇲🇭" },
    { name: "Mauritania", code: "MR", dial_code: "+222", flag: "🇲🇷" },
    { name: "Mauritius", code: "MU", dial_code: "+230", flag: "🇲🇺" },
    { name: "Mayotte", code: "YT", dial_code: "+262", flag: "🇾🇹" },
    { name: "Mexico", code: "MX", dial_code: "+52", flag: "🇲🇽" },
    { name: "Micronesia", code: "FM", dial_code: "+691", flag: "🇫🇲" },
    { name: "Moldova", code: "MD", dial_code: "+373", flag: "🇲🇩" },
    { name: "Monaco", code: "MC", dial_code: "+377", flag: "🇲🇨" },
    { name: "Mongolia", code: "MN", dial_code: "+976", flag: "🇲🇳" },
    { name: "Montenegro", code: "ME", dial_code: "+382", flag: "🇲🇪" },
    { name: "Montserrat", code: "MS", dial_code: "+1-664", flag: "🇲🇸" },
    { name: "Morocco", code: "MA", dial_code: "+212", flag: "🇲🇦" },
    { name: "Mozambique", code: "MZ", dial_code: "+258", flag: "🇲🇿" },
    { name: "Myanmar", code: "MM", dial_code: "+95", flag: "🇲🇲" },
    { name: "Namibia", code: "NA", dial_code: "+264", flag: "🇳🇦" },
    { name: "Nauru", code: "NR", dial_code: "+674", flag: "🇳🇷" },
    { name: "Nepal", code: "NP", dial_code: "+977", flag: "🇳🇵" },
    { name: "Netherlands", code: "NL", dial_code: "+31", flag: "🇳🇱" },
    { name: "Netherlands Antilles", code: "AN", dial_code: "+599", flag: "🇳🇱" },
    { name: "New Caledonia", code: "NC", dial_code: "+687", flag: "🇳🇨" },
    { name: "New Zealand", code: "NZ", dial_code: "+64", flag: "🇳🇿" },
    { name: "Nicaragua", code: "NI", dial_code: "+505", flag: "🇳🇮" },
    { name: "Niger", code: "NE", dial_code: "+227", flag: "🇳🇪" },
    { name: "Nigeria", code: "NG", dial_code: "+234", flag: "🇳🇬" },
    { name: "Niue", code: "NU", dial_code: "+683", flag: "🇳🇺" },
    { name: "North Korea", code: "KP", dial_code: "+850", flag: "🇰🇵" },
    { name: "Northern Mariana Islands", code: "MP", dial_code: "+1-670", flag: "🇲🇵" },
    { name: "Norway", code: "NO", dial_code: "+47", flag: "🇳🇴" },
    { name: "Oman", code: "OM", dial_code: "+968", flag: "🇴🇲" },
    { name: "Pakistan", code: "PK", dial_code: "+92", flag: "🇵🇰" },
    { name: "Palau", code: "PW", dial_code: "+680", flag: "🇵🇼" },
    { name: "Palestine", code: "PS", dial_code: "+970", flag: "🇵🇸" },
    { name: "Panama", code: "PA", dial_code: "+507", flag: "🇵🇦" },
    { name: "Papua New Guinea", code: "PG", dial_code: "+675", flag: "🇵🇬" },
    { name: "Paraguay", code: "PY", dial_code: "+595", flag: "🇵🇾" },
    { name: "Peru", code: "PE", dial_code: "+51", flag: "🇵🇪" },
    { name: "Philippines", code: "PH", dial_code: "+63", flag: "🇵🇭" },
    { name: "Pitcairn", code: "PN", dial_code: "+870", flag: "🇵🇳" },
    { name: "Poland", code: "PL", dial_code: "+48", flag: "🇵🇱" },
    { name: "Portugal", code: "PT", dial_code: "+351", flag: "🇵🇹" },
    { name: "Puerto Rico", code: "PR", dial_code: "+1-787, 1-939", flag: "🇵🇷" },
    { name: "Qatar", code: "QA", dial_code: "+974", flag: "🇶🇦" },
    { name: "Republic of the Congo", code: "CG", dial_code: "+242", flag: "🇨🇬" },
    { name: "Reunion", code: "RE", dial_code: "+262", flag: "🇷🇪" },
    { name: "Romania", code: "RO", dial_code: "+40", flag: "🇷🇴" },
    { name: "Russia", code: "RU", dial_code: "+7", flag: "🇷🇺" },
    { name: "Rwanda", code: "RW", dial_code: "+250", flag: "🇷🇼" },
    { name: "Saint Barthelemy", code: "BL", dial_code: "+590", flag: "🇧🇱" },
    { name: "Saint Helena", code: "SH", dial_code: "+290", flag: "🇸🇭" },
    { name: "Saint Kitts and Nevis", code: "KN", dial_code: "+1-869", flag: "🇰🇳" },
    { name: "Saint Lucia", code: "LC", dial_code: "+1-758", flag: "🇱🇨" },
    { name: "Saint Martin", code: "MF", dial_code: "+590", flag: "🇲🇫" },
    { name: "Saint Pierre and Miquelon", code: "PM", dial_code: "+508", flag: "🇵🇲" },
    { name: "Saint Vincent and the Grenadines", code: "VC", dial_code: "+1-784", flag: "🇻🇨" },
    { name: "Samoa", code: "WS", dial_code: "+685", flag: "🇼🇸" },
    { name: "San Marino", code: "SM", dial_code: "+378", flag: "🇸🇲" },
    { name: "Sao Tome and Principe", code: "ST", dial_code: "+239", flag: "🇸🇹" },
    { name: "Saudi Arabia", code: "SA", dial_code: "+966", flag: "🇸🇦" },
    { name: "Senegal", code: "SN", dial_code: "+221", flag: "🇸🇳" },
    { name: "Serbia", code: "RS", dial_code: "+381", flag: "🇷🇸" },
    { name: "Seychelles", code: "SC", dial_code: "+248", flag: "🇸🇨" },
    { name: "Sierra Leone", code: "SL", dial_code: "+232", flag: "🇸🇱" },
    { name: "Singapore", code: "SG", dial_code: "+65", flag: "🇸🇬" },
    { name: "Sint Maarten", code: "SX", dial_code: "+1-721", flag: "🇸🇽" },
    { name: "Slovakia", code: "SK", dial_code: "+421", flag: "🇸🇰" },
    { name: "Slovenia", code: "SI", dial_code: "+386", flag: "🇸🇮" },
    { name: "Solomon Islands", code: "SB", dial_code: "+677", flag: "🇸🇧" },
    { name: "Somalia", code: "SO", dial_code: "+252", flag: "🇸🇴" },
    { name: "South Africa", code: "ZA", dial_code: "+27", flag: "🇿🇦" },
    { name: "South Korea", code: "KR", dial_code: "+82", flag: "🇰🇷" },
    { name: "South Sudan", code: "SS", dial_code: "+211", flag: "🇸🇸" },
    { name: "Spain", code: "ES", dial_code: "+34", flag: "🇪🇸" },
    { name: "Sri Lanka", code: "LK", dial_code: "+94", flag: "🇱🇰" },
    { name: "Sudan", code: "SD", dial_code: "+249", flag: "🇸🇩" },
    { name: "Suriname", code: "SR", dial_code: "+597", flag: "🇸🇷" },
    { name: "Svalbard and Jan Mayen", code: "SJ", dial_code: "+47", flag: "🇸🇯" },
    { name: "Swaziland", code: "SZ", dial_code: "+268", flag: "🇸🇿" },
    { name: "Sweden", code: "SE", dial_code: "+46", flag: "🇸🇪" },
    { name: "Switzerland", code: "CH", dial_code: "+41", flag: "🇨🇭" },
    { name: "Syria", code: "SY", dial_code: "+963", flag: "🇸🇾" },
    { name: "Taiwan", code: "TW", dial_code: "+886", flag: "🇹🇼" },
    { name: "Tajikistan", code: "TJ", dial_code: "+992", flag: "🇹🇯" },
    { name: "Tanzania", code: "TZ", dial_code: "+255", flag: "🇹🇿" },
    { name: "Thailand", code: "TH", dial_code: "+66", flag: "🇹🇭" },
    { name: "Togo", code: "TG", dial_code: "+228", flag: "🇹🇬" },
    { name: "Tokelau", code: "TK", dial_code: "+690", flag: "🇹🇰" },
    { name: "Tonga", code: "TO", dial_code: "+676", flag: "🇹🇴" },
    { name: "Trinidad and Tobago", code: "TT", dial_code: "+1-868", flag: "🇹🇹" },
    { name: "Tunisia", code: "TN", dial_code: "+216", flag: "🇹🇳" },
    { name: "Turkey", code: "TR", dial_code: "+90", flag: "🇹🇷" },
    { name: "Turkmenistan", code: "TM", dial_code: "+993", flag: "🇹🇲" },
    { name: "Turks and Caicos Islands", code: "TC", dial_code: "+1-649", flag: "🇹🇨" },
    { name: "Tuvalu", code: "TV", dial_code: "+688", flag: "🇹🇻" },
    { name: "U.S. Virgin Islands", code: "VI", dial_code: "+1-340", flag: "🇻🇮" },
    { name: "Uganda", code: "UG", dial_code: "+256", flag: "🇺🇬" },
    { name: "Ukraine", code: "UA", dial_code: "+380", flag: "🇺🇦" },
    { name: "United Arab Emirates", code: "AE", dial_code: "+971", flag: "🇦🇪" },
    { name: "United Kingdom", code: "GB", dial_code: "+44", flag: "🇬🇧" },
    { name: "United States", code: "US", dial_code: "+1", flag: "🇺🇸" },
    { name: "Uruguay", code: "UY", dial_code: "+598", flag: "🇺🇾" },
    { name: "Uzbekistan", code: "UZ", dial_code: "+998", flag: "🇺🇿" },
    { name: "Vanuatu", code: "VU", dial_code: "+678", flag: "🇻🇺" },
    { name: "Vatican", code: "VA", dial_code: "+379", flag: "🇻🇦" },
    { name: "Venezuela", code: "VE", dial_code: "+58", flag: "🇻🇪" },
    { name: "Vietnam", code: "VN", dial_code: "+84", flag: "🇻🇳" },
    { name: "Wallis and Futuna", code: "WF", dial_code: "+681", flag: "🇼🇫" },
    { name: "Western Sahara", code: "EH", dial_code: "+212", flag: "🇪🇭" },
    { name: "Yemen", code: "YE", dial_code: "+967", flag: "🇾🇪" },
    { name: "Zambia", code: "ZM", dial_code: "+260", flag: "🇿🇲" },
    { name: "Zimbabwe", code: "ZW", dial_code: "+263", flag: "🇿🇼" }
]

export default function CheckoutPage() {
    const [loading, setLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)
    const [step, setStep] = useState(1) // 1: Contact Info (Guest), 2: Traveler Details
    const [totalAdults, setTotalAdults] = useState(0)
    const [openCountry, setOpenCountry] = useState(false)

    const [isBookNow, setIsBookNow] = useState(false)

    const showMessage = (title: string, content: string, onClose?: () => void) => {
        if (title === "Success") toast.success(content)
        else if (title === "Error" || title.includes("Failed")) toast.error(content)
        else toast.warning(content)
        if (onClose) onClose()
    }

    // Forms
    const [guestDetails, setGuestDetails] = useState({
        full_name: "",
        email: "",
        country: "",
        phone: ""
    })

    const [travelerDetails, setTravelerDetails] = useState<TravelerDetail[]>([])

    useEffect(() => {
        checkAuthAndLoad()
    }, [])

    const checkAuthAndLoad = async () => {
        setLoading(true)
        const isUserLoggedIn = isLoggedIn()
        setLoggedIn(isUserLoggedIn)

        // If logged in, skip contact step
        if (isUserLoggedIn) {
            setStep(2)
        }

        let prepopulatedName = "";
        if (isUserLoggedIn) {
            try {
                const profile = await getUserProfile();
                prepopulatedName = `${profile.first_name} ${profile.last_name}`.trim();
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        } else {
            const savedGuest = localStorage.getItem('guestCheckoutDetails');
            if (savedGuest) {
                try {
                    const parsed = JSON.parse(savedGuest);
                    prepopulatedName = parsed.full_name || "";
                    setGuestDetails(parsed);
                } catch (e) {
                    console.error("Failed to parse guest details", e);
                }
            }
        }

        // Check for Book Now data first
        const bookNowDataStr = localStorage.getItem('bookNowData')
        let bookNowMode = false
        if (bookNowDataStr) {
            try {
                const bookNowData = JSON.parse(bookNowDataStr)
                setIsBookNow(true)
                bookNowMode = true

                // Set adults count directly from data
                const adults = bookNowData.num_adults || 0 // Default to 0 if not found, though interface implies it exists
                setTotalAdults(adults)

                // Initialize traveler details with prepopulated name for first traveler
                const initialTravelers = Array(adults).fill({ name: "" }).map((t, i) =>
                    i === 0 && prepopulatedName ? { ...t, name: prepopulatedName } : t
                );
                setTravelerDetails(initialTravelers)

                setLoading(false)
                return; // Skip cart loading
            } catch (e) {
                console.error("Failed to parse book now data", e)
                // Fallthrough to cart logic
            }
        }

        // Load cart for adult count if not book now
        const cartIdsStr = localStorage.getItem('cartItemId')
        if (!cartIdsStr) {
            setLoading(false)
            return
        }

        const ids = cartIdsStr.split(',').map(id => parseInt(id.trim(), 10)).filter(n => !isNaN(n))

        try {
            const cartResponse = await getCart(ids)
            // Calculate total adults across all items
            const adults = cartResponse.results.reduce((acc, item) => acc + item.num_adults, 0)
            setTotalAdults(adults)

            // Initialize traveler details array with prepopulated name for first traveler
            const initialTravelers = Array(adults).fill({ name: "" }).map((t, i) =>
                i === 0 && prepopulatedName ? { ...t, name: prepopulatedName } : t
            );
            setTravelerDetails(initialTravelers)
        } catch (error) {
            console.error("Failed to load cart for checkout", error)
        } finally {
            setLoading(false)
        }
    }

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Save to local storage
        localStorage.setItem('guestCheckoutDetails', JSON.stringify(guestDetails))

        // Also update the first traveler's name if not already set or override it
        const newDetails = [...travelerDetails]
        if (newDetails.length > 0) {
            newDetails[0] = { ...newDetails[0], name: guestDetails.full_name }
            setTravelerDetails(newDetails)
        }

        setStep(2)
    }

    const handleTravelerChange = (index: number, field: keyof TravelerDetail, value: string) => {
        const newDetails = [...travelerDetails]
        newDetails[index] = { ...newDetails[index], [field]: value }
        setTravelerDetails(newDetails)
    }

    const handleFinalSubmit = async () => {
        setLoading(true)
        try {
            let payload: BookingPayload;

            if (isBookNow) {
                const bookNowDataStr = localStorage.getItem('bookNowData')
                if (!bookNowDataStr) throw new Error("Missing booking data")
                const bookNowData = JSON.parse(bookNowDataStr)

                payload = {
                    book_now: "true",
                    single_item: bookNowData,
                    traveler_details: travelerDetails
                }
            } else {
                const cartIdsStr = localStorage.getItem('cartItemId')
                if (!cartIdsStr) throw new Error("No items in cart")

                payload = {
                    cart_item_ids: cartIdsStr.split(',').map(id => parseInt(id.trim(), 10)).filter(n => !isNaN(n)),
                    traveler_details: travelerDetails
                }
            }

            if (!loggedIn) {
                // Attach guest formatted details
                const savedGuest = localStorage.getItem('guestCheckoutDetails')
                if (savedGuest) {
                    const parsed = JSON.parse(savedGuest)
                    payload.full_name = parsed.full_name
                    payload.email = parsed.email
                    payload.country = parsed.country
                    payload.phone = parsed.phone
                } else {
                    // Fallback to state
                    payload.full_name = guestDetails.full_name
                    payload.email = guestDetails.email
                    payload.country = guestDetails.country
                    payload.phone = guestDetails.phone
                }
            }

            let token = undefined;
            if (loggedIn) {
                const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
                if (match) {
                    token = match[2];
                }
            }

            await createBooking(payload, token)
            showMessage("Success", "Booking successful!", () => {
                // Cleanup
                if (isBookNow) {
                    localStorage.removeItem('bookNowData')
                } else {
                    localStorage.removeItem('cartItemId')
                }
                localStorage.removeItem('guestCheckoutDetails')
                window.location.href = "/"
            })

        } catch (error: any) {
            console.error("Booking failed", error)
            showMessage("Error", error.message || "Booking failed")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex justify-center items-center h-[70vh]">
                    <Loader2 className="animate-spin text-brand-dark" size={40} />
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <p className="eyebrow mb-2">Final step</p>
                <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink mb-4">Checkout</h1>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-ink/70">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-cream/60 px-3 py-1.5 font-medium"><ShieldCheck size={14} className="text-gold" /> Secure checkout</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-cream/60 px-3 py-1.5 font-medium"><CheckCircle2 size={14} className="text-gold" /> Free cancellation on most tours</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-cream/60 px-3 py-1.5 font-medium"><Check size={14} className="text-gold" /> Instant mobile tickets</span>
                </div>

                {/* Stepper (Roman ordinals) */}
                {!loggedIn && (
                    <div className="flex items-center gap-3 mb-8" aria-hidden="true">
                        <div className="flex items-center gap-2.5">
                            <span className={`flex h-9 w-9 items-center justify-center rounded-full font-serif text-sm font-semibold border transition-colors ${step === 1 ? "bg-brand text-white border-brand shadow-warm" : "bg-espresso text-gold-light border-gold/50"}`}>I</span>
                            <span className={`text-sm font-medium ${step === 1 ? "text-ink" : "text-ink/50"}`}>Contact</span>
                        </div>
                        <span className="h-px flex-1 max-w-16 bg-gradient-to-r from-gold/60 to-gold/20" />
                        <div className="flex items-center gap-2.5">
                            <span className={`flex h-9 w-9 items-center justify-center rounded-full font-serif text-sm font-semibold border transition-colors ${step === 2 ? "bg-brand text-white border-brand shadow-warm" : "bg-white text-ink/50 border-ink/20"}`}>II</span>
                            <span className={`text-sm font-medium ${step === 2 ? "text-ink" : "text-ink/50"}`}>Travelers</span>
                        </div>
                    </div>
                )}

                {/* Step 1: Contact Info (Guest Only) */}
                {step === 1 && !loggedIn && (
                    <div className="relative bg-white rounded-2xl shadow-warm-lg border border-gold/30 p-6 sm:p-8 overflow-hidden">
                        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Contact Details</h2>
                        <form onSubmit={handleGuestSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 p-2.5 border border-ink/15 rounded-xl bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all"
                                        placeholder="John Doe"
                                        value={guestDetails.full_name}
                                        onChange={e => setGuestDetails({ ...guestDetails, full_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="email"
                                        className="w-full pl-10 p-2.5 border border-ink/15 rounded-xl bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all"
                                        placeholder="john@example.com"
                                        value={guestDetails.email}
                                        onChange={e => setGuestDetails({ ...guestDetails, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-ink mb-1.5">Country</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        <Popover open={openCountry} onOpenChange={setOpenCountry}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    role="combobox"
                                                    aria-expanded={openCountry}
                                                    className="w-full pl-10 p-2.5 border border-ink/15 rounded-xl bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none text-left flex justify-between items-center text-sm transition-all hover:bg-cream/40 hover:border-gold/60 cursor-pointer"
                                                >
                                                    {guestDetails.country ? (
                                                        <span className="font-medium text-gray-900">
                                                            {countries.find((country) => country.name === guestDetails.country)?.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">Select Country</span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[310px] p-1 bg-white border border-gray-200 shadow-xl rounded-xl max-h-[400px]" align="start">
                                                <Command className="w-full">
                                                    <div className="px-2 pt-2 pb-1">
                                                        <CommandInput
                                                            placeholder="Search country..."
                                                            className="h-10 rounded-lg bg-gray-50 border-0 focus:ring-0 px-3 text-sm"
                                                        />
                                                    </div>
                                                    <div className="h-[1px] bg-gray-100 mx-2 mb-1" />
                                                    <CommandList className="max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
                                                        <CommandEmpty className="py-6 text-center text-sm text-gray-500">No country found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {[...countries].sort((a, b) => {
                                                                if (a.name === guestDetails.country) return -1
                                                                if (b.name === guestDetails.country) return 1
                                                                return 0
                                                            }).map((country) => (
                                                                <CommandItem
                                                                    key={country.code}
                                                                    value={country.name}
                                                                    className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-cream hover:text-brand-dark transition-colors rounded-lg mx-1 my-0.5 group aria-selected:bg-cream"
                                                                    onSelect={(currentValue) => {
                                                                        setGuestDetails({ ...guestDetails, country: country.name })
                                                                        setOpenCountry(false)
                                                                    }}
                                                                >
                                                                    <div className={cn(
                                                                        "flex items-center justify-center w-5 h-5 rounded-full border transition-all shrink-0",
                                                                        guestDetails.country === country.name
                                                                            ? "bg-brand border-brand"
                                                                            : "border-gray-200 group-hover:border-gold"
                                                                    )}>
                                                                        {guestDetails.country === country.name && (
                                                                            <Check className="h-3 w-3 text-white" />
                                                                        )}
                                                                    </div>

                                                                    <div className="flex flex-col">
                                                                        <span className={cn(
                                                                            "font-medium transition-colors text-sm",
                                                                            guestDetails.country === country.name ? "text-brand-dark" : "text-gray-700 group-hover:text-brand-dark"
                                                                        )}>
                                                                            {country.name}
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-ink mb-1.5">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        <input
                                            //required
                                            type="tel"
                                            className="w-full pl-10 p-2.5 border border-ink/15 rounded-xl bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all"
                                            placeholder="+1 234 567 890"
                                            value={guestDetails.phone}
                                            onChange={e => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-premium w-full py-3.5 mt-4">
                                Continue
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Traveler Details */}
                {step === 2 && (
                    <div className="relative bg-white rounded-2xl shadow-warm-lg border border-gold/30 p-6 sm:p-8 overflow-hidden">
                        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                        <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Traveler Details</h2>
                        <div className="space-y-6">
                            {travelerDetails.map((traveler, index) => (
                                <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    <h3 className="font-serif font-semibold text-ink mb-3">Adult {index + 1}</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-ink/60 mb-1.5">Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full p-2.5 border border-ink/15 rounded-xl bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition-all"
                                                value={traveler.name}
                                                onChange={e => handleTravelerChange(index, 'name', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleFinalSubmit}
                            className="btn-premium w-full py-3.5 mt-8"
                        >
                            <Check size={20} />
                            Final Submit
                        </button>
                    </div>
                )}
            </main>

            <Footer />

        </div>
    )
}
