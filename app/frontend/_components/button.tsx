import FeatherIcon from "feather-icons-react";

type ButtonProps = {
  label: string;
  icon?: string;
};

export default function Button(props: ButtonProps, ...buttonProps: any) {
  return (
    <button
      className="flex flex-row items-center rounded-lg border bg-white px-4 py-2 text-xs dark:border-stone-800 dark:bg-stone-950"
      {...buttonProps}
    >
      {props.icon && <FeatherIcon icon={props.icon} className="h-4" />}
      {props.label}
    </button>
  );
}
