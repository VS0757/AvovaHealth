import FeatherIcon from "feather-icons-react";

type ButtonProps = {
  label: string;
  icon?: string;
  onClick?: () => void;
  inverse?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  inverse,
  ...buttonProps
}) => {
  const normalColors =
    "bg-white border dark:bg-stone-950 dark:border-stone-800";
  const inverseColors =
    "bg-stone-950 border border-stone-800 dark:bg-stone-50 dark:border-stone-100 text-stone-100 dark:text-stone-800";

  let colors = normalColors;
  if (inverse) {
    colors = inverseColors;
  }

  return (
    <button
      className={`max-w-fit flex flex-row items-center rounded-full px-4 py-2 text-xs ${colors}`}
      {...buttonProps}
    >
      {icon && <FeatherIcon icon={icon} className="h-4 w-4 mr-2" />}{" "}
      {/* Ensuring proper styling and spacing for icon */}
      {label}
    </button>
  );
};

export default Button;
