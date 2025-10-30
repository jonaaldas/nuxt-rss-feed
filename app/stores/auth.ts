import { authClient } from '~/lib/auth-client';
export type Session = typeof authClient.$Infer.Session;

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null);
  const getSession = async () => {
    const { data } = await authClient.getSession();
    session.value = data;
  };

  return { session, getSession };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
