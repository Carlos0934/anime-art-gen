import classNames from "classnames";

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};
export function TextArea({ ...props }: TextAreaProps) {
  return (
    <label className="block ">
      <span className="text-sm font-semibold">{props.label}</span>
      <textarea
        {...props}
        className={classNames(
          "block w-full mt-2 px-3 py-2 border border-gray-300 rounded-sm",
          props.className
        )}
      />
    </label>
  );
}
