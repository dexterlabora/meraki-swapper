<template>
  <v-form>
    <v-container fluid>
      <v-layout>
        <!-- Step 1 : SOURCE SWITCH SELECTION -->
        <v-stepper v-model="stepper" non-linear vertical>
          <v-stepper-step :complete="stepper > 1" step="1">
            Source Switch
            <small>
              Settings to be copied from
              <div v-if="form.oldSwitchDetails">
                <div v-if="form.oldSwitchDetails.serial">
                  <strong>{{form.oldSwitchDetails.serial}}</strong>
                  | {{form.oldSwitchDetails.model}}
                  <div class="pt-0">Net: {{networkById(form.oldSwitchDetails.networkId).name}}</div>

                  <span>
                    <v-btn @click.prevent="showOldSwitchInfo" round small color="secondary">Details</v-btn>
                  </span>
                  <v-dialog v-model="oldSwitchDialog">
                    <switch-info
                      :key="form.oldSwitchDetails.serial"
                      :network="networkById(form.oldSwitchDetails.networkId)"
                      :switchDetails="form.oldSwitchDetails"
                      :switchPorts="form.oldSwitchPorts"
                      @onClose="oldSwitchDialog = false"
                    ></switch-info>
                  </v-dialog>
                </div>
              </div>
            </small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <switch-selector
              label="Select Source Switch..."
              :switches="usedSwitches"
              @selected="onOldSwitchSelect"
            ></switch-selector>

            <v-btn
              color="primary"
              @click="stepper = 2"
              :disabled="!form.oldSwitchDetails.serial"
            >Continue</v-btn>
            <v-btn flat @click="initForm">Cancel</v-btn>
          </v-stepper-content>

          <!-- Step 2 : DESTINATION SWITCH SELECTION -->
          <v-stepper-step :complete="stepper > 2" step="2">
            Destination Switch
            <small>
              Settings to be copied to
              <div v-if="form.newSwitchDetails">
                <div v-if="form.newSwitchDetails.serial">
                  <strong>{{form.newSwitchDetails.serial}}</strong>
                  | {{form.newSwitchDetails.model}}
                  <div class="pt-0">Net: {{networkById(form.newSwitchDetails.networkId).name}}</div>
                  <span>
                    <v-btn @click="showNewSwitchInfo" round small color="secondary">Details</v-btn>
                  </span>
                  <v-dialog v-model="newSwitchDialog">
                    form.newSwitchDetails.serial: {{form.newSwitchDetails.serial}}
                    <switch-info
                      id="info-2"
                      key="new"
                      :network="networkById(form.newSwitchDetails.networkId)"
                      :switchDetails="form.newSwitchDetails"
                      :switchPorts="form.newSwitchPorts"
                      @onClose="newSwitchDialog = false"
                    ></switch-info>
                  </v-dialog>
                </div>
              </div>
            </small>
          </v-stepper-step>

          <v-stepper-content step="2">
            <switch-selector
              label="Select Destination Switch..."
              :switches="unusedAndNetworkSwitchesModelMatch"
              @selected="onNewSwitchSelect"
            ></switch-selector>

            <!-- Step 2-Optional : Add SWITCH -->
            <div v-if="form.newSwitchDetails.serial">
              <div v-if="!form.newSwitchDetails.networkId">
                <small>The switch must first be added to the same network as the source</small>
                <switch-add
                  :switchDetails="form.newSwitchDetails"
                  :network="networkById(form.oldSwitchDetails.networkId)"
                  :key="form.newSwitchDetails.serial"
                  @switchAdded="onSwitchAdded($event)"
                ></switch-add>
              </div>
              <div v-if="form.switchAdded">
                <v-card>
                  <v-card-title class="headline">Success!</v-card-title>
                  <v-card-text>
                    <p color="secondary">The switch has been added to the network.</p>
                  </v-card-text>
                </v-card>
              </div>
            </div>
            <v-btn
              color="primary"
              @click="stepper = 3"
              :disabled="!form.newSwitchDetails.networkId"
            >Continue</v-btn>
            <v-btn flat @click="initForm">Cancel</v-btn>
          </v-stepper-content>

          <!-- Step 3 : CLONE SWITCH -->
          <v-stepper-step :complete="stepper > 3" step="3">
            Clone Switch Settings
            <small>
              Destination switch will be overwritten
              <div v-if="form.newSwitchDetails">
                <div v-if="form.newSwitchDetails.serial">
                  <strong>{{form.newSwitchDetails.serial}}</strong>
                  | {{form.newSwitchDetails.model}}
                  <div class="pt-0">Net: {{network.name}}</div>

                  <span>
                    <v-btn
                      v-if="form.updatedSwitchDetails.serial"
                      @click.prevent="showUpdatedSwitchInfo"
                      round
                      small
                      color="secondary"
                    >Details</v-btn>
                  </span>
                  <v-dialog v-model="updatedSwitchDialog">
                    <switch-info
                      :key="form.updatedSwitchDetails.serial"
                      :network="network"
                      :switchDetails="form.updatedSwitchDetails"
                      :switchPorts="form.updatedSwitchPorts"
                      @onClose="updatedSwitchDialog = false"
                    ></switch-info>
                  </v-dialog>
                </div>
              </div>
            </small>
          </v-stepper-step>

          <v-stepper-content step="3">
            <switch-clone
              :key="form.newSwitchDetails.serial"
              :netId="network.id"
              :orgId="org.id"
              :oldSwitchDetails="form.oldSwitchDetails"
              :oldSwitchPorts="form.oldSwitchPorts"
              :newSwitchPorts="form.newSwitchPorts"
              :newSwitchDetails="form.newSwitchDetails"
              @updatedSwitchDetails="form.updatedSwitchDetails = $event"
              @updatedSwitchPorts="form.updatedSwitchPorts = $event"
            ></switch-clone>

            <v-btn
              color="primary"
              @click="stepper = 4"
              :disabled="!form.updatedSwitchDetails.serial"
            >Continue</v-btn>
            <v-btn flat @click="initForm">Cancel</v-btn>
          </v-stepper-content>

          <!-- Step 4 : REMOVE SOURCE SWITCH -->
          <v-stepper-step :complete="stepper > 4" step="4">
            Remove Source Switch
            <small>Moves the source switch into the organization inventory (optional)</small>
          </v-stepper-step>
          <v-stepper-content step="4">
            <switch-remove
              :key="form.oldSwitchDetails.serial"
              :switchDetails="form.oldSwitchDetails"
              :network="network"
              @removed="onSwitchRemoved"
            ></switch-remove>
            <div class="text-xs-center pt-0 pb-2"></div>
            <v-btn color="primary" @click="stepper = 5">Continue</v-btn>
            <v-btn flat @click="initForm">Cancel</v-btn>
          </v-stepper-content>

          <!-- Step 5 : FINISH -->
          <v-stepper-step :complete="stepper > 5" step="5">Finished</v-stepper-step>
          <v-stepper-content step="5">
            <p>Ta Da!</p>
            <div class="text-xs-center pt-0 pb-2"></div>
            <v-btn color="primary" @click="initForm">Start Over</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-layout>
    </v-container>
  </v-form>
