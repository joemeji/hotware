import { memo } from "react";
import { TD, TH, archiveHeadings } from "../..";
import { fetcher } from "@/utils/api.config";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

const SettingsTaskList = () => {
  const listUrl = `/api/project/task/archives`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const archives = data?.archive_tasks;

  return (
    <div className='grid bg-white'>
      <div className='p-3'>
        <div className='min-h-full'>
          <table className='w-full rounded-sm overflow-hidden p-5'>
            <thead>
              <tr className='uppercase text-center'>
                {archiveHeadings.map((heading: any, i: any) => {
                  return (
                    <TH key={i} className={heading?.class}>
                      {heading?.name}
                    </TH>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {archives &&
                archives.length > 0 &&
                archives.map((task: any, i: number) => {
                  return (
                    <tr key={i} className='text-center &_td:border-r'>
                      <TD>{task.task_name}</TD>
                      <TD>{task.task_description}</TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && archives?.length == 0 && (
            <div className='text-center max-w-full p-5'>No records found</div>
          )}

          {isLoading && <Loader2 className='animate-spin mx-auto m-5' />}
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsTaskList);
