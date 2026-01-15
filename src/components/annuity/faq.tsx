import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqItems = [
  {
    question: 'Como emitir a 2ª via do boleto?',
    answer:
      'Preencha o formulário acima com seu número OAB e ano de referência, depois clique em "Emitir Boleto".',
  },
  {
    question: 'Posso parcelar anuidades atrasadas?',
    answer:
      'Sim! Entre em contato com a Tesouraria para negociar condições especiais de parcelamento.',
  },
  {
    question: 'Tenho direito a desconto?',
    answer:
      'Advogados inscritos há menos de 3 anos têm 50% de desconto. O pagamento em cota única também garante 10% de desconto.',
  },
]

export function AnnuityFaq() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline py-4">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
