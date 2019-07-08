<template>
  <v-card v-if="switchDetails">
    <v-card-text>
      <h3>Adding to Network</h3>
      <p>{{network.name}}</p>
      <div v-if="isAdded">
        <strong>
          <p class="primary pl-2">ADDED TO NETWORK</p>
        </strong>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        round
        small
        color="secondary"
        @click="onAddSwitch"
        :disabled="isAdded"
        :loading="loading"
      >
        Add
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
    isAdded: false,
    loading: false
  }),
  methods: {
    onAddSwitch() {
      console.log("onAddSwitch");
      this.addSwitch(this.network.id, this.switchDetails.serial);
    },
    addSwitch(networkId, serial) {
      this.loading = true;
      axios
        .post(`/api/networks/${networkId}/devices/claim`, { serial })
        .then(res => res)
        .then(res => {
          return meraki.DevicesController.getNetworkDevice({
            networkId,
            serial
          }).then(res => res);
        })
        .then(res => {
          console.log("switch added: new details", serial, res);
          this.isAdded = true;
          this.$emit("switchAdded", res);
        })
        .catch(e => false)
        .finally(() => (this.loading = false));
    }

    /* -- SDK is currently broken here - does not handle an empty response body, statusCode 200 instead of 201
    addSwitch(networkId, serial) {
      let input = {};
      input["networkId"] = networkId;
      let claimNetworkDevices = new meraki.ClaimNetworkDevicesModel();
      claimNetworkDevices.serial = serial;
      input["claimNetworkDevices"] = claimNetworkDevices;
      return meraki.DevicesController.claimNetworkDevices()
        .then(res => res)
        .catch(e => e);
    }
    */
  }
};
</script>

<style>
</style>
