<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

// Redirect to feed page
await navigateTo('/dashboard/feed');
</script>

<template>
  <div></div>
</template>
