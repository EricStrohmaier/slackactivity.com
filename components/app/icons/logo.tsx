import Image from "next/image";

const Logo = (props: { width: string; height: string }) => {
  return (
    <Image
      src="/logo.png"
      alt="logo"
      width={props.width ? parseInt(props.width) : 64}
      height={props.height ? parseInt(props.height) : 64}
      className="rounded-full"
    />
  );
};

export default Logo;
