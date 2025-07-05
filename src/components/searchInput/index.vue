<script setup lang="ts">
import { IonIcon, IonSpinner, IonSearchbar } from '@ionic/vue'
import { searchOutline } from 'ionicons/icons';
const props = defineProps<{
  loading: boolean,
  placeholder: string,
  modelValue: string,
}>();

const emit = defineEmits<{
  (e: 'searchHandle'): void
  (e: 'update:modelValue'): void
  (e: 'ionInput',event: CustomEvent): void
}>()

const searchHandle = () => {
  emit('searchHandle')
}

const searchValue = useVModel(props, 'modelValue', emit)
const handleInput = (event: CustomEvent) => {
  emit('ionInput', event)
}
</script>




<template>
  <div class="search-input">
    <ion-searchbar mode="md" id="searchbar" class="relative" v-model="searchValue"  show-clear-button="never"
      :placeholder="placeholder" @ionInput="handleInput">
      <ion-spinner name="bubbles" v-if="loading" />
      <ion-icon :icon="searchOutline" @click="searchHandle" v-else />
    </ion-searchbar>
  </div>

</template>

<style scoped lang="less">
.blue-default {
  #search-input-index.style();


}

.green-default {
  #search-input-index.style(@text-color1: #afc69f;
    @text-color2: #7e9071;
    @icon-color2: #afc69f;
    @bg1: #3e9b2f;
    @bg3: #183009;
    @shadow1: "0 0 0 0.0625rem #34571d, 
 0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.14),
    0 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2),
    0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.12)";
);

}

.forest-green {
  #search-input-index.style(@text-color1: var(--text-color1);
    @text-color2: var(--text-color2);
    @icon-color2: var(--text-color1);
    @bg1: var(--theme-color-800);
    @bg3: var(--color-bg-300);
    @shadow1: "0 0 0 0.0625rem var(--line-color), 
 0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.14),
    0 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2),
    0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.12)";
);


}

.amber-purple {
  #search-input-index.style(@text-color1: #bdb8e1;
    @text-color2: #686299;
    @icon-color2: #bdb8e1;
    @bg1: #7041f3;
    @bg3: #252141;
    @shadow1: "0 0 0 0.0625rem #5f588c,
 0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.14),
    0 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2),
    0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.12)";
);


}

.green-dark {
  #search-input-index.style(@text-color1: #fff;
    @text-color2: #fff6;
    @icon-color2: #fff;
    @bg1: #3e9b2f;
    @bg3: #16191d;
    @shadow1: "0 0 0 0.0625rem #3b424e, 
 0 0.125rem 0.125rem 0 rgba(0, 0, 0, .14),
    0 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, .2),
    0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, .12)";
);


}

.yellow-dark {
  #search-input-index.style(@text-color1: #fff;
    @text-color2: #fff6;
    @icon-color2: #fff;
    @bg1: #feb805;
    @bg3: #181816;
    @shadow1: "0 0 0 0.0625rem #2e2d2c, 
 0 0.125rem 0.125rem 0 rgba(0, 0, 0, .14),
    0 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, .2),
    0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, .12)";
);


}

.purple-light {
  #search-input-index.style(@text-color1: #403d4f;
    @text-color2: #403d4f80;
    @icon-color2: #403d4f;
    @bg1: #6526db;
    @bg3: #e0d0ff;
    @shadow1: "none";
  );


}

.auroral-yellow {
  #search-input-index.style(@text-color1: #fff;
    @text-color2: var(--text-color2);
    @icon-color2: #fff;
    @bg1: var(--theme-color-800);
    @bg3: var(--color-bg-400);
    @shadow1: "0 0 0 0.0625rem var(--line-color), 
 0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.14),
    0 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2),
    0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.12)";
);
}

.new-skin-symbol {
  #search-input-index.style(@text-color1: var(--ep-color-text-default);
    @text-color2: var(--ep-color-text-weaker);
    @icon-color2: var(--ep-color-icon-weaker);
    @bg1: var(--ep-color-border-brand);
    @bg3: var(--ep-color-background-fill-surface-lowered);
    @bg5: var(--ep-color-background-fill-body-default);
    @shadow1: "
 0 0 0 1px var(--ep-color-border-default),
    0 2px 2px 0 rgba(0, 0, 0, .14),
    0 3px 1px -2px rgba(0, 0, 0, .2),
    0 1px 5px 0 rgba(0, 0, 0, .12) ";
);
}

#search-input-index {
  .style(@text-color1: #fff;
    @text-color2: #6d788e;
    @icon-color2: #fff;
    @bg1: #116fcd;
    @bg3: #101629;
    @bg4: transparent;
    @bg5: var(--color-bg-300);
    @shadow1: "0 0 0 0.0625rem #1a233e, 
 0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.14),
    0 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.2),
    0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.12)";


  ) {


    .search-input {
      background: @bg5;
      height: 100%;
      width: 100%;

      #searchbar {
        --color: @text-color1;
        --placeholder-color: @text-color2;
        caret-color: @bg1;
        --background: @bg3;
        --box-shadow:~"@{shadow1}";
        border-radius: 0.25rem;
        padding: 0;

        ion-spinner {
          position: absolute;
          z-index: 10;
          right: 1.25rem;
          width: 1.75rem;
          height: 1.75rem;
          font-size: 1.25rem;
        }

        ion-icon {
          position: absolute;
          z-index: 10;
          right: 1.25rem;
          font-size: 1.25rem;
          color: @icon-color2;
        }
      }
    }

  }
}
</style>
