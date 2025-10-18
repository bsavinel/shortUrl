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

const formSchema = z.object({
	url: z.string(),
});

const urlApi = import.meta.env.VITE_SERVER_URL;
const clientUrl = import.meta.env.VITE_CLIENT_URL;

function Shortener() {
	const [shortUrl, setShortUrl] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			url: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const response = await fetch(`${urlApi}/url`, {
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: data.url }),
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
				</form>
			</Form>
			{shortUrl && <p>Short URL: {clientUrl}/{shortUrl}</p>}
		</div>
	);
}

export default Shortener;
