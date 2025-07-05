<template>
  <span class="info-icon">
    <svg v-if="beforeOrAfter === 'before'" width="31" height="11" viewBox="0 0 31 11" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect x="0.445312" y="0.5" width="30.5556" height="10" fill="url(#pattern0_5506_40331)"/>
      <defs>
        <pattern id="pattern0_5506_40331" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image0_5506_40331" transform="scale(0.0181818 0.0555556)"/>
        </pattern>
        <image id="image0_5506_40331" width="55" height="18" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
      </defs>
    </svg>
    <svg v-else width="31" height="11" viewBox="0 0 31 11" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="30.5556" height="10" transform="matrix(-1 0 0 1 30.5566 0.5)" fill="url(#pattern0_5506_40333)"/>
      <defs>
        <pattern id="pattern0_5506_40333" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlink:href="#image0_5506_40333" transform="scale(0.0181818 0.0555556)"/>
        </pattern>
        <image id="image0_5506_40333" width="55" height="18" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAASCAYAAAD/ukbDAAAFnElEQVR4AdRWa0xURxQ+Z+4uSBMhBh9NGqyvpvEBiMViAFnX3QY10lqaGl9NkNqiojZtfdSCZqsVg0bTiEsrDUpb2+j+wMZXS4XlqWAUccFYGkIfaZq0piSNERXh3uk3q+hCYN2l/undc+7MnDnnm/PNnHv3CnpwuaRLc7e6ny//sTzygel/33jJuX+pTRjZPqaVNNEq2HTDfd1d6LrmCnnS7GoKjyy6UHC4oX5/8fn6PYdmDAW/bf2B0OZtBz/y5DqvN+c6v7q85VDEYDjiXPu5CCZ5hpgmeZ1YCmJeM5JH5njHT+DWcPRoeFXxl0dYEycMwQmGRolk0o4HC928rSC6M8J0UUrejtjJkmiF2awPmqfQzGEWkIlkZmLBREoZoYLScf/PUnH8eMpdYg8LkYFtI1L4UCk4KlBw6XAIT+7BTVKKS0wytm+cHNt3/GgkmOU9YhigEooekVB3cU/dh6pnz54NdZce2wP8ShAZJ4EphSApkJ7GRBrvDwS7yfHpuOaeUZVEvIeIQqG+coeYnb4G374IJa2aiH+FEzF+hMWJmUgzvqAhXu5TpbGh3Z2XJItNwBN4lkma7pOSGv8D/BWJ6zM/fBx88/bClVqP4YFfCrS/NOm6Fh+7c21t/4nesUiMSrxjMNuRRBVhfWa1uNhsfc5a0OsUaOtA+ZR/f2Kz1OgiCRENzPsnpTYMp4axWwpzTPKajK/9YV7JOzCqyeEsRSUdhob389WJOa/7hilhxu7V1/vN9RmiWIhsY5ParWOTrUT6U9YJKSPmTkrZC5J4Xvv4+h2UVZ8cnzw7rgoE8pFQKClkZiII+nexge9a3lhmt2Qu/Z38XI15RQtJD2mRLF69n4AC6A3gdiEpBaeVE1+U1d1rHaxVKTycs4633n04CKJzrvZ0pkZ8lZhngwgRTkoqYmhxglcMjV+wLVnyCeMBHAy2Lr94eEN+UZHB8pRkGkNMJJmhiFB9KYs0k5wevSv7AiwBSR9yAUX4OJWdLxtd3vDdtyy4GITCoURISClsOsa7Ip7pmGVftNhv+dQXlCRpIbIJMW8pQoYi48UhIiH/MpgXTt+1LmuaI/sWLAHLkMlVNJalaWbZghxeUWSIsaZC854Wt0spZ9sWpOfGxw9ePtdcrpCaz0rydDaqQWqigXjv2xQYqiXmEz1kmha3Y+0ZoActgAsupq61bnhFS/nnOJWTeJ2P9iaBZJAIQSUxFen6sFj7/PR68nO5S76Z2nGrqwE4W4GhSQ27AxypMmK+aQheGbd9dXq8I+tvPzDeqQbHgXDPNudeT66z+mqO84gnt2C8mlBQqg1IK3+qTO7Su67CeRWSIhCBqqSIMP4TiaXZ57yclZqa2gnLgKLeqG7XsffYTJdBKA5K3r8KEAMhvF2putskYl7c+nbJgAD9jOpzLKxHqyNJGzGVgkrKIBKNLTnOqIDJVbZVb5GSqvBcTCAgKEWfGAjMXKqZ9eiXkhb6LR8XytASM+U0YvdhM4ZBkYf6Yye03CWZNs+6+cfcpI2rfoMlILkTYVoGx2ior4zQWW5Bar62gfsVP1c8K0nuJkEaEXsFfSLBN5FQhm3mvNes8WmPLZ/IMJGJ05lPWFWdmFfRN4Tw6ELOTN7w5l52OAwK4jIkDfgZx0SBnZxJmkJIMBOEkAwLdElUEcrHHpca8JeMJA4nxise8QRlTRj4csm/3RmZYMla2RIEp0eumhzwCwVr1YhHXoP3LBMtbcilkNT/lOBOJt5YM7XGZptiC7h8vOhhjL8M4VHEpOC2HiHnWJcv/2DBhgVd3vkh3KbvyK5EWvt9Q5noB5NpVEFA5FTgnAmW7G4yPd19u2uMdbJ1n4ODKx+FYbend9Q2tswQZhHV0UOT7a8vHXDXlW8wGrNz3fsgmEhSvoPHJy3647XzpjkW3/sXAAD//9gwjdYAAAAGSURBVAMAGKrMSOhonUgAAAAASUVORK5CYII="/>
      </defs>
    </svg>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  beforeOrAfter: 'before' | 'after'
}
>(), {
    beforeOrAfter: 'before'
});
</script>

<style lang="less" scoped>
.info-icon {
  &.before {
    transform: rotate(0deg);
  }
  &.after {
    transform: rotate(160deg);
  }
}
</style>
