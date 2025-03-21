import styles from "./topmenu.module.css";
import Link from "next/link";

export default function TopMenuItem({
  title,
  pageRef,
  className,
}: {
  title: string;
  pageRef: string;
  className:string;
}) {
  return (
    <Link href={pageRef} className={className}>
      {title}
    </Link>
  );
}
