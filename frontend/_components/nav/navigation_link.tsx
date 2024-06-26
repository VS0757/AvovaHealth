import Link from "next/link";
import FeatherIcon from "feather-icons-react";

type NavigationLinkProps = {
  label: string;
  href: string;
  icon: string;
  active: boolean;
  small: boolean;
};

export default function NavigationLink(props: NavigationLinkProps) {
  let classname = "flex flex-row items-center gap-2 py-2 text-sm min-h-9";
  let active = "text-[#E05767]";

  if (props.active) {
    classname = classname + " " + active;
  }

  return (
    <a href={props.href} className={`${classname}`}>
      <FeatherIcon icon={props.icon} className="h-4" />
      {props.small ? "" : props.label}
    </a>
  );
}
