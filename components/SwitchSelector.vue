<template>
  <v-flex xs12>
    <v-autocomplete
      v-model="selectedSwitch"
      :items="switches"
      @click:clear="clearForm"
      clearable
      hide-selected
      item-text="serial"
      item-value="serial"
      :label="label"
      solo
      return-object
    >
      <template v-slot:no-data>
        <v-list-tile>
          <v-list-tile-title>{{label}}</v-list-tile-title>
        </v-list-tile>
      </template>
      <template v-slot:selection="{ item, selected }">
        <v-chip small :selected="selected" color="blue-grey" class="white--text">
          <v-icon left>mdi-coin</v-icon>
          <span v-text="`${item.serial}`"></span>
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <!--
        <v-list-tile-avatar color="green" class="font-small font-weight-light white--text small"></v-list-tile-avatar>
        -->

        <v-list-tile-content>
          <v-list-tile-title v-text="`${item.serial} ${item.networkId ? '' : '~ unclaimed'}`"></v-list-tile-title>
          <v-list-tile-sub-title v-text="item.name"></v-list-tile-sub-title>
          <v-list-tile-sub-title v-text="item.model"></v-list-tile-sub-title>
        </v-list-tile-content>
      </template>
    </v-autocomplete>
    <!--  
    <v-dialog v-model="showScanner">
      <v-card height="300">
        
        <v-card-title>Barcode Scanner</v-card-title>
        
        <v-card-text>
          <barcode-scanner></barcode-scanner>
        </v-card-text>
        <v-card-actions>
          <v-btn small color="primary" @click="showScanner = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <span>
      <v-btn @click="showScanner = !showScanner">
        <v-icon small color="grey">filter_center_focus</v-icon>
      </v-btn>
    </span>
    -->
  </v-flex>
</template>

<script>
//import BarcodeScanner from "./BarcodeScanner";

const selectedSwitch = {
  name: "",
  model: "",
  serial: ""
};
export default {
  props: ["label", "switches"],
  components: {
    //BarcodeScanner
  },
  computed: {},
  data: () => ({
    selectedSwitch: Object.create(selectedSwitch),
    showScanner: false,
    readerSize: {
      width: 300,
      height: 300
    },
    detecteds: []
  }),
  watch: {
    selectedSwitch() {
      this.$emit("selected", this.selectedSwitch);
    },
    switches() {
      console.log("switch selector, props: switches", this.switches);
      if (!this.switches.length > 0) {
        this.clearForm();
      }
    }
  },
  methods: {
    logIt(data) {
      console.log("detected", data);
    },
    clearForm() {
      console.log("clearing switchSelector form");
      this.$nextTick(() => {
        this.selectedSwitch = {
          name: "",
          model: "",
          serial: ""
        };
      });
    }
  }
};
</script>

<style>
</style>
