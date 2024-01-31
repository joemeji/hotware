export default function ReceiptTotals({ list }: { list: any[] }) {
  return (
    <>
      {Array.isArray(list) && list.length !== 0
        ? list.map((receiptTotal) => (
            <tr
              key={receiptTotal.port_id}
              className="w-full bg-white rounded-sm px-4 py-1"
            >
              <td className="w-[2%]"></td>
              <td className="w-[9%]"></td>
              <td className="w-[21%] py-3 px-2">{receiptTotal.port_text}</td>
              <td className="w-[7%]"></td>
              <td className="w-[8%]"></td>
              <td className="w-[8%]"></td>
              <td className="w-[10%]"></td>
              <td className="w-[10%]">
                {receiptTotal.vat_description || "No VAT"}
              </td>
              <td className="w-[9%]"></td>
              <td className="w-[11%] py-3 px-2">
                {Number(
                  receiptTotal.port_value *
                    (receiptTotal.port_is_surcharge == 1 ? 1 : -1)
                ).toLocaleString()}
              </td>
              <td className="w-[7%]"></td>
            </tr>
          ))
        : null}
    </>
  );
}
