<template>
  <div v-if="oldSwitchDetails && newSwitchDetails">
    <v-btn
      v-if="!updatedSwitchDetails.serial"
      :disabled="!oldSwitchDetails.serial && !newSwitchDetails.serial"
      @click="onClone"
      round
      class="error"
      :loading="loading"
    >Clone Switch</v-btn>

    <div v-if="!oldSwitchDetails.serial">You must first select a source switch.</div>
    <div v-if="!newSwitchDetails.serial">You must first select a destination switch.</div>

    <div v-if="actionBatchDetails">
      <div v-if="actionBatchDetails.status">
        <div v-if="actionBatchDetails.status.error">
          <strong>Clone Error:</strong>
          {{actionBatchDetails.error}}
          {{actionBatchDetails.errors[0]}}
        </div>
      </div>
    </div>

    <v-card v-if="successDialog">
      <v-card-title class="headline">Success!</v-card-title>
      <v-card-text>The switch has been cloned.</v-card-text>
    </v-card>

    <v-card v-if="failDialog">
      <v-card-title class="headline">Fail :(</v-card-title>
      <v-card-text>
        There was an error with the clone operation.
        <p></p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import SwitchInfo from "./SwitchInfo";
import SwitchDetails from "./SwitchDetails";
import SwitchPortTable from "./SwitchPortTable";

import meraki from "~/plugins/meraki";
import axios from "~/plugins/axios";
import * as _ from "lodash";

export default {
  props: {
    orgId: String,
    netId: String,
    oldSwitchDetails: Object,
    oldSwitchPorts: Array,
    newSwitchDetails: Object,
    newSwitchPorts: Array
  },
  components: {},
  data: () => ({
    updatedSwitchDetails: {},
    updatedSwitchPorts: [],
    actionBatchDetails: {},
    successDialog: false,
    failDialog: false,
    loading: false
  }),
  computed: {
    actionBatchIsCompleted() {
      if (!this.actionBatchDetails) {
        return false;
      }
      if (!this.actionBatchDetails.status) {
        return false;
      }
      return this.actionBatchDetails.status.completed;
    }
  },
  watch: {
    newSwitchDetails() {
      this.initForm();
    }
  },
  mounted() {
    /*
    this.fetchSwitchPorts(this.newSwitchDetails.serial).then(
      res => (this.updatedSwitchPorts = res)
    );
    */
  },
  methods: {
    initForm() {
      this.updatedSwitchDetails = {};
      this.updatedSwitchPorts = [];
      this.actionBatchDetails = {};
      this.successDialog = false;
      this.failDialog = false;
      this.loading = false;
    },
    updateSwitchDetails(networkId, serial, details) {
      let updateNetworkDevice = new meraki.UpdateNetworkDeviceModel();
      updateNetworkDevice = details;
      return meraki.DevicesController.updateNetworkDevice({
        networkId,
        serial,
        updateNetworkDevice
      })
        .then(res => res)
        .catch(e => this.handleError(e));
    },
    batchUpdateSwitch(orgId, netId, portConfigs, switchDetails, serial) {
      let input = {};
      let createOrganizationActionBatch = new meraki.CreateOrganizationActionBatchModel();
      createOrganizationActionBatch.confirmed = true;
      createOrganizationActionBatch.actions = [];

      portConfigs.forEach((p, i) => {
        console.log("portConfigs p,i", p, i);
        createOrganizationActionBatch.actions[i] = new meraki.ActionModel();
        createOrganizationActionBatch.actions[
          i
        ].resource = `/devices/${serial}/switchPorts/${p.number}`;
        createOrganizationActionBatch.actions[i].operation = "update";
        //delete portConfigs[i].number; // remove number from param body (causes error and is not needed)
        //portConfigs = portConfigs.map(p => delete p.number);
        //const pConfigs = [];
        //delete p.number;
        let configs = {};
        configs = { ...configs, ...p };
        delete configs.number;
        delete configs.macWhitelist;
        delete configs.stickyMacWhitelist;
        delete configs.stickyMacWhitelistLimit;
        //console.log("portConfigs[i]", pConfigs[i]);
        createOrganizationActionBatch.actions[i].body = configs;
      });
      const updateDeviceAction = {
        resource: `/networks/${netId}/devices/${serial}`,
        operation: "update",
        body: switchDetails
      };
      createOrganizationActionBatch.actions.push(updateDeviceAction);
      input["createOrganizationActionBatch"] = createOrganizationActionBatch;
      input["organizationId"] = orgId;
      console.log("actionBatch input", input);
      return meraki.ActionBatchesController.createOrganizationActionBatch(input)
        .then(res => {
          console.log("actionBatchSent res", res);
          return res;
        })
        .catch(e => this.handleError(e));
    },

    checkBatchUpdateStatus(organizationId, batchId) {
      let input = {};
      input["organizationId"] = organizationId;
      input["id"] = batchId;
      return meraki.ActionBatchesController.getOrganizationActionBatch(
        input
      ).then(res => res);
    },
    fetchSwitchDetails(serial) {
      return meraki.DevicesController.getNetworkDevice({
        networkId: this.netId,
        serial: this.newSwitchDetails.serial
      })
        .then(res => {
          console.log("this.getDeviceSwitchDetails", serial, res);
          //this.updateSwitchDetails = res;
          return res;
        })
        .catch(e => this.handleError(e));
    },
    fetchSwitchPorts(serial) {
      return meraki.SwitchPortsController.getDeviceSwitchPorts(serial)
        .then(res => {
          console.log("this.getDeviceSwitchPorts", serial, res);
          return res;
        })
        .catch(e => this.handleError(e));
    },
    onClone() {
      console.log(
        "Cloning Switches,  this.oldSwitchDetails.serial, this.newSwitchDetails.serial",
        this.oldSwitchDetails.serial,
        this.newSwitchDetails.serial
      );

      // set new switch settings/ports to that of old switch and remove hard coded properties
      let switchDetails = {};
      switchDetails = { ...switchDetails, ...this.oldSwitchDetails };
      delete switchDetails.serial;
      delete switchDetails.mac;

      console.log(
        "Cloning Switches AFTER MODs, this.oldSwitchDetails.serial, this.newSwitchDetails.serial",
        this.oldSwitchDetails.serial,
        this.newSwitchDetails.serial
      );
      this.loading = true;
      this.batchUpdateSwitch(
        this.orgId,
        this.netId,
        this.oldSwitchPorts,
        switchDetails,
        this.newSwitchDetails.serial
      ).then(res => {
        this.actionBatchDetails = res;
        if (!this.actionBatchDetails) {
          return;
        }
        // pull batch status (improve logic)
        let statusInterval = setInterval(() => {
          console.log("statusInterval");

          this.checkBatchUpdateStatus(
            this.orgId,
            this.actionBatchDetails.id
          ).then(res => {
            console.log("statusInterval", res);
            this.actionBatchDetails = res;

            // Handle Clone Results
            if (
              this.actionBatchDetails.status.completed ||
              this.actionBatchDetails.status.failed
            ) {
              console.log("clearing statusInterval");
              clearInterval(statusInterval);
            }
            if (this.actionBatchDetails.status.completed) {
              this.$emit("updatedSwitchDetails", this.updatedSwitchDetails);

              // refresh updated device details
              this.fetchSwitchDetails(this.newSwitchDetails.serial)
                .then(res => {
                  this.updatedSwitchDetails = res;
                  this.$emit("updatedSwitchDetails", this.updatedSwitchDetails);
                  return res;
                })
                .then(res => {
                  return this.fetchSwitchPorts(this.newSwitchDetails.serial);
                })
                .then(res => {
                  this.updatedSwitchPorts = res;
                  this.$emit("updatedSwitchPorts", this.updatedSwitchPorts);
                  return res;
                })
                .then(res => {
                  this.successDialog = true;
                })
                .catch(e => this.handleError(e))
                .finally(() => {
                  this.loading = false;
                });
            }

            if (this.actionBatchDetails.status.failed) {
              // Batch updated
              this.failDialog = true;
              this.loading = false;
            }
          });
        }, 2000); // wait 2 seconds and get status
      });
    },

    handleError(error) {
      this.loading = false;
      console.log(error);
    }
  }
};
</script>

<style>
</style>
