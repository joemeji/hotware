import React, { memo, useState } from "react";
import Base from "./base";
import { Button } from "@/components/ui/button";

const ModalCmsSelect = () => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Base open={open} onOpenChange={(open: any) => setOpen(open)} />
    </React.Fragment>
  );
};

export default memo(ModalCmsSelect);
