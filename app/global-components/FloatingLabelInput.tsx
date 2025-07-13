export interface FloatingLabelInputProps {
  label: string;
  value?: string;
  type?: "text" | "email" | "password" | "number" | "date" | "tel" | "url";
  props?: any;
}

export default function FloatingLabelInput({
  //MIGHTDO make this a generic component, Implement variations from flowbite + color variations
  label,
  value,
  type,
  ...props
}: FloatingLabelInputProps) {
  return (
    <>
      <div className="relative">
        <input
          type={type}
          id={label.toLowerCase() + "Input"}
          className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer"
          placeholder=""
          value={value}
          {...props}
        />
        <label
          htmlFor={label.toLowerCase() + "Input"}
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {label}
        </label>
      </div>
    </>
  );
}
