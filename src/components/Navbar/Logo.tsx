import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../useTranslation";

const Logo = () => {
  const { lang } = useTranslation();
  return (
    <>
      <Link href={`/${lang}`}>
        <div className="w-20 md:w-32">
          <Image
            src={`/${lang}/inworlds.png`}
            alt="logo"
            width={1231}
            height={280}
            style={{ objectFit: "cover" }}
          />
        </div>
      </Link>
    </>
  );
};
export default Logo;