</template>
<script>
import meraki from "~/plugins/meraki";
import axios from "~/plugins/axios";
import SwitchPortTable from "./SwitchPortTable";
import SwitchSelector from "./SwitchSelector";
import SwitchDetails from "./SwitchDetails";
import SwitchClone from "./SwitchClone";
import SwitchInfoDialog from "./SwitchInfoDialog";
import SwitchInfo from "./SwitchInfo";
import SwitchRemove from "./SwitchRemove";
import SwitchAdd from "./SwitchAdd";

export default {
  components: {
    SwitchPortTable,
    SwitchSelector,
    SwitchDetails,
    SwitchClone,
    SwitchInfoDialog,
    SwitchInfo,
    SwitchAdd,
    SwitchRemove
  },
  data: () => ({
    form: {
      orgDevices: [],
      orgInventory: [],
      oldSwitchDetails: {
        name: "",
        serial: ""
      },
      newSwitchDetails: {
        name: "",
        serial: ""
      },
      oldSwitchPorts: [],
      newSwitchPorts: [],
      updatedSwitchDetails: {
        name: "",
        serial: ""
      },
      updatedSwitchPorts: []
    },

    networks: [],
    stepper: 0, // wizard control
    oldSwitchDialog: false,
    newSwitchDialog: false,
    updatedSwitchDialog: false

    //expansionPanel: [true, false]
  }),
  mounted() {
    //this.fetchOrgDevices(this.orgId);
    this.initForm();
  },
  watch: {
    org() {
      if (!this.org.id) {
        return;
      }
      this.initForm();
    },
    stepper() {
      // Log the step to console, for demo
      console.log(
        `Step: ${this.stepper} ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
      );
    }
  },
  computed: {
    unusedSwitches() {
      return this.form.orgInventory.filter(i => {
        return !i.networkId && i.model.toUpperCase().includes("MS");
      });
    },
    usedSwitches() {
      return this.form.orgInventory.filter(i => {
        return i.networkId && i.model.toUpperCase().includes("MS");
      });
    },
    unusedAndNetworkSwitches() {
      return this.form.orgInventory.filter(i => {
        return (
          (i.networkId == this.network.id || !i.networkId) &&
          i.model.toUpperCase().includes("MS")
        );
      });
    },
    unusedAndNetworkSwitchesModelMatch() {
      return this.form.orgInventory.filter(i => {
        return (
          (i.networkId == this.network.id || !i.networkId) &&
          i.model == this.form.oldSwitchDetails.model &&
          i.serial != this.form.oldSwitchDetails.serial
        );
      });
    },
    // sets the current network to that of the old switch
    network() {
      if (!this.form.oldSwitchDetails) {
        return {
          name: "",
          id: ""
        };
      }
      return (
        this.networks.filter(
          i => i.id == this.form.oldSwitchDetails.networkId
        )[0] || {
          name: "",
          networkId: null
        }
      );
    },
    org() {
      return this.$store.state.org;
    }
  },
  methods: {
    initForm() {
      this.$emit("initForm", true);
      this.stepper = 1; // wizard control
      this.form = {
        orgDevices: [],
        orgInventory: [],
        oldSwitchDetails: {
          name: "",
          serial: ""
        },
        newSwitchDetails: {
          name: "",
          serial: ""
        },
        updatedSwitchDetails: {
          name: "",
          serial: ""
        },
        oldSwitchPorts: [],
        newSwitchPorts: [],
        updatedSwitchPorts: [],
        switchAdded: false
      };
      if (!this.org.id) {
        return;
      }
      this.fetchOrgDevices(this.org.id);
      this.fetchOrgInventory(this.org.id);
      this.fetchNetworks(this.org.id);
    },
    showOldSwitchInfo() {
      this.oldSwitchDialog = true;
    },
    showNewSwitchInfo() {
      this.newSwitchDialog = true;
    },
    showUpdatedSwitchInfo() {
      this.updatedSwitchDialog = true;
    },
    onSwitchAdded(event) {
      console.log("SwapForm onSwitchAdded(event)", event);
      this.form.newSwitchDetails = event;
      this.form.switchAdded = true;
    },
    onSwitchRemoved(event) {
      console.log("SwapForm: switch removed", event);
    },
    onNewSwitchSelect(value) {
      console.log("onNewSwitchSelect", value);
      this.form.newSwitchDetails = value;
      if (!value) {
        return;
      }
      if (!this.form.newSwitchDetails.networkId) {
        console.log(
          "skipping port query because device is not yet added to network"
        );
        return;
      } // no ports defined yet
      if (!this.form.newSwitchDetails.serial) {
        return;
      }
      meraki.SwitchPortsController.getDeviceSwitchPorts(
        this.form.newSwitchDetails.serial
      ).then(res => {
        this.newSwitchPorts = res;
      });
    },
    onOldSwitchSelect(value) {
      console.log("onOldSwitchSelect", value);
      this.form.oldSwitchDetails = value;
      if (!value) {
        return;
      }
      if (!this.form.oldSwitchDetails.serial) {
        return;
      }
      meraki.SwitchPortsController.getDeviceSwitchPorts(
        this.form.oldSwitchDetails.serial
      )
        .then(res => {
          console.log("this.getDeviceSwitchPorts", res);
          this.form.oldSwitchPorts = res;
        })
        .catch(e => this.handleError(e));
    },
    onOrgSelected(value) {
      this.org = value;
    },
    fetchOrgDevices(orgId) {
      return meraki.DevicesController.getOrganizationDevices({
        organizationId: orgId
      })
        .then(res => {
          console.log("organization devices", res);
          this.form.orgDevices = res;
          return res;
        })
        .catch(e => this.handleError(e));
    },
    fetchOrgInventory(orgId) {
      return meraki.OrganizationsController.getOrganizationInventory(orgId)
        .then(res => {
          console.log("organization inventory", res);
          this.form.orgInventory = res;
          return res;
        })
        .catch(e => this.handleError(e));
    },
    fetchNetworks(orgId) {
      return meraki.NetworksController.getOrganizationNetworks({
        organizationId: orgId
      })
        .then(res => {
          console.log("organization networks", res);
          this.networks = res;
          return res;
        })
        .catch(e => this.handleError(e));
    },
    networkById(id) {
      console.log("networkById", id);
      const filtered = this.networks.filter(n => n.id === id)[0] || {
        name: "INVENTORY",
        id: id
      };
      console.log("networkById Filtered", filtered);
      return filtered;
    },
    handleError(error) {
      console.log(error);
    }
  }
};
</script>

