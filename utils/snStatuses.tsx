import { Ban, Box, Lock } from "lucide-react";
import { CheckCircle2, Hammer, ShieldCheck, ThumbsDown, Truck } from "lucide-react";

export const SN_ACTIVE = 'active';
export const SN_QUARANTINE = 'quarantine';
export const SN_DAMAGE = 'damage';
export const SN_ONSOLD = 'sold';
export const SN_SHIPPED = 'shipped';

export const snStatuses = [
  {
    text: 'Active',
    name: SN_ACTIVE,
    color: '34, 197, 94',
    icon: (props: any) => <CheckCircle2 {...props} color={`rgba(34, 197, 94)`} />
  },
  {
    text: 'Quarantine',
    name: SN_QUARANTINE,
    color: '69, 10, 10',
    icon: (props: any) => <ShieldCheck {...props} color={`rgba(69, 10, 10)`} />
  },
  {
    text: 'Damage',
    name: SN_DAMAGE,
    color: '220, 38, 38',
    icon: (props: any) => <ThumbsDown {...props} color={`rgba(220, 38, 38)`} />
  },
  {
    text: 'On Sold',
    name: SN_ONSOLD,
    color: '133, 77, 14',
    icon: (props: any) => <Lock {...props} color={`rgb(133, 77, 14)`} />
  },
  {
    text: 'Shipped',
    name: SN_SHIPPED,
    color: '239, 68, 68',
    icon: (props: any) => <Truck {...props} color={`rgba(239, 68, 68)`} />
  },
  {
    text: 'Undefined',
    name: 'undefined',
    color: '75, 85, 99',
    icon: (props: any) => <Ban {...props} color={`rgba(75, 85, 99)`} />
  },
];