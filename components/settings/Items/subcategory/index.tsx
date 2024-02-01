import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ItemMenu } from "@/components/LoadingList";
import { Download, Loader2, MoreHorizontal, Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsItemsSubcategoryLists } from "./lists/SubcategoryLists";
import { AddSubcategoryForm } from "./forms/AddSubcategoryForm";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { AccessTokenContext } from "@/context/access-token-context";

export const SettingsItemsSubcategory = () => {
  const { data }: any = useSession();
  const roleId = parseInt(data?.user?.role_id);

  const router = useRouter();
  const [searchText, setSearchText] = useState('')
  const [loading,setLoading] = useState(false)

  const page = router.query['page'] ?? 1

  const listUrl = `/api/item/subcategory/paginate?page=${page}&search=${searchText}`;

  const access_token: any = useContext(AccessTokenContext);


  const exportPdf = async () => {

    setLoading(true)
    try {
       await fetch(`${baseUrl}/api/sub_categories/pdf?search=${searchText}`, {
        headers: { ...authHeaders(access_token) },
      })
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then((blob) => {
          setLoading(false)
          window.open(blob, "_blank");
        })
        .catch((e) => console.log('e', e))

    } catch (err: any) {
    } finally { }
  };

  return (
    <div className=''>
      <div className='p-[20px] w-full max-w-[1600px] mx-auto xl:min-h-screen'>
        <div className='flex py-5 justify-between'>
          <h2 className='uppercase'>Subcategory</h2>
        </div>
        <div className='rounded-xl mt-4 shadow-sm flex flex-col min-h-[600px]'>
          <div className='grid grid-cols-8 gap-5 '>
            {roleId <= 2 && (
              <div className='bg-white col-span-3 p-7 '>
                <h2 className='text-xl font-semibold uppercase'>
                  Add Subcategory
                </h2>
                <h3 className='text-md font-light'>
                  Add new equipment subcategory
                </h3>
                <AddSubcategoryForm listUrl={listUrl} />
              </div>
            )}

            <div
              className={cn("bg-white p-7", {
                "col-span-5 p-7": roleId <= 2,
                "col-span-8 p-7": roleId > 2 || !roleId,
              })}
            >
              <div className='flex items-center justify-between '>
                <h1 className='text-2xl font-light mb-5'>
                  Manage Subcategories
                </h1>
                <div className='flex gap-2 items-center'>
                  <div>
                    <Input
                      placeholder='Search'
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        focus();
                      }}
                    />
                  </div>
                  <Button
                    className='flex gap-2 text-xs p-3'
                    onClick={exportPdf}
                    disabled={loading}
                  >
                    {!loading && <Download size={13}   />}
                    {loading && <Loader2  size={13} className='animate-spin mx-auto' />}
                    Save as PDF
                  </Button>
                </div>
              </div>
              <SettingsItemsSubcategoryLists listUrl={listUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export const TH = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <td className={cn('py-3 px-2 text-sm border-stone-200 bg-stone-200 text-stone-700 font-medium', className)}>{children}</td>
);

export const TD = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <td className={cn('py-2 px-2 border-stone-100 group-last:border-0', className)}>{children}</td>
);

interface IActionMenuProps {
  onDelete: (id:any) => void
  onEdit: (id:any) => void
  data: {}
}

export const ActionMenu = ({ onDelete, onEdit, data }: IActionMenuProps) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant='outline'
        className='p-2 text-stone-400 border-0 bg-transparent h-auto rounded-full'
      >
        <MoreHorizontal className='w-5 h-5' />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' className='border border-stone-50'>
      <ItemMenu onClick={() => onEdit(data)}>
        <Pen />
        <span className='text-stone-600 text-sm'>Edit</span>
      </ItemMenu>
      <ItemMenu onClick={() => onDelete(data)}>
        <Trash
          className='mr-2 h-[18px] w-[18px] text-red-500'
          strokeWidth='2'
        />
        <span className='text-stone-600 text-sm'>Delete</span>
      </ItemMenu>
    </DropdownMenuContent>
  </DropdownMenu>
);


export const tableSubcategoryHeadings = [
  {
    name: 'ID'
  },
  {
    name: 'Main Category'
  },
  {
    name: 'Category'
  },
  {
    name: 'Name'
  },
  {
    name: 'Description'
  },
  {}
];