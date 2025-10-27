import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: 'Как работает обмен криптовалют?',
      answer: 'Вы выбираете валюту для обмена, указываете сумму, и наша платформа автоматически находит лучший курс. После подтверждения, обмен происходит в течение нескольких минут.'
    },
    {
      question: 'Какие комиссии взимаются?',
      answer: 'Мы взимаем небольшую комиссию, которая уже включена в курс обмена. Никаких скрытых платежей нет. Точную комиссию вы увидите перед подтверждением обмена.'
    },
    {
      question: 'Безопасно ли это?',
      answer: 'Да, абсолютно безопасно. Мы используем передовые технологии шифрования и проводим AML/KYC проверки для защиты от мошенничества. Ваши средства и данные надежно защищены.'
    },
    {
      question: 'Сколько времени занимает обмен?',
      answer: 'Обычно обмен занимает от 5 до 30 минут, в зависимости от загруженности сети блокчейн и количества необходимых подтверждений.'
    },
    {
      question: 'Нужна ли регистрация?',
      answer: 'Для небольших сумм регистрация не обязательна. Однако для больших сумм и для доступа к дополнительным функциям рекомендуется пройти верификацию.'
    },
    {
      question: 'Какие валюты поддерживаются?',
      answer: 'Мы поддерживаем более 50 популярных криптовалют, включая Bitcoin, Ethereum, USDT, BNB, Solana и многие другие. Список постоянно расширяется.'
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Часто задаваемые вопросы</h2>
          <p className="text-muted-foreground">Ответы на популярные вопросы</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
