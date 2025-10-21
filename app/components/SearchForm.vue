<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";

const emit = defineEmits<{
  (e: "input", value: string): void;
}>();

const emitEvent = (event: Event) => {
  emit("input", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <form>
    <SidebarGroup class="py-0">
      <SidebarGroupContent class="relative">
        <Label for="search" class="sr-only"> Search </Label>
        <SidebarInput
          id="search"
          placeholder="Search the feeds..."
          class="pl-8"
          @input="emitEvent"
        />
        <Search
          class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  </form>
</template>
