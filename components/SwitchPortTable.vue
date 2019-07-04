<template>
  <v-data-table :headers="headers" :items="data" class="elevation-1">
    <template v-slot:items="props">
      <td class="text-xs-right">{{ props.item.number }}</td>
      <td class="text-xs-right">{{ props.item.vlan }}</td>
      <td class="text-xs-right">{{ props.item.voiceVlan }}</td>
      <td>{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.tags }}</td>
      <td class="text-xs-right">{{ props.item.enabled }}</td>
      <td class="text-xs-right">{{ props.item.poeEnabled }}</td>
      <td class="text-xs-right">{{ props.item.type }}</td>

      <td class="text-xs-right">{{ props.item.allowedVlans }}</td>
      <td class="text-xs-right">{{ props.item.isolationEnabled }}</td>
      <td class="text-xs-right">{{ props.item.rstpEnabled }}</td>
      <td class="text-xs-right">{{ props.item.stpGuard }}</td>
      <td class="text-xs-right">{{ props.item.accessPolicyNumber }}</td>
      <td class="text-xs-right">{{ props.item.linkNegotiation }}</td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ["data"],
  computed: {
    dynamicHeaders() {
      if (!this.data) {
        return;
      }
      return Object.keys(this.data);
    },
    items() {
      if (!this.data) {
        return;
      }
      return Object.values(this.data);
    }
  },
  data: () => ({
    headers: [
      {
        text: "Port Number",
        sortable: true,
        value: "number"
      },
      { text: "VLAN", value: "vlan" },
      { text: "Voice VLAN", value: "voiceVlan" },
      { text: "Name", value: "name" },
      { text: "Tags", value: "tags" },
      { text: "Enabled", value: "enabled" },
      { text: "PoE Enabled", value: "poeEnabled" },
      { text: "Type", value: "type" },   
      { text: "Allowed VLANs", value: "allowedVlans" },
      { text: "Isolation Enabled", value: "isolationEnabled" },
      { text: "RSTP Enabled", value: "rstpEnabled" },
      { text: "STP Guard", value: "stpGuard" },
      { text: "Access Policy Number", value: "accessPolicyNumber" },
      { text: "linkNegotiation", value: "linkNegotiation" }
    ]
  })
};
</script>

<style>
</style>
