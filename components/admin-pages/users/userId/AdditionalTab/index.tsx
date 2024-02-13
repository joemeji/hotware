import { cn } from '@/lib/utils';
import * as Tabs from '@radix-ui/react-tabs';
import { memo, useEffect, useState } from "react"
import ObjectiveTab from './ObjectiveTab';
import HobbyTab from './HobbyTab';
import ReferenceTab from './ReferenceTab';
import EducationalTab from './EducationalTab';

function FamilyTabs(props: FamilyTabsProps) {
  const { user } = props;
  const [activeTab, setActiveTab] = useState('objective');

  function onClickTab(tab: any) {
    setActiveTab(tab);
  }

  return (
    <div className="bg-stone-100 p-2 w-full rounded">
      <Tabs.Root defaultValue="objective" orientation="horizontal" onValueChange={(e: any) => onClickTab(e)}>
        <Tabs.List aria-label="tabs" className='flex py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1'>
          <Tabs.Trigger value="objective" className={cn(activeTab === "objective" ? "bg-stone-600 text-stone-200 py-1.5 px-4 rounded-xl text-sm font-medium" : "bg-stone-100 hover:bg-stone-600 hover:text-stone-200 py-1.5 px-4 rounded-xl text-stone-600 text-sm font-medium")}>Objective</Tabs.Trigger>
          <Tabs.Trigger value="hobbies" className={cn(activeTab === "hobbies" ? "bg-stone-600 text-stone-200 py-1.5 px-4 rounded-xl text-sm font-medium" : "bg-stone-100 hover:bg-stone-600 hover:text-stone-200 py-1.5 px-4 rounded-xl text-stone-600 text-sm font-medium")}>Hobbies</Tabs.Trigger>
          <Tabs.Trigger value="references" className={cn(activeTab === "references" ? "bg-stone-600 text-stone-200 py-1.5 px-4 rounded-xl text-sm font-medium" : "bg-stone-100 hover:bg-stone-600 hover:text-stone-200 py-1.5 px-4 rounded-xl text-stone-600 text-sm font-medium")}>References</Tabs.Trigger>
          <Tabs.Trigger value="educational" className={cn(activeTab === "educational" ? "bg-stone-600 text-stone-200 py-1.5 px-4 rounded-xl text-sm font-medium" : "bg-stone-100 hover:bg-stone-600 hover:text-stone-200 py-1.5 px-4 rounded-xl text-stone-600 text-sm font-medium")}>Educational Background</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="objective">
          <ObjectiveTab
            activeTab={activeTab === "objective" ? true : false}
            user={user}
          />
        </Tabs.Content>
        <Tabs.Content value="hobbies">
          <HobbyTab
            activeTab={activeTab === "hobbies" ? true : false}
            user={user}
          />
        </Tabs.Content>
        <Tabs.Content value="references">
          <ReferenceTab
            activeTab={activeTab === "references" ? true : false}
            user={user}
          />
        </Tabs.Content>
        <Tabs.Content value="educational">
          <EducationalTab
            activeTab={activeTab === "educational" ? true : false}
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