'use client'

import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const years = ['2025', '2024', '2023', '2022', '2021']

export function AnnuityForm() {
  const [oabNumber, setOabNumber] = useState('')
  const [selectedYear, setSelectedYear] = useState('2025')

  return (
    <Card className="shadow-lg border-0 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Emitir Guia de Anuidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="oab-number">Número da Inscrição OAB/SC</Label>
          <Input
            id="oab-number"
            type="text"
            value={oabNumber}
            onChange={(e) => setOabNumber(e.target.value)}
            placeholder="Digite seu número OAB"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Ano de Referência</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year" className="h-12">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button className="flex-1 h-12 gap-2" onClick={() => console.log('Consultar débitos')}>
            <FileText className="w-5 h-5" />
            Consultar Débitos
          </Button>
          <Button
            variant="destructive"
            className="flex-1 h-12 gap-2"
            onClick={() => console.log('Emitir boleto')}
          >
            <Download className="w-5 h-5" />
            Emitir Boleto
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
