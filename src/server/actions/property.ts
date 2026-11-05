'use server';

import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';
import { validatePropertyInput } from '@/lib/validators';

export async function updatePropertySettingsAction(input: unknown) {
  await requireRole(['pemilik']);
  const validated = validatePropertyInput(input);

  await db
    .update(properties)
    .set({
      name: validated.name,
      category: validated.category,
      description: validated.description,
      address: validated.address,
      city: validated.city,
      whatsappNumber: validated.whatsappNumber,
      rules: validated.rules,
      facilities: validated.facilities,
      qrisImageUrl: validated.qrisImageUrl,
      bankAccounts: validated.bankAccounts,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, validated.id));

  return { success: true };
}

export async function updatePropertyFormAction(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as 'putra' | 'putri' | 'campur';
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const whatsappNumber = formData.get('whatsappNumber') as string;
  const description = (formData.get('description') as string) || '';

  await updatePropertySettingsAction({
    id,
    name,
    category,
    address,
    city,
    whatsappNumber,
    description,
    rules: [],
    facilities: [],
    bankAccounts: [],
  });
}
