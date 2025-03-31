import MainLayout from "@/components/layouts/MainLayout";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function Home() {
  return (
		<MainLayout>
			<HeroGeometric 
				badge="Savannah Informatics"
				title1="Secure & Organized "
				title2="Photo collections" 
			/>
		</MainLayout>
  );
}