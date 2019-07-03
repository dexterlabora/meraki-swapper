<template id="org-selector">
  <div>
    <v-layout>
      <v-flex class="md-8">
        <v-select
          v-bind:items="orgs"
          item-text="name"
          item-value="id"
          return-object
          v-model="form.org"
          label="Organizations"
          mask
          autofocus
        ></v-select>
      </v-flex>
      <v-flex class="md-4">
        <span>
          <v-btn round icon @click="fetchOrgs">
            <v-icon>autorenew</v-icon>
          </v-btn>
        </span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Vue from "vue";
import meraki from "~/plugins/meraki";

export default Vue.extend({
  template: "#org-state-selector",
  data() {
    return {
      form: {
        org: {
          id: "",
          name: ""
        }
      },
      orgs: []
    };
  },
  computed: {
    org: function() {
      return this.$store.state.org;
    }
  },
  created() {
    this.fetchOrgs();
  },
  methods: {
    fetchOrgs: function() {
      this.orgs = [];
      this.form.org = {
        id: "",
        name: ""
      };
      meraki.OrganizationsController.getOrganizations().then(res => {
        console.log("getOrganizations res", res);
        // order and save orgs
        this.orgs = res.sort(function(a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      });
    }
  },
  watch: {
    /*
    apiKey(newVal, oldVal) {
      console.log("apiKey updated, fetching orgs");
      this.fetchOrgs();
    },
    apiUrl(newVal, oldVal) {
      console.log("apiUrl updated, fetching orgs");
      this.fetchOrgs();
    },
    */
    org() {
      this.form.org = this.org;
    },
    orgs() {
      this.form.org = this.orgs[0] || "";
      //this.$store.commit("setOrgs", this.orgs);
    },
    "form.org"(newVal, oldVal) {
      console.log("setting org, ", this.form.org);
      this.$store.commit("setOrg", this.form.org);
      this.$emit("onChange", { org: this.form.org });
    }
  }
});
</script>
