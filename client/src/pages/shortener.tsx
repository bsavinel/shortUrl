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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			<div className="container mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
						Shortener
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Raccourcir vos liens n'as jamais été aussi facile.
					</p>
				</div>

				<div className="max-w-4xl mx-auto">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
								<div className="space-y-4">
									<h2 className="text-2xl font-semibold text-gray-800 mb-6">
										Raccourcir votre URL
									</h2>
									<div className="flex flex-col sm:flex-row gap-4 items-end">
										<FormField
											control={form.control}
											name="url"
											render={() => (
												<FormItem className="flex-1">
													<FormLabel />
													<FormControl>
														<FloatingLabelInput
															label="Votre URL ici"
															type="url"
															className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500"
															{...form.register(
																"url"
															)}
														/>
													</FormControl>
													<FormDescription />
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											type="submit"
											size="lg"
											className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
										>
											Raccourcir
										</Button>
									</div>
								</div>

								<div className="border-t border-gray-200 pt-8">
									<h3 className="text-lg font-semibold text-gray-700 mb-6">
										Paramètres d'expiration
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name="clickLimit"
											render={() => (
												<FormItem>
													<FormLabel className="text-sm font-medium text-gray-600 mb-2 block">
														Limite de clics
													</FormLabel>
													<FormControl>
														<FloatingLabelInput
															label="Choisir un nombre de clics"
															type="number"
															min="1"
															className="h-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
															{...form.register(
																"clickLimit"
															)}
														/>
													</FormControl>
													<FormDescription className="text-xs text-gray-500">
														Le lien sera désactivé
														après ce nombre
														d'utilisations
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="expirationDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-sm font-medium text-gray-600 mb-2 block">
														Date limite
													</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={
																		"outline"
																	}
																	className={cn(
																		"h-12 w-full",
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
																			Choisir
																			une
																			date
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
																	formatDay: (
																		date
																	) =>
																		format(
																			date,
																			"dd"
																		),
																}}
																selected={
																	field.value
																}
																onSelect={
																	field.onChange
																}
															/>
														</PopoverContent>
													</Popover>
													<FormDescription className="text-xs text-gray-500">
														Le lien sera désactivé
														après cette date
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</form>
						</Form>
					</div>
				</div>
				{shortUrl && (
					<div className="max-w-4xl mx-auto mt-8">
						<div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
							<div className="flex flex-col sm:flex-row items-center gap-4">
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-green-800 mb-2">
										Votre URL raccourci a été créée avec
										succès !
									</h3>
									<div className="bg-white rounded-lg p-4 border border-green-200">
										<p className="text-sm text-gray-600 mb-1">
											Votre lien :
										</p>
										<div className="flex flex-row items-center justify-center gap-4">
											<p className="text-lg font-mono text-green-700 break-all">
												{clientUrl}/{shortUrl}
											</p>
											<CopyButton
												content={`${clientUrl}/${shortUrl}`}
												className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="fixed inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 "></div>
				<div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
			</div>
		</div>
	);
}

export default Shortener;
