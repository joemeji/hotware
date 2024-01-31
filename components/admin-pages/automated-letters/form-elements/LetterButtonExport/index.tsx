import { Button } from "@/components/ui/button"
import { memo, useContext } from "react"
import { AccessTokenContext } from "@/context/access-token-context";
import { authHeaders, baseUrl } from "@/utils/api.config";

const LetterButtonExport = ({ type, dateFrom, dateTo }: ILetterButtonExport) => {

  const access_token: any = useContext(AccessTokenContext);

  const exportPdf = async () => {

    try {
      const a = await fetch(`${baseUrl}/api/letter/generate-pdf?type=${type}&from=${dateFrom}&to=${dateTo}`, {
        headers: { ...authHeaders(access_token) },
        // body: JSON.stringify({
        //   type: type,
        //   from: dateFrom,
        //   to: dateTo
        // })
      })
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then((blob) => {
          window.open(blob, "_blank");
        })
        .catch((e) => console.log('e', e))

    } catch (err: any) {
    } finally { }
  };

  return (
    <Button
      type="button"
      className="w-full my-5 bg-red-500 hover:bg-red-400"
      onClick={() => exportPdf()
      }
    >
      Export
    </Button >
  )
}

export default memo(LetterButtonExport)

interface ILetterButtonExport {
  type: string,
  dateFrom?: string,
  dateTo?: string
}