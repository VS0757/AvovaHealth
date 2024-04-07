import FeatherIcon from "feather-icons-react";

type ButtonProps = {
  label: string;
  icon?: string;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ icon, label, ...buttonProps }) => {
  return (
    <button
      className="flex flex-row items-center rounded-lg border bg-white px-4 py-2 text-xs dark:border-stone-800 dark:bg-stone-950"
      {...buttonProps}
    >
      {icon && <FeatherIcon icon={icon} className="h-4 w-4 mr-2" />} {/* Ensuring proper styling and spacing for icon */}
      {label}
    </button>
  );
};

export default Button;
