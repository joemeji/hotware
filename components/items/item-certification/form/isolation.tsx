import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Isolation({ isolationValues, onChangeIsolationValues }: any) {

  const onChangeInput = (e: any, name: string) => {
    const _isolationValues = { ...isolationValues };
    _isolationValues[name] = e.target.value;
    onChangeIsolationValues && onChangeIsolationValues(_isolationValues);
  };

  return (
    <div className="mx-auto w-full max-w-[700px] border border-stone-100 rounded-xl">
      <span className="flex justify-center border-b border-b-stone-100 font-medium py-3">
        Isolation, Resistance to Earth
      </span>
      <div className="p-4">
        <div className="mb-4">
          <label className="text-sm mb-1 flex text-stone-400">Measurement Voltage</label>
          <Input className="bg-stone-50 border border-stone-100"
            value={isolationValues.form_isolation_voltage || ''}
            onChange={(e: any) => onChangeInput(e, 'form_isolation_voltage')}
          />
        </div>
        <div className="flex gap-3 mb-4">
          <div className="w-1/2">
            <label className="text-sm mb-1 flex text-stone-400">Minimum acceptable resistance</label>
            <Input className="bg-stone-50 border border-stone-100" 
              value={isolationValues.form_isolation_resistance || ''}
              onChange={(e: any) => onChangeInput(e, 'form_isolation_resistance')}
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm mb-1 flex text-stone-400">Tested with Device</label>
            <Input className="bg-stone-50 border border-stone-100" 
              value={isolationValues.form_isolation_device || ''}
              onChange={(e: any) => onChangeInput(e, 'form_isolation_device')}
            />
          </div>
        </div>
        <div className="flex gap-3 mb-4">
          <div className="w-1/3">
            <label className="text-sm mb-1 flex text-stone-400">L1 (MΩ)</label>
            <Input className="bg-stone-50 border border-stone-100" 
              value={isolationValues.form_isolation_l1 || ''}
              onChange={(e: any) => onChangeInput(e, 'form_isolation_l1')}
            />
          </div>
          <div className="w-1/3">
            <label className="text-sm mb-1 flex text-stone-400">L2 (MΩ)</label>
            <Input className="bg-stone-50 border border-stone-100" 
              value={isolationValues.form_isolation_l2 || ''}
              onChange={(e: any) => onChangeInput(e, 'form_isolation_l2')}
            />
          </div>
          <div className="w-1/3">
            <label className="text-sm mb-1 flex text-stone-400">L3 (MΩ)</label>
            <Input className="bg-stone-50 border border-stone-100" 
              value={isolationValues.form_isolation_l3 || ''}
              onChange={(e: any) => onChangeInput(e, 'form_isolation_l3')}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm mb-1 flex text-stone-400">Remarks</label>
          <Textarea className="bg-stone-50 border border-stone-100" 
            value={isolationValues.form_isolation_remarks || ''}
            onChange={(e: any) => onChangeInput(e, 'form_isolation_remarks')}
          />
        </div>
        <div className="mb-4">
          <label className="text-sm mb-1 flex text-stone-400">Function and Safety of device without defect/fault</label>
          <div className="flex gap-2">
          {['ok', 'fail', 'n/a'].map((btn: any, key3: number) => (
            <button 
              key={key3} 
              className={cn(
                "bg-stone-100 rounded-xl px-3 py-1 flex items-center gap-2 cursor-pointer",
                "hover:bg-stone-200",
                isolationValues.form_isolation_function_safety === btn && 'bg-blue-500 hover:bg-blue-500 text-white'
              )}
              onClick={() => {
                const _isolationValues = { ...isolationValues };
                if (_isolationValues.form_isolation_function_safety === btn) {
                  _isolationValues.form_isolation_function_safety = null;
                } else {
                  _isolationValues.form_isolation_function_safety = btn;
                }
                onChangeIsolationValues && onChangeIsolationValues(_isolationValues);
              }}
            >
              <span className="uppercase text-sm">{btn}</span>
            </button>
          ))}
      </div>
        </div>
      </div>
    </div>
  );
}