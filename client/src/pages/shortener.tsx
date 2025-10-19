import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloatingLabelInput } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { CopyButton } from "../components/ui/shadcn-io/copy-button";
import { Calendar } from "../components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
	url: z.string(),
	clickLimit: z.coerce.number().optional(),
	expirationDate: z.date().optional(),
});

const urlApi = import.meta.env.VITE_SERVER_URL;
const clientUrl = import.meta.env.VITE_CLIENT_URL;

function Shortener() {
	const [shortUrl, setShortUrl] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			url: "",
			clickLimit: undefined,
			expirationDate: undefined,
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const response = await fetch(`${urlApi}/url`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				url: data.url,
				clickLimit: data.clickLimit,
				expirationDate: data.expirationDate,
			}),
		});
		const responseData = await response.json();
		if (response.ok) {
			setShortUrl(responseData.shortUrl);
		} else {
			console.error("Failed to create short URL");
		}
	};

	return (
		<div className="flex items-center flex-col justify-center">
			<h1>Shortener</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col items-center gap-2">
						<div className="flex flex-row items-center w-full gap-2">
							<FormField
								control={form.control}
								name="url"
								render={() => (
									<FormItem>
										<FormLabel />
										<FormControl>
											<FloatingLabelInput
												label="URL"
												type="url"
												className="md:min-w-96"
												{...form.register("url")}
											/>
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Generer</Button>
						</div>
						<div className="flex flex-row items-center gap-2">
							<FormField
								control={form.control}
								name="clickLimit"
								render={() => (
									<FormItem>
										<FormLabel />
										<FormControl>
											<FloatingLabelInput
												label="Limite de clics"
												type="number"
												min="1"
												className="min-w-32 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
												{...form.register("clickLimit")}
											/>
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="expirationDate"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel></FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"text-left font-normal",
															!field.value &&
																"text-muted-foreground"
														)}
													>
														{field.value ? (
															format(
																field.value,
																"dd/MM/yyyy"
															)
														) : (
															<span>
																Date
																d'expiration
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<Calendar
													mode="single"
													formatters={{
														formatDay: (date) =>
															format(date, "dd"),
													}}
													selected={field.value}
													onSelect={field.onChange}
												/>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</form>
			</Form>
			{shortUrl && (
				<div className="flex flex-row items-center gap-2">
					<p className="text-sm text-gray-500">
						Short URL: {clientUrl}/{shortUrl}
					</p>
					<CopyButton content={`${clientUrl}/${shortUrl}`} />
				</div>
			)}
		</div>
	);
}

export default Shortener;
