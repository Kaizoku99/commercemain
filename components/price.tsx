import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import {
  UAE_DIRHAM_CODE,
  UAE_DIRHAM_SYMBOL,
} from "@/lib/constants";
import { DirhamSymbol } from "@/components/icons/dirham-symbol";
import { isValidPrice } from "@/lib/price-utils";

const Price = ({
  amount,
  className,
  currencyCode = UAE_DIRHAM_CODE,
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => {
  // For UAE Dirham, use custom formatting with official symbol only
  if (currencyCode === UAE_DIRHAM_CODE) {
    const price = parseFloat(amount);
    
    // Handle invalid amounts
    if (!isValidPrice(amount)) {
      return (
        <p suppressHydrationWarning={true} className={twMerge("text-xs flex items-center gap-1", className)}>
          <DirhamSymbol className="flex-shrink-0 w-[1em] h-[1em] text-current" />
          <span>0.00</span>
        </p>
      );
    }
    
    const formattedNumber = new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
    
    return (
      <p suppressHydrationWarning={true} className={twMerge("text-xs flex items-center gap-1", className)}>
        <DirhamSymbol className="flex-shrink-0 w-[1em] h-[1em] text-current" />
        <span>{formattedNumber}</span>
      </p>
    );
  }

  // Fallback to standard formatting for other currencies
  return (
    <p suppressHydrationWarning={true} className={twMerge("text-xs", className)}>
      {`${new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "narrowSymbol",
      }).format(parseFloat(amount))}`}
      <span
        className={clsx("ml-1 inline", currencyCodeClassName)}
      >{`${currencyCode}`}</span>
    </p>
  );
};

export default Price;
