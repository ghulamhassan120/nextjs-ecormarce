import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {cn} from '../../lib/utils'
const ButtonLoading = ({
  type,
  text,
  loading,
  className,
  onclick,
  ...props
}) => {
  return (
    <Button
      type={type}
      disabled={loading}
      className={cn("", className)}
      onClick={onclick}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {text}
    </Button>
  );
};

export default ButtonLoading;
