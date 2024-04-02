import FeatherIcon from "feather-icons-react";

export default function Button({
  icon,
  label,
  className,
  ...buttonProps
}: any) {
  return (
    <button
      className={`flex flex-row items-center justify-center rounded-md bg-stone-950 px-4 py-2 text-stone-50 dark:bg-stone-50 dark:text-stone-950 ${className}`}
      {...buttonProps}
    >
      <FeatherIcon icon={icon} className="h-4" />
      {label}
    </button>
  );
}
