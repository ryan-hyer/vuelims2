import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';
import type { AuthUser, PasswordResetResult } from 'src/components/Auth/models';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    assignedRoleIds: [] as number[],
  }),

  getters: {
    isAuthenticated: (state): boolean => state.user !== null,
    isAdmin: (state): boolean => state.user?.role === 'admin',
    fullName: (state): string =>
      state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    initials: (state): string =>
      state.user ? `${state.user.firstName[0]}${state.user.lastName[0]}`.toUpperCase() : '?',
  },

  actions: {
    isSupervisorOf(supervisorRoleId: number | null | undefined): boolean {
      if (supervisorRoleId == null) return false;
      return this.assignedRoleIds.includes(supervisorRoleId);
    },

    async _loadAssignedRoles() {
      if (!this.user?.employeeId) {
        this.assignedRoleIds = [];
        return;
      }
      this.assignedRoleIds = await api.fetchEmployeeRoleIds(this.user.employeeId);
    },

    async login(email: string, password: string) {
      const user = (await api.login(email, password)) as AuthUser;
      this.user = user;
      localStorage.setItem('auth_user_id', String(user.id));
      await this._loadAssignedRoles();
    },

    logout() {
      this.user = null;
      this.assignedRoleIds = [];
      localStorage.removeItem('auth_user_id');
    },

    async restoreSession() {
      const storedId = localStorage.getItem('auth_user_id');
      if (!storedId) return;
      const user = (await api.getCurrentUser(Number(storedId))) as AuthUser | null;
      if (user) {
        this.user = user;
        await this._loadAssignedRoles();
      } else {
        localStorage.removeItem('auth_user_id');
      }
    },

    async requestPasswordReset(email: string): Promise<PasswordResetResult> {
      return (await api.requestPasswordReset(email)) as PasswordResetResult;
    },

    async resetPassword(email: string, token: string, newPassword: string) {
      await api.resetPassword(email, token, newPassword);
    },

    async changePassword(currentPassword: string, newPassword: string) {
      if (!this.user) throw new Error('Not authenticated');
      await api.changePassword(this.user.id, currentPassword, newPassword);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
