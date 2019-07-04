<template id="switch-info">
  <v-card max-height="100%">
    <v-card-title>
      <h2>Switch Information</h2>
    </v-card-title>
    <v-card-text>
      <div v-if="switchDetails">
        <div v-if="switchDetails.serial">
          <p>
            <v-label>Serial:</v-label>
            <strong>{{switchDetails.serial}}</strong>
          </p>
          <p v-if="switchDetails.networkId">
            <v-label>Network:</v-label>
            <strong>{{network.name}}</strong>
          </p>
          <div class="text-xs-center pt-0">
            <v-btn round color="grey" :loading="blinking" @click="onBlink()">Blink LEDs</v-btn>
          </div>

          <v-expansion-panel v-model="expansionPanel" focusable>
            <v-expansion-panel-content>
              <template v-slot:header>
                <div>Switch Details</div>
              </template>

              <switch-details :switchDetails="switchDetails"></switch-details>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
              <template v-slot:header>
                <div>Switch Ports</div>
              </template>
              <v-flex xs12 md12 v-if="switchPorts">
                <switch-port-table class="pt-2" :data="switchPorts"></switch-port-table>
              </v-flex>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="onClose()">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SwitchDetails from "./SwitchDetails";
import SwitchPortTable from "./SwitchPortTable";
import meraki from "~/plugins/meraki";

export default {
  template: "switch-info",
  props: ["network", "switchDetails", "switchPorts", "dialogOpen"],
  components: {
    SwitchDetails,
    SwitchPortTable
  },
  computed: {},
  data: () => ({
    blinking: false,
    expansionPanel: [true, false]
  }),
  methods: {
    onClose() {
      this.dialog = false;
      this.$emit("onClose", true);
    },
    onBlink() {
      this.blinkMerakiDevice(
        this.switchDetails.networkId,
        this.switchDetails.serial
      )
        .then(res => {
          console.log("blinking device: ", this.switchDetails.serial, res);
          this.blinking = true;
          setTimeout(() => {
            this.blinking = false;
          }, 1000);
        })
        .catch(e => {
          console.log("Bummer..", e);
        });
    },
    blinkMerakiDevice(networkId, serial) {
      let input = {};
      input.serial = serial;
      input.networkId = networkId;
      let blinkNetworkDeviceLeds = new meraki.BlinkNetworkDeviceLedsModel();
      blinkNetworkDeviceLeds.duration = 20;
      //blinkNetworkDeviceLeds.period = 50;
      //blinkNetworkDeviceLeds.duty = 50;

      return meraki.DevicesController.blinkNetworkDeviceLeds(input)
        .then(res => res)
        .catch(e => console.log(e));
    }
  }
};
</script>

<style>
</style>
