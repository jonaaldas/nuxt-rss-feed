<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue-sonner';

import { Input } from '@/components/ui/input';
const { session } = useAuthStore();

const name = ref(session?.user?.name || '');
const email = ref(session?.user?.email || '');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const handleUpdateProfile = async () => {
  toast.success('Profile update will be implemented soon');
};

const handleChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Passwords do not match');
    return;
  }
  toast.success('Password change will be implemented soon');
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
};
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="ghost" class="w-full justify-start">
        <Icon name="heroicons:pencil-square" class="w-4 h-4" />
        Edit Profile
      </Button>
    </DialogTrigger>
    <DialogContent class="w-full max-h-[85vh] flex flex-col p-0 gap-0">
      <DialogHeader
        class="sticky top-0 bg-background z-10 px-6 pt-6 pb-4 border-b">
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Manage your account settings and preferences.
        </DialogDescription>
      </DialogHeader>

      <div class="p-6 overflow-y-auto space-y-6">
        <form @submit.prevent="handleUpdateProfile">
          <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldSeparator />
            <FieldGroup>
              <Field :data-invalid="false">
                <FieldLabel htmlFor="name"> Name </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Max Leiter"
                  v-model="name" />
                <FieldError
                  v-if="name.length === 0"
                  :errors="[{ message: 'Name is required' }]" />
              </Field>
              <Field data-invalid="true">
                <FieldLabel htmlFor="email"> Email </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="max@leiter.com"
                  v-model="email" />
                <FieldError :errors="[{ message: 'Email is required' }]" />
              </Field>
              <Button class="max-w-40" variant="secondary" type="submit">
                Update Profile
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>

        <form @submit.prevent="handleChangePassword">
          <FieldSet>
            <FieldLegend>Password</FieldLegend>
            <FieldSeparator />
            <FieldGroup>
              <Field>
                <FieldLabel for="currentPassword">
                  Current Password
                </FieldLabel>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="********"
                  v-model="currentPassword" />
              </Field>
              <Field>
                <FieldLabel for="newPassword"> New Password </FieldLabel>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="********"
                  v-model="newPassword" />
              </Field>
              <Field>
                <FieldLabel for="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  v-model="confirmPassword" />
              </Field>
              <Button type="submit" class="max-w-40" variant="secondary">
                Update Password
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>

        <FieldSet>
          <FieldLegend>Billing Information</FieldLegend>
          <FieldSeparator />
          <FieldGroup>
            <div class="rounded-lg border border-border p-4 space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Current Plan</span>
                <span class="text-sm text-muted-foreground">Free Plan</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Status</span>
                <span class="text-sm text-green-600">Active</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Next Billing Date</span>
                <span class="text-sm text-muted-foreground">N/A</span>
              </div>
            </div>
            <Button class="max-w-40" variant="outline" disabled>
              Upgrade Plan
            </Button>
          </FieldGroup>
        </FieldSet>
      </div>
    </DialogContent>
  </Dialog>
</template>