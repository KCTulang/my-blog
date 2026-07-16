import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "./index";
import { comments, posts, user } from "./schema";

async function main() {
	console.log("Seeding database...");

	try {
		const existingAdmin = await db.query.user.findFirst({
			where: eq(user.email, "admin@loonary.com"),
		});

		if (!existingAdmin) {
			console.log("Seeding Admin User...");
			const password = process.env.ADMIN_PASSWORD || "LoonaryAdmin888";
			await auth.api.signUpEmail({
				body: {
					email: "admin@loonary.com",
					password: password,
					name: "Admin",
				},
			});
			console.log("Admin User seeded successfully.");
		} else {
			console.log("Admin User already exists. Skipping.");
		}

		const insertedPosts = await db
			.insert(posts)
			.values([
				{
					title: "Cybersecurity Webinar Re: Zero Trust",
					slug: "cybersecurity-webinar-re-zero-trust",
					body: '<p>The foundational premise of modern cybersecurity is acknowledging a hard reality: absolute security simply does not exist. As a developer focused on crafting intuitive frontends, it’s dangerously easy to treat security like an afterthought, a problem for the backend team to solve while I perfect the user interface. But attending the "Beyond Perimeter Security: Navigating Professional Accountability, Compliance, and Ethics in a Zero Trust World" webinar completely shattered that illusion.</p><p>Hearing directly from Mr. Jonnifer C. Mandigma, a Google Certified Cybersecurity expert and our own CCIS faculty, felt less like a standard academic lecture and more like a professional wake-up call. When he broke down the "Three Architectural Pillars" of Zero Trust, Explicit Verification, Least Privilege, and Assume Breach, the concepts finally clicked for me. Security isn\'t just an invisible wall we build around an application; it\'s a foundational social contract. Writing clean, accessible code is just the baseline. Ensuring the systems we build are actually secure is an ethical promise we make to the society relying on our creations.</p><p>The technical deep dives into the "Principle of Least Privilege" and "Just-In-Time" credentials highlighted the intense precision required in modern engineering. It fundamentally changed how I view my own projects. When I’m designing high-fidelity prototypes or mapping out data flows, I now realize the weight of the "Secure Coding Manifesto." We can never trust implicit boundaries; we have to authenticate inputs recursively, right from the interface layers I spend so much time building. Furthermore, the push for "Compliance as Code" proved that these ethical guidelines aren\'t just theoretical aspirations for management, they are hardcoded realities we must implement.</p><p>Tracing the "Zero Trust Maturity Journey" provided a clear roadmap of where our industry is headed, but the closing remarks are what will stick with me the most. Compliance with data privacy laws isn\'t a paperwork chore; it is a programmatic duty that lives in the very lines of code we write. I am walking away from this experience ready to challenge my own architectural assumptions and ensure my work reflects both technical competence and a genuine commitment to protecting user sovereignty.</p>',
					tags: ["cybersecurity", "ethics", "zero-trust"],
					published: true,
				},
				{
					title:
						"“Walang Rape sa Bontok” Understanding Indigenous Cultural Norms",
					slug: "walang-rape-sa-bontok",
					body: '<p>“Is a rapeless society a reality—or merely a hope we keep chasing?”</p><p>Does a society genuinely exist that lacks both the concept of rape and the reality of it? This is the question that keeps intriguing my mind as I start to watch the video. The documentary “Walang Rape sa Bontok” presents an unsettling yet hopeful question: Can a society really exist without rape, even the concept of it? In exploring the cultural life of the Bontok people of the Cordillera, the documentary challenges the deep assumption that sexual violence is a universal problem for all humans. This possibility lingers in my mind because not only is it unbelievable, but also because it opens the topic of the cultural, social, and historical roots of violence in our own society, and if a rapeless society exists, how? It forces us to confront a critical inquiry: Is a rapeless society a tangible reality, or is it merely a hope we keep chasing?</p><p>The documentary answers the first part of this inquiry with a definitive "yes." From the perspective of anthropology set in a traditional Bontok community, the film demonstrates that not only is it possible to achieve a world free of sexual violence today, but that such a world has already existed and been written into history. And this wasn\'t achieved with modern police forces, technology-based surveillance, or draconian laws; it was done within a cultural ecosystem of mutual respect and deep spiritual engagement. The movie underscores the concept of Inayan, as a culture that a good person will hold and suppress his desire to do evil due to fear in spirit and community. In this reality, women were not seen as objects of desire but as critical economic factors feeding the community through agriculture. To harm a woman was not simply a crime; it was a blow to the village itself.</p><p>Furthermore, the documentary dismantles the modern excuse that rape is a biological inevitability. A common defense in contemporary discourse is the notion that men are "sexual animals" incapable of controlling their urges. The history of Bontok proves this false. The men of the traditional Ato (council house) were warriors with physical prowess, yet they possessed a disciplined masculinity that viewed the protection of women as a badge of honor. They lived in a society without locks on their doors and where women slept in the Olog (dormitory) without fear. This stark contrast forces us to realize that the sexual violence we see today is not a biological mandate, but a cultural failure. It affirms that rape truly exists because of rapists and the "rape culture" that emboldens them, never because of the victims. In our current world, victims are often treated like suspects, judged for their clothes or actions, but the documentary exposes this lie. It shows that violence is not a reaction to what a woman wears, but the result of a "dirty mind" and a society that has lost the discipline to curb it.</p><p>However, the film also serves as a tragic cautionary tale, showing how this "reality" has slowly transformed into a "hope" we are now struggling to chase. As the documentary traces the entry of "civilization", roads, foreign media, alcohol, and the dismantling of communal structures, it shows how the rapeless reality began to fade. The shift from the communal Ato and Olog to the isolated, nuclear family structure destroyed the village\'s system of checks and balances. Privacy replaced transparency, and in the shadows of modern houses, abuse began to fester. This transition suggests that what we call "progress" often comes at the cost of our humanity.</p><p>So, is a rapeless society a reality or a hope? The answer becomes deeply personal. I admit that when I read the title, I was scared. The topic is often untouchable for me and horrifies me, not because I want to ignore the issue, but because the subject is deeply personal and carries a weight that is difficult to face and confront. Yet, this documentary transforms that fear into something else. It reveals that a rapeless world is a proven reality that has become a necessary hope. It is a reality because the Bontok elders lived it, proving that human beings are capable of a violence-free existence. But for us today, it is a hope we must chase. We are not chasing a fantasy; we are chasing a version of humanity that we lost. Knowing that this safety is possible makes the chase not only worth it, but imperative for our survival.</p>',
					tags: ["culture", "society", "documentary"],
					published: true,
				},
				{
					title:
						"Beyond the Algorithm: The Ecological and Cognitive Costs of AI",
					slug: "beyond-the-algorithm",
					body: "<p>The rapid advancement of Artificial Intelligence (AI) represents a groundbreaking transformation across all sectors, particularly in education.</p><p>On February 19, 2026, I attended the PSUCCESS Technological Revolution in Education conference. This event provided a valuable platform to gather insights from educators and practitioners who leverage AI as a strategic tool in the academic landscape.</p><p>In my own coursework and system development, I frequently utilize AI to refine my outputs, structure complex documents, and optimize my workflow. However, this conference highlighted a dichotomy that leaves me conflicted: while AI significantly enhances task efficiency and user productivity, its environmental footprint remains an unsettling and often overlooked concern. During the event, CHED Commissioner Dr. Michelle Aguilar-Ong offered profound perspectives on the current educational landscape. Her humility in deferring technical AI questions to a guest educator from India, who utilizes AI for anti-cheating examination protocols, was particularly striking.</p><p>Although I did not catch his name, his insights resonated deeply. He framed AI not just in terms of environmental sustainability, but as a mechanism for sustaining human time and effort. I agree with his premise that, much like globalization, the widespread integration of AI is inevitable. We must learn to use it strategically; failing to understand its mechanisms and weaknesses risks professional obsolescence in an increasingly automated world.</p><p>Nevertheless, the ecological implications of massive AI adoption remain a vital concern. While some AI infrastructure utilizes renewable energy, the sheer computational demand generated by everyday queries is staggering. History has already shown us the environmental toll exacted by rapid industrialization and globalization; we must take proactive measures to ensure AI does not follow the same destructive path. Since we cannot halt its adoption, the tech community's focus must urgently shift toward engineering greener, more sustainable AI models.</p><p>Just as we must address the hidden environmental costs of AI on a global scale, I realized I must also confront its hidden cognitive costs on a personal one. Ultimately, this conference catalyzed a critical evaluation of my own AI consumption. While these tools undeniably aid my academic tasks, I must weigh their risks: the potential erosion of my foundational skills as a computer science student and the compromise of my data privacy. Moving forward, my goal is to manage my AI usage more deliberately, extracting its benefits without diminishing my own analytical capabilities. AI is a powerful instrument, but it remains just that: a tool. I must ensure that my reliance on it never supersedes my own intellect, capacities, and creativity.</p>",
					tags: ["ai", "technology", "education"],
					published: true,
				},
			])
			.onConflictDoNothing()
			.returning();

		console.log(
			`${insertedPosts.length} post(s) inserted (skipped duplicates).`,
		);

		if (insertedPosts.length > 0) {
			await db
				.insert(comments)
				.values([
					{
						postId: insertedPosts[0].id,
						authorName: "Admin",
						body: "Testing the brand new comments section!",
						approved: true,
					},
					{
						postId: insertedPosts[2].id,
						authorName: "Next.js Fan",
						body: "Good luck on your 10-day sprint!",
						approved: true,
					},
				])
				.onConflictDoNothing();

			console.log("Seed comments inserted.");
		}

		console.log("Database seeding complete!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

main();
