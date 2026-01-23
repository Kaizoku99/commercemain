import clsx from "clsx";
import Price from "./price";

const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
  isATPMember = false,
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
  isATPMember?: boolean;
}) => {
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label",
        {
          "lg:px-20 lg:pb-[35%]": position === "center",
        }
      )}
    >
      <div
        className={clsx(
          "flex items-center rounded-full border p-1 text-xs font-semibold backdrop-blur-md transition-all duration-300 w-full max-w-full",
          {
            "bg-atp-gold/90 border-atp-gold text-atp-black": isATPMember,
            "bg-atp-white/90 border-atp-light-gray text-atp-black":
              !isATPMember,
          }
        )}
      >
        <h3 className="mr-4 grow pl-2 leading-none tracking-tight text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </h3>
        <Price
          className={clsx(
            "flex-none rounded-full p-2 text-white font-semibold text-xs",
            {
              "bg-atp-black": isATPMember,
              "bg-atp-charcoal": !isATPMember,
            }
          )}
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
