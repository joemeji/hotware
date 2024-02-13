import { cn } from '@/lib/utils';
import * as Tabs from '@radix-ui/react-tabs';
import { memo, useEffect, useState } from "react"
import SpouseTab from './SpouseTab';
import ChildrenTab from './ChildrenTab';
import ParentTab from './ParentTab';

function FamilyTabs(props: FamilyTabsProps) {
  const { user } = props;
  const [activeTab, setActiveTab] = useState('spouse');

  function onClickTab(tab: any) {
    console.log({ tab: tab });
    setActiveTab(tab);
  }

  return (
    <div className="bg-stone-100 p-2 w-full rounded">
      <Tabs.Root defaultValue="spouse" orientation="horizontal" onValueChange={(e: any) => onClickTab(e)}>
        <Tabs.List aria-label="tabs" className='flex py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1'>
          <Tabs.Trigger value="spouse" className={cn(activeTab === "spouse" ? "bg-stone-600 text-stone-200 py-1.5 px-4 rounded-xl text-sm font-medium" : "bg-stone-100 hover:bg-stone-600 hover:text-stone-200 py-1.5 px-4 rounded-xl text-stone-600 text-sm font-medium")}>Spouse</Tabs.Trigger>
          <Tabs.Trigger value="children" className={cn(activeTab === "children" ? "bg-stone-600 text-stone-200 py-1.5 px-4 rounded-xl text-sm font-medium" : "bg-stone-100 hover:bg-stone-600 hover:text-stone-200 py-1.5 px-4 rounded-xl text-stone-600 text-sm font-medium")}>Children</Tabs.Trigger>
          <Tabs.Trigger value="parents" className={cn(activeTab === "parents" ? "bg-stone-600 text-stone-200 py-1.5 px-4 rounded-xl text-sm font-medium" : "bg-stone-100 hover:bg-stone-600 hover:text-stone-200 py-1.5 px-4 rounded-xl text-stone-600 text-sm font-medium")}>Parents</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="spouse">
          <SpouseTab
            activeTab={activeTab === "spouse" ? true : false}
            user={user}
          />
        </Tabs.Content>
        <Tabs.Content value="children">
          <ChildrenTab
            activeTab={activeTab === "children" ? true : false}
            user={user}
          />
        </Tabs.Content>
        <Tabs.Content value="parents">
          <ParentTab
            activeTab={activeTab === "parents" ? true : false}
            user={user}
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

export default memo(FamilyTabs);

type FamilyTabsProps = {
  user?: any
}