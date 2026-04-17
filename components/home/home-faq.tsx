import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { homeFAQs, buildFAQSchema } from "@/lib/faq-data"

export function HomeFaq() {
  const schema = buildFAQSchema(homeFAQs)

  return (
    <section className="bg-surface-container-highest border-t border-border">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8 lg:py-24">
        <div data-aos="fade-up" className="text-center">
          <span className="label-md text-primary">FAQ</span>
          <h2 className="mt-2 text-3xl md:display-md font-bold uppercase tracking-tight text-foreground">
            Questions About Dapperr Drift?
          </h2>
          <p className="mt-4 body-lg text-muted-foreground max-w-2xl mx-auto">
            Quick answers about our Kota streetwear brand, shipping across India, and more.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="100" className="mt-10 md:mt-12">
          <Accordion type="single" collapsible className="w-full">
            {homeFAQs.map((faq, i) => (
              <AccordionItem key={i} value={`home-faq-${i}`}>
                <AccordionTrigger className="text-base md:text-lg font-semibold text-foreground py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="body-md text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div data-aos="fade-up" className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 label-md uppercase tracking-widest text-foreground transition-colors hover:text-primary"
          >
            View All FAQs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
