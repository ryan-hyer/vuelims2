import { defineBoot } from '#q-app/wrappers';
import { useAuthStore } from 'src/stores/auth-store';

export default defineBoot(async ({ store }) => {
  const authStore = useAuthStore(store);
  await authStore.restoreSession();
});
