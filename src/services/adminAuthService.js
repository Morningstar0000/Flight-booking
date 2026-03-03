import { supabase } from './supabaseClient';

// Simple hash function for demo (in production use bcrypt)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export const adminAuthService = {
  // Login admin
  async login(username, password) {
    try {
      // Find user by username
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        throw new Error('Invalid username or password');
      }

      // Check password (plain text for demo - in production use bcrypt)
      if (user.password_hash !== password) {
        throw new Error('Invalid username or password');
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;
      
      // Store in session
      sessionStorage.setItem('adminUser', JSON.stringify(userWithoutPassword));
      sessionStorage.setItem('adminAuthenticated', 'true');
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout() {
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminAuthenticated');
    return { success: true };
  },

  // Check if logged in
  isAuthenticated() {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  },

  // Get current user
  getCurrentUser() {
    const userStr = sessionStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    try {
      // Verify old password
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new Error('User not found');
      }

      if (user.password_hash !== oldPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ password_hash: newPassword })
        .eq('id', userId);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: error.message };
    }
  },

  // Create new admin (for super admins only)
  async createAdmin(adminData) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          username: adminData.username,
          email: adminData.email,
          password_hash: adminData.password,
          full_name: adminData.fullName,
          role: adminData.role || 'admin'
        }])
        .select();

      if (error) throw error;
      
      const { password_hash, ...newAdmin } = data[0];
      return { success: true, user: newAdmin };
    } catch (error) {
      console.error('Create admin error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all admins (for super admins)
  async getAllAdmins() {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, email, full_name, role, is_active, last_login, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, admins: data };
    } catch (error) {
      console.error('Get admins error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update admin status (activate/deactivate)
  async updateAdminStatus(adminId, isActive) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: isActive })
        .eq('id', adminId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Update admin status error:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete admin (for super admins)
  async deleteAdmin(adminId) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete admin error:', error);
      return { success: false, error: error.message };
    }
  }
};