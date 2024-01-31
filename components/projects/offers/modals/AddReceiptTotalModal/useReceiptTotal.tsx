import { useState } from "react";

const defaultReceipt = {
  offerrt_type: 1,
  offerrt_value: 0,
  offerrt_text: "",
  offerrt_vat: "0",
};

export const useReceiptTotal = () => {
  const [list, setList] = useState(new Array(3).fill(defaultReceipt));

  const onChange = (index: number, value: {}) => {
    const items = [...list];
    items[index] = { ...items[index], ...value };
    setList(items);
  };

  const onChangeValue = (index: number, e: any) => {
    const value = e?.target?.textContent || null;
    if (value && !isNaN(value)) {
      onChange(index, { offerrt_value: +value });
    } else {
      // revert changes
      const oldValue = list[index].offerrt_value;
      onChange(index, { offerrt_value: oldValue });
      e.target.innerHTML = oldValue;
    }
  };

  const handleValueKeyDown = (index: number, e: any) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      // Enter
      onChangeValue(index, e);
      e.target.blur();
    } else if (e.keyCode === 27) {
      e.preventDefault();
      // Esc
      const oldValue = list[index].offerrt_value;
      onChange(index, { offerrt_value: oldValue });
      e.target.innerHTML = oldValue;
      e.target.blur();
    }
  };

  const onChangeText = (index: number, e: any) => {
    const value = e?.target?.textContent || null;
    onChange(index, { offerrt_text: value });
  };

  const handleTextKeyDown = (index: number, e: any) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      // Enter
      onChangeText(index, e);
      e.target.blur();
    } else if (e.keyCode === 27) {
      e.preventDefault();
      // Esc
      const oldValue = list[index].offerrt_text;
      onChange(index, { offerrt_text: oldValue });
      e.target.innerHTML = oldValue;
      e.target.blur();
    }
  };

  const add = () => {
    setList([...list, defaultReceipt]);
  };

  const remove = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const setExisting = (list: any[]) => {
    if (!list?.length) return;

    if (list.length >= 3) {
      setList(list);
    } else {
      setList([...list, ...new Array(3 - list.length).fill(defaultReceipt)]);
    }
  };

  return {
    list,
    setList: setExisting,
    add,
    remove,
    onChange,
    onChangeValue,
    handleValueKeyDown,
    onChangeText,
    handleTextKeyDown,
  };
};
