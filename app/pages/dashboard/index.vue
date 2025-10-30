<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

navigateTo('/dashboard/feed', { replace: true });
</script>

<template>
  <div></div>
</template>
