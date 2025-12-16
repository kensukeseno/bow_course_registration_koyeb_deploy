import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
export default function Header() {
  return (
    <>
      <div className="hidden md:block">
        <HeaderDesktop />
      </div>
      <div className="md:hidden">
        <HeaderMobile />
      </div>
    </>
  );
}
