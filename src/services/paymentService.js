import { supabase } from './supabaseClient';

export const paymentService = {
  // Get all active payment methods
  async getPaymentMethods() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data;
  },

  // Get all payment methods (admin only)
  async getAllPaymentMethods() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('sort_order');

    if (error) throw error;
    return data;
  },

  // Get payment method by ID
  async getPaymentMethodById(id) {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get payment methods by type
  async getPaymentMethodsByType(type) {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('method_type', type)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data;
  },

  // Create new payment method
  async createPaymentMethod(methodData) {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([methodData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update payment method
  async updatePaymentMethod(id, methodData) {
    const { data, error } = await supabase
      .from('payment_methods')
      .update(methodData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete payment method
  async deletePaymentMethod(id) {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Toggle payment method active status
  async togglePaymentMethodStatus(id, isActive) {
    const { data, error } = await supabase
      .from('payment_methods')
      .update({ is_active: isActive })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Create payment transaction
  async createTransaction(transactionData) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([transactionData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update transaction status
  async updateTransactionStatus(bookingRef, status, transactionData = {}) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({ 
        status, 
        transaction_data: transactionData,
        updated_at: new Date()
      })
      .eq('booking_reference', bookingRef)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Get transaction by booking reference
  async getTransactionByBooking(bookingRef) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*, payment_methods(*)')
      .eq('booking_reference', bookingRef)
      .single();

    if (error) throw error;
    return data;
  },

  // Get all transactions (admin)
  async getAllTransactions() {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*, payment_methods(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Upload proof of payment
  async uploadProofOfPayment(bookingRef, file) {
    const fileName = `proof_${bookingRef}_${Date.now()}`;
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName);

    // Update transaction with proof URL
    await supabase
      .from('payment_transactions')
      .update({ proof_of_payment_url: urlData.publicUrl })
      .eq('booking_reference', bookingRef);

    return urlData.publicUrl;
  }
};