import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async ({ email, password, username, displayName }: SignUpData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          username,
          display_name: displayName || username,
        });

      if (profileError) throw profileError;

      toast({
        title: "Account created successfully!",
        description: "You can now start using the app.",
      });
    }

    return { data, error: null };
  } catch (error: any) {
    toast({
      title: "Sign up failed",
      description: error.message,
      variant: "destructive",
    });
    return { data: null, error };
  }
};

export const signIn = async ({ email, password }: SignInData) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });

    return { data, error: null };
  } catch (error: any) {
    toast({
      title: "Sign in failed",
      description: error.message,
      variant: "destructive",
    });
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });

    return { error: null };
  } catch (error: any) {
    toast({
      title: "Sign out failed",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    toast({
      title: "Password reset email sent",
      description: "Check your email for the password reset link.",
    });

    return { error: null };
  } catch (error: any) {
    toast({
      title: "Password reset failed",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  }
};