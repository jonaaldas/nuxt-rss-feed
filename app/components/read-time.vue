<script setup lang="ts">
import * as z from "zod";

const props = defineProps({
  totalWords: {
    type: Number as PropType<number>,
    required: true,
    validator: (value: number) => {
      const schema = z.object({
        totalWords: z.number().min(1).positive(),
      });
      return schema.safeParse({ totalWords: value }).data?.totalWords === value;
    },
  },
});

const avrageWordPerMinute = 238;

const totalMinutesUntilEnd = computed(() => {
  return Math.round(totalWords.value / avrageWordPerMinute);
});
const { totalWords } = toRefs(props);
</script>
<template>
  <div>
    <p class="text-xs text-muted-foreground">
      Read time: {{ totalMinutesUntilEnd }} minutes
    </p>
  </div>
</template>
