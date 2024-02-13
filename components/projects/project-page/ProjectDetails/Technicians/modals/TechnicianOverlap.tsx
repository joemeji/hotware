import { TD, TH } from "@/components/items";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import useSWR, { mutate } from "swr";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

export const TechnicianOverlap = (props: TechnicianOverlap) => {
  const { data: session }: any = useSession();
  const { open, onOpenChange, projects, onSuccess } = props;

  const handleCancel = () => {
    onSuccess && onSuccess(false);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleContinue = async () => {
    try {
      onSuccess && onSuccess(true);
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch { }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Existing Technicians?</AlertDialogTitle>
          <AlertDialogDescription>
            <table className="w-full">
              <thead>
                <tr>
                  <TH className="ps-4 font-medium w-[70px]">Project #</TH>
                </tr>
              </thead>
              <tbody>
                {projects && projects.map((project: any, key: number) => (
                  <tr key={key}>
                    <TD>
                      <Link href={`/projects/${project._project_id}`} target="_blank">
                        <p className="py-1 hover:underline hover:underline-offset-1">
                          {project.project_number}
                        </p>
                      </Link>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type TechnicianOverlap = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  projects?: any;
  onSuccess?: (success: boolean) => void;
};
