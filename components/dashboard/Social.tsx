import {
  Facebook,
  Instagram,
  Link2,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/hotwork.ag/",
    icon: (
      <Facebook
        fill="#111"
        className="text-black w-[19px] h-[19px]"
        strokeWidth={0.01}
      />
    ),
  },
  {
    name: "Youtube",
    href: "https://www.youtube.com/@hotworkinternational3918",
    icon: <Youtube className="w-[19px] h-[19px]" />,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/HotworkAG",
    icon: <Twitter className="w-[19px] h-[19px]" />,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hotworkinternational/",
    icon: <Instagram className="w-[19px] h-[19px]" />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/hotwork-international/",
    icon: <Linkedin className="w-[19px] h-[19px]" />,
  },
];

export default function Social() {
  return (
    <div className="w-1/2 bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2">
        <Link2 className="w-[30px] h-[30px]" strokeWidth={1.5} />
        <p className="font-medium text-base">Socials</p>
      </div>
      <Separator className="my-2 mb-4" />

      <div className="flex gap-1">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-fit p-[1px] rounded-full">
          <Link
            href="https://www.hotwork.ag"
            target="_blank"
            className="bg-white rounded-full px-4 font-medium h-full flex items-center"
          >
            www.hotwork.ag
          </Link>
        </div>
        {socials.map((item: any, key: number) => (
          <Link
            title={item.name}
            href={item.href}
            key={key}
            target="_blank"
            className="p-2 bg-stone-100 rounded-full hover:bg-stone-200/70"
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
