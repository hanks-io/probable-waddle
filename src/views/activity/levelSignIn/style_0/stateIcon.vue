<template >
 <div :class="[isDone ? 'done' : 'undone']">
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="12" height="12" rx="6" fill="var(--rect-fill-color)"/>
    <circle cx="6.5" cy="6.5" r="4.5" fill="var(--circle-fill-color)"/>
  </svg>
 </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  isDone?: boolean,
}>(), {
  isDone: false,
})
</script>

<style scoped lang="less">

.blue-default {
  .done {
    --rect-fill-color: #2F3852;
    --circle-fill-color: #9BA7BE;
  }
  .undone {
    --rect-fill-color: #151C2F;
    --circle-fill-color: #090F1F;
  }
}

.green-dark {
  .done {
    --rect-fill-color: #3B414D;
    --circle-fill-color: rgba(255, 255, 255, 0.8);
  }
  .undone {
    --rect-fill-color: #292D36;
    --circle-fill-color: #1A1D22;
  }
}

.green-default {
  .done {
    --rect-fill-color: #7E9071;
    --circle-fill-color: #AFC69F;
  }
  .undone {
    --rect-fill-color: #2B4F14;
    --circle-fill-color: #213B10;
  }
}

.yellow-dark,
.auroral-yellow {
  .done {
    --rect-fill-color: #857A47;
    --circle-fill-color: #B8AD7A;
  }
  .undone {
    --rect-fill-color: #423D24;
    --circle-fill-color: #1B1B19;
  }
}

.purple-light {
  .done {
    --rect-fill-color: #C7A8FF;
    --circle-fill-color: #9462F2;
  }
  .undone {
    --rect-fill-color: #DBC9FF;
    --circle-fill-color: #E7DBFF;
  }
}

.amber-purple {
  .done {
    --rect-fill-color: #4B4778;
    --circle-fill-color: #686299;
  }
  .undone {
    --rect-fill-color: #2C294D;
    --circle-fill-color: #262346;
  }
}

.forest-green {
  .done {
    --rect-fill-color: #007B4C;
    --circle-fill-color: #50B388;
  }
  .undone {
    --rect-fill-color: #009F76;
    --circle-fill-color: #004D37;
  }
}

.new-skin-symbol {
  .done {
    --rect-fill-color: var(--ep-color-text-weakest);
    --circle-fill-color: var(--ep-color-text-default);
  }
  .undone {
    --rect-fill-color: var(--ep-color-background-fill-surface-raised-L2);
    --circle-fill-color: var(--ep-color-background-fill-body-default);
  }
}
</style>
