import styles from "./topmenu.module.css";
import Link from "next/link";

export default function TopMenuItem({
  title,
  pageRef,
  className,
  onClick
}: {
  title: string;
  pageRef: string;
  className:string;
  onClick?:() => void;
}) {
  return (
    <Link href={pageRef} className={className} onClick={onClick}>
      {title}
    </Link>
  );
}
