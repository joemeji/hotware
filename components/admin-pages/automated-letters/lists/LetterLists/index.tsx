import { toast } from "@/components/ui/use-toast"
import { mutate } from "swr"
import { fetcher } from "@/utils/api.config";
import useSWR from "swr";
import { ActionMenu, clTableInfo, defaultTableInfo, dwmTableInfo, iaTableInfo, scTableInfo, TABLE_ACTION_LABEL, TD, TH, wCTableInfo, woTableInfo, wusTableInfo } from "../..";

const LetterLists = ({ categoryType, dateFrom, dateTo }: any) => {

  const { data, isLoading } = useSWR(`/api/letter/lists?type=${categoryType}&from=${dateFrom}&to=${dateTo}`, fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const getTableInfo = (categoryType: string) => {
    switch (categoryType) {
      case 'cl':
        return clTableInfo
      case 'wc':
        return wCTableInfo
      case 'ia':
        return iaTableInfo
      case 'dwm':
        return dwmTableInfo
      case 'wo':
        return woTableInfo
      case 'sc':
        return scTableInfo
      case 'wus':
        return wusTableInfo
      default:
        return defaultTableInfo
    }
  }

  const tableInfo = getTableInfo(categoryType);


  const handleDelete = async (data: any) => {
    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/letter/delete', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/letter/lists?type=${categoryType}&from=${dateFrom}&to=${dateTo}`);
        toast({
          title: "Successfully deleted",
          variant: 'success',
          duration: 4000
        });

      } else {
        toast({
          title: json?.error,
          variant: 'error',
          duration: 4000
        });
      }

    } catch { }
  }


  return (
    <>
      <table className="w-full sticky top-[var(--header-height)] z-10 rounded-sm overflow-hidden my-5">
        <thead>
          <tr>
            {tableInfo && tableInfo.length > 0 && tableInfo.map((heading: any, i: any) => {
              return (
                <TH key={i} className={heading?.class}>{heading?.name}</TH>
              )
            })}
          </tr>
        </thead>
        <tbody className="">
          {isLoading && <tr className="text-center"><td>Loading...</td></tr>}

          {!isLoading && data && data.length > 0 && data.map((letter: any, i: any) => {
            return (
              <tr key={i}>
                {tableInfo && tableInfo.length > 0 && tableInfo.map((info: any, ii: any) => {

                  const _fields = info?.field

                  return !Array.isArray(_fields) ? info?.name != TABLE_ACTION_LABEL && (
                    <TD key={ii} className={info?.class}> {letter[_fields]} </TD>
                  )
                    :
                    <TD key={ii} className={info?.class}>
                      <div className="flex gap-1">
                        {_fields.map((j, i) =>
                          <span key={i}>{letter[j]}</span>
                        )}
                      </div>
                    </TD>

                })}
                <TD className="text-center">
                  <ActionMenu
                    onDelete={() => handleDelete({ id: letter.letter_id })}
                  />
                </TD>
              </tr>
            )
          })}

        </tbody>
      </table>
      {!data || data.length === 0 &&
        <div className='py-5 text-center'>No records found</div>
      }
    </>
  )
}

interface ILetterLists {
  data: string[]
}

export default LetterLists