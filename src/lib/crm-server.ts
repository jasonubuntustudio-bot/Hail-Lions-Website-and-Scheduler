import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/crm";

type UpsertInput = {
  fullName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  bookingId?: string | null;
  interaction?: {
    channel: string;
    direction?: string;
    subject?: string;
    body?: string;
  };
};

export async function upsertCustomerFromLead(input: UpsertInput) {
  const supabase = createAdminClient();
  const phone = normalizePhone(input.phone) || input.phone.trim();
  if (!phone) return null;

  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  let customerId = existing?.id as string | undefined;

  if (customerId) {
    await supabase
      .from("customers")
      .update({
        full_name: input.fullName.trim(),
        email: input.email?.trim() || null,
        address: input.address || null,
        city: input.city || null,
        zip: input.zip || null,
        updated_at: new Date().toISOString(),
        last_contact_at: new Date().toISOString(),
      })
      .eq("id", customerId);
  } else {
    const { data: created, error } = await supabase
      .from("customers")
      .insert({
        full_name: input.fullName.trim(),
        phone,
        email: input.email?.trim() || null,
        address: input.address || null,
        city: input.city || null,
        zip: input.zip || null,
        source: "website",
        last_contact_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error || !created) {
      console.error("[crm] create customer", error);
      return null;
    }
    customerId = created.id;
  }

  if (input.bookingId && customerId) {
    await supabase
      .from("bookings")
      .update({ customer_id: customerId })
      .eq("id", input.bookingId);
  }

  if (input.interaction && customerId) {
    await supabase.from("customer_interactions").insert({
      customer_id: customerId,
      booking_id: input.bookingId || null,
      channel: input.interaction.channel,
      direction: input.interaction.direction || "system",
      subject: input.interaction.subject || null,
      body: input.interaction.body || null,
      created_by: "system",
    });
  }

  return customerId;
}
