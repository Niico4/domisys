import { useAuthStore, User } from '@/store/useAuth.store';

const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const signIn = useAuthStore((state) => state.signIn);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const signUp = useAuthStore((state) => state.signUp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const token = useAuthStore((state) => state.token);

  const enhancedUpdateUser = async (data: Partial<User>) => {
    try {
      updateUser(data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    user,
    token,
    isLoading,
    signIn,
    logout,
    updateUser: enhancedUpdateUser,
    signUp,
  };
};

export default useAuth;
