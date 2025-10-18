import * as React from "react";

import { cn } from "../../lib/utils";
import { Label } from "./label";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className
			)}
			{...props}
		/>
	);
}

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		return (
			<Input
				placeholder=" "
				className={cn("peer", className)}
				ref={ref}
				{...props}
			/>
		);
	}
);
FloatingInput.displayName = "FloatingInput";

const FloatingLabel = React.forwardRef<
	React.ElementRef<typeof Label>,
	React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
	return (
		<Label
			className={cn(
				"peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-muted-foreground duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:text-primary peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 cursor-text",
				className
			)}
			ref={ref}
			{...props}
		/>
	);
});
FloatingLabel.displayName = "FloatingLabel";

type FloatingLabelInputProps = InputProps & {
	label?: string;
	labelClassName?: string;
};

const FloatingLabelInput = React.forwardRef<
	React.ElementRef<typeof FloatingInput>,
	React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, labelClassName, className, ...props }, ref) => {
	return (
		<div className="relative">
			<FloatingInput ref={ref} id={id} className={className} {...props} />
			<FloatingLabel htmlFor={id} className={labelClassName}>
				{label}
			</FloatingLabel>
		</div>
	);
});
FloatingLabelInput.displayName = "FloatingLabelInput";

export { Input, FloatingInput, FloatingLabel, FloatingLabelInput };
