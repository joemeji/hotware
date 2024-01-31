import AutoMattedLetters from "./filters/AutomatedLetter"
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ItemMenu } from "@/components/items"
import { MoreHorizontal, Pencil, Trash, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"


export const TH = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <td className={cn('py-3 px-2 text-sm border-stone-200 bg-stone-200 text-stone-700 font-medium', className)}>{children}</td>
);

export const TD = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <td className={cn('py-2 px-2 border-stone-100 group-last:border-0', className)}>{children}</td>
);

interface IActionMenuProps {
  onDelete: () => void;
}

export const ActionMenu = ({ onDelete }: IActionMenuProps) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        className="p-2 text-stone-400 border-0 bg-transparent h-auto rounded-full"
      >
        <MoreHorizontal className="w-5 h-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="border border-stone-50">
      <ItemMenu onClick={onDelete}>
        <Trash
          className="mr-2 h-[18px] w-[18px] text-red-500"
          strokeWidth="2"
        />
        <span className="text-stone-600 text-sm">Delete</span>
      </ItemMenu>
    </DropdownMenuContent>
  </DropdownMenu>
)

export const TABLE_ACTION_LABEL = 'Actions'

const id = {
  'name': 'id',
  'class': 'text-center',
  'field': 'letter_id'
}

const employee = {
  'name': 'Employee',
  'field': [
    'fname',
    'lname',
  ]
}

const employeeType = {
  'name': 'Employee Type',
  'field': 'employee_type'
}

const designation = {
  'name': 'Designation',
  'field': 'designation'
}

const client = {
  'name': 'Client',
  'field': 'cms_name'
}

const country = {
  'name': 'Country',
  'field': 'country_name'
}

const action = {
  'name': TABLE_ACTION_LABEL,
  'class': 'text-center'
}

const clientLocation = {
  'name': 'Client Location',
  'field': 'cms_address_street'
}


const startDate = {
  'name': 'Start date',
  'field': 'start_date'
}

const returnDate = {
  'name': 'Return Date',
  'field': 'return_date'
}

const purpose = {
  'name': 'Purpose',
  'field': 'purpose'
}

const job = {
  'name': 'Job',
  'field': 'job'
}

const embassy = {
  'name': 'Embassy',
  'field': 'embassy'
}

const language = {
  'name': 'Language',
  'field': 'letter_language'
}

const _identity = {
  'name': 'Identity Card Number',
  'field': 'card_number'
}

const absenceFrom = {
  'name': 'Absence (From)',
  'field': 'letter_date_from'
}

const absenceTo = {
  'name': 'Absence (To)',
  'field': 'letter_date_to'
}

const salaryReductFrom = {
  'name': 'Salary Reduction (From)',
  'field': 'letter_date_from'
}

const salaryReductTo = {
  'name': 'Salary Reduction (To)',
  'field': 'letter_date_to'
}

export const defaultTableInfo = [
  id,
  employee,
  designation,
  client,
  country,
  action
]

export const clTableInfo = [
  id,
  employee,
  employeeType,
  designation,
  client,
  clientLocation,
  returnDate,
  purpose,
  job,
  embassy,
  action
]

export const wCTableInfo = [
  id,
  employee,
  startDate,
  returnDate,
  country,
  action
]

export const iaTableInfo = [
  id,
  employee,
  employeeType,
  designation,
  _identity,
  language,
  action
]

export const dwmTableInfo = [
  id,
  employee,
  employeeType,
  designation,
  _identity,
  language,
  absenceFrom,
  absenceTo,
  action
]

export const woTableInfo = [
  id,
  employee,
  employeeType,
  designation,
  language,
  action
]

export const scTableInfo = [
  id,
  employee,
  employeeType,
  designation,
  _identity,
  language,
  salaryReductFrom,
  salaryReductTo,
  action
]

export const wusTableInfo = [
  id,
  employee,
  employeeType,
  designation,
  _identity,
  language,
  action
]