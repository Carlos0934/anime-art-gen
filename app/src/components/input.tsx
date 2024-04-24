import classNames from "classnames";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ ...props }: InputProps) {
  return (
    <label className="block ">
      <span className="font-semibold text-sm">{props.label}</span>
      <input
        {...props}
        className={classNames(
          "block w-full mt-2 px-3 py-2 border border-gray-300 rounded-sm",
          props.className
        )}
      />
    </label>
  );
}
