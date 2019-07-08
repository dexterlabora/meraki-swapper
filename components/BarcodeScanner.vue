<template>
  <div>
    <v-quagga :onDetected="logIt" :readerSize="readerSize" :readerType="['code_128_reader']"></v-quagga>
  </div>
</template>

<script>
// register component 'v-quagga'
Vue.use(VueQuagga);
import Vue from "vue";

import VueQuagga from "vue-quaggajs";
export default {
  name: "barcode-scanner",
  data() {
    return {
      readerSize: {
        width: 400,
        height: 200
      }
    };
  },
  components: {
    VueQuagga
  },
  methods: {
    logIt(data) {
      console.log("detected", data);
    }
  }
};
</script>