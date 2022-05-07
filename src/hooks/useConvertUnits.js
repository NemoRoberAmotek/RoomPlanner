import convert from "convert-units";

const useConvertUnits = (units) => {
  const convertUnitsToString = (number) => {
    if (units === "metric") {
      const value = convert(number).from("cm").to("m").toFixed(2);
      return `${value}m`;
    } else {
      const value = convert(number).from("cm").to("ft-us").toFixed(2);

      return `${value}ft`;
    }
  };

  const convertUnits = (number, from, to) => {
    if (from === to) {
      return number;
    } else {
      let fromUnit, toUnit;
      if (from === "metric") {
        fromUnit = "cm";
      } else {
        fromUnit = "ft-us";
      }
      if (to === "metric") {
        toUnit = "cm";
      } else {
        toUnit = "ft-us";
      }

      let value = convert(number).from(fromUnit).to(toUnit);

      if (toUnit === "cm") {
        value = parseFloat(value.toFixed(2));
      } else {
        value = parseFloat(value.toFixed(2));
      }

      return value;
    }
  };

  const getUnitName = () => {
    if (units === "metric") {
      return "cm";
    } else {
      return "ft";
    }
  };

  return { convertUnitsToString, convertUnits, getUnitName };
};

export default useConvertUnits;
