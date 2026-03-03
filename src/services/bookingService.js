import { supabase } from './supabaseClient';

export const bookingService = {
  // Create a new booking
  async createBooking(bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Get booking by reference
  async getBookingByReference(reference) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, flights(*)')
      .eq('booking_reference', reference)
      .single();

    if (error) throw error;
    return data;
  },

  // Get booking by reference and email (for guest lookup)
  async getBookingByReferenceAndEmail(reference, email) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, flights(*)')
      .eq('booking_reference', reference)
      .eq('passenger_email', email)
      .single();

    if (error) throw error;
    return data;
  },

  // Get all bookings for an email
  async getBookingsByEmail(email) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, flights(*)')
      .eq('passenger_email', email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update booking
  async updateBooking(reference, updates) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('booking_reference', reference)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete booking (admin only)
  async deleteBooking(reference) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('booking_reference', reference);

    if (error) throw error;
    return true;
  },

  // Generate unique booking reference
  generateBookingReference() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let reference = '';
    for (let i = 0; i < 6; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
  },

  // Generate seat number (random for demo)
  generateSeatNumber() {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const row = rows[Math.floor(Math.random() * rows.length)];
    const number = Math.floor(Math.random() * 30) + 1;
    return `${number}${row}`;
  }
};