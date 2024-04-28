import classNames from "classnames";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: readonly string[];
  getValue?: (value: string) => string | number;
};
export function Select({ options, getValue, ...props }: SelectProps) {
  return (
    <label className="block ">
      <span className="text-sm font-semibold">{props.label}</span>
      <select
        {...props}
        className={classNames(
          " block w-full mt-2 px-2  py-2.5 border border-gray-300 rounded-sm",
          props.className
        )}
      >
        {options.map((option) => (
          <option key={option} value={getValue ? getValue(option) : option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
