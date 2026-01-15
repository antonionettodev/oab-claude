'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Mail, Phone, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { subscribeToNewsletter } from '@/actions/newsletter'

export function NewsletterCta() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Por favor, informe seu nome.')
      return
    }

    if (!formData.email.trim()) {
      toast.error('Por favor, informe seu e-mail.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor, informe um e-mail válido.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await subscribeToNewsletter({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
      })

      if (result.success) {
        toast.success(result.message, {
          description: 'Você receberá nossas novidades em breve.',
        })
        setFormData({ name: '', email: '', phone: '' })
        setOpen(false)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Erro ao realizar inscrição.', {
        description: 'Tente novamente mais tarde.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-8 transition-colors">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-gray-900 dark:text-gray-100 mb-2">Receba nossas notícias</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Cadastre-se para receber as últimas notícias diretamente no seu e-mail
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="cursor-pointer bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all whitespace-nowrap">
              Cadastrar e-mail
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Inscreva-se na Newsletter</DialogTitle>
              <DialogDescription>
                Receba as últimas notícias e atualizações diretamente no seu e-mail.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Telefone <span className="text-gray-400 text-sm">(opcional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full bg-gradient-to-r from-[#0066cc] to-[#0052a3] hover:from-[#0052a3] hover:to-[#003d7a]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Inscrever-se'
                )}
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Ao se inscrever, você concorda em receber nossos e-mails. Você pode cancelar a
                qualquer momento.
              </p>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
