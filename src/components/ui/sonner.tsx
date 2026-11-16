import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!rounded-none group-[.toaster]:!border-[3px] group-[.toaster]:!border-[var(--nb-ink)] group-[.toaster]:!bg-card group-[.toaster]:!font-bold group-[.toaster]:!text-card-foreground group-[.toaster]:!shadow-[5px_5px_0_0_var(--nb-ink)]",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
