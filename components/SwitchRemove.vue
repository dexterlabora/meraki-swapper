<template>
  <v-card v-if="switchDetails">
    <v-card-text>
      <p>
        <strong>Name</strong>
        : {{switchDetails.name}}
      </p>
      <p>
        <strong>Serial</strong>
        : {{switchDetails.serial}}
      </p>
      <p>
        <strong>Model</strong>
        : {{switchDetails.model}}
      </p>
      <p>
        <strong>Network</strong>
        : {{network.name}}
      </p>
      <div v-if="isRemoved">
        <strong>
          <p class="error pl-2">REMOVED FROM NETWORK</p>
        </strong>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        round
        small
        color="warning"
        @click="onRemoveSwitch"
        :disabled="isRemoved"
        :loading="loading"
      >
        Remove
        <strong></strong>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import meraki from "~/plugins/meraki";
import axios from "~/plugins/axios";

export default {
  props: {
    switchDetails: Object,
    network: Object
  },
  computed: {},
  data: () => ({
    isRemoved: false,
    loading: false
  }),
  methods: {
    onRemoveSwitch() {
      let netId = this.network.id; //this.oldSwitchDetails.networkId;
      let serial = this.switchDetails.serial;
      let options = {
        url: `/api/networks/${netId}/devices/${serial}/remove`
      };
      this.loading = true;
      axios
        .post(`/api/networks/${netId}/devices/${serial}/remove`, {
          headers: { "content-type": "text/html" }
        })
        .then(res => {
          //this.oldSwitchDetails = res.data;
          console.log("device removed ", res);
          this.isRemoved = true;
          this.$emit("removed", this.switchDetails.serial);
          this.loading = false;
        })
        .catch(e => this.handleError(e));

      /* broken endpoint method. invalid content type
      let input = {};
      input["networkId"] = this.netId;
      input["serial"] = this.oldSwitchDetails.serial;
      meraki.DevicesController.removeNetworkDevice(input).then(res => {
        // update the old switch details
        this.oldSwitchDetails = res;
        // clear the old switch ports.
        //  this.oldSwitchPorts = [];
      });
      */
    },
    handleError(e) {
      this.loading = false;
      console.log(e);
    }
  }
};
</script>

<style>
</style>
