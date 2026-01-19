import { Container } from "@/components/layout/container";

export function FullPageLoader() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
			<Container>
				<div className="flex flex-col items-center justify-center gap-4 text-center text-slate-100">
					<div className="flex items-center gap-2">
						<span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.2s]" />
						<span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-300 [animation-delay:-0.1s]" />
						<span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-200" />
					</div>
					<p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-100">
						Loading Himexplore
					</p>
					<p className="max-w-xs text-[11px] text-slate-300">
						Pulling fresh trips, stays and reviews for you. This usually takes just a moment.
					</p>
				</div>
			</Container>
		</div>
	);
}
