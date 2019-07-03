<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-xs-center">
        <!--img src="~assets/img/swap.png" alt="Nuxt.js Logo" max-height="60px" class="logo" /-->
        <swapper-logo></swapper-logo>
      </div>

      <swap-form></swap-form>
    </v-flex>
  </v-layout>
</template>

<script>
import SwapperLogo from "~/components/SwapperLogo.vue";

import SwapForm from "~/components/SwapForm.vue";

export default {
  components: {
    SwapperLogo,
    SwapForm
  }
};
</script>
