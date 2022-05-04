import convert from "convert-units";

const useConvertUnits = (units) => {
  const convertUnits = (number) => {
    if (units === "metric") {
      const value = convert(number).from("cm").to("m").toFixed(2);
      return `${value}m`;
    } else {
      const value = convert(number).from("cm").to("ft-us").toFixed(2);

      return `${value}ft`;
    }
  };

  return convertUnits;
};

export default useConvertUnits;
